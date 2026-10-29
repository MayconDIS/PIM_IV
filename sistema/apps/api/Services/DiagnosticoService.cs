using System.Data;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;

namespace NexTI_API.Services;

public interface IDiagnosticoService
{
    Task<Resultado<ResultadoDiagnostico>> ConcluirAsync(int usuarioId, IReadOnlyList<RespostaDiagnostico?>? respostas);
}

/// <summary>Salva a avaliação atual sem apagar os acessos anteriores nem conceder XP, moedas ou conclusões.</summary>
public class DiagnosticoService(AppDbContext db, CatalogoDiagnostico catalogo) : IDiagnosticoService
{
    public static ResultadoDiagnostico? LerResultado(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        return JsonSerializer.Deserialize<ResultadoDiagnostico>(json, CatalogoDiagnostico.Json);
    }

    public async Task<Resultado<ResultadoDiagnostico>> ConcluirAsync(int usuarioId, IReadOnlyList<RespostaDiagnostico?>? respostas)
    {
        var avaliacao = catalogo.Avaliar(respostas);
        if (!avaliacao.Sucesso) return avaliacao;
        return await db.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            db.ChangeTracker.Clear();
            await using var transacao = db.Database.IsRelational()
                ? await db.Database.BeginTransactionAsync(IsolationLevel.Serializable) : null;
            // O lock de atualização serializa duas avaliações do mesmo aluno antes de ler seus acessos.
            var consulta = db.Database.IsSqlServer()
                ? db.Usuarios.FromSqlInterpolated($"SELECT * FROM usuarios WITH (UPDLOCK, HOLDLOCK) WHERE id = {usuarioId}")
                : db.Usuarios.Where(u => u.Id == usuarioId);
            var usuario = await consulta.SingleOrDefaultAsync();
            if (usuario is null) return Resultado<ResultadoDiagnostico>.Erro(TipoFalha.NaoEncontrado, "Usuário não encontrado.");
            var anterior = LerResultado(usuario.DiagnosticoJson);
            var preservadas = anterior?.FasesLiberadas ?? catalogo.AcessosLegados(usuario.Nivel);
            var acessos = preservadas.Concat(avaliacao.Valor!.Fases).ToHashSet(StringComparer.Ordinal);
            var salvo = avaliacao.Valor with
            {
                RealizadoEm = DateTime.UtcNow,
                FasesLiberadas = catalogo.OrdemFases.Where(acessos.Contains).ToList()
            };
            usuario.DiagnosticoJson = JsonSerializer.Serialize(salvo, CatalogoDiagnostico.Json);
            await db.SaveChangesAsync();
            if (transacao is not null) await transacao.CommitAsync();
            return Resultado<ResultadoDiagnostico>.Ok(salvo);
        });
    }
}
