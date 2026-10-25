using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;
using NexTI_API.Services;

namespace NexTI_API.Tests.Carga;

/// <summary>
/// Os dois defeitos que o teste de carga (tests/carga/carga-api.mjs) achou, presos em teste:
/// respostas da mesma carta chegando ao mesmo tempo e uma carta respondida "Fácil" muitas vezes.
/// </summary>
public class ConcorrenciaTests
{
    [ContaLocalDbFact]   // a chave duplicada só existe num banco de verdade
    public async Task TrintaPrimeirasRespostasAoMesmoTempo_NenhumaFalhaEFicaUmRegistro()
    {
        var conexao = $@"Server=(localdb)\MSSQLLocalDB;Database=NexTI_Carga_{Guid.NewGuid():N};Trusted_Connection=True;TrustServerCertificate=True;";
        DbContextOptions<AppDbContext> Opcoes() => new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(conexao).UseSnakeCaseNamingConvention().Options;

        await using var db = new AppDbContext(Opcoes());
        try
        {
            await db.Database.MigrateAsync();
            var aluno = new Usuario { Username = "carga", Email = "carga@exemplo.test", SenhaHash = "x" };
            var carta = new Flashcard { CodigoFase = "fase1", Frente = "Pergunta", Verso = "Resposta" };
            db.Fases.Add(new Fase { CodigoFase = "fase1", Descricao = "Teste" });
            db.Usuarios.Add(aluno);
            db.Flashcards.Add(carta);
            await db.SaveChangesAsync();

            // Cada requisição tem o próprio contexto, como na API.
            var resultados = await Task.WhenAll(Enumerable.Range(0, 30).Select(async _ =>
            {
                await using var outro = new AppDbContext(Opcoes());
                return await new ProgressoService(outro, new Sm2Engine()).RegistrarRespostaAsync(aluno.Id, carta.Id, 4);
            }));

            Assert.All(resultados, r => Assert.True(r.Sucesso));
            Assert.Equal(1, await db.Progresso_Flashcards.CountAsync(p => p.UsuarioId == aluno.Id));
        }
        finally
        {
            await db.Database.EnsureDeletedAsync();
        }
    }

    [Fact]
    public void Sm2_FacilTrintaVezes_ODiaDaRevisaoContinuaValido()
    {
        var progresso = new ProgressoFlashcard();
        var sm2 = new Sm2Engine();

        // Antes do teto, por volta da 12ª resposta o AddDays passava do ano 9999 e estourava.
        for (var i = 0; i < 30; i++) sm2.Calcular(progresso, 5);

        Assert.Equal(Sm2Engine.IntervaloMaximo, progresso.IntervaloDias);
        Assert.Equal(DateTime.UtcNow.Date.AddDays(36500), progresso.DataProximaRevisao);
    }
}
