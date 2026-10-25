namespace NexTI.Desktop.Dominio.Regras;

/// <summary>Os quatro botões da tela de estudo.</summary>
public enum Resposta { Errei, Dificil, Bom, Facil }

/// <summary>XP e moedas pagos ao concluir uma fase.</summary>
public record Premio(int Xp, int Moedas)
{
    public static readonly Premio Nenhum = new(0, 0);
}

/// <summary>Os três números que o SM-2 usa e devolve para uma carta.</summary>
public readonly record struct Agendamento(int Repeticoes, double IntervaloDias, double FatorFacilidade)
{
    public static readonly Agendamento Inicial = new(0, 0, 2.5);
}

/// <summary>Calcula quando a carta volta. Hoje só existe o SM-2, mas outro algoritmo entraria aqui.</summary>
public interface IAgendadorDeRevisao
{
    Agendamento Calcular(Agendamento atual, Resposta resposta);
}
