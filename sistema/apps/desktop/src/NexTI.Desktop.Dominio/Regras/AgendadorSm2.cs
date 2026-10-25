namespace NexTI.Desktop.Dominio.Regras;

/// <summary>
/// SM-2 no estilo do Anki: a mesma regra do site, do app e da API do Nex_TI
/// (packages/shared/src/sm2.js e Sm2Engine.cs). Os testes conferem os mesmos casos
/// (packages/shared/tests/sm2-casos.json).
/// </summary>
public class AgendadorSm2 : IAgendadorDeRevisao
{
    public const double FatorMinimo = 1.3;

    /// <summary>O maior intervalo, em dias (100 anos, o teto do Anki): sem ele a data da próxima revisão passava do ano 9999.</summary>
    public const double IntervaloMaximo = 36500;

    public Agendamento Calcular(Agendamento atual, Resposta resposta)
    {
        var novo = CalcularSemTeto(atual, resposta);
        return novo with { IntervaloDias = Math.Min(novo.IntervaloDias, IntervaloMaximo) };
    }

    private static Agendamento CalcularSemTeto(Agendamento atual, Resposta resposta)
    {
        var (repeticoes, intervalo, fator) = atual;
        switch (resposta)
        {
            case Resposta.Errei:
                return new(0, 1, Math.Max(FatorMinimo, fator - 0.2));
            case Resposta.Dificil:
                // Soma pelo menos 1 dia: com intervalo 1, arredondar 1 × 1,2 daria 1 para sempre.
                intervalo = repeticoes == 0 ? 1 : Math.Max(intervalo + 1, Arredondar(intervalo * 1.2));
                return new(repeticoes + 1, intervalo, Math.Max(FatorMinimo, fator - 0.15));
            case Resposta.Bom:
                intervalo = repeticoes == 0 ? 1 : Math.Max(1, Arredondar(intervalo * fator));
                return new(repeticoes + 1, intervalo, fator);
            default:
                intervalo = repeticoes == 0 ? 3 : Math.Max(1, Arredondar(intervalo * fator * 1.3));
                return new(repeticoes + 1, intervalo, fator + 0.15);
        }
    }

    /// <summary>Arredonda 0,5 para cima, como o Math.round do JavaScript (o Math.Round do C# arredonda para o par).</summary>
    public static double Arredondar(double valor) => Math.Floor(valor + 0.5);
}
