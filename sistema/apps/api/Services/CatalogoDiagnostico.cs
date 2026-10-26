using System.Text.Json;
using System.Text.Json.Serialization;

namespace NexTI_API.Services;

public record RespostaDiagnostico(string? PerguntaId, [property: JsonRequired] int? Alternativa);
public record PerguntaDiagnostico(string Id, int Modulo, string FaseId, string P, List<string> R, int Certa, string Explicacao);
public record ModuloDiagnostico(int Numero, string Codigo, string Titulo, List<string> Fases, string TesteId);
public record ResumoModuloDiagnostico(int Numero, string Codigo, string Titulo, int Total, int Acertos, bool Dominio);
public record RevisaoDiagnostico(string PerguntaId, string FaseId, int Modulo, int? Respondida, int Correta, bool Acertou, string Explicacao);
public record ResultadoDiagnostico(int Versao, int Total, int Acertos, int ModuloRecomendado, string FaseRecomendada,
    List<ResumoModuloDiagnostico> Modulos, List<RevisaoDiagnostico> Revisoes, List<string> Fases,
    DateTime? RealizadoEm = null, List<string>? FasesLiberadas = null);

/// <summary>Dados gerados do catálogo compartilhado. A API corrige as respostas sem confiar na pontuação enviada.</summary>
public record CatalogoDiagnostico(int Versao, int PerguntasPorModulo, int MinimoAcertosPorModulo,
    List<ModuloDiagnostico> Modulos, List<string> OrdemFases, List<PerguntaDiagnostico> Perguntas)
{
    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    public static CatalogoDiagnostico Carregar(string? caminho = null) =>
        JsonSerializer.Deserialize<CatalogoDiagnostico>(File.ReadAllText(caminho ??
            Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "diagnostico.json")), Json)
        ?? throw new InvalidDataException("Catálogo do diagnóstico vazio.");

    public Resultado<ResultadoDiagnostico> Avaliar(IReadOnlyList<RespostaDiagnostico?>? respostas)
    {
        var avaliados = Modulos.Where(m => m.Numero <= 4).OrderBy(m => m.Numero).ToList();
        if (respostas is null || respostas.Count != avaliados.Count * PerguntasPorModulo)
            return Invalido("Responda às 20 perguntas, cinco de cada módulo.");
        var perguntas = Perguntas.ToDictionary(p => p.Id, StringComparer.Ordinal);
        var vistas = new HashSet<string>(StringComparer.Ordinal);
        var revisoes = new List<RevisaoDiagnostico>();
        foreach (var resposta in respostas)
        {
            if (resposta?.PerguntaId is not string id || !perguntas.TryGetValue(id, out var pergunta) || !vistas.Add(id))
                return Invalido("O diagnóstico contém pergunta desconhecida ou repetida.");
            if (resposta.Alternativa is int alternativa && (alternativa < 0 || alternativa >= pergunta.R.Count))
                return Invalido("A alternativa informada é inválida.");
            revisoes.Add(new(id, pergunta.FaseId, pergunta.Modulo, resposta.Alternativa, pergunta.Certa,
                resposta.Alternativa == pergunta.Certa, pergunta.Explicacao));
        }
        if (avaliados.Any(m => revisoes.Count(r => r.Modulo == m.Numero) != PerguntasPorModulo))
            return Invalido("O diagnóstico deve conter cinco perguntas de cada módulo.");
        var modulos = avaliados.Select(m =>
        {
            var acertos = revisoes.Count(r => r.Modulo == m.Numero && r.Acertou);
            return new ResumoModuloDiagnostico(m.Numero, m.Codigo, m.Titulo, PerguntasPorModulo, acertos,
                acertos >= MinimoAcertosPorModulo);
        }).ToList();
        var recomendado = modulos.FirstOrDefault(m => !m.Dominio)?.Numero ?? 5;
        var fase = Modulos.Single(m => m.Numero == recomendado).Fases[0];
        var fases = OrdemFases.Take(OrdemFases.IndexOf(fase) + 1).ToList();
        return Resultado<ResultadoDiagnostico>.Ok(new(Versao, respostas.Count, revisoes.Count(r => r.Acertou),
            recomendado, fase, modulos, revisoes, fases));
    }

    public List<string> AcessosLegados(int nivel) => nivel >= 6 ? [.. OrdemFases]
        : nivel >= 3 ? OrdemFases.Take(OrdemFases.IndexOf("teste-mod2") + 1).ToList() : [OrdemFases[0]];

    private static Resultado<ResultadoDiagnostico> Invalido(string mensagem) =>
        Resultado<ResultadoDiagnostico>.Erro(TipoFalha.Invalido, mensagem);
}
