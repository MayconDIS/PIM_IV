using NexTI.Desktop.Dominio.Regras;

namespace NexTI.Desktop.Dominio.Entidades;

/// <summary>
/// O estado de uma carta para um aluno: quantas vezes acertou, de quantos em quantos dias ela
/// volta e quando é a próxima revisão. Quem decide o novo intervalo é o agendador (SM-2),
/// recebido por parâmetro: a entidade não sabe qual algoritmo está sendo usado.
/// </summary>
public class Revisao : Entidade
{
    public int AlunoId { get; private set; }
    public int FlashcardId { get; private set; }
    public int Repeticoes { get; private set; }
    public double IntervaloDias { get; private set; }
    public double FatorFacilidade { get; private set; } = Agendamento.Inicial.FatorFacilidade;
    public DateOnly ProximaRevisao { get; private set; }

    protected Revisao() { }

    public Revisao(int alunoId, int flashcardId)
    {
        AlunoId = alunoId;
        FlashcardId = flashcardId;
    }

    public bool VenceAte(DateOnly dia) => ProximaRevisao <= dia;

    public void Registrar(Resposta resposta, IAgendadorDeRevisao agendador, DateOnly hoje)
    {
        var novo = agendador.Calcular(new Agendamento(Repeticoes, IntervaloDias, FatorFacilidade), resposta);
        Repeticoes = novo.Repeticoes;
        IntervaloDias = novo.IntervaloDias;
        FatorFacilidade = novo.FatorFacilidade;
        ProximaRevisao = hoje.AddDays((int)novo.IntervaloDias);
    }
}
