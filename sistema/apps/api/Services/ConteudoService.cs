using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;

namespace NexTI_API.Services
{
    public record AlternativaDto(int Id, string Texto, bool IsCorreta);

    public record QuestaoDto(int Id, int IdArea, string Enunciado, string? Origem, IEnumerable<AlternativaDto> Alternativas);

    public interface IConteudoService
    {
        Task<List<Fase>> ListarFasesAsync();
        Task<List<Flashcard>> ListarFlashcardsAsync(string codigoFase);
        Task<Resultado<Flashcard>> CriarFlashcardAsync(string? codigoFase, string? frente, string? verso, string? dica);
        Task<Resultado<Flashcard>> EditarFlashcardAsync(int id, string? frente, string? verso, string? dica);
        Task<Resultado<bool>> ExcluirFlashcardAsync(int id);
        Task<List<AreaConhecimento>> ListarAreasAsync();
        Task<List<QuestaoDto>> ListarQuestoesAsync();
    }

    /// <summary>Conteúdo de estudo: fases, flashcards e questões dos simulados.</summary>
    public class ConteudoService : IConteudoService
    {
        private readonly AppDbContext _db;

        public ConteudoService(AppDbContext db) => _db = db;

        public Task<List<Fase>> ListarFasesAsync() => _db.Fases.ToListAsync();

        public Task<List<Flashcard>> ListarFlashcardsAsync(string codigoFase) =>
            _db.Flashcards.Where(f => f.CodigoFase == codigoFase).ToListAsync();

        public async Task<Resultado<Flashcard>> CriarFlashcardAsync(string? codigoFase, string? frente, string? verso, string? dica)
        {
            if (string.IsNullOrWhiteSpace(codigoFase) || string.IsNullOrWhiteSpace(frente) || string.IsNullOrWhiteSpace(verso))
                return Resultado<Flashcard>.Erro(TipoFalha.Invalido, "Fase, Frente e Verso são campos obrigatórios.");

            // Confere a fase já normalizada — o mesmo código que será gravado.
            codigoFase = codigoFase.Trim().ToLowerInvariant();
            if (!await _db.Fases.AnyAsync(f => f.CodigoFase == codigoFase))
                return Resultado<Flashcard>.Erro(TipoFalha.Invalido, $"A disciplina '{codigoFase}' não foi encontrada.");

            var flashcard = new Flashcard
            {
                CodigoFase = codigoFase,
                Frente = frente.Trim(),
                Verso = verso.Trim(),
                Dica = string.IsNullOrWhiteSpace(dica) ? null : dica.Trim()
            };

            _db.Flashcards.Add(flashcard);
            await _db.SaveChangesAsync();
            return Resultado<Flashcard>.Ok(flashcard);
        }

        public async Task<Resultado<Flashcard>> EditarFlashcardAsync(int id, string? frente, string? verso, string? dica)
        {
            if (string.IsNullOrWhiteSpace(frente) || string.IsNullOrWhiteSpace(verso))
                return Resultado<Flashcard>.Erro(TipoFalha.Invalido, "Frente e Verso são campos obrigatórios.");

            var flashcard = await _db.Flashcards.FindAsync(id);
            if (flashcard is null)
                return Resultado<Flashcard>.Erro(TipoFalha.NaoEncontrado, "Carta não encontrada.");

            if (flashcard.Frente != frente.Trim()) await LembrarModeracaoAsync(flashcard);
            flashcard.Frente = frente.Trim();
            flashcard.Verso = verso.Trim();
            flashcard.Dica = string.IsNullOrWhiteSpace(dica) ? null : dica.Trim();
            await _db.SaveChangesAsync();
            return Resultado<Flashcard>.Ok(flashcard);
        }

        /// <summary>Apaga a carta; o progresso dos alunos nela sai junto (ON DELETE CASCADE).</summary>
        public async Task<Resultado<bool>> ExcluirFlashcardAsync(int id)
        {
            var flashcard = await _db.Flashcards.FindAsync(id);
            if (flashcard is null)
                return Resultado<bool>.Erro(TipoFalha.NaoEncontrado, "Carta não encontrada.");

            await LembrarModeracaoAsync(flashcard);
            _db.Flashcards.Remove(flashcard);
            await _db.SaveChangesAsync();
            return Resultado<bool>.Ok(true);
        }

        /// <summary>
        /// Guarda a frente original para o seed (que roda a cada vez que a API sobe)
        /// não recriar a carta que o Tutor editou ou excluiu.
        /// </summary>
        private async Task LembrarModeracaoAsync(Flashcard original)
        {
            var jaGuardada = await _db.CartasModeradas.AnyAsync(m => m.CodigoFase == original.CodigoFase && m.Frente == original.Frente);
            if (!jaGuardada)
                _db.CartasModeradas.Add(new CartaModerada { CodigoFase = original.CodigoFase, Frente = original.Frente });
        }

        public Task<List<AreaConhecimento>> ListarAreasAsync() => _db.AreasConhecimento.ToListAsync();

        public Task<List<QuestaoDto>> ListarQuestoesAsync() =>
            _db.Questoes
                .Select(q => new QuestaoDto(q.Id, q.IdArea, q.Enunciado, q.Origem,
                    q.Alternativas.Select(a => new AlternativaDto(a.Id, a.Texto, a.IsCorreta))))
                .ToListAsync();
    }
}
