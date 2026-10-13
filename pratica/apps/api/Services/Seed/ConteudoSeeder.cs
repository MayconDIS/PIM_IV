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
    /// Povoa Fases e Flashcards a partir de Data/Seed/conteudo.json — arquivo gerado
    /// por scripts/sync-content.mjs a partir do mesmo conteúdo canônico do front-end.
    /// Nunca apaga nada: cartas já existentes (e o progresso ligado a elas) são preservadas.
    /// </summary>
    public class ConteudoSeeder : IEtapaSeed
    {
        private static readonly JsonSerializerOptions OpcoesJson = new() { PropertyNameCaseInsensitive = true };
        private readonly string _caminhoArquivo;

        public ConteudoSeeder(string? caminhoArquivo = null)
        {
            _caminhoArquivo = caminhoArquivo ?? Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "conteudo.json");
        }

        public string Nome => "Conteúdo (fases e flashcards)";

        public async Task<int> ExecutarAsync(AppDbContext db)
        {
            var semente = await LerAsync();
            var inseridos = 0;

            var fasesExistentes = await db.Fases.ToDictionaryAsync(f => f.CodigoFase);
            foreach (var fase in semente.Fases)
            {
                if (fasesExistentes.TryGetValue(fase.Codigo, out var atual))
                {
                    atual.Descricao = fase.Descricao;
                    continue;
                }
                db.Fases.Add(new Fase { CodigoFase = fase.Codigo, Descricao = fase.Descricao });
                inseridos++;
            }
            await db.SaveChangesAsync();

            var cartasExistentes = (await db.Flashcards
                    .Select(f => new { f.CodigoFase, f.Frente })
                    .ToListAsync())
                .Select(f => Chave(f.CodigoFase, f.Frente))
                .ToHashSet();

            foreach (var carta in semente.Flashcards)
            {
                if (!cartasExistentes.Add(Chave(carta.CodigoFase, carta.Frente))) continue;
                db.Flashcards.Add(new Flashcard
                {
                    CodigoFase = carta.CodigoFase,
                    Frente = carta.Frente,
                    Verso = carta.Verso,
                    Dica = carta.Dica,
                    Opcoes = carta.Opcoes,
                    Correta = carta.Correta,
                });
                inseridos++;
            }
            await db.SaveChangesAsync();

            return inseridos;
        }

        public async Task<SementeConteudo> LerAsync()
        {
            if (!File.Exists(_caminhoArquivo))
                throw new FileNotFoundException("Semente de conteúdo não encontrada. Rode: npm run sync:content", _caminhoArquivo);

            await using var arquivo = File.OpenRead(_caminhoArquivo);
            return await JsonSerializer.DeserializeAsync<SementeConteudo>(arquivo, OpcoesJson)
                ?? throw new InvalidDataException($"Semente vazia ou inválida: {_caminhoArquivo}");
        }

        private static string Chave(string codigoFase, string frente) => $"{codigoFase}\u001f{frente}";
    }

    public record SementeConteudo(List<SementeFase> Fases, List<SementeFlashcard> Flashcards);
    public record SementeFase(string Codigo, string Descricao);
    public record SementeFlashcard(string CodigoFase, string Frente, string Verso, string? Dica, List<string>? Opcoes, int? Correta);
}
