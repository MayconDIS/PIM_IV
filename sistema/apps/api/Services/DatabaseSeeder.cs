using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NexTI_API.Data;
using NexTI_API.Services.Seed;

namespace NexTI_API.Services
{
    /// <summary>
    /// Orquestra as etapas de povoamento (padrão Composite). Uma etapa com erro
    /// é registrada no log e não impede a API de subir.
    /// </summary>
    public class DatabaseSeeder : IDatabaseSeeder
    {
        private readonly IEnumerable<IEtapaSeed> _etapas;
        private readonly ILogger<DatabaseSeeder> _logger;

        public DatabaseSeeder(IEnumerable<IEtapaSeed> etapas, ILogger<DatabaseSeeder> logger)
        {
            _etapas = etapas;
            _logger = logger;
        }

        public async Task SeedAsync(AppDbContext db)
        {
            foreach (var etapa in _etapas)
            {
                try
                {
                    var inseridos = await etapa.ExecutarAsync(db);
                    _logger.LogInformation("[Seed] {Etapa}: {Inseridos} registro(s) novo(s).", etapa.Nome, inseridos);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[Seed] Falha na etapa {Etapa}.", etapa.Nome);
                }
            }
        }
    }
}
