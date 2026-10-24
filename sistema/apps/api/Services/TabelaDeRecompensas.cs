using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace NexTI_API.Services
{
    public record PremioFase(int Xp, int Moedas);
    public record PremioTeste(int Xp, int Corte);
    public record PremioBonus(int Xp, int Moedas, int Custo);
    public record FaixaDeNivel(int XpMinimo, int Nivel);
    public record Premio(int Xp, int Moedas);

    /// <summary>
    /// XP e moedas de cada fase, teste e bônus, mais as faixas de nível. Vem de
    /// Data/Seed/recompensas.json, gerado de packages/shared/src/gamificacao.js
    /// (npm run seed:api): o site, o app e a API pagam o mesmo valor.
    /// </summary>
    public class TabelaDeRecompensas
    {
        public Dictionary<string, PremioFase> Fases { get; init; } = new();
        public Dictionary<string, PremioTeste> Testes { get; init; } = new();
        public Dictionary<string, PremioBonus> Bonus { get; init; } = new();
        public List<FaixaDeNivel> Niveis { get; init; } = new();

        private static readonly Lazy<TabelaDeRecompensas> padrao = new(() => Carregar());

        /// <summary>A tabela do arquivo publicado com a API (usada quando ninguém injeta outra).</summary>
        public static TabelaDeRecompensas Padrao => padrao.Value;

        public static TabelaDeRecompensas Carregar(string? caminho = null)
        {
            caminho ??= Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "recompensas.json");
            if (!File.Exists(caminho))
                throw new FileNotFoundException("Tabela de recompensas não encontrada. Rode: npm run seed:api", caminho);
            return JsonSerializer.Deserialize<TabelaDeRecompensas>(File.ReadAllText(caminho),
                       new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                   ?? throw new InvalidDataException($"Tabela de recompensas vazia: {caminho}");
        }

        public bool Conhece(string faseId) => Fases.ContainsKey(faseId) || Testes.ContainsKey(faseId) || Bonus.ContainsKey(faseId);

        /// <summary>
        /// Prêmio ao concluir uma fase, teste ou bônus, igual ao recompensa() do gamificacao.js:
        /// teste reprovado (ou sem questões) não paga; fase desconhecida também não.
        /// </summary>
        public Premio PremioDe(string faseId, int acertos, int total)
        {
            if (Testes.TryGetValue(faseId, out var teste))
                return Aproveitamento(acertos, total) >= teste.Corte ? new Premio(teste.Xp, 0) : new Premio(0, 0);
            if (Fases.TryGetValue(faseId, out var fase)) return new Premio(fase.Xp, fase.Moedas);
            if (Bonus.TryGetValue(faseId, out var bonus)) return new Premio(bonus.Xp, bonus.Moedas);
            return new Premio(0, 0);
        }

        /// <summary>Percentual de acertos arredondado como o Math.round do JavaScript.</summary>
        public static int Aproveitamento(int acertos, int total) =>
            total <= 0 ? 0 : (int)Sm2Engine.ArredondarComoJs((double)acertos / total * 100);   // mesma ordem da conta do JS

        public int NivelPorXp(int xp) =>
            Niveis.OrderByDescending(n => n.XpMinimo).FirstOrDefault(n => xp >= n.XpMinimo)?.Nivel ?? 1;
    }
}
