using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using System;
using System.Security.Claims;
using NexTI_API.Services;

namespace NexTI_API.Endpoints
{
    /// <summary>
    /// Camada de apresentação: só HTTP. Lê a requisição e o token, chama o serviço
    /// e traduz o resultado em status code. Regra de negócio e banco ficam em Services.
    /// </summary>
    public static class EndpointExtensions
    {
        /// <summary>Nome da política de rate limiting de login/cadastro (registrada no Program.cs).</summary>
        public const string PoliticaDeAutenticacao = "autenticacao";

        /// <summary>Políticas de acesso por perfil (registradas no Program.cs).</summary>
        public const string PoliticaDeConteudo = "tutor-ou-admin";
        public const string PoliticaDeAdmin = "admin";

        /// <summary>O usuário autenticado é o dono do recurso pedido na rota?</summary>
        public static bool EhOProprioUsuario(ClaimsPrincipal usuario, string username) =>
            string.Equals(usuario.FindFirst(ClaimTypes.Name)?.Value, username, StringComparison.Ordinal);

        /// <summary>Id do usuário autenticado, lido do token; null se ausente ou inválido.</summary>
        public static int? IdDoUsuario(ClaimsPrincipal usuario) =>
            int.TryParse(usuario.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : null;

        /// <summary>Traduz a falha de um serviço no status HTTP correspondente.</summary>
        public static IResult ParaHttp<T>(Resultado<T> resultado, Func<T, IResult> sucesso) => resultado.Falha switch
        {
            null => sucesso(resultado.Valor!),
            TipoFalha.NaoEncontrado => Results.NotFound(new { message = resultado.Mensagem }),
            TipoFalha.NaoAutorizado => Results.Unauthorized(),
            _ => Results.BadRequest(new { message = resultado.Mensagem })
        };

        public static void MapNexTiEndpoints(this IEndpointRouteBuilder app)
        {
            // Status Route
            app.MapGet("/api/status", () => Results.Ok(new {
                status = "online",
                message = "NexTI API está online e conectada!",
                timestamp = DateTime.UtcNow
            })).WithName("GetStatus");

            // --- AUTENTICAÇÃO ---
            app.MapPost("/api/auth/register", async (RegisterRequest request, IAuthService auth) =>
                ParaHttp(await auth.CadastrarAsync(request.Username, request.Email, request.Password),
                    usuario => Results.Ok(new { message = "Usuário criado com sucesso!", userId = usuario.Id }))
            ).RequireRateLimiting(PoliticaDeAutenticacao);

            app.MapPost("/api/auth/login", async (LoginRequest request, IAuthService auth) =>
                ParaHttp(await auth.EntrarAsync(request.Username, request.Password),
                    sessao => Results.Ok(new {
                        token = sessao.Token,
                        user = new {
                            id = sessao.Usuario.Id,
                            username = sessao.Usuario.Username,
                            nivel = sessao.Usuario.Nivel,
                            xp = sessao.Usuario.XP,
                            moedas = sessao.Usuario.Moedas,
                            perfil = sessao.Usuario.Perfil
                        }
                    }))
            ).RequireRateLimiting(PoliticaDeAutenticacao);

            // --- USUÁRIOS ---
            // Só o próprio aluno lê os próprios dados: o nome do token tem de bater com a rota.
            app.MapGet("/api/usuarios/{username}", async (string username, IGamificacaoService gamificacao, ClaimsPrincipal userClaims) =>
            {
                if (!EhOProprioUsuario(userClaims, username)) return Results.Forbid();

                var perfil = await gamificacao.PerfilAsync(username);
                return perfil is not null ? Results.Ok(perfil) : Results.NotFound(new { message = "Usuário não encontrado" });
            }).RequireAuthorization();

            // --- FASES ---
            app.MapGet("/api/fases", async (IConteudoService conteudo) => Results.Ok(await conteudo.ListarFasesAsync()));

            // --- FLASHCARDS ---
            app.MapGet("/api/fases/{codigoFase}/flashcards", async (string codigoFase, IConteudoService conteudo) =>
                Results.Ok(await conteudo.ListarFlashcardsAsync(codigoFase)));

            // Criar Novo Flashcard (Protegido por JWT)
            app.MapPost("/api/flashcards", async (NovoFlashcardRequest request, IConteudoService conteudo, ClaimsPrincipal userClaims) =>
            {
                if (string.IsNullOrEmpty(userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value)) return Results.Unauthorized();

                return ParaHttp(await conteudo.CriarFlashcardAsync(request.CodigoFase, request.Frente, request.Verso, request.Dica),
                    flashcard => Results.Created($"/api/fases/{flashcard.CodigoFase}/flashcards", flashcard));
            }).RequireAuthorization();

            // Editar e excluir carta: as cartas são de todos, então só Tutor e Admin moderam.
            app.MapPut("/api/flashcards/{id:int}", async (int id, EditarFlashcardRequest request, IConteudoService conteudo) =>
                ParaHttp(await conteudo.EditarFlashcardAsync(id, request.Frente, request.Verso, request.Dica), Results.Ok)
            ).RequireAuthorization(PoliticaDeConteudo);

            app.MapDelete("/api/flashcards/{id:int}", async (int id, IConteudoService conteudo) =>
                ParaHttp(await conteudo.ExcluirFlashcardAsync(id), _ => Results.NoContent())
            ).RequireAuthorization(PoliticaDeConteudo);

            // --- ESTRUTURA ADMINISTRATIVA ---
            // Painel do Tutor: como cada aluno está indo no SM-2.
            app.MapGet("/api/tutor/alunos", async (IAdminService admin) => Results.Ok(await admin.PainelDosAlunosAsync()))
                .RequireAuthorization(PoliticaDeConteudo);

            // Admin: lista os usuários e define o perfil de cada um.
            app.MapGet("/api/admin/usuarios", async (IAdminService admin) => Results.Ok(await admin.ListarUsuariosAsync()))
                .RequireAuthorization(PoliticaDeAdmin);

            app.MapPut("/api/admin/usuarios/{id:int}/perfil", async (int id, PerfilRequest request, IAdminService admin, ClaimsPrincipal userClaims) =>
            {
                if (IdDoUsuario(userClaims) is not int quemPede) return Results.Unauthorized();
                return ParaHttp(await admin.DefinirPerfilAsync(quemPede, id, request.Perfil), Results.Ok);
            }).RequireAuthorization(PoliticaDeAdmin);

            // --- SM-2 PROGRESSO (PROTEGIDO) ---
            app.MapGet("/api/progresso/usuario", async (IProgressoService progresso, ClaimsPrincipal userClaims) =>
            {
                if (IdDoUsuario(userClaims) is not int currentUserId) return Results.Unauthorized();

                return Results.Ok(await progresso.ListarAsync(currentUserId));
            }).RequireAuthorization();

            app.MapPost("/api/progresso/atualizar", async (ProgressoUpdate request, IProgressoService progresso, ClaimsPrincipal userClaims) =>
            {
                if (IdDoUsuario(userClaims) is not int currentUserId) return Results.Unauthorized();
                if (request.UsuarioId > 0 && currentUserId != request.UsuarioId) return Results.Forbid();

                return Results.Ok(await progresso.RegistrarRespostaAsync(currentUserId, request.FlashcardId, request.Qualidade));
            }).RequireAuthorization();

            // Estatísticas Detalhadas do Usuário
            app.MapGet("/api/usuarios/{username}/stats-detalhadas", async (string username, IProgressoService progresso, ClaimsPrincipal userClaims) =>
            {
                if (!EhOProprioUsuario(userClaims, username)) return Results.Forbid();

                return ParaHttp(await progresso.EstatisticasAsync(username), Results.Ok);
            }).RequireAuthorization();

            // --- ATUALIZAR ESTATÍSTICAS DO USUÁRIO (PROTEGIDO) ---
            app.MapPut("/api/usuarios/stats", async (UserStatsUpdate request, IGamificacaoService gamificacao, ClaimsPrincipal userClaims) =>
            {
                if (string.IsNullOrEmpty(userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value)) return Results.Unauthorized();
                if (IdDoUsuario(userClaims) is not int currentUserId)
                    return Results.BadRequest(new { message = "Identificador de usuário inválido no token." });

                return ParaHttp(await gamificacao.AtualizarAsync(currentUserId, request.XP, request.Moedas, request.Nivel),
                    usuario => Results.Ok(new { message = "Estatísticas atualizadas!", xp = usuario.XP, moedas = usuario.Moedas, nivel = usuario.Nivel }));
            }).RequireAuthorization();

            // --- SIMULADOS (UML PIM IV) ---
            app.MapGet("/api/simulados/areas", async (IConteudoService conteudo) => Results.Ok(await conteudo.ListarAreasAsync()));

            app.MapGet("/api/simulados/questoes", async (IConteudoService conteudo) => Results.Ok(await conteudo.ListarQuestoesAsync()));

            // --- ESTATÍSTICAS GERAIS E LEADERBOARD ---
            app.MapGet("/api/estatisticas/resumo", async (IGamificacaoService gamificacao) => Results.Ok(await gamificacao.ResumoAsync()));
        }
    }

    // DTOs para requests
    public record RegisterRequest(string Username, string Email, string Password);
    public record LoginRequest(string Username, string Password);
    public record ProgressoUpdate(int UsuarioId, int FlashcardId, int Qualidade);
    public record UserStatsUpdate(int XP, int Moedas, int Nivel);
    public record NovoFlashcardRequest(string CodigoFase, string Frente, string Verso, string? Dica);
    public record EditarFlashcardRequest(string Frente, string Verso, string? Dica);
    public record PerfilRequest(string Perfil);
}
