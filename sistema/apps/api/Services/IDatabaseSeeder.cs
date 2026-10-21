using System.Threading.Tasks;
using NexTI_API.Data;

namespace NexTI_API.Services
{
    public interface IDatabaseSeeder
    {
        Task SeedAsync(AppDbContext db);
    }
}
