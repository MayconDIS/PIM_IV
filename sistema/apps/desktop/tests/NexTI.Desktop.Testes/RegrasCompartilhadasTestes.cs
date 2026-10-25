using System.Text.Json;
using NexTI.Desktop.Aplicacao;
using NexTI.Desktop.Dominio.Entidades;
using NexTI.Desktop.Dominio.Regras;

namespace NexTI.Desktop.Testes;

/// <summary>
/// O programa desktop tem de calcular igual ao site, ao app e à API. Os casos vêm dos mesmos
/// arquivos que os testes em JavaScript e os da API conferem (packages/shared/tests).
/// </summary>
public class RegrasCompartilhadasTestes
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true };
    private static string Dados(string arquivo) => Path.Combine(AppContext.BaseDirectory, "Dados", arquivo);

    private record EsperadoSm2(int Repeticoes, double IntervaloDias, double FatorFacilidade);
    private record CasoSm2(string Nome, string[] Respostas, EsperadoSm2 Esperado);
    private record EsperadoPremio(int Xp, int Moedas);
    private record CasoPremio(string FaseId, EsperadoPremio Esperado);
    private record CasoNivel(int Xp, int Nivel);
    private record CasosRecompensa(List<CasoPremio> Premios, List<CasoNivel> Niveis);

    private static readonly Dictionary<string, Resposta> RespostaDoBotao = new()
    {
        ["again"] = Resposta.Errei, ["hard"] = Resposta.Dificil, ["good"] = Resposta.Bom, ["easy"] = Resposta.Facil,
    };

    public static IEnumerable<object[]> CasosSm2() =>
        JsonSerializer.Deserialize<List<CasoSm2>>(File.ReadAllText(Dados("sm2-casos.json")), Json)!
            .Select(c => new object[] { c.Nome, c.Respostas, c.Esperado.Repeticoes, c.Esperado.IntervaloDias, c.Esperado.FatorFacilidade });

    [Theory]
    [MemberData(nameof(CasosSm2))]
    public void Sm2_DaOMesmoResultadoQueOSiteEAApi(string nome, string[] respostas, int repeticoes, double intervalo, double fator)
    {
        var agendador = new AgendadorSm2();
        var atual = Agendamento.Inicial;
        foreach (var r in respostas) atual = agendador.Calcular(atual, RespostaDoBotao[r]);

        Assert.True(repeticoes == atual.Repeticoes, $"{nome}: repetições");
        Assert.True(intervalo == atual.IntervaloDias, $"{nome}: intervalo {atual.IntervaloDias}, esperado {intervalo}");
        Assert.True(fator == Math.Round(atual.FatorFacilidade, 6), $"{nome}: fator {atual.FatorFacilidade}, esperado {fator}");
    }

    [Fact]
    public void Revisao_MarcaAProximaDataComOIntervalo()
    {
        var revisao = new Revisao(alunoId: 1, flashcardId: 1);
        var hoje = new DateOnly(2026, 10, 27);

        revisao.Registrar(Resposta.Facil, new AgendadorSm2(), hoje);   // Fácil numa carta nova: 3 dias

        Assert.Equal(hoje.AddDays(3), revisao.ProximaRevisao);
        Assert.False(revisao.VenceAte(hoje));
        Assert.True(revisao.VenceAte(hoje.AddDays(3)));
    }

    [Fact]
    public void Recompensas_IguaisAoGamificacaoDoSite()
    {
        var tabela = TabelaDeRecompensas.Carregar(Dados("recompensas.json"));
        var casos = JsonSerializer.Deserialize<CasosRecompensa>(File.ReadAllText(Dados("recompensa-casos.json")), Json)!;

        var dasFases = casos.Premios.Where(c => c.FaseId.StartsWith("fase")).ToList();
        Assert.NotEmpty(dasFases);
        foreach (var c in dasFases)
            Assert.Equal(new Premio(c.Esperado.Xp, c.Esperado.Moedas), tabela.PremioDe(c.FaseId));
        foreach (var n in casos.Niveis)
            Assert.True(n.Nivel == tabela.NivelPorXp(n.Xp), $"{n.Xp} XP deveria ser nível {n.Nivel}");
    }

    [Fact]
    public void Recompensas_FaseDesconhecidaNaoPaga()
    {
        var tabela = TabelaDeRecompensas.Carregar(Dados("recompensas.json"));
        Assert.Equal(Premio.Nenhum, tabela.PremioDe("nao-existe"));
    }
}
