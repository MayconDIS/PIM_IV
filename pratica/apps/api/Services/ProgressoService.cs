using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;

namespace NexTI_API.Services
{
    public record ProgressoResumo(int FlashcardId, string Frente, string CodigoFase, int Repeticoes,
        double IntervaloDias, double FatorFacilidade, DateTime DataProximaRevisao);

    public record EstatisticasDetalhadas(int Id, string Username, int Nivel, int XP, int Moedas,
        int TotalEstudados, int CartasMaduras, int CartasEmAprendizado, int CartasDevidasHoje, double FacilidadeMedia);

    public interface IProgressoService
    {
        Task<List<ProgressoResumo>> ListarAsync(int usuarioId);
        Task<ProgressoFlashcard> RegistrarRespostaAsync(int usuarioId, int flashcardId, int qualidade);
        Task<Resultado<EstatisticasDetalhadas>> EstatisticasAsync(string username);
    }

    /// <summary>Progresso de repetição espaçada do aluno: grava cada resposta e aplica o SM-2.</summary>
    public class ProgressoService : IProgressoService
    {
        /// <summary>A partir deste intervalo a carta é considerada "madura" (convenção do Anki).</summary>
        public const int DiasParaCartaMadura = 21;

        private readonly AppDbContext _db;
        private readonly ISm2Engine _sm2;

        public ProgressoService(AppDbContext db, ISm2Engine sm2)
        {
            _db = db;
            _sm2 = sm2;
        }

        public Task<List<ProgressoResumo>> ListarAsync(int usuarioId) =>
            _db.Progresso_Flashcards
                .Where(p => p.UsuarioId == usuarioId)
                .Join(_db.Flashcards,
                      p => p.FlashcardId,
                      f => f.Id,
                      (p, f) => new ProgressoResumo(p.FlashcardId, f.Frente, f.CodigoFase, p.Repeticoes,
                          p.IntervaloDias, p.FatorFacilidade, p.DataProximaRevisao))
                .ToListAsync();

        public async Task<ProgressoFlashcard> RegistrarRespostaAsync(int usuarioId, int flashcardId, int qualidade)
        {
            var progresso = await _db.Progresso_Flashcards.FindAsync(usuarioId, flashcardId);
            if (progresso == null)
            {
                progresso = new ProgressoFlashcard
                {
                    UsuarioId = usuarioId,
                    FlashcardId = flashcardId,
                    FatorFacilidade = 2.5
                };
                _db.Progresso_Flashcards.Add(progresso);
            }

            // Inversão de dependência para aplicar cálculo do SM-2 (DIP)
            _sm2.Calcular(progresso, qualidade);

            await _db.SaveChangesAsync();
            return progresso;
        }

        public async Task<Resultado<EstatisticasDetalhadas>> EstatisticasAsync(string username)
        {
            var usuario = await _db.Usuarios
                .Include(u => u.Progressos)
                .FirstOrDefaultAsync(u => u.Username == username);
            if (usuario == null)
                return Resultado<EstatisticasDetalhadas>.Erro(TipoFalha.NaoEncontrado, "Usuário não encontrado");

            var hoje = DateTime.UtcNow.Date;
            var progressos = usuario.Progressos;
            var facilidadeMedia = progressos.Any() ? progressos.Average(p => p.FatorFacilidade) : 2.5;

            return Resultado<EstatisticasDetalhadas>.Ok(new EstatisticasDetalhadas(
                usuario.Id,
                usuario.Username,
                usuario.Nivel,
                usuario.XP,
                usuario.Moedas,
                TotalEstudados: progressos.Count,
                CartasMaduras: progressos.Count(p => p.IntervaloDias >= DiasParaCartaMadura),
                CartasEmAprendizado: progressos.Count(p => p.IntervaloDias < DiasParaCartaMadura),
                CartasDevidasHoje: progressos.Count(p => p.DataProximaRevisao <= hoje),
                FacilidadeMedia: Math.Round(facilidadeMedia, 2)));
        }
    }
}
