using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NexTI_API.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string SenhaHash { get; set; } = string.Empty;

        /// <summary>Aluno, Tutor ou Admin (ver <see cref="Perfis"/>). Todo cadastro começa como Aluno.</summary>
        [Required]
        [MaxLength(20)]
        public string Perfil { get; set; } = Perfis.Aluno;

        public int Nivel { get; set; } = 1;
        public int XP { get; set; } = 0;
        public int Moedas { get; set; } = 0;

        /// <summary>Último diagnóstico e acessos preservados; separado do nível ganho por XP.</summary>
        public string? DiagnosticoJson { get; set; }

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public ICollection<ProgressoFlashcard> Progressos { get; set; } = new List<ProgressoFlashcard>();
    }
}
