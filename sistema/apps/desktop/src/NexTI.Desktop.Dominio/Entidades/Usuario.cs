namespace NexTI.Desktop.Dominio.Entidades;

/// <summary>
/// Quem usa o programa. É abstrata: ninguém é só "usuário"; cada tipo (hoje, o Aluno) diz o
/// próprio perfil. O nickname só é definido pelo construtor, que confere o tamanho.
/// </summary>
public abstract class Usuario : Entidade
{
    public const int TamanhoMinimo = 3;
    public const int TamanhoMaximo = 20;

    public string Nickname { get; private set; } = string.Empty;
    public DateTime DataCriacao { get; private set; }

    /// <summary>Nome do perfil mostrado na tela (polimorfismo: cada classe filha responde o seu).</summary>
    public abstract string Perfil { get; }

    protected Usuario() { }   // usado pelo EF Core ao ler do banco

    protected Usuario(string nickname)
    {
        nickname = (nickname ?? string.Empty).Trim();
        if (nickname.Length < TamanhoMinimo || nickname.Length > TamanhoMaximo)
            throw new ArgumentException($"O nickname precisa ter de {TamanhoMinimo} a {TamanhoMaximo} letras.", nameof(nickname));
        Nickname = nickname;
        DataCriacao = DateTime.Now;
    }
}
