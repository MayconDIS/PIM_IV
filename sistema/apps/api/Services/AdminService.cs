using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;

namespace NexTI_API.Services
{
    public record UsuarioResumo(int Id, string Username, string Email, string Perfil, int XP, int Nivel, DateTime DataCriacao);

    public record AlunoNoPainel(string Username, int XP, int Nivel, int Moedas, int CartasEstudadas, int CartasDevidasHoje, int CartasMaduras);

    public interface IAdminService
    {
        Task<List<UsuarioResumo>> ListarUsuariosAsync();
        Task<Resultado<UsuarioResumo>> DefinirPerfilAsync(int quemPede, int usuarioId, string? perfil);
        Task<List<AlunoNoPainel>> PainelDosAlunosAsync();
    }

    /// <summary>Estrutura administrativa: perfis de acesso (Admin) e acompanhamento dos alunos (Tutor).</summary>
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _db;

        public AdminService(AppDbContext db) => _db = db;

        public Task<List<UsuarioResumo>> ListarUsuariosAsync() =>
            _db.Usuarios
                .OrderBy(u => u.Username)
                .Select(u => new UsuarioResumo(u.Id, u.Username, u.Email, u.Perfil, u.XP, u.Nivel, u.DataCriacao))
                .ToListAsync();

        public Task<Resultado<UsuarioResumo>> DefinirPerfilAsync(int quemPede, int usuarioId, string? perfil) =>
            _db.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            _db.ChangeTracker.Clear();
            await using var tx = _db.Database.IsRelational()
                ? await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable) : null;
            if (!await _db.Usuarios.AnyAsync(u => u.Id == quemPede && u.Perfil == Perfis.Admin))
                return Resultado<UsuarioResumo>.Erro(TipoFalha.NaoAutorizado);
            var novo = Perfis.Todos.FirstOrDefault(p => string.Equals(p, perfil?.Trim(), StringComparison.OrdinalIgnoreCase));
            if (novo is null)
                return Resultado<UsuarioResumo>.Erro(TipoFalha.Invalido, "Perfil inválido. Use Aluno, Tutor ou Admin.");

            // Sem isso o único Admin poderia se rebaixar e o sistema ficaria sem administração.
            if (quemPede == usuarioId)
                return Resultado<UsuarioResumo>.Erro(TipoFalha.Invalido, "Você não pode mudar o próprio perfil.");

            var usuario = await _db.Usuarios.FindAsync(usuarioId);
            if (usuario is null)
                return Resultado<UsuarioResumo>.Erro(TipoFalha.NaoEncontrado, "Usuário não encontrado.");

            if (usuario.Perfil == Perfis.Admin && novo != Perfis.Admin &&
                await _db.Usuarios.CountAsync(u => u.Perfil == Perfis.Admin) <= 1)
                return Resultado<UsuarioResumo>.Erro(TipoFalha.Invalido, "O sistema precisa de pelo menos um administrador.");
            usuario.Perfil = novo;
            await _db.SaveChangesAsync();
            if (tx is not null) await tx.CommitAsync();
            return Resultado<UsuarioResumo>.Ok(new UsuarioResumo(usuario.Id, usuario.Username, usuario.Email, usuario.Perfil, usuario.XP, usuario.Nivel, usuario.DataCriacao));
        });

        public async Task<List<AlunoNoPainel>> PainelDosAlunosAsync()
        {
            var hoje = DateTime.UtcNow.Date;
            return await _db.Usuarios
                .Where(u => u.Perfil == Perfis.Aluno)
                .OrderByDescending(u => u.XP)
                .Select(u => new AlunoNoPainel(
                    u.Username,
                    u.XP,
                    u.Nivel,
                    u.Moedas,
                    u.Progressos.Count,
                    u.Progressos.Count(p => p.DataProximaRevisao <= hoje),
                    u.Progressos.Count(p => p.IntervaloDias >= ProgressoService.DiasParaCartaMadura)))
                .ToListAsync();
        }
    }
}
