using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;

namespace NexTI_API.Services
{
    public record PerfilUsuario(int Id, string Username, int Nivel, int XP, int Moedas);

    public record RankingAluno(string Username, int XP, int Nivel, int Moedas);

    public record ResumoGeral(int TotalCards, int TotalUsuarios, List<RankingAluno> TopAlunos);

    public interface IGamificacaoService
    {
        Task<PerfilUsuario?> PerfilAsync(string username);
        Task<Resultado<Usuario>> AtualizarAsync(int usuarioId, int xp, int moedas, int nivel);
        Task<ResumoGeral> ResumoAsync(int tamanhoDoRanking = 5);
    }

    /// <summary>XP, moedas, nível e ranking. O cliente calcula a recompensa; aqui ela é validada e gravada.</summary>
    public class GamificacaoService : IGamificacaoService
    {
        /// <summary>Maior ganho de XP ou moedas aceito numa única atualização.</summary>
        public const int IncrementoMaximo = 200;

        private readonly AppDbContext _db;

        public GamificacaoService(AppDbContext db) => _db = db;

        /// <summary>Regra anti-trapaça: XP e nível só sobem, e nunca mais que <see cref="IncrementoMaximo"/> por vez.</summary>
        /// <returns>A mensagem de recusa, ou null se a atualização é válida.</returns>
        public static string? ValidarAtualizacao(Usuario atual, int xp, int moedas, int nivel)
        {
            if (xp < atual.XP) return "O progresso de XP não pode diminuir.";
            if (nivel < atual.Nivel) return "O nível não pode diminuir.";
            if (xp - atual.XP > IncrementoMaximo) return "Incremento de XP suspeito detectado.";
            if (moedas - atual.Moedas > IncrementoMaximo) return "Incremento de Moedas suspeito detectado.";
            return null;
        }

        public Task<PerfilUsuario?> PerfilAsync(string username) =>
            _db.Usuarios
                .Where(u => u.Username == username)
                .Select(u => new PerfilUsuario(u.Id, u.Username, u.Nivel, u.XP, u.Moedas))
                .FirstOrDefaultAsync();

        public async Task<Resultado<Usuario>> AtualizarAsync(int usuarioId, int xp, int moedas, int nivel)
        {
            var usuario = await _db.Usuarios.FindAsync(usuarioId);
            if (usuario == null) return Resultado<Usuario>.Erro(TipoFalha.NaoEncontrado, "Usuário não encontrado");

            var recusa = ValidarAtualizacao(usuario, xp, moedas, nivel);
            if (recusa != null) return Resultado<Usuario>.Erro(TipoFalha.Invalido, recusa);

            usuario.XP = xp;
            usuario.Moedas = moedas;
            usuario.Nivel = nivel;

            await _db.SaveChangesAsync();
            return Resultado<Usuario>.Ok(usuario);
        }

        public async Task<ResumoGeral> ResumoAsync(int tamanhoDoRanking = 5)
        {
            var totalCards = await _db.Flashcards.CountAsync();
            var totalUsuarios = await _db.Usuarios.CountAsync();
            var topAlunos = await _db.Usuarios
                .OrderByDescending(u => u.XP)
                .Take(tamanhoDoRanking)
                .Select(u => new RankingAluno(u.Username, u.XP, u.Nivel, u.Moedas))
                .ToListAsync();

            return new ResumoGeral(totalCards, totalUsuarios, topAlunos);
        }
    }
}
