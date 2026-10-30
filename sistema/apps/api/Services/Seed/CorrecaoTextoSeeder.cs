using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;

namespace NexTI_API.Services.Seed
{
    /// <summary>
    /// Leva para o banco as correções de texto das cartas da semente (por exemplo, palavras de
    /// Portugal trocadas pelas do Brasil), lidas de Data/Seed/correcoes-texto.json.
    /// O <see cref="ConteudoSeeder"/> só insere cartas novas; sem esta etapa, uma carta com a
    /// frente corrigida entraria duplicada e as já existentes ficariam com o texto antigo.
    /// Cada campo só muda se ainda estiver igual ao texto antigo: o que um Tutor editou fica como está.
    /// Roda antes do ConteudoSeeder e é idempotente (na segunda vez não acha mais o texto antigo).
    /// </summary>
    public class CorrecaoTextoSeeder : IEtapaSeed
    {
        private static readonly JsonSerializerOptions OpcoesJson = new() { PropertyNameCaseInsensitive = true };
        private readonly string _caminhoArquivo;

        public CorrecaoTextoSeeder(string? caminhoArquivo = null)
        {
            _caminhoArquivo = caminhoArquivo ?? Path.Combine(System.AppContext.BaseDirectory, "Data", "Seed", "correcoes-texto.json");
        }

        public string Nome => "Correções de texto das cartas";

        public async Task<int> ExecutarAsync(AppDbContext db)
        {
            var corrigidas = 0;
            foreach (var correcao in await LerAsync())
            {
                var carta = await db.Flashcards.FirstOrDefaultAsync(f =>
                    f.CodigoFase == correcao.CodigoFase && f.Frente == correcao.FrenteAntiga);
                if (carta is not null)
                {
                    var mudou = false;
                    if (correcao.Frente is not null) { carta.Frente = correcao.Frente; mudou = true; }
                    if (correcao.Verso is not null && carta.Verso == correcao.VersoAntigo) { carta.Verso = correcao.Verso; mudou = true; }
                    if (correcao.Dica is not null && carta.Dica == correcao.DicaAntiga) { carta.Dica = correcao.Dica; mudou = true; }
                    if (correcao.Opcoes is not null && carta.Opcoes is not null && correcao.OpcoesAntigas is not null
                        && carta.Opcoes.SequenceEqual(correcao.OpcoesAntigas))
                    {
                        carta.Opcoes = correcao.Opcoes;
                        mudou = true;
                    }
                    if (mudou) corrigidas++;
                }

                // Carta que um Tutor editou ou excluiu: a lista de moderadas passa a guardar a frente
                // nova, senão o ConteudoSeeder recriaria a carta com a frente corrigida.
                if (correcao.Frente is not null)
                {
                    var moderadas = await db.CartasModeradas
                        .Where(m => m.CodigoFase == correcao.CodigoFase && m.Frente == correcao.FrenteAntiga)
                        .ToListAsync();
                    moderadas.ForEach(m => m.Frente = correcao.Frente);
                }
            }
            await db.SaveChangesAsync();
            return corrigidas;
        }

        public async Task<List<CorrecaoCarta>> LerAsync()
        {
            if (!File.Exists(_caminhoArquivo)) return new();
            await using var arquivo = File.OpenRead(_caminhoArquivo);
            return await JsonSerializer.DeserializeAsync<List<CorrecaoCarta>>(arquivo, OpcoesJson) ?? new();
        }
    }

    public record CorrecaoCarta(
        string CodigoFase, string FrenteAntiga, string? Frente,
        string? VersoAntigo, string? Verso, string? DicaAntiga, string? Dica,
        List<string>? OpcoesAntigas, List<string>? Opcoes);
}
