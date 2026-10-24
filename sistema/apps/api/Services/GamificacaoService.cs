using System;
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

    /// <summary>Resultado de concluir uma fase: o prêmio desta vez e o saldo novo do aluno.</summary>
    public record Conclusao(Premio Premio, bool Aprovado, int XP, int Moedas, int Nivel);

    public interface IGamificacaoService
    {
        Task<PerfilUsuario?> PerfilAsync(string username);
        Task<Resultado<Usuario>> AtualizarAsync(int usuarioId, int xp, int moedas, int nivel);
        Task<ResumoGeral> ResumoAsync(int tamanhoDoRanking = 5);
        Task<Resultado<Conclusao>> ConcluirFaseAsync(int usuarioId, string? faseId, int acertos, int total);
        Task<Resultado<Usuario>> ComprarBonusAsync(int usuarioId, string? bonusId);
    }

    /// <summary>
    /// XP, moedas, nível e ranking. O prêmio de cada fase é calculado aqui, com a mesma
    /// tabela do site e do app (TabelaDeRecompensas); o cliente só informa o que concluiu.
    /// </summary>
    public class GamificacaoService : IGamificacaoService
    {
        /// <summary>Maior ganho de XP ou moedas aceito numa única atualização.</summary>
        public const int IncrementoMaximo = 200;

        /// <summary>Maior teste aceito (os testes de módulo têm 20 questões; as provas, 23).</summary>
        public const int TotalMaximo = 100;

        private readonly AppDbContext _db;
        private readonly TabelaDeRecompensas _tabela;

        public GamificacaoService(AppDbContext db, TabelaDeRecompensas? tabela = null)
        {
            _db = db;
            _tabela = tabela ?? TabelaDeRecompensas.Padrao;
        }

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

        public async Task<Resultado<Conclusao>> ConcluirFaseAsync(int usuarioId, string? faseId, int acertos, int total)
        {
            faseId = (faseId ?? string.Empty).Trim().ToLowerInvariant();
            if (!_tabela.Conhece(faseId))
                return Resultado<Conclusao>.Erro(TipoFalha.Invalido, "Fase desconhecida.");
            if (total < 0 || total > TotalMaximo || acertos < 0 || acertos > total)
                return Resultado<Conclusao>.Erro(TipoFalha.Invalido, "Acertos e total inválidos.");

            var usuario = await _db.Usuarios.FindAsync(usuarioId);
            if (usuario == null) return Resultado<Conclusao>.Erro(TipoFalha.NaoEncontrado, "Usuário não encontrado");

            var premio = _tabela.PremioDe(faseId, acertos, total);
            usuario.XP += premio.Xp;
            usuario.Moedas += premio.Moedas;
            usuario.Nivel = Math.Max(usuario.Nivel, _tabela.NivelPorXp(usuario.XP));   // o diagnóstico pode ter dado um nível maior
            await _db.SaveChangesAsync();

            var aprovado = !_tabela.Testes.ContainsKey(faseId) || premio.Xp > 0;
            return Resultado<Conclusao>.Ok(new Conclusao(premio, aprovado, usuario.XP, usuario.Moedas, usuario.Nivel));
        }

        public async Task<Resultado<Usuario>> ComprarBonusAsync(int usuarioId, string? bonusId)
        {
            bonusId = (bonusId ?? string.Empty).Trim().ToLowerInvariant();
            if (!_tabela.Bonus.TryGetValue(bonusId, out var bonus))
                return Resultado<Usuario>.Erro(TipoFalha.Invalido, "Bônus desconhecido.");

            var usuario = await _db.Usuarios.FindAsync(usuarioId);
            if (usuario == null) return Resultado<Usuario>.Erro(TipoFalha.NaoEncontrado, "Usuário não encontrado");
            if (usuario.Moedas < bonus.Custo)
                return Resultado<Usuario>.Erro(TipoFalha.Invalido, $"Saldo insuficiente: o bônus custa {bonus.Custo} moedas.");

            usuario.Moedas -= bonus.Custo;
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
