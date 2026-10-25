using NexTI.Desktop.Dominio.Entidades;
using NexTI.Desktop.Dominio.Regras;

namespace NexTI.Desktop.Aplicacao;

/// <summary>
/// Uma fase aberta na tela: a fila de cartas e a carta da vez. Carta respondida com "Errei"
/// volta para o fim da fila, como no site: a fase só termina quando todas foram acertadas.
/// </summary>
public class SessaoDeEstudo
{
    private readonly Queue<Flashcard> _fila;

    public Fase Fase { get; }
    public int TotalDeCartas { get; }
    public int Respondidas { get; private set; }

    public SessaoDeEstudo(Fase fase, IEnumerable<Flashcard> cartasEmOrdem)
    {
        Fase = fase;
        _fila = new Queue<Flashcard>(cartasEmOrdem);
        TotalDeCartas = _fila.Count;
    }

    public Flashcard? CartaAtual => _fila.Count > 0 ? _fila.Peek() : null;
    public int Restantes => _fila.Count;
    public bool Terminou => _fila.Count == 0;

    /// <summary>Tira a carta da vez da fila; com "Errei", ela volta para o fim.</summary>
    public Flashcard Avancar(Resposta resposta)
    {
        var carta = _fila.Dequeue();
        Respondidas++;
        if (resposta == Resposta.Errei) _fila.Enqueue(carta);
        return carta;
    }
}
