using NexTI_API.Services;
using Xunit;

namespace NexTI_API.Tests
{
    /// <summary>
    /// Os mesmos casos de packages/shared/tests/senha.test.js: tela e API precisam
    /// aceitar e recusar as mesmas senhas.
    /// </summary>
    public class PoliticaDeSenhaTests
    {
        private readonly PoliticaDeSenha _politica = new();

        [Theory]
        [InlineData("Ótimo#2026")]
        [InlineData("Girassol#77")]
        [InlineData("Analise#2026")] // "Ana" é curto demais para contar como dado pessoal
        public void SenhaForte_EhAceita(string senha)
        {
            Assert.Empty(_politica.Validar(senha, "Ana", "dev@nexti.com"));
        }

        [Fact]
        public void LetrasAcentuadas_ContamComoMaiusculaEMinuscula()
        {
            var faltando = _politica.Validar("ÉÇÃéçã12!");
            Assert.DoesNotContain("uma letra maiúscula", faltando);
            Assert.DoesNotContain("uma letra minúscula", faltando);
        }

        [Theory]
        [InlineData("Maycon@2026")]
        [InlineData("Xmdcode#99")]
        public void SenhaComNicknameOuEmail_EhRecusada(string senha)
        {
            var faltando = _politica.Validar(senha, "Maycon", "mdcode@exemplo.com");
            Assert.Contains("não conter seu nickname nem seu e-mail", faltando);
        }

        [Fact]
        public void SenhaFraca_ListaTudoQueFalta()
        {
            var faltando = _politica.Validar("abcdefgh");
            Assert.Equal(new[] { "uma letra maiúscula", "um número", "um símbolo" }, faltando);
            Assert.Equal("A senha ainda precisa de: uma letra maiúscula, um número, um símbolo.", PoliticaDeSenha.Mensagem(faltando));
        }

        [Fact]
        public void SenhaCurta_PedeOTamanhoMinimo()
        {
            Assert.Contains($"pelo menos {PoliticaDeSenha.TamanhoMinimo} caracteres", _politica.Validar("Ab1!"));
        }

        [Fact]
        public void SenhaAlemDoLimiteDoBCrypt_EhRecusada()
        {
            var longa = "Aa1!" + new string('x', 80);
            Assert.Contains($"no máximo {PoliticaDeSenha.TamanhoMaximo} bytes", _politica.Validar(longa));
        }

        [Fact]
        public void SenhaNula_NaoQuebra()
        {
            Assert.NotEmpty(_politica.Validar(null));
        }
    }
}
