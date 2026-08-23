using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;

namespace NexTI_API.Services
{
    public class DatabaseSeeder : IDatabaseSeeder
    {
        public async Task SeedAsync(AppDbContext db)
        {
            // Verifica se o banco já possui os flashcards semeados
            if (await db.Flashcards.AnyAsync() && await db.Flashcards.CountAsync() >= 400)
            {
                return;
            }

            Console.WriteLine("--> [DatabaseSeeder] Inicializando seeding automático do banco de dados (LocalDB / Azure SQL)...");

            try
            {
                // Tenta localizar o arquivo NexTI_DB.sql nos caminhos possíveis (Monorepo e Standalone)
                string[] possiblePaths = new[]
                {
                    Path.Combine(Directory.GetCurrentDirectory(), "database", "NexTI_DB.sql"),
                    Path.Combine(Directory.GetCurrentDirectory(), "..", "database", "NexTI_DB.sql"),
                    Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "database", "NexTI_DB.sql"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "database", "NexTI_DB.sql"),
                    Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())?.FullName ?? "", "database", "NexTI_DB.sql"),
                    Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())?.Parent?.FullName ?? "", "database", "NexTI_DB.sql"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "..", "database", "NexTI_DB.sql")
                };

                string? sqlPath = possiblePaths.FirstOrDefault(File.Exists);

                if (string.IsNullOrEmpty(sqlPath))
                {
                    Console.WriteLine("--> [DatabaseSeeder] Aviso: Arquivo NexTI_DB.sql não encontrado nos caminhos mapeados.");
                    return;
                }

                string fullSql = await File.ReadAllTextAsync(sqlPath, Encoding.UTF8);

                // Localiza o início dos inserts
                int seedStartIndex = fullSql.IndexOf("-- 2. INSERINDO AS FASES NO BANCO", StringComparison.OrdinalIgnoreCase);
                if (seedStartIndex == -1)
                {
                    Console.WriteLine("--> [DatabaseSeeder] Erro: Seção de inserções não localizada no arquivo SQL.");
                    return;
                }

                string seedSql = fullSql.Substring(seedStartIndex);

                Console.WriteLine("--> [DatabaseSeeder] Limpando dados legados antes de popular...");
                try
                {
                    await db.Database.ExecuteSqlRawAsync("DELETE FROM tb_prova_questao;");
                    await db.Database.ExecuteSqlRawAsync("DELETE FROM tb_alternativas;");
                    await db.Database.ExecuteSqlRawAsync("DELETE FROM tb_questoes;");
                    await db.Database.ExecuteSqlRawAsync("DELETE FROM tb_provas;");
                    await db.Database.ExecuteSqlRawAsync("DELETE FROM tb_areas_conhecimento;");
                    await db.Database.ExecuteSqlRawAsync("DELETE FROM Progresso_Flashcards;");
                    await db.Database.ExecuteSqlRawAsync("DELETE FROM Flashcards;");
                    await db.Database.ExecuteSqlRawAsync("DELETE FROM Fases;");
                }
                catch (Exception exCleanup)
                {
                    Console.WriteLine($"--> [DatabaseSeeder] Nota de limpeza: {exCleanup.Message}");
                }

                var connection = db.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }

                var lines = seedSql.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
                var currentBatch = new StringBuilder();

                foreach (var line in lines)
                {
                    string trimmed = line.Trim();
                    if (trimmed.Equals("GO", StringComparison.OrdinalIgnoreCase))
                    {
                        string batchSql = currentBatch.ToString().Trim();
                        if (!string.IsNullOrEmpty(batchSql))
                        {
                            using var command = connection.CreateCommand();
                            command.CommandText = batchSql;
                            await command.ExecuteNonQueryAsync();
                        }
                        currentBatch.Clear();
                    }
                    else
                    {
                        currentBatch.AppendLine(line);
                    }
                }

                string finalBatch = currentBatch.ToString().Trim();
                if (!string.IsNullOrEmpty(finalBatch))
                {
                    using var command = connection.CreateCommand();
                    command.CommandText = finalBatch;
                    await command.ExecuteNonQueryAsync();
                }

                Console.WriteLine("--> [DatabaseSeeder] Banco de dados populado com sucesso!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> [DatabaseSeeder] Erro durante o seeding: {ex.Message}");
            }
        }
    }
}
