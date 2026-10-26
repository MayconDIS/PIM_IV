using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;
using NexTI_API.Services;
using Xunit;

namespace NexTI_API.Tests
{
    /// <summary>Estrutura administrativa: perfis, painel do Tutor e moderação de cartas.</summary>
    public class AdminTests
    {
        private static AppDbContext NovoBanco() =>
            new(new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"nexti-{Guid.NewGuid()}")
                .Options);

        private static async Task<AppDbContext> BancoComUsuarios()
        {
            var db = NovoBanco();
            db.Usuarios.AddRange(
                new Usuario { Id = 1, Username = "admin", Email = "admin@nexti.com", SenhaHash = "x", Perfil = Perfis.Admin },
                new Usuario { Id = 2, Username = "ana", Email = "ana@nexti.com", SenhaHash = "x", XP = 120 },
                new Usuario { Id = 3, Username = "bia", Email = "bia@nexti.com", SenhaHash = "x", XP = 40 });
            await db.SaveChangesAsync();
            return db;
        }

        [Fact]
        public void NovoUsuario_ComecaComoAluno()
        {
            Assert.Equal(Perfis.Aluno, new Usuario().Perfil);
        }

        [Fact]
        public async Task Admin_PromoveAlunoATutor()
        {
            using var db = await BancoComUsuarios();

            var resultado = await new AdminService(db).DefinirPerfilAsync(quemPede: 1, usuarioId: 2, perfil: "tutor");

            Assert.True(resultado.Sucesso);
            Assert.Equal(Perfis.Tutor, resultado.Valor!.Perfil);
            Assert.Equal(Perfis.Tutor, (await db.Usuarios.FindAsync(2))!.Perfil);
        }

        [Fact]
        public async Task Admin_NaoMudaOProprioPerfil()
        {
            using var db = await BancoComUsuarios();

            var resultado = await new AdminService(db).DefinirPerfilAsync(1, 1, Perfis.Aluno);

            Assert.Equal(TipoFalha.Invalido, resultado.Falha);
            Assert.Equal(Perfis.Admin, (await db.Usuarios.FindAsync(1))!.Perfil);
        }

        [Theory]
        [InlineData("Diretor")]
        [InlineData("")]
        [InlineData(null)]
        public async Task PerfilInvalido_ERecusado(string? perfil)
        {
            using var db = await BancoComUsuarios();

            var resultado = await new AdminService(db).DefinirPerfilAsync(1, 2, perfil);

            Assert.Equal(TipoFalha.Invalido, resultado.Falha);
        }

        [Fact]
        public async Task PerfilDeUsuarioInexistente_NaoEncontrado()
        {
            using var db = await BancoComUsuarios();

            var resultado = await new AdminService(db).DefinirPerfilAsync(1, 99, Perfis.Tutor);

            Assert.Equal(TipoFalha.NaoEncontrado, resultado.Falha);
        }

        [Fact]
        public async Task PainelDoTutor_MostraSoAlunos_PorXp_ComNumerosDoSm2()
        {
            using var db = await BancoComUsuarios();
            db.Progresso_Flashcards.AddRange(
                new ProgressoFlashcard { UsuarioId = 2, FlashcardId = 1, IntervaloDias = 30, DataProximaRevisao = DateTime.UtcNow.Date.AddDays(30) },
                new ProgressoFlashcard { UsuarioId = 2, FlashcardId = 2, IntervaloDias = 1, DataProximaRevisao = DateTime.UtcNow.Date });
            await db.SaveChangesAsync();

            var painel = await new AdminService(db).PainelDosAlunosAsync();

            Assert.Equal(new[] { "ana", "bia" }, painel.Select(a => a.Username));
            var ana = painel[0];
            Assert.Equal((2, 1, 1), (ana.CartasEstudadas, ana.CartasDevidasHoje, ana.CartasMaduras));
        }

        [Fact]
        public async Task Tutor_EditaCarta()
        {
            using var db = NovoBanco();
            db.Flashcards.Add(new Flashcard { Id = 5, CodigoFase = "fase1", Frente = "a", Verso = "b" });
            await db.SaveChangesAsync();

            var resultado = await new ConteudoService(db).EditarFlashcardAsync(5, " Nova frente ", " Novo verso ", " ");

            Assert.True(resultado.Sucesso);
            Assert.Equal(("Nova frente", "Novo verso", (string?)null), (resultado.Valor!.Frente, resultado.Valor.Verso, resultado.Valor.Dica));
        }

        [Fact]
        public async Task EditarCarta_SemVersoOuInexistente_ERecusado()
        {
            using var db = NovoBanco();
            var conteudo = new ConteudoService(db);

            Assert.Equal(TipoFalha.Invalido, (await conteudo.EditarFlashcardAsync(5, "a", "  ", null)).Falha);
            Assert.Equal(TipoFalha.NaoEncontrado, (await conteudo.EditarFlashcardAsync(5, "a", "b", null)).Falha);
        }

        [Fact]
        public async Task Seed_NaoRecriaCartaQueOTutorEditouOuExcluiu()
        {
            using var db = NovoBanco();
            var seeder = new NexTI_API.Services.Seed.ConteudoSeeder();
            await seeder.ExecutarAsync(db);
            var totalAntes = await db.Flashcards.CountAsync();
            var cartas = await db.Flashcards.OrderBy(f => f.Id).Take(2).ToListAsync();
            var (editada, excluida) = (cartas[0], cartas[1]);
            var frenteOriginal = editada.Frente;
            var conteudo = new ConteudoService(db);

            await conteudo.EditarFlashcardAsync(editada.Id, "Frente corrigida pelo tutor", editada.Verso, editada.Dica);
            await conteudo.ExcluirFlashcardAsync(excluida.Id);
            var inseridosNoReinicio = await seeder.ExecutarAsync(db);   // a API sobe de novo

            Assert.Equal(0, inseridosNoReinicio);
            Assert.Equal(totalAntes - 1, await db.Flashcards.CountAsync());
            Assert.False(await db.Flashcards.AnyAsync(f => f.Frente == frenteOriginal));
            Assert.False(await db.Flashcards.AnyAsync(f => f.Frente == excluida.Frente));
        }

        [Fact]
        public async Task EditarSoOVerso_NaoMarcaComoModerada()
        {
            using var db = NovoBanco();
            db.Flashcards.Add(new Flashcard { Id = 5, CodigoFase = "fase1", Frente = "a", Verso = "b" });
            await db.SaveChangesAsync();

            await new ConteudoService(db).EditarFlashcardAsync(5, "a", "novo verso", null);

            Assert.Empty(db.CartasModeradas);
        }

        [Fact]
        public async Task Tutor_ExcluiCarta()
        {
            using var db = NovoBanco();
            db.Flashcards.Add(new Flashcard { Id = 5, CodigoFase = "fase1", Frente = "a", Verso = "b" });
            await db.SaveChangesAsync();
            var conteudo = new ConteudoService(db);

            Assert.True((await conteudo.ExcluirFlashcardAsync(5)).Sucesso);
            Assert.Empty(db.Flashcards);
            Assert.Equal(TipoFalha.NaoEncontrado, (await conteudo.ExcluirFlashcardAsync(5)).Falha);
        }
    }
}
