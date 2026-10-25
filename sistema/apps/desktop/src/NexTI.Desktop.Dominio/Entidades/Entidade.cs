namespace NexTI.Desktop.Dominio.Entidades;

/// <summary>Base de toda entidade guardada no banco: só a chave (Id).</summary>
public abstract class Entidade
{
    public int Id { get; protected set; }
}
