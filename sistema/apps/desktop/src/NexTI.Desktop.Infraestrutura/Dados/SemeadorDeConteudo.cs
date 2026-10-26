using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using NexTI.Desktop.Dominio.Entidades;

namespace NexTI.Desktop.Infraestrutura.Dados;

/// <summary>
/// Atualiza o conteúdo e acrescenta fases e cartas sem apagar IDs, revisões ou conclusões. Lê o mesmo conteudo.json que a API
/// usa (gerado de packages/shared por "npm run seed:api"), então as cartas são as do site.
/// Entram só as fases da trilha; os bônus (comprados com moedas no site) ficam de fora.
/// </summary>
public static class SemeadorDeConteudo
{
    private record FaseJson(string Codigo, string Descricao);
    private record CartaJson(string CodigoFase, string Frente, string Verso, string? Dica);
    private record ConteudoJson(List<FaseJson> Fases, List<CartaJson> Flashcards);

    private static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true };

    public static int Semear(ContextoNexTI contexto, string caminhoDoConteudo)
    {
        var conteudo = JsonSerializer.Deserialize<ConteudoJson>(File.ReadAllText(caminhoDoConteudo),
                           Json)
                       ?? throw new InvalidDataException($"Conteúdo vazio: {caminhoDoConteudo}");

        var existentes = contexto.Fases.Include(f => f.Cartas).ToDictionary(f => f.Codigo);
        var ordem = 0;
        var novasFases = 0;
        foreach (var f in conteudo.Fases.Where(f => f.Codigo.StartsWith("fase")))
        {
            ordem++;
            if (!existentes.TryGetValue(f.Codigo, out var fase))
            {
                fase = new Fase(f.Codigo, f.Descricao, ordem);
                existentes.Add(f.Codigo, fase);
                contexto.Fases.Add(fase);
                novasFases++;
            }
            else
            {
                contexto.Entry(fase).Property(x => x.Descricao).CurrentValue = f.Descricao;
                contexto.Entry(fase).Property(x => x.Ordem).CurrentValue = ordem;
            }
            foreach (var carta in conteudo.Flashcards.Where(c => c.CodigoFase == f.Codigo))
            {
                var existente = fase.Cartas.FirstOrDefault(c => c.Frente == carta.Frente);
                if (existente is null)
                    fase.Cartas.Add(new Flashcard(carta.CodigoFase, carta.Frente, carta.Verso, carta.Dica));
                else
                {
                    // A carta mantém a identidade usada pelo SM-2; apenas o texto canônico é atualizado.
                    contexto.Entry(existente).Property(c => c.Verso).CurrentValue = carta.Verso;
                    contexto.Entry(existente).Property(c => c.Dica).CurrentValue = carta.Dica;
                }
            }
        }
        contexto.SaveChanges();
        return novasFases;
    }
}
