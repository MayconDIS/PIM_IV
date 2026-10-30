namespace NexTI_API.Models
{
    /// <summary>
    /// Especialização de <see cref="Usuario"/> no modelo de domínio (diagrama de classes).
    /// No banco todos ficam na tabela usuarios, e o que vale é o campo Perfil (ver <see cref="Perfis"/>).
    /// </summary>
    public class Aluno : Usuario
    {
    }
}
