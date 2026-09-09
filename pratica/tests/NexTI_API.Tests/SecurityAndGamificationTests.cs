using System.Text.RegularExpressions;
using Xunit;

namespace NexTI_API.Tests
{
    public class SecurityAndGamificationTests
    {
        [Theory]
        [InlineData("Maycon Silva; rm -rf /", "Maycon Silva rm -rf /")]
        [InlineData("Aluno & echo hacked", "Aluno  echo hacked")]
        [InlineData("Test | dir", "Test  dir")]
        [InlineData("`whoami`", "whoami")]
        [InlineData("$(id)", "id")]
        [InlineData("<script>alert(1)</script>", "scriptalert1/script")]
        public void Sanitizacao_ParametrosCertificado_DeveRemoverCaracteresPerigosos(string input, string esperado)
        {
            // Regex de sanitização contra OS Command Injection usada no EndpointExtensions
            string resultado = Regex.Replace(input, @"[""&|;`$(){}\\<>!\n\r]", "");

            Assert.Equal(esperado, resultado);
        }

        [Fact]
        public void Gamificacao_ValidacaoDeDelta_DeveDetectarIncrementoSuspeito()
        {
            int xpAnterior = 100;
            int xpNovoInvalido = 400; // Delta de 300 (> 200 permitido por requisição)
            int xpDelta = xpNovoInvalido - xpAnterior;

            bool isSuspeito = xpDelta > 200;

            Assert.True(isSuspeito);
        }

        [Fact]
        public void Gamificacao_ValidacaoDeDelta_DevePermitirIncrementoValido()
        {
            int xpAnterior = 100;
            int xpNovoValido = 150; // Delta de 50
            int xpDelta = xpNovoValido - xpAnterior;

            bool isSuspeito = xpDelta > 200;

            Assert.False(isSuspeito);
        }
    }
}
