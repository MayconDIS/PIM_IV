using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NexTI_API.Data;
using NexTI_API.Services.Seed;
using Microsoft.Data.SqlClient;
using Xunit;

namespace NexTI_API.Tests
{
    public class ConexaoBancoTests
    {
        private const string AzureSql =
            "Server=tcp:nexti-sql.database.windows.net,1433;Initial Catalog=nexti;User ID=nexti_admin;Password=S3nha!;Encrypt=False;Connection Timeout=30;";

        [Fact]
        public void AzureSql_ForcaTlsEValidacaoDeCertificado()
        {
            var b = new SqlConnectionStringBuilder(ConexaoBanco.Normalizar(AzureSql + "TrustServerCertificate=True;"));

            Assert.Equal(SqlConnectionEncryptOption.Mandatory, b.Encrypt);
            Assert.False(b.TrustServerCertificate);
        }

        [Fact]
        public void AzureSql_DaTempoParaOBancoServerlessAcordar()
        {
            var b = new SqlConnectionStringBuilder(ConexaoBanco.Normalizar(AzureSql));

            Assert.True(b.ConnectTimeout >= 60);
        }

        [Fact]
        public void LocalDb_FicaComoEsta()
        {
            var b = new SqlConnectionStringBuilder(ConexaoBanco.Normalizar(ConexaoBanco.LocalPadrao));

            Assert.Equal(@"(localdb)\mssqllocaldb", b.DataSource);
            Assert.True(b.TrustServerCertificate);
            Assert.Equal(15, b.ConnectTimeout);
        }

        [Fact]
        public void ServiceConnectorDaAzure_TemPrioridadeSobreOAppsettings()
        {
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new[]
                {
                    new KeyValuePair<string, string?>("ConnectionStrings:DefaultConnection", ConexaoBanco.LocalPadrao),
                    new KeyValuePair<string, string?>("AZURE_SQL_CONNECTIONSTRING", AzureSql),
                })
                .Build();

            Assert.Equal("tcp:nexti-sql.database.windows.net,1433", new SqlConnectionStringBuilder(ConexaoBanco.Resolver(config)).DataSource);
        }

        [Fact]
        public void SemConfiguracao_UsaOLocalDb()
        {
            var config = new ConfigurationBuilder().Build();

            Assert.Equal("NexTI_Local", new SqlConnectionStringBuilder(ConexaoBanco.Resolver(config)).InitialCatalog);
        }
    }

    public class SeedTests
    {
        private static AppDbContext NovoBanco() =>
            new(new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"nexti-{Guid.NewGuid()}")
                .Options);

        [Fact]
        public async Task Semente_TemAsMesmas43FasesE1198CartasDoFront()
        {
            var semente = await new ConteudoSeeder().LerAsync();

            Assert.Equal(43, semente.Fases.Count);
            Assert.Equal(1198, semente.Flashcards.Count);
            Assert.All(semente.Flashcards, c => Assert.Contains(semente.Fases, f => f.Codigo == c.CodigoFase));
            Assert.All(semente.Flashcards.Where(c => c.Opcoes is not null), c =>
                Assert.InRange(c.Correta ?? -1, 0, c.Opcoes!.Count - 1));
        }

        [Fact]
        public async Task ConteudoSeeder_EIdempotente()
        {
            using var db = NovoBanco();
            var seeder = new ConteudoSeeder();

            var primeira = await seeder.ExecutarAsync(db);
            var segunda = await seeder.ExecutarAsync(db);

            Assert.Equal(43 + 1198, primeira);
            Assert.Equal(0, segunda);
            Assert.Equal(1198, await db.Flashcards.CountAsync());
        }

        [Fact]
        public async Task ConteudoSeeder_PreservaCartasCriadasPeloUsuario()
        {
            using var db = NovoBanco();
            var seeder = new ConteudoSeeder();
            await seeder.ExecutarAsync(db);

            db.Flashcards.Add(new NexTI_API.Models.Flashcard { CodigoFase = "fase1", Frente = "Carta do aluno", Verso = "Resposta" });
            await db.SaveChangesAsync();
            await seeder.ExecutarAsync(db);

            Assert.Equal(1199, await db.Flashcards.CountAsync());
        }

        [Fact]
        public async Task CorrecaoTexto_AtualizaBancoAntigoSemDuplicarNemApagarEdicaoDoTutor()
        {
            using var db = NovoBanco();
            await new ConteudoSeeder().ExecutarAsync(db);
            var correcoes = await new CorrecaoTextoSeeder().LerAsync();
            Assert.NotEmpty(correcoes);

            // Volta o banco para o texto antigo, como está o banco que já estava no ar.
            foreach (var c in correcoes)
            {
                var carta = await db.Flashcards.SingleAsync(f => f.CodigoFase == c.CodigoFase && f.Frente == (c.Frente ?? c.FrenteAntiga));
                carta.Frente = c.FrenteAntiga;
                if (c.Verso is not null) carta.Verso = c.VersoAntigo!;
                if (c.Dica is not null) carta.Dica = c.DicaAntiga;
                if (c.Opcoes is not null) carta.Opcoes = c.OpcoesAntigas;
            }
            await db.SaveChangesAsync();
            // Um Tutor editou o verso de uma carta e excluiu outra que teve a frente corrigida.
            var editada = correcoes.First(c => c.Verso is not null);
            (await db.Flashcards.SingleAsync(f => f.CodigoFase == editada.CodigoFase && f.Frente == editada.FrenteAntiga)).Verso = "Texto do Tutor";
            var excluida = correcoes.First(c => c.Frente is not null && c != editada);
            db.Flashcards.Remove(await db.Flashcards.SingleAsync(f => f.CodigoFase == excluida.CodigoFase && f.Frente == excluida.FrenteAntiga));
            db.CartasModeradas.Add(new NexTI_API.Models.CartaModerada { CodigoFase = excluida.CodigoFase, Frente = excluida.FrenteAntiga });
            await db.SaveChangesAsync();

            var corrigidas = await new CorrecaoTextoSeeder().ExecutarAsync(db);
            await new ConteudoSeeder().ExecutarAsync(db);

            // A excluída não está mais no banco; a editada só conta se tiver outro campo corrigido.
            var soOVersoDaEditada = editada.Frente is null && editada.Dica is null && editada.Opcoes is null;
            Assert.Equal(correcoes.Count - 1 - (soOVersoDaEditada ? 1 : 0), corrigidas);
            Assert.Equal(0, await new CorrecaoTextoSeeder().ExecutarAsync(db));
            Assert.Equal(1198 - 1, await db.Flashcards.CountAsync());
            Assert.False(await db.Flashcards.AnyAsync(f => f.Verso.Contains("utilizador") || f.Frente.Contains("utilizador")));
            Assert.Equal("Texto do Tutor", (await db.Flashcards.SingleAsync(f =>
                f.CodigoFase == editada.CodigoFase && f.Frente == (editada.Frente ?? editada.FrenteAntiga))).Verso);
        }

        [Fact]
        public async Task SimuladoSeeder_CriaAsProvasOficiaisUmaSoVez()
        {
            using var db = NovoBanco();
            var seeder = new SimuladoSeeder();

            await seeder.ExecutarAsync(db);
            Assert.Equal(0, await seeder.ExecutarAsync(db));

            Assert.Equal(new[] { 2017, 2021 }, await db.Provas.OrderBy(p => p.Ano).Select(p => p.Ano).ToArrayAsync());
            Assert.Equal(46, await db.Questoes.CountAsync());
            Assert.All(await db.Questoes.Include(q => q.Alternativas).Include(q => q.Provas).ToListAsync(), q =>
            {
                Assert.Equal(5, q.Alternativas.Count);
                Assert.Single(q.Alternativas, a => a.IsCorreta);
                Assert.Single(q.Provas);
                Assert.StartsWith($"ENADE {q.Provas.Single().Ano} - questão ", q.Origem);
            });
        }

        [Fact]
        public async Task SimuladoSeeder_TrocaAsQuestoesDeExemploPelasOficiais()
        {
            using var db = NovoBanco();
            var area = new NexTI_API.Models.AreaConhecimento { NomeArea = "Engenharia de Software" };
            var antiga = new NexTI_API.Models.Questao { Area = area, Enunciado = "Questão escrita pela equipe", Origem = SimuladoSeeder.OrigemDasQuestoesDeExemplo };
            antiga.Alternativas.Add(new NexTI_API.Models.Alternativa { Texto = "A) Sim", IsCorreta = true });
            antiga.Provas.Add(new NexTI_API.Models.Prova { Ano = 2021, Tipo = "ENADE" });
            db.Questoes.Add(antiga);
            await db.SaveChangesAsync();

            await new SimuladoSeeder().ExecutarAsync(db);

            Assert.False(await db.Questoes.AnyAsync(q => q.Origem == SimuladoSeeder.OrigemDasQuestoesDeExemplo));
            Assert.Equal(2, await db.Provas.CountAsync());   // reaproveita a prova de 2021 que já existia
            Assert.Equal(46, await db.Questoes.CountAsync());
            Assert.Equal(46 * 5, await db.Alternativas.CountAsync());
        }
    }
}
