namespace NexTI.Desktop.Dominio.Entidades;

/// <summary>Registro de que o aluno concluiu uma fase (e já recebeu o prêmio dela).</summary>
public class FaseConcluida : Entidade
{
    public int AlunoId { get; private set; }
    public string CodigoFase { get; private set; } = string.Empty;
    public DateTime DataConclusao { get; private set; }

    protected FaseConcluida() { }

    public FaseConcluida(string codigoFase)
    {
        CodigoFase = codigoFase;
        DataConclusao = DateTime.Now;
    }
}
