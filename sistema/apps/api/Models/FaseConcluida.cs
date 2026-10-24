using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexTI_API.Models
{
    /// <summary>
    /// Fase, teste ou bônus que o aluno já concluiu. O prêmio (XP e moedas) é pago só na
    /// primeira conclusão; revisar a fase depois continua valendo para o SM-2, sem prêmio.
    /// </summary>
    public class FaseConcluida
    {
        public int UsuarioId { get; set; }

        [MaxLength(20)]
        public string CodigoFase { get; set; } = string.Empty;

        public DateTime DataConclusao { get; set; } = DateTime.UtcNow;

        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }
    }
}
