using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Sockets;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;

namespace NexTI_API.Tests;

public class ContaHttpTests
{
    [ContaLocalDbFact]
    public async Task ApiReal_ProtegeContaERevogaTokensAposTrocaEExclusao()
    {
        var nome = "NexTI_ContaTest_" + Guid.NewGuid().ToString("N");
        var conexao = $@"Server=(localdb)\MSSQLLocalDB;Database={nome};Trusted_Connection=True;TrustServerCertificate=True;";
        await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(conexao).UseSnakeCaseNamingConvention().Options);
        await db.Database.MigrateAsync();
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        var porta = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        var inicio = new ProcessStartInfo("dotnet")
        {
            WorkingDirectory = AppContext.BaseDirectory,
            UseShellExecute = false, CreateNoWindow = true,
            RedirectStandardOutput = true, RedirectStandardError = true
        };
        inicio.ArgumentList.Add(Path.Combine(AppContext.BaseDirectory, "NexTI_API.dll"));
        inicio.Environment["PORT"] = porta.ToString();
        inicio.Environment["DOTNET_ENVIRONMENT"] = "Development";
        inicio.Environment["ASPNETCORE_ENVIRONMENT"] = "Development";
        inicio.Environment["AZURE_SQL_CONNECTIONSTRING"] = conexao;
        inicio.Environment["Database__MigrarAoIniciar"] = "false";
        inicio.Environment["Jwt__Key"] = "Chave_apenas_deste_teste_HTTP_descartavel_2026";
        using var processo = new Process { StartInfo = inicio };
        try
        {
            processo.Start();
            var stdout = processo.StandardOutput.ReadToEndAsync();
            var stderr = processo.StandardError.ReadToEndAsync();
            using var http = new HttpClient { BaseAddress = new Uri($"http://127.0.0.1:{porta}"), Timeout = TimeSpan.FromSeconds(10) };
            var online = false;
            for (var i = 0; i < 100; i++)
            {
                if (processo.HasExited) throw new Exception(await stderr + await stdout);
                try { online = (await http.GetAsync("/api/status")).IsSuccessStatusCode; }
                catch (HttpRequestException) { }
                if (online) break;
                await Task.Delay(100);
            }
            Assert.True(online, "API de teste não iniciou.");
            Assert.Equal(HttpStatusCode.Unauthorized, (await http.GetAsync("/api/conta/")).StatusCode);
            var cadastro = await http.PostAsJsonAsync("/api/auth/register", new { username = "aluno_teste", email = "aluno@example.com", password = "Forte!942z" });
            cadastro.EnsureSuccessStatusCode();
            var login = await http.PostAsJsonAsync("/api/auth/login", new { username = "aluno_teste", password = "Forte!942z" });
            login.EnsureSuccessStatusCode();
            var sessao = await login.Content.ReadFromJsonAsync<JsonElement>();
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", sessao.GetProperty("token").GetString());
            Assert.Equal(HttpStatusCode.Forbidden, (await http.GetAsync("/api/admin/usuarios")).StatusCode);
            var aluno = await db.Usuarios.SingleAsync(u => u.Username == "aluno_teste");
            aluno.Perfil = "Admin";
            await db.SaveChangesAsync();
            (await http.GetAsync("/api/admin/usuarios")).EnsureSuccessStatusCode();
            aluno.Perfil = "Aluno";
            await db.SaveChangesAsync();
            Assert.Equal(HttpStatusCode.Forbidden, (await http.GetAsync("/api/admin/usuarios")).StatusCode);
            var conta = await http.GetAsync("/api/conta/");
            conta.EnsureSuccessStatusCode();
            Assert.True(conta.Headers.CacheControl!.NoStore);
            Assert.DoesNotContain("senhaHash", await conta.Content.ReadAsStringAsync());
            var exportacao = await http.GetAsync("/api/conta/dados");
            exportacao.EnsureSuccessStatusCode();
            Assert.DoesNotContain("senhaHash", await exportacao.Content.ReadAsStringAsync());
            var errado = await http.PutAsJsonAsync("/api/conta/email", new { email = "novo@example.com", senhaAtual = "errada" });
            Assert.Equal(HttpStatusCode.BadRequest, errado.StatusCode);
            (await http.PutAsJsonAsync("/api/conta/email", new { email = "novo@example.com", senhaAtual = "Forte!942z", usuarioId = 999 })).EnsureSuccessStatusCode();
            var troca = await http.PutAsJsonAsync("/api/conta/senha", new { senhaAtual = "Forte!942z", novaSenha = "Outra!872x" });
            Assert.Equal(HttpStatusCode.NoContent, troca.StatusCode);
            Assert.Equal(HttpStatusCode.Unauthorized, (await http.GetAsync("/api/conta/")).StatusCode);
            Assert.Equal(HttpStatusCode.Unauthorized, (await http.GetAsync("/api/progresso/usuario")).StatusCode);
            var novoLogin = await http.PostAsJsonAsync("/api/auth/login", new { username = "novo@example.com", password = "Outra!872x" });
            novoLogin.EnsureSuccessStatusCode();
            var novaSessao = await novoLogin.Content.ReadFromJsonAsync<JsonElement>();
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", novaSessao.GetProperty("token").GetString());
            var exclusao = await http.PostAsJsonAsync("/api/conta/excluir", new { senhaAtual = "Outra!872x" });
            Assert.Equal(HttpStatusCode.NoContent, exclusao.StatusCode);
            Assert.Equal(HttpStatusCode.Unauthorized, (await http.GetAsync("/api/conta/")).StatusCode);
        }
        finally
        {
            if (processo.Id != 0 && !processo.HasExited) { processo.Kill(entireProcessTree: true); await processo.WaitForExitAsync(); }
            await db.Database.EnsureDeletedAsync();
        }
    }
}
