using System;
using NexTI_API.Models;
using Xunit;

namespace NexTI_API.Tests
{
    public class UsuarioAndAuthTests
    {
        [Fact]
        public void Usuario_ValoresPadrao_DevemEstarCorretos()
        {
            var user = new Usuario
            {
                Username = "dev_tester",
                Email = "dev@tester.com",
                SenhaHash = "hash_simulado"
            };

            Assert.Equal(1, user.Nivel);
            Assert.Equal(0, user.XP);
            Assert.Equal(0, user.Moedas);
            Assert.NotNull(user.Progressos);
            Assert.Empty(user.Progressos);
        }

        [Fact]
        public void BCrypt_HashESenha_DeveValidarCorretamente()
        {
            string senhaOriginal = "SenhaUltraSecreta2026!";
            string hashGerado = BCrypt.Net.BCrypt.HashPassword(senhaOriginal);

            bool senhaCorreta = BCrypt.Net.BCrypt.Verify(senhaOriginal, hashGerado);
            bool senhaErrada = BCrypt.Net.BCrypt.Verify("SenhaIncorreta", hashGerado);

            Assert.True(senhaCorreta);
            Assert.False(senhaErrada);
        }

        [Fact]
        public void ProgressoFlashcard_ValoresIniciais_DevemSerConsistentes()
        {
            var progresso = new ProgressoFlashcard();

            Assert.Equal(0, progresso.Repeticoes);
            Assert.Equal(0, progresso.IntervaloDias);
            Assert.Equal(2.5, progresso.FatorFacilidade);
            Assert.Equal(DateTime.UtcNow.Date, progresso.DataProximaRevisao);
        }
    }
}
