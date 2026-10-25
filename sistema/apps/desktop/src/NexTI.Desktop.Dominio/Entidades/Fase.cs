namespace NexTI.Desktop.Dominio.Entidades;

/// <summary>Uma disciplina para estudar (ex.: fase1, "Lógica com Python"), com as suas cartas.</summary>
public class Fase
{
    public string Codigo { get; private set; } = string.Empty;
    public string Descricao { get; private set; } = string.Empty;
    /// <summary>Posição na trilha: concluir a fase N libera a N+1.</summary>
    public int Ordem { get; private set; }
    public List<Flashcard> Cartas { get; private set; } = new();

    protected Fase() { }

    public Fase(string codigo, string descricao, int ordem)
    {
        Codigo = codigo;
        Descricao = descricao;
        Ordem = ordem;
    }
}
