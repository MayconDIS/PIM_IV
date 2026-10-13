using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexTI_API.Models
{
    public class Flashcard
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string CodigoFase { get; set; } = string.Empty;

        [Required]
        public string Frente { get; set; } = string.Empty;

        [Required]
        public string Verso { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Dica { get; set; }

        /// <summary>Alternativas das cartas ENADE (A..D). No SQL Server o EF guarda a lista como JSON.</summary>
        public List<string>? Opcoes { get; set; }

        /// <summary>Índice (0-based) da alternativa correta em <see cref="Opcoes"/>.</summary>
        public int? Correta { get; set; }

        [ForeignKey("CodigoFase")]
        public Fase? Fase { get; set; }

        public ICollection<ProgressoFlashcard> Progressos { get; set; } = new List<ProgressoFlashcard>();
    }
}
