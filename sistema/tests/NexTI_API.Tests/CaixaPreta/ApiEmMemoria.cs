using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NexTI_API.Data;
using NexTI_API.Services;

namespace NexTI_API.Tests.CaixaPreta;

/// <summary>
/// A API inteira, de verdade (rotas, JWT, perfis, rate limiting e serviços), rodando dentro do
/// teste. Só o banco é trocado por um em memória, já com as fases, as cartas e os simulados.
/// Cada instância tem o seu banco: um teste não enxerga os dados de outro.
/// </summary>
public sealed class ApiEmMemoria : WebApplicationFactory<Program>
{
    private readonly string _banco = $"caixa-preta-{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.UseSetting("Jwt:Key", "Chave_somente_dos_testes_de_caixa_preta_2026");
        builder.UseSetting("Database:MigrarAoIniciar", "false");
        builder.ConfigureTestServices(servicos =>
        {
            servicos.RemoveAll<DbContextOptions<AppDbContext>>();
            servicos.RemoveAll(typeof(IDbContextOptionsConfiguration<AppDbContext>));
            servicos.AddDbContext<AppDbContext>(o => o.UseInMemoryDatabase(_banco).UseSnakeCaseNamingConvention());
        });
    }

    /// <summary>Cria a API e coloca o conteúdo no banco, como a API faz ao subir.</summary>
    public static async Task<ApiEmMemoria> IniciarAsync()
    {
        var api = new ApiEmMemoria();
        using var escopo = api.Services.CreateScope();
        var db = escopo.ServiceProvider.GetRequiredService<AppDbContext>();
        await escopo.ServiceProvider.GetRequiredService<IDatabaseSeeder>().SeedAsync(db);
        return api;
    }

    /// <summary>Muda algo direto no banco (ex.: transformar alguém em Tutor), como faria um DBA.</summary>
    public async Task NoBancoAsync(Func<AppDbContext, Task> acao)
    {
        using var escopo = Services.CreateScope();
        var db = escopo.ServiceProvider.GetRequiredService<AppDbContext>();
        await acao(db);
        await db.SaveChangesAsync();
    }

    /// <summary>Cadastra pela rota pública e devolve um cliente já logado com o token.</summary>
    public async Task<HttpClient> CadastrarELogarAsync(string usuario, string senha = "Forte!942z")
    {
        var http = CreateClient();
        (await http.PostAsJsonAsync("/api/auth/register", new { username = usuario, email = $"{usuario}@exemplo.test", password = senha }))
            .EnsureSuccessStatusCode();
        return await LogarAsync(usuario, senha);
    }

    public async Task<HttpClient> LogarAsync(string usuario, string senha = "Forte!942z")
    {
        var http = CreateClient();
        var resposta = await http.PostAsJsonAsync("/api/auth/login", new { username = usuario, password = senha });
        resposta.EnsureSuccessStatusCode();
        var token = (await resposta.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("token").GetString();
        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return http;
    }

    /// <summary>Cadastra, troca o perfil direto no banco e loga de novo (o perfil vai no token).</summary>
    public async Task<HttpClient> UsuarioComPerfilAsync(string usuario, string perfil)
    {
        await CadastrarELogarAsync(usuario);
        await NoBancoAsync(async db => (await db.Usuarios.SingleAsync(u => u.Username == usuario)).Perfil = perfil);
        return await LogarAsync(usuario);
    }
}

internal static class RespostaJson
{
    public static async Task<JsonElement> JsonAsync(this HttpResponseMessage resposta) =>
        await resposta.Content.ReadFromJsonAsync<JsonElement>();
}
