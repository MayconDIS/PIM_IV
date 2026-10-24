using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;
using NexTI_API.Services;

namespace NexTI_API.Tests;

/// <summary>Ative NEXTI_TEST_LOCALDB=1 no Windows. Usa apenas bancos descartáveis NexTI_ContaTest_*.</summary>
public sealed class ContaLocalDbFactAttribute : FactAttribute
{
    public ContaLocalDbFactAttribute()
    {
        if (Environment.GetEnvironmentVariable("NEXTI_TEST_LOCALDB") != "1")
            Skip = "Integração SQL: definir NEXTI_TEST_LOCALDB=1 (LocalDB).";
    }
}

public class ContaSqlTests
{
    private const string Senha = "Teste!829z";
    private static DbContextOptions<AppDbContext> Opcoes(string nome) =>
        new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer($@"Server=(localdb)\MSSQLLocalDB;Database={nome};Trusted_Connection=True;TrustServerCertificate=True;",
                sql => sql.EnableRetryOnFailure())
            .UseSnakeCaseNamingConvention().Options;
    private static ContaService Servico(AppDbContext db) => new(db, new PoliticaDeSenha(), new HistoricoConta(db));

    [ContaLocalDbFact]
    public async Task ExportaHistoricoReal_EExcluiEmCascataSemApagarOutroAlunoOuConteudo()
    {
        var opcoes = Opcoes("NexTI_ContaTest_" + Guid.NewGuid().ToString("N"));
        await using var db = new AppDbContext(opcoes);
        try
        {
            await db.Database.MigrateAsync();
            var hash = BCrypt.Net.BCrypt.HashPassword(Senha, 4);
            var ana = new Usuario { Username = "ana", Email = "ana@example.com", SenhaHash = hash };
            var bia = new Usuario { Username = "bia", Email = "bia@example.com", SenhaHash = hash };
            var carta = new Flashcard { CodigoFase = "fase1", Frente = "Pergunta", Verso = "Resposta" };
            db.Usuarios.AddRange(ana, bia);
            db.Fases.Add(new Fase { CodigoFase = "fase1", Descricao = "Teste" });
            db.Flashcards.Add(carta);
            await db.SaveChangesAsync();
            db.Progresso_Flashcards.AddRange(
                new ProgressoFlashcard { UsuarioId = ana.Id, FlashcardId = carta.Id },
                new ProgressoFlashcard { UsuarioId = bia.Id, FlashcardId = carta.Id });
            await db.SaveChangesAsync(); // trigger gera histórico para os dois
            var s = Servico(db);
            var exportacao = await s.ExportarAsync(ana.Id);
            Assert.True(exportacao.Sucesso);
            Assert.Single(exportacao.Valor!.Progresso);
            Assert.Single(exportacao.Valor.Historico);
            Assert.Equal(carta.Id, exportacao.Valor.Historico[0].FlashcardId);
            Assert.True((await s.ExcluirAsync(ana.Id, Senha)).Sucesso);
            Assert.False(await db.Progresso_Flashcards.AnyAsync(p => p.UsuarioId == ana.Id));
            Assert.Empty(await new HistoricoConta(db).LerAsync(ana.Id));
            Assert.Single(await new HistoricoConta(db).LerAsync(bia.Id));
            Assert.True(await db.Flashcards.AnyAsync(f => f.Id == carta.Id));
            Assert.True(await db.Usuarios.AnyAsync(u => u.Id == bia.Id));
        }
        finally { await db.Database.EnsureDeletedAsync(); }
    }

    [ContaLocalDbFact]
    public async Task ExclusoesConcorrentes_NaoRemovemTodosOsAdmins()
    {
        var opcoes = Opcoes("NexTI_ContaTest_" + Guid.NewGuid().ToString("N"));
        await using var db = new AppDbContext(opcoes);
        try
        {
            await db.Database.MigrateAsync();
            var hash = BCrypt.Net.BCrypt.HashPassword(Senha, 4);
            var a = new Usuario { Username = "admin1", Email = "a@example.com", SenhaHash = hash, Perfil = Perfis.Admin };
            var b = new Usuario { Username = "admin2", Email = "b@example.com", SenhaHash = hash, Perfil = Perfis.Admin };
            db.Usuarios.AddRange(a, b);
            await db.SaveChangesAsync();
            await using var d1 = new AppDbContext(opcoes);
            await using var d2 = new AppDbContext(opcoes);
            var resultados = await Task.WhenAll(Servico(d1).ExcluirAsync(a.Id, Senha), Servico(d2).ExcluirAsync(b.Id, Senha));
            Assert.Single(resultados, r => r.Sucesso);
            Assert.Equal(1, await db.Usuarios.CountAsync(u => u.Perfil == Perfis.Admin));
        }
        finally { await db.Database.EnsureDeletedAsync(); }
    }
}
