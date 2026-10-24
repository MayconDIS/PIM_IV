using System.Collections.Generic;

namespace NexTI_API.Models
{
    /// <summary>Perfis de acesso do Nex_TI (os atores do caso de uso).</summary>
    public static class Perfis
    {
        public const string Aluno = "Aluno";
        public const string Tutor = "Tutor";
        public const string Admin = "Admin";

        public static readonly IReadOnlyList<string> Todos = new[] { Aluno, Tutor, Admin };
    }
}
