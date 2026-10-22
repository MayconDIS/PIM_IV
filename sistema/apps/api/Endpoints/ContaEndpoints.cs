using System.Security.Claims;
using NexTI_API.Services;

namespace NexTI_API.Endpoints;

public static class ContaEndpoints
{
    public static void MapContaEndpoints(this IEndpointRouteBuilder app)
    {
        var conta = app.MapGroup("/api/conta").RequireAuthorization();
        conta.AddEndpointFilter(async (contexto, proximo) =>
        {
            contexto.HttpContext.Response.Headers.CacheControl = "no-store";
            if (EndpointExtensions.IdDoUsuario(contexto.HttpContext.User) is null) return Results.Unauthorized();
            return await proximo(contexto);
        });
        conta.MapGet("/", async (IContaService servico, ClaimsPrincipal usuario) =>
            EndpointExtensions.ParaHttp(await servico.LerAsync(Id(usuario)), Results.Ok));
        conta.MapPut("/email", async (EmailContaRequest dados, IContaService servico, ClaimsPrincipal usuario) =>
            EndpointExtensions.ParaHttp(await servico.AlterarEmailAsync(Id(usuario), dados.Email, dados.SenhaAtual), Results.Ok))
            .RequireRateLimiting(EndpointExtensions.PoliticaDeAutenticacao);
        conta.MapPut("/senha", async (SenhaContaRequest dados, IContaService servico, ClaimsPrincipal usuario) =>
            EndpointExtensions.ParaHttp(await servico.AlterarSenhaAsync(Id(usuario), dados.SenhaAtual, dados.NovaSenha), _ => Results.NoContent()))
            .RequireRateLimiting(EndpointExtensions.PoliticaDeAutenticacao);
        conta.MapGet("/dados", async (IContaService servico, ClaimsPrincipal usuario) =>
            EndpointExtensions.ParaHttp(await servico.ExportarAsync(Id(usuario)), Results.Ok));
        // POST evita depender de suporte a corpo em DELETE nos clientes/proxies.
        conta.MapPost("/excluir", async (ExcluirContaRequest dados, IContaService servico, ClaimsPrincipal usuario) =>
            EndpointExtensions.ParaHttp(await servico.ExcluirAsync(Id(usuario), dados.SenhaAtual), _ => Results.NoContent()))
            .RequireRateLimiting(EndpointExtensions.PoliticaDeAutenticacao);
    }

    private static int Id(ClaimsPrincipal usuario) => EndpointExtensions.IdDoUsuario(usuario)!.Value;
    public record EmailContaRequest(string? Email, string? SenhaAtual);
    public record SenhaContaRequest(string? SenhaAtual, string? NovaSenha);
    public record ExcluirContaRequest(string? SenhaAtual);
}
