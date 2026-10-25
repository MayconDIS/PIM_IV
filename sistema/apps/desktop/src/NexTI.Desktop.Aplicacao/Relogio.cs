namespace NexTI.Desktop.Aplicacao;

/// <summary>De onde vem "hoje". Nos testes, um relógio falso escolhe o dia.</summary>
public interface IRelogio
{
    DateOnly Hoje { get; }
}

public class RelogioDoSistema : IRelogio
{
    public DateOnly Hoje => DateOnly.FromDateTime(DateTime.Now);
}
