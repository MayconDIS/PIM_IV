using System.Text.Json;
using NexTI.Desktop.Dominio.Regras;

namespace NexTI.Desktop.Aplicacao;

/// <summary>
/// XP e moedas de cada fase e as faixas de nível. Lê o mesmo recompensas.json da API
/// (gerado de packages/shared/src/gamificacao.js por "npm run seed:api"): o programa desktop
/// paga o mesmo valor que o site, o app e a API.
/// </summary>
public class TabelaDeRecompensas
{
    public record PremioFase(int Xp, int Moedas);
    public record FaixaDeNivel(int XpMinimo, int Nivel);

    public Dictionary<string, PremioFase> Fases { get; init; } = new();
    public List<FaixaDeNivel> Niveis { get; init; } = new();

    private static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true };

    public static TabelaDeRecompensas Carregar(string caminho)
    {
        if (!File.Exists(caminho))
            throw new FileNotFoundException("Tabela de recompensas não encontrada.", caminho);
        return JsonSerializer.Deserialize<TabelaDeRecompensas>(File.ReadAllText(caminho),
                   Json)
               ?? throw new InvalidDataException($"Tabela de recompensas vazia: {caminho}");
    }

    public Premio PremioDe(string codigoFase) =>
        Fases.TryGetValue(codigoFase, out var p) ? new Premio(p.Xp, p.Moedas) : Premio.Nenhum;

    public int NivelPorXp(int xp) =>
        Niveis.OrderByDescending(n => n.XpMinimo).FirstOrDefault(n => xp >= n.XpMinimo)?.Nivel ?? 1;
}
