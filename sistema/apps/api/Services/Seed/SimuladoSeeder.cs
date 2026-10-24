using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;

namespace NexTI_API.Services.Seed
{
    /// <summary>
    /// Povoa o módulo de simulados do diagrama UML (áreas, provas, questões e alternativas)
    /// com as provas oficiais do ENADE de ADS, lidas de Data/Seed/simulados.json — arquivo
    /// gerado por scripts/gerar-semente-api.mjs a partir de packages/shared/src/enadeOficial.js.
    /// Só insere o que falta, pela origem ("ENADE 2017 - questão 12").
    /// </summary>
    public class SimuladoSeeder : IEtapaSeed
    {
        private static readonly JsonSerializerOptions OpcoesJson = new() { PropertyNameCaseInsensitive = true };
        private readonly string _caminhoArquivo;

        public SimuladoSeeder() : this(null) { }

        public SimuladoSeeder(string? caminhoArquivo)
        {
            _caminhoArquivo = caminhoArquivo ?? Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "simulados.json");
        }

        public string Nome => "Simulados ENADE";

        /// <summary>Origem das 6 questões de exemplo das versões antigas, que não eram da prova real.</summary>
        public const string OrigemDasQuestoesDeExemplo = "ENADE 2021";

        public static string Origem(int ano, int numero) => $"ENADE {ano} - questão {numero}";

        public async Task<int> ExecutarAsync(AppDbContext db)
        {
            var semente = await LerAsync();
            var alterados = await RemoverQuestoesDeExemploAsync(db);

            var areas = await db.AreasConhecimento.ToDictionaryAsync(a => a.NomeArea);
            var origens = (await db.Questoes.Select(q => q.Origem).ToListAsync()).ToHashSet();

            foreach (var provaSemente in semente.Provas)
            {
                var prova = await db.Provas.FirstOrDefaultAsync(p => p.Ano == provaSemente.Ano && p.Tipo == provaSemente.Tipo);
                if (prova is null)
                {
                    prova = new Prova { Ano = provaSemente.Ano, Tipo = provaSemente.Tipo };
                    db.Provas.Add(prova);
                    alterados++;
                }

                foreach (var questaoSemente in provaSemente.Questoes)
                {
                    var origem = Origem(provaSemente.Ano, questaoSemente.Numero);
                    if (!origens.Add(origem)) continue;

                    if (!areas.TryGetValue(questaoSemente.Area, out var area))
                    {
                        area = new AreaConhecimento { NomeArea = questaoSemente.Area };
                        areas[questaoSemente.Area] = area;
                        db.AreasConhecimento.Add(area);
                        alterados++;
                    }

                    var questao = new Questao { Area = area, Enunciado = questaoSemente.Enunciado, Origem = origem };
                    for (var i = 0; i < questaoSemente.Alternativas.Count; i++)
                        questao.Alternativas.Add(new Alternativa { Texto = questaoSemente.Alternativas[i], IsCorreta = i == questaoSemente.Correta });
                    questao.Provas.Add(prova);
                    db.Questoes.Add(questao);
                    alterados += 1 + questao.Alternativas.Count;
                }
            }

            await db.SaveChangesAsync();
            return alterados;
        }

        /// <summary>
        /// As primeiras versões gravavam 6 questões escritas pela equipe com a origem "ENADE 2021",
        /// como se fossem da prova. Agora que a prova real está no banco, elas saem.
        /// </summary>
        private static async Task<int> RemoverQuestoesDeExemploAsync(AppDbContext db)
        {
            var exemplos = await db.Questoes
                .Include(q => q.Alternativas)
                .Where(q => q.Origem == OrigemDasQuestoesDeExemplo)
                .ToListAsync();
            if (exemplos.Count == 0) return 0;

            db.Alternativas.RemoveRange(exemplos.SelectMany(q => q.Alternativas));
            db.Questoes.RemoveRange(exemplos);
            await db.SaveChangesAsync();
            return exemplos.Count;
        }

        public async Task<SementeSimulados> LerAsync()
        {
            if (!File.Exists(_caminhoArquivo))
                throw new FileNotFoundException("Semente dos simulados não encontrada. Rode: npm run seed:api", _caminhoArquivo);

            await using var arquivo = File.OpenRead(_caminhoArquivo);
            return await JsonSerializer.DeserializeAsync<SementeSimulados>(arquivo, OpcoesJson)
                ?? throw new InvalidDataException($"Semente vazia ou inválida: {_caminhoArquivo}");
        }
    }

    public record SementeSimulados(List<SementeProva> Provas);
    public record SementeProva(int Ano, string Tipo, List<SementeQuestao> Questoes);
    public record SementeQuestao(int Numero, string Area, string Enunciado, List<string> Alternativas, int Correta);
}
