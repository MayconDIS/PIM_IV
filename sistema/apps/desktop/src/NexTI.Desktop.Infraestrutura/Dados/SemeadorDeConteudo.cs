using System.Text.Json;
using NexTI.Desktop.Dominio.Entidades;

namespace NexTI.Desktop.Infraestrutura.Dados;

/// <summary>
/// Enche o banco vazio com as fases e as cartas do Nex_TI. Lê o mesmo conteudo.json que a API
/// usa (gerado de packages/shared por "npm run seed:api"), então as cartas são as do site.
/// Entram só as fases da trilha; os bônus (comprados com moedas no site) ficam de fora.
/// </summary>
public static class SemeadorDeConteudo
{
    private record FaseJson(string Codigo, string Descricao);
    private record CartaJson(string CodigoFase, string Frente, string Verso, string? Dica);
    private record ConteudoJson(List<FaseJson> Fases, List<CartaJson> Flashcards);

    public static int Semear(ContextoNexTI contexto, string caminhoDoConteudo)
    {
        if (contexto.Fases.Any()) return 0;

        var conteudo = JsonSerializer.Deserialize<ConteudoJson>(File.ReadAllText(caminhoDoConteudo),
                           new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                       ?? throw new InvalidDataException($"Conteúdo vazio: {caminhoDoConteudo}");

        var ordem = 0;
        foreach (var f in conteudo.Fases.Where(f => f.Codigo.StartsWith("fase")))
        {
            var fase = new Fase(f.Codigo, f.Descricao, ++ordem);
            fase.Cartas.AddRange(conteudo.Flashcards.Where(c => c.CodigoFase == f.Codigo)
                .Select(c => new Flashcard(c.CodigoFase, c.Frente, c.Verso, c.Dica)));
            contexto.Fases.Add(fase);
        }
        contexto.SaveChanges();
        return ordem;
    }
}
