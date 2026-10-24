using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using NexTI_API.Models;
using NexTI_API.Services;
using Xunit;

namespace NexTI_API.Tests
{
    /// <summary>
    /// O SM-2 da API tem de dar o mesmo resultado do site e do app. Os casos vêm de
    /// packages/shared/tests/sm2-casos.json, o mesmo arquivo que o teste em JavaScript confere.
    /// </summary>
    public class Sm2EngineTests
    {
        private readonly Sm2Engine _sm2 = new();

        private record Esperado(int Repeticoes, double IntervaloDias, double FatorFacilidade);
        private record Caso(string Nome, string[] Respostas, Esperado Esperado);

        private static readonly Dictionary<string, int> NotaDaResposta = new()
        {
            ["again"] = 1, ["hard"] = 3, ["good"] = 4, ["easy"] = 5,
        };

        public static IEnumerable<object[]> CasosCompartilhados()
        {
            var arquivo = Path.Combine(AppContext.BaseDirectory, "sm2-casos.json");
            var casos = JsonSerializer.Deserialize<List<Caso>>(File.ReadAllText(arquivo),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            return casos.Select(c => new object[] { c.Nome, c.Respostas, c.Esperado.Repeticoes, c.Esperado.IntervaloDias, c.Esperado.FatorFacilidade });
        }

        [Theory]
        [MemberData(nameof(CasosCompartilhados))]
        public void MesmoResultadoQueOSiteEOApp(string nome, string[] respostas, int repeticoes, double intervalo, double fator)
        {
            var progresso = new ProgressoFlashcard();
            foreach (var resposta in respostas) _sm2.Calcular(progresso, NotaDaResposta[resposta]);

            Assert.True(repeticoes == progresso.Repeticoes, $"{nome}: repetições");
            Assert.True(intervalo == progresso.IntervaloDias, $"{nome}: intervalo {progresso.IntervaloDias}, esperado {intervalo}");
            Assert.True(fator == Math.Round(progresso.FatorFacilidade, 6), $"{nome}: fator {progresso.FatorFacilidade}, esperado {fator}");
        }

        [Theory]
        [InlineData(0, Sm2Engine.Resposta.Errei)]
        [InlineData(1, Sm2Engine.Resposta.Errei)]
        [InlineData(2, Sm2Engine.Resposta.Errei)]
        [InlineData(3, Sm2Engine.Resposta.Dificil)]
        [InlineData(4, Sm2Engine.Resposta.Bom)]
        [InlineData(5, Sm2Engine.Resposta.Facil)]
        public void NotaDoSite_ViraUmaDasQuatroRespostas(int qualidade, Sm2Engine.Resposta esperada)
        {
            Assert.Equal(esperada, Sm2Engine.RespostaDaQualidade(qualidade));
        }

        [Fact]
        public void ProximaRevisao_EHojeMaisOIntervalo()
        {
            var progresso = new ProgressoFlashcard();

            _sm2.Calcular(progresso, 5);   // Fácil numa carta nova: 3 dias

            Assert.Equal(DateTime.UtcNow.Date.AddDays(3), progresso.DataProximaRevisao);
        }

        [Fact]
        public void Dificil_SomaPeloMenosUmDia()
        {
            var progresso = new ProgressoFlashcard { Repeticoes = 1, IntervaloDias = 1, FatorFacilidade = 2.5 };

            _sm2.Calcular(progresso, 3);

            Assert.Equal(2, progresso.IntervaloDias);
        }

        [Fact]
        public void FatorNuncaFicaAbaixoDe1Ponto3()
        {
            var progresso = new ProgressoFlashcard();
            for (var i = 0; i < 40; i++) _sm2.Calcular(progresso, i % 2 == 0 ? 3 : 1);

            Assert.Equal(Sm2Engine.FatorMinimo, progresso.FatorFacilidade);
        }

        [Theory]
        [InlineData(2.5, 3)]
        [InlineData(7.5, 8)]
        [InlineData(7.95, 8)]
        [InlineData(7.49, 7)]
        public void Arredonda_ComoOMathRoundDoJavaScript(double valor, double esperado)
        {
            Assert.Equal(esperado, Sm2Engine.ArredondarComoJs(valor));
        }
    }
}
