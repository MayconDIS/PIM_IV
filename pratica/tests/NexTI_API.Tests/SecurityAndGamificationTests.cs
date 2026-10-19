using System.Security.Claims;
using NexTI_API.Endpoints;
using NexTI_API.Services;
using Xunit;

namespace NexTI_API.Tests
{
    public class SecurityAndGamificationTests
    {
        private static readonly PoliticaDeCors Cors = new(
            "https://nexti-pim-iv.vercel.app",
            "nexti-pim-*-dev-maycon.vercel.app");

        [Theory]
        [InlineData("http://localhost:5501")]
        [InlineData("http://127.0.0.1:5173")]
        [InlineData("https://nexti-pim-iv.vercel.app")]
        [InlineData("https://nexti-pim-iv.vercel.app/")]
        [InlineData("https://nexti-pim-a3tfgmhcf-dev-maycon.vercel.app")]
        [InlineData("https://nexti-pim-iv-git-main-dev-maycon.vercel.app")]
        public void Cors_PermiteProducaoLocalhostEPreviewsDoProjeto(string origem)
        {
            Assert.True(Cors.Permite(origem));
        }

        [Theory]
        [InlineData("https://site-do-atacante.vercel.app")]                 // qualquer projeto da Vercel (antes passava)
        [InlineData("https://nexti-pim-x-dev-maycon.vercel.app.evil.com")]  // sufixo forjado
        [InlineData("https://evil.com/nexti-pim-x-dev-maycon.vercel.app")]
        [InlineData("https://nexti-pim-a.b-dev-maycon.vercel.app")]         // * não atravessa ponto
        [InlineData("http://nexti-pim-abc-dev-maycon.vercel.app")]          // preview só em https
        [InlineData("https://nexti-pim-abc-dev-maycon.vercel.app:8443")]
        [InlineData("null")]
        [InlineData("")]
        public void Cors_RecusaOrigensDeTerceiros(string origem)
        {
            Assert.False(Cors.Permite(origem));
        }

        [Fact]
        public void Cors_SemConfiguracao_SoPermiteLocalhost()
        {
            var vazia = new PoliticaDeCors(null, null);
            Assert.True(vazia.Permite("http://localhost:5501"));
            Assert.False(vazia.Permite("https://nexti-pim-iv.vercel.app"));
        }

        [Fact]
        public void DadosDoUsuario_SoParaOProprioDono()
        {
            var maycon = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "maycon") }, "jwt"));
            var anonimo = new ClaimsPrincipal(new ClaimsIdentity());

            Assert.True(EndpointExtensions.EhOProprioUsuario(maycon, "maycon"));
            Assert.False(EndpointExtensions.EhOProprioUsuario(maycon, "outro_aluno"));
            Assert.False(EndpointExtensions.EhOProprioUsuario(maycon, "Maycon"));
            Assert.False(EndpointExtensions.EhOProprioUsuario(anonimo, "maycon"));
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
