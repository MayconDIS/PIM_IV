using System.Threading.Tasks;
using NexTI_API.Data;

namespace NexTI_API.Services.Seed
{
    /// <summary>
    /// Uma etapa idempotente de povoamento do banco. Cada implementação cuida de
    /// um conjunto de tabelas e só insere o que ainda não existe.
    /// </summary>
    public interface IEtapaSeed
    {
        string Nome { get; }
        Task<int> ExecutarAsync(AppDbContext db);
    }
}
