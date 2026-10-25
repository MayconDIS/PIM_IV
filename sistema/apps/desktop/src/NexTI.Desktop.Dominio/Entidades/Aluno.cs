using NexTI.Desktop.Dominio.Regras;

namespace NexTI.Desktop.Dominio.Entidades;

/// <summary>
/// O aluno que estuda. XP e moedas só mudam por <see cref="ReceberPremio"/>, que também
/// anota a fase concluída: o prêmio de cada fase é pago só na primeira vez (a mesma regra da API).
/// </summary>
public class Aluno : Usuario
{
    private readonly List<FaseConcluida> _fasesConcluidas = new();

    public int Xp { get; private set; }
    public int Moedas { get; private set; }
    public IReadOnlyCollection<FaseConcluida> FasesConcluidas => _fasesConcluidas;

    public override string Perfil => "Aluno";

    protected Aluno() { }

    public Aluno(string nickname) : base(nickname) { }

    public bool JaConcluiu(string codigoFase) => _fasesConcluidas.Any(f => f.CodigoFase == codigoFase);

    /// <summary>Paga o prêmio se for a primeira conclusão da fase. Devolve false numa revisão.</summary>
    public bool ReceberPremio(string codigoFase, Premio premio)
    {
        if (JaConcluiu(codigoFase)) return false;
        _fasesConcluidas.Add(new FaseConcluida(codigoFase));
        Xp += premio.Xp;
        Moedas += premio.Moedas;
        return true;
    }
}
