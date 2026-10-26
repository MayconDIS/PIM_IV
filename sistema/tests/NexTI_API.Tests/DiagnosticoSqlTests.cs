using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;
using NexTI_API.Services;

namespace NexTI_API.Tests;

public class DiagnosticoSqlTests
{
    [ContaLocalDbFact]
    public async Task DiagnosticosConcorrentes_PreservamAcessos_EExportacaoEExclusaoUsamAConta()
    {
        var nome = "NexTI_DiagnosticoTest_" + Guid.NewGuid().ToString("N");
        var opcoes = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer($@"Server=(localdb)\MSSQLLocalDB;Database={nome};Trusted_Connection=True;TrustServerCertificate=True;",
                sql => sql.EnableRetryOnFailure()).UseSnakeCaseNamingConvention().Options;
        await using var db = new AppDbContext(opcoes);
        try
        {
            await db.Database.MigrateAsync();
            var senha = BCrypt.Net.BCrypt.HashPassword("Forte!942z", 4);
            var ana = new Usuario { Username = "ana", Email = "ana@exemplo.test", SenhaHash = senha, XP = 17, Moedas = 9, Nivel = 3 };
            var bia = new Usuario { Username = "bia", Email = "bia@exemplo.test", SenhaHash = senha };
            db.Usuarios.AddRange(ana, bia);
            await db.SaveChangesAsync();
            var catalogo = CatalogoDiagnostico.Carregar();
            var perguntas = catalogo.Perguntas.GroupBy(p => p.Modulo).OrderBy(g => g.Key).SelectMany(g => g.Take(5)).ToList();
            async Task Salvar(bool acertar)
            {
                await using var concorrente = new AppDbContext(opcoes);
                var respostas = perguntas.Select(p => (RespostaDiagnostico?)new RespostaDiagnostico(p.Id, acertar ? p.Certa : null)).ToList();
                Assert.True((await new DiagnosticoService(concorrente, catalogo).ConcluirAsync(ana.Id, respostas)).Sucesso);
            }
            await Task.WhenAll(Salvar(true), Salvar(false));
            var perfil = (await new GamificacaoService(db).PerfilAsync("ana"))!;
            Assert.Contains("fase21", perfil.Diagnostico!.FasesLiberadas!);
            Assert.Contains("teste-mod2", perfil.Diagnostico.FasesLiberadas!);
            Assert.Equal((17, 9, 3), (perfil.XP, perfil.Moedas, perfil.Nivel));
            Assert.Null((await new GamificacaoService(db).PerfilAsync("bia"))!.Diagnostico);
            var conta = new ContaService(db, new PoliticaDeSenha(), new HistoricoConta(db));
            Assert.Equal(perfil.Diagnostico.Acertos, (await conta.ExportarAsync(ana.Id)).Valor!.Diagnostico!.Acertos);
            Assert.True((await conta.ExcluirAsync(ana.Id, "Forte!942z")).Sucesso);
            Assert.Null(await new GamificacaoService(db).PerfilAsync("ana"));
            Assert.NotNull(await new GamificacaoService(db).PerfilAsync("bia"));
        }
        finally
        {
            // Apenas o banco descartável deste teste pode ser removido.
            if (db.Database.GetDbConnection().Database == nome && nome.StartsWith("NexTI_DiagnosticoTest_", StringComparison.Ordinal))
                await db.Database.EnsureDeletedAsync();
        }
    }
}
