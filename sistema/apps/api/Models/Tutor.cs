namespace NexTI_API.Models
{
    /// <summary>
    /// Especialização de <see cref="Usuario"/> no modelo de domínio (diagrama de classes): acompanha os
    /// alunos e modera cartas. No banco é um usuario com Perfil = Tutor (ver <see cref="Perfis"/>).
    /// </summary>
    public class Tutor : Usuario
    {
    }
}
