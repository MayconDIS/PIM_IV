using System;
using System.ComponentModel.DataAnnotations;

namespace NexTI_API.Models
{
    /// <summary>
    /// Carta da semente que um Tutor editou ou excluiu. O seed roda a cada vez que a
    /// API sobe e recria cartas que faltam; esta lista diz quais ele deve deixar quietas.
    /// </summary>
    public class CartaModerada
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(20)]
        public string CodigoFase { get; set; } = string.Empty;

        /// <summary>A frente original, como estava antes da moderação.</summary>
        public string Frente { get; set; } = string.Empty;

        public DateTime DataModeracao { get; set; } = DateTime.UtcNow;
    }
}
