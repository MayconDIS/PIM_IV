using System;
using System.Linq;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace NexTI_API.Data
{
    /// <summary>
    /// Resolve a string de conexão do SQL Server: Azure SQL Database em produção,
    /// LocalDB no desenvolvimento.
    /// </summary>
    public static class ConexaoBanco
    {
        public const string LocalPadrao =
            "Server=(localdb)\\mssqllocaldb;Database=NexTI_Local;Trusted_Connection=True;TrustServerCertificate=True;";

        /// <summary>
        /// Ordem de procura: AZURE_SQL_CONNECTIONSTRING (nome usado pelo Service Connector
        /// da Azure) e ConnectionStrings:DefaultConnection. No App Service, uma connection
        /// string "DefaultConnection" do tipo SQLAzure chega como SQLAZURECONNSTR_DefaultConnection
        /// e o ASP.NET Core já a expõe em ConnectionStrings:DefaultConnection.
        /// </summary>
        public static string Resolver(IConfiguration config)
        {
            var bruta = new[] { config["AZURE_SQL_CONNECTIONSTRING"], config.GetConnectionString("DefaultConnection") }
                .FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));

            return Normalizar(bruta ?? LocalPadrao);
        }

        public static string Normalizar(string bruta)
        {
            var builder = new SqlConnectionStringBuilder(bruta.Trim());

            if (EhAzureSql(builder.DataSource))
            {
                // Azure SQL exige TLS. O banco serverless da oferta gratuita pausa quando
                // fica ocioso e leva até ~1 min para voltar: damos tempo para a primeira conexão.
                builder.Encrypt = SqlConnectionEncryptOption.Mandatory;
                builder.TrustServerCertificate = false;
                if (builder.ConnectTimeout < 60) builder.ConnectTimeout = 60;
            }

            return builder.ConnectionString;
        }

        private static bool EhAzureSql(string dataSource) =>
            dataSource.Contains(".database.windows.net", StringComparison.OrdinalIgnoreCase);
    }
}
