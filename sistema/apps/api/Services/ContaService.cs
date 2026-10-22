using System.Data;
using System.Text.RegularExpressions;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;

namespace NexTI_API.Services;

public record ContaDados(int Id, string Username, string Email, string Perfil, int XP, int Moedas, int Nivel, DateTime DataCriacao);
public record ProgressoExportado(int FlashcardId, int Repeticoes, double IntervaloDias, double FatorFacilidade, DateTime DataProximaRevisao);
public class RevisaoExportada
{
    public int IdHistorico { get; set; }
    public int FlashcardId { get; set; }
    public int Repeticoes { get; set; }
    public double IntervaloDias { get; set; }
    public double FatorFacilidade { get; set; }
    public DateTime DataProximaRevisao { get; set; }
    public DateTime DataRevisao { get; set; }
}
public record ExportacaoConta(DateTime ExportadoEm, ContaDados Conta, List<ProgressoExportado> Progresso, List<RevisaoExportada> Historico);

public interface IHistoricoConta
{
    Task<List<RevisaoExportada>> LerAsync(int usuarioId);
}

public class HistoricoConta(AppDbContext db) : IHistoricoConta
{
    public Task<List<RevisaoExportada>> LerAsync(int usuarioId) => db.Database.SqlQuery<RevisaoExportada>($"""
        SELECT id_historico, flashcard_id, repeticoes, intervalo_dias,
               fator_facilidade, data_proxima_revisao, data_revisao
        FROM tb_historico_revisoes WHERE usuario_id = {usuarioId}
        ORDER BY id_historico
        """).ToListAsync();
}

public interface IContaService
{
    Task<Resultado<ContaDados>> LerAsync(int usuarioId);
    Task<Resultado<ContaDados>> AlterarEmailAsync(int usuarioId, string? email, string? senhaAtual);
    Task<Resultado<bool>> AlterarSenhaAsync(int usuarioId, string? senhaAtual, string? novaSenha);
    Task<Resultado<ExportacaoConta>> ExportarAsync(int usuarioId);
    Task<Resultado<bool>> ExcluirAsync(int usuarioId, string? senhaAtual);
}

public class ContaService(AppDbContext db, IPoliticaDeSenha politica, IHistoricoConta historico) : IContaService
{
    private static readonly Regex EmailValido = new(@"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$");
    private static ContaDados Dados(Usuario u) => new(u.Id, u.Username, u.Email, u.Perfil, u.XP, u.Moedas, u.Nivel, u.DataCriacao);
    private static bool ConfereSenha(Usuario u, string? senha) =>
        !string.IsNullOrEmpty(senha) && System.Text.Encoding.UTF8.GetByteCount(senha) <= 72 && BCrypt.Net.BCrypt.Verify(senha, u.SenhaHash);

    public async Task<Resultado<ContaDados>> LerAsync(int usuarioId)
    {
        var u = await db.Usuarios.AsNoTracking().SingleOrDefaultAsync(u => u.Id == usuarioId);
        return u is null ? Resultado<ContaDados>.Erro(TipoFalha.NaoEncontrado) : Resultado<ContaDados>.Ok(Dados(u));
    }

    public async Task<Resultado<ContaDados>> AlterarEmailAsync(int usuarioId, string? email, string? senhaAtual)
    {
        var u = await db.Usuarios.FindAsync(usuarioId);
        if (u is null) return Resultado<ContaDados>.Erro(TipoFalha.NaoEncontrado);
        if (!ConfereSenha(u, senhaAtual)) return Resultado<ContaDados>.Erro(TipoFalha.Invalido, "Senha atual incorreta.");
        email = email?.Trim() ?? "";
        if (email.Length > 100 || !EmailValido.IsMatch(email))
            return Resultado<ContaDados>.Erro(TipoFalha.Invalido, "Informe um e-mail válido.");
        if (await db.Usuarios.AnyAsync(outro => outro.Id != usuarioId && outro.Email.ToLower() == email.ToLower()))
            return Resultado<ContaDados>.Erro(TipoFalha.Invalido, "Este e-mail já está cadastrado.");
        u.Email = email;
        try { await db.SaveChangesAsync(); }
        catch (DbUpdateException e) when (e.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Resultado<ContaDados>.Erro(TipoFalha.Invalido, "Este e-mail já está cadastrado.");
        }
        return Resultado<ContaDados>.Ok(Dados(u));
    }

    public async Task<Resultado<bool>> AlterarSenhaAsync(int usuarioId, string? senhaAtual, string? novaSenha)
    {
        var u = await db.Usuarios.FindAsync(usuarioId);
        if (u is null) return Resultado<bool>.Erro(TipoFalha.NaoEncontrado);
        if (!ConfereSenha(u, senhaAtual)) return Resultado<bool>.Erro(TipoFalha.Invalido, "Senha atual incorreta.");
        var faltando = politica.Validar(novaSenha, u.Username, u.Email);
        if (faltando.Count > 0) return Resultado<bool>.Erro(TipoFalha.Invalido, PoliticaDeSenha.Mensagem(faltando));
        if (ConfereSenha(u, novaSenha)) return Resultado<bool>.Erro(TipoFalha.Invalido, "Escolha uma senha diferente da atual.");
        u.SenhaHash = BCrypt.Net.BCrypt.HashPassword(novaSenha!);
        await db.SaveChangesAsync();
        return Resultado<bool>.Ok(true);
    }

    public async Task<Resultado<ExportacaoConta>> ExportarAsync(int usuarioId)
    {
        var conta = await LerAsync(usuarioId);
        if (!conta.Sucesso) return Resultado<ExportacaoConta>.Erro(conta.Falha!.Value);
        var progresso = await db.Progresso_Flashcards.AsNoTracking().Where(p => p.UsuarioId == usuarioId)
            .OrderBy(p => p.FlashcardId)
            .Select(p => new ProgressoExportado(p.FlashcardId, p.Repeticoes, p.IntervaloDias, p.FatorFacilidade, p.DataProximaRevisao))
            .ToListAsync();
        return Resultado<ExportacaoConta>.Ok(new(DateTime.UtcNow, conta.Valor!, progresso, await historico.LerAsync(usuarioId)));
    }

    public Task<Resultado<bool>> ExcluirAsync(int usuarioId, string? senhaAtual) =>
        db.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            db.ChangeTracker.Clear(); // Recarrega estado após eventual retry de deadlock.
            // SERIALIZABLE protege a contagem contra exclusões/rebaixamentos concorrentes.
            await using var tx = db.Database.IsRelational()
                ? await db.Database.BeginTransactionAsync(IsolationLevel.Serializable) : null;
            var u = await db.Usuarios.SingleOrDefaultAsync(u => u.Id == usuarioId);
            if (u is null) return Resultado<bool>.Erro(TipoFalha.NaoEncontrado);
            if (!ConfereSenha(u, senhaAtual)) return Resultado<bool>.Erro(TipoFalha.Invalido, "Senha atual incorreta.");
            if (u.Perfil == Perfis.Admin && await db.Usuarios.CountAsync(u => u.Perfil == Perfis.Admin) <= 1)
                return Resultado<bool>.Erro(TipoFalha.Invalido, "O único administrador não pode excluir a conta. Defina outro Admin primeiro.");
            db.Usuarios.Remove(u);
            await db.SaveChangesAsync(); // FKs removem progresso e histórico; conteúdo compartilhado permanece.
            if (tx is not null) await tx.CommitAsync();
            return Resultado<bool>.Ok(true);
        });
}
