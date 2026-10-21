using System;
using NexTI_API.Models;
using NexTI_API.Services;
using Xunit;

namespace NexTI_API.Tests
{
    public class Sm2EngineTests
    {
        private readonly ISm2Engine _sm2Engine;

        public Sm2EngineTests()
        {
            _sm2Engine = new Sm2Engine();
        }

        [Fact]
        public void Calcular_PrimeiraRepeticao_Qualidade5_DeveDefinirIntervalo1Dia_E_AumentarFacilidade()
        {
            // Arrange
            var progresso = new ProgressoFlashcard
            {
                UsuarioId = 1,
                FlashcardId = 10,
                Repeticoes = 0,
                IntervaloDias = 0,
                FatorFacilidade = 2.5
            };

            // Act: Qualidade 5 (Fácil)
            _sm2Engine.Calcular(progresso, 5);

            // Assert
            Assert.Equal(1, progresso.Repeticoes);
            Assert.Equal(1, progresso.IntervaloDias);
            Assert.Equal(2.6, Math.Round(progresso.FatorFacilidade, 2));
            Assert.Equal(DateTime.UtcNow.Date.AddDays(1), progresso.DataProximaRevisao);
        }

        [Fact]
        public void Calcular_SegundaRepeticao_Qualidade4_DeveDefinirIntervalo6Dias()
        {
            // Arrange
            var progresso = new ProgressoFlashcard
            {
                UsuarioId = 1,
                FlashcardId = 10,
                Repeticoes = 1,
                IntervaloDias = 1,
                FatorFacilidade = 2.6
            };

            // Act: Qualidade 4 (Bom)
            _sm2Engine.Calcular(progresso, 4);

            // Assert
            Assert.Equal(2, progresso.Repeticoes);
            Assert.Equal(6, progresso.IntervaloDias);
            Assert.Equal(2.6, Math.Round(progresso.FatorFacilidade, 2));
            Assert.Equal(DateTime.UtcNow.Date.AddDays(6), progresso.DataProximaRevisao);
        }

        [Fact]
        public void Calcular_TerceiraRepeticao_Qualidade4_DeveMultiplicarPeloFatorFacilidade()
        {
            // Arrange
            var progresso = new ProgressoFlashcard
            {
                UsuarioId = 1,
                FlashcardId = 10,
                Repeticoes = 2,
                IntervaloDias = 6,
                FatorFacilidade = 2.5
            };

            // Act: Qualidade 4 (Bom)
            _sm2Engine.Calcular(progresso, 4);

            // Assert
            Assert.Equal(3, progresso.Repeticoes);
            Assert.Equal(15.0, progresso.IntervaloDias); // 6 * 2.5 = 15
            Assert.Equal(DateTime.UtcNow.Date.AddDays(15), progresso.DataProximaRevisao);
        }

        [Fact]
        public void Calcular_ErroNaResposta_QualidadeMenorQue3_DeveZerarRepeticoes_E_ReduzirFacilidade()
        {
            // Arrange: Cartão maduro com 5 repetições e 30 dias de intervalo
            var progresso = new ProgressoFlashcard
            {
                UsuarioId = 1,
                FlashcardId = 10,
                Repeticoes = 5,
                IntervaloDias = 30,
                FatorFacilidade = 2.5
            };

            // Act: Qualidade 1 (Errou)
            _sm2Engine.Calcular(progresso, 1);

            // Assert
            Assert.Equal(0, progresso.Repeticoes);
            Assert.Equal(1, progresso.IntervaloDias);
            Assert.Equal(2.3, Math.Round(progresso.FatorFacilidade, 2));
            Assert.Equal(DateTime.UtcNow.Date.AddDays(1), progresso.DataProximaRevisao);
        }

        [Fact]
        public void Calcular_MultiplosErros_NaoDeveDeixarFatorFacilidadeMenorQue1Ponto3()
        {
            // Arrange: Cartão já com facilidade baixa
            var progresso = new ProgressoFlashcard
            {
                UsuarioId = 1,
                FlashcardId = 10,
                Repeticoes = 1,
                IntervaloDias = 1,
                FatorFacilidade = 1.35
            };

            // Act: Erro consecutivo
            _sm2Engine.Calcular(progresso, 0);

            // Assert: Mínimo garantido é 1.3
            Assert.Equal(1.3, progresso.FatorFacilidade);
        }
    }
}
