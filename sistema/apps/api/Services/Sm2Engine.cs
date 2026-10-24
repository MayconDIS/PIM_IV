using System;
using NexTI_API.Models;

namespace NexTI_API.Services
{
    /// <summary>
    /// SM-2 no estilo do Anki, com as quatro respostas da tela. É a mesma regra de
    /// packages/shared/src/sm2.js (usada pelo site e pelo app): os dois lados são testados
    /// com os mesmos casos (packages/shared/tests/sm2-casos.json), então a data que a API
    /// grava é a mesma que o aluno viu no botão.
    /// </summary>
    public class Sm2Engine : ISm2Engine
    {
        public const double FatorMinimo = 1.3;

        /// <summary>As respostas da tela, a partir da nota que o site envia (1, 3, 4 ou 5).</summary>
        public enum Resposta { Errei, Dificil, Bom, Facil }

        public static Resposta RespostaDaQualidade(int qualidade) => qualidade switch
        {
            <= 2 => Resposta.Errei,
            3 => Resposta.Dificil,
            4 => Resposta.Bom,
            _ => Resposta.Facil,
        };

        public void Calcular(ProgressoFlashcard progresso, int qualidade)
        {
            switch (RespostaDaQualidade(qualidade))
            {
                case Resposta.Errei:
                    progresso.Repeticoes = 0;
                    progresso.IntervaloDias = 1;
                    progresso.FatorFacilidade = Math.Max(FatorMinimo, progresso.FatorFacilidade - 0.2);
                    break;

                case Resposta.Dificil:
                    // Soma pelo menos 1 dia: com intervalo 1, arredondar 1 × 1,2 daria 1 para sempre.
                    progresso.IntervaloDias = progresso.Repeticoes == 0
                        ? 1
                        : Math.Max(progresso.IntervaloDias + 1, ArredondarComoJs(progresso.IntervaloDias * 1.2));
                    progresso.FatorFacilidade = Math.Max(FatorMinimo, progresso.FatorFacilidade - 0.15);
                    progresso.Repeticoes++;
                    break;

                case Resposta.Bom:
                    progresso.IntervaloDias = progresso.Repeticoes == 0
                        ? 1
                        : Math.Max(1, ArredondarComoJs(progresso.IntervaloDias * progresso.FatorFacilidade));
                    progresso.Repeticoes++;
                    break;

                case Resposta.Facil:
                    progresso.IntervaloDias = progresso.Repeticoes == 0
                        ? 3
                        : Math.Max(1, ArredondarComoJs(progresso.IntervaloDias * progresso.FatorFacilidade * 1.3));
                    progresso.FatorFacilidade += 0.15;
                    progresso.Repeticoes++;
                    break;
            }

            progresso.DataProximaRevisao = DateTime.UtcNow.Date.AddDays((int)progresso.IntervaloDias);
        }

        /// <summary>
        /// O Math.round do JavaScript arredonda 0,5 para cima; o Math.Round do C# arredonda
        /// para o par. Para os dois lados darem o mesmo intervalo, a API usa a regra do JS.
        /// </summary>
        public static double ArredondarComoJs(double valor) => Math.Floor(valor + 0.5);
    }
}
