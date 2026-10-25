namespace NexTI.Desktop.Dominio.Entidades;

/// <summary>Uma carta: a pergunta (frente), a resposta (verso) e uma dica.</summary>
public class Flashcard : Entidade
{
    public string CodigoFase { get; private set; } = string.Empty;
    public string Frente { get; private set; } = string.Empty;
    public string Verso { get; private set; } = string.Empty;
    public string? Dica { get; private set; }

    protected Flashcard() { }

    public Flashcard(string codigoFase, string frente, string verso, string? dica)
    {
        CodigoFase = codigoFase;
        Frente = frente;
        Verso = verso;
        Dica = dica;
    }
}
