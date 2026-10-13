using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using NexTI_API.Data;
using NexTI_API.Models;
using NexTI_API.Services;

namespace NexTI_API.Endpoints
{
    public static class EndpointExtensions
    {
        /// <summary>Nome da política de rate limiting de login/cadastro (registrada no Program.cs).</summary>
        public const string PoliticaDeAutenticacao = "autenticacao";

        private static readonly Regex NicknameValido = new(@"^[\p{L}\p{N}_.\-]{3,30}$", RegexOptions.Compiled);
        private static readonly Regex EmailValido = new(@"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$", RegexOptions.Compiled);

        public static void MapNexTiEndpoints(this IEndpointRouteBuilder app, byte[] key)
        {
            // Status Route
            app.MapGet("/api/status", () => Results.Ok(new { 
                status = "online",
                message = "NexTI API está online e conectada!",
                timestamp = DateTime.UtcNow
            })).WithName("GetStatus");

            // --- AUTENTICAÇÃO ---
            app.MapPost("/api/auth/register", async (RegisterRequest request, AppDbContext db, IPoliticaDeSenha politica) =>
            {
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                    return Results.BadRequest(new { message = "Username e senha são obrigatórios." });

                var username = request.Username.Trim();
                var email = (request.Email ?? string.Empty).Trim();

                if (!NicknameValido.IsMatch(username))
                    return Results.BadRequest(new { message = "O nickname deve ter de 3 a 30 caracteres: letras, números, ponto, hífen ou sublinhado." });
                if (!EmailValido.IsMatch(email) || email.Length > 100)
                    return Results.BadRequest(new { message = "Informe um e-mail válido." });

                var faltando = politica.Validar(request.Password, username, email);
                if (faltando.Count > 0)
                    return Results.BadRequest(new { message = PoliticaDeSenha.Mensagem(faltando) });

                // Compara com os valores já normalizados — os mesmos que serão gravados.
                if (await db.Usuarios.AnyAsync(u => u.Username == username))
                    return Results.BadRequest(new { message = "Este nickname já está em uso." });
                if (await db.Usuarios.AnyAsync(u => u.Email == email))
                    return Results.BadRequest(new { message = "Este e-mail já está cadastrado." });

                var user = new Usuario
                {
                    Username = username,
                    Email = email,
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
                };

                db.Usuarios.Add(user);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Usuário criado com sucesso!", userId = user.Id });
            }).RequireRateLimiting(PoliticaDeAutenticacao);

            app.MapPost("/api/auth/login", async (LoginRequest request, AppDbContext db) =>
            {
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                    return Results.BadRequest(new { message = "Credenciais não informadas." });

                var search = request.Username.Trim();
                var user = await db.Usuarios.FirstOrDefaultAsync(u => u.Username == search || u.Email == search);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.SenhaHash))
                    return Results.Unauthorized();

                // Geração do Token JWT
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] { 
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Username)
                    }),
                    Issuer = "NexTI_API",
                    Audience = "NexTI_Frontend",
                    Expires = DateTime.UtcNow.AddHours(24),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Results.Ok(new { 
                    token = tokenString,
                    user = new { 
                        id = user.Id, 
                        username = user.Username, 
                        nivel = user.Nivel, 
                        xp = user.XP, 
                        moedas = user.Moedas
                    }
                });
            }).RequireRateLimiting(PoliticaDeAutenticacao);

            // --- USUÁRIOS ---
            app.MapGet("/api/usuarios/{username}", async (string username, AppDbContext db) =>
            {
                var user = await db.Usuarios
                    .Where(u => u.Username == username)
                    .Select(u => new { u.Id, u.Username, u.Nivel, u.XP, u.Moedas })
                    .FirstOrDefaultAsync();
                    
                return user is not null ? Results.Ok(user) : Results.NotFound(new { message = "Usuário não encontrado" });
            });

            // --- FASES ---
            app.MapGet("/api/fases", async (AppDbContext db) =>
            {
                var fases = await db.Fases.ToListAsync();
                return Results.Ok(fases);
            });

            // --- FLASHCARDS ---
            app.MapGet("/api/fases/{codigoFase}/flashcards", async (string codigoFase, AppDbContext db) =>
            {
                var flashcards = await db.Flashcards.Where(f => f.CodigoFase == codigoFase).ToListAsync();
                return Results.Ok(flashcards);
            });

            // Criar Novo Flashcard (Protegido por JWT)
            app.MapPost("/api/flashcards", async (NovoFlashcardRequest request, AppDbContext db, ClaimsPrincipal userClaims) =>
            {
                var userIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();

                if (string.IsNullOrWhiteSpace(request.CodigoFase) || string.IsNullOrWhiteSpace(request.Frente) || string.IsNullOrWhiteSpace(request.Verso))
                {
                    return Results.BadRequest(new { message = "Fase, Frente e Verso são campos obrigatórios." });
                }

                // Verifica se a fase existe
                var faseExiste = await db.Fases.AnyAsync(f => f.CodigoFase == request.CodigoFase);
                if (!faseExiste)
                {
                    return Results.BadRequest(new { message = $"A disciplina '{request.CodigoFase}' não foi encontrada." });
                }

                var flashcard = new Flashcard
                {
                    CodigoFase = request.CodigoFase.Trim().ToLower(),
                    Frente = request.Frente.Trim(),
                    Verso = request.Verso.Trim(),
                    Dica = string.IsNullOrWhiteSpace(request.Dica) ? null : request.Dica.Trim()
                };

                db.Flashcards.Add(flashcard);
                await db.SaveChangesAsync();

                return Results.Created($"/api/fases/{flashcard.CodigoFase}/flashcards", flashcard);
            }).RequireAuthorization();

            // --- SM-2 PROGRESSO (PROTEGIDO) ---
            app.MapGet("/api/progresso/usuario", async (AppDbContext db, ClaimsPrincipal userClaims) =>
            {
                var userIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int currentUserId))
                    return Results.Unauthorized();

                var progressos = await db.Progresso_Flashcards
                    .Where(p => p.UsuarioId == currentUserId)
                    .Join(db.Flashcards,
                          p => p.FlashcardId,
                          f => f.Id,
                          (p, f) => new {
                              p.FlashcardId,
                              f.Frente,
                              f.CodigoFase,
                              p.Repeticoes,
                              p.IntervaloDias,
                              p.FatorFacilidade,
                              p.DataProximaRevisao
                          })
                    .ToListAsync();

                return Results.Ok(progressos);
            }).RequireAuthorization();

            app.MapPost("/api/progresso/atualizar", async (ProgressoUpdate request, AppDbContext db, ClaimsPrincipal userClaims, ISm2Engine sm2Engine) =>
            {
                var userIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int currentUserId))
                    return Results.Unauthorized();
                
                if (request.UsuarioId > 0 && currentUserId != request.UsuarioId) return Results.Forbid();

                var progresso = await db.Progresso_Flashcards.FindAsync(currentUserId, request.FlashcardId);
                
                if (progresso == null)
                {
                    progresso = new ProgressoFlashcard { 
                        UsuarioId = currentUserId, 
                        FlashcardId = request.FlashcardId,
                        FatorFacilidade = 2.5
                    };
                    db.Progresso_Flashcards.Add(progresso);
                }

                // Inversão de dependência para aplicar cálculo do SM-2 (DIP)
                sm2Engine.Calcular(progresso, request.Qualidade);

                await db.SaveChangesAsync();

                return Results.Ok(progresso);
            }).RequireAuthorization();

            // Estatísticas Detalhadas do Usuário
            app.MapGet("/api/usuarios/{username}/stats-detalhadas", async (string username, AppDbContext db) =>
            {
                var user = await db.Usuarios
                    .Include(u => u.Progressos)
                    .FirstOrDefaultAsync(u => u.Username == username);

                if (user == null) return Results.NotFound(new { message = "Usuário não encontrado" });

                var hoje = DateTime.UtcNow.Date;
                var totalEstudados = user.Progressos.Count;
                var cartasMaduras = user.Progressos.Count(p => p.IntervaloDias >= 21);
                var cartasEmAprendizado = user.Progressos.Count(p => p.IntervaloDias < 21);
                var cartasDevidasHoje = user.Progressos.Count(p => p.DataProximaRevisao <= hoje);
                var facilidadeMedia = user.Progressos.Any() ? user.Progressos.Average(p => p.FatorFacilidade) : 2.5;

                return Results.Ok(new
                {
                    user.Id,
                    user.Username,
                    user.Nivel,
                    user.XP,
                    user.Moedas,
                    TotalEstudados = totalEstudados,
                    CartasMaduras = cartasMaduras,
                    CartasEmAprendizado = cartasEmAprendizado,
                    CartasDevidasHoje = cartasDevidasHoje,
                    FacilidadeMedia = Math.Round(facilidadeMedia, 2)
                });
            });

            // --- ATUALIZAR ESTATÍSTICAS DO USUÁRIO (PROTEGIDO) ---
            app.MapPut("/api/usuarios/stats", async (UserStatsUpdate request, AppDbContext db, ClaimsPrincipal userClaims) =>
            {
                var userIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim)) return Results.Unauthorized();
                
                if (!int.TryParse(userIdClaim, out int currentUserId))
                    return Results.BadRequest(new { message = "Identificador de usuário inválido no token." });
                var user = await db.Usuarios.FindAsync(currentUserId);
                if (user == null) return Results.NotFound(new { message = "Usuário não encontrado" });
                
                if (request.XP < user.XP) return Results.BadRequest(new { message = "O progresso de XP não pode diminuir." });
                if (request.Nivel < user.Nivel) return Results.BadRequest(new { message = "O nível não pode diminuir." });
                
                int xpDelta = request.XP - user.XP;
                if (xpDelta > 200) return Results.BadRequest(new { message = "Incremento de XP suspeito detectado." });
                
                int moedasDelta = request.Moedas - user.Moedas;
                if (moedasDelta > 200) return Results.BadRequest(new { message = "Incremento de Moedas suspeito detectado." });

                user.XP = request.XP;
                user.Moedas = request.Moedas;
                user.Nivel = request.Nivel;
                
                await db.SaveChangesAsync();
                return Results.Ok(new { message = "Estatísticas atualizadas!", xp = user.XP, moedas = user.Moedas, nivel = user.Nivel });
            }).RequireAuthorization();

            // --- SIMULADOS (UML PIM IV) ---
            app.MapGet("/api/simulados/areas", async (AppDbContext db) =>
            {
                var areas = await db.AreasConhecimento.ToListAsync();
                return Results.Ok(areas);
            });

            app.MapGet("/api/simulados/questoes", async (AppDbContext db) =>
            {
                var questoes = await db.Questoes
                    .Include(q => q.Alternativas)
                    .Select(q => new {
                        q.Id,
                        q.IdArea,
                        q.Enunciado,
                        q.Origem,
                        Alternativas = q.Alternativas.Select(a => new { a.Id, a.Texto, a.IsCorreta })
                    })
                    .ToListAsync();
                return Results.Ok(questoes);
            });

            // --- ESTATÍSTICAS GERAIS E LEADERBOARD ---
            app.MapGet("/api/estatisticas/resumo", async (AppDbContext db) =>
            {
                var totalCards = await db.Flashcards.CountAsync();
                var totalUsuarios = await db.Usuarios.CountAsync();
                var topAlunos = await db.Usuarios
                    .OrderByDescending(u => u.XP)
                    .Take(5)
                    .Select(u => new { u.Username, u.XP, u.Nivel, u.Moedas })
                    .ToListAsync();

                return Results.Ok(new {
                    totalCards,
                    totalUsuarios,
                    topAlunos
                });
            });

            // --- GERAÇÃO DE CERTIFICADO EM PDF ---
            app.MapGet("/api/certificado/pdf", async (string nome, string data, string codigo) =>
            {
                if (string.IsNullOrEmpty(nome) || string.IsNullOrEmpty(data) || string.IsNullOrEmpty(codigo))
                {
                    return Results.BadRequest(new { message = "Parâmetros 'nome', 'data' e 'codigo' são obrigatórios." });
                }

                // Sanitização contra OS Command Injection (CRIT-01)
                static string SanitizarParametro(string input)
                {
                    if (string.IsNullOrEmpty(input)) return string.Empty;
                    return Regex.Replace(input, @"[""&|;`$(){}\\<>!\n\r]", "");
                }

                string nomeSafe = SanitizarParametro(nome);
                string dataSafe = SanitizarParametro(data);
                string codigoSafe = SanitizarParametro(codigo);

                if (nomeSafe.Length > 100 || dataSafe.Length > 80 || codigoSafe.Length > 50)
                    return Results.BadRequest(new { message = "Parâmetros excedem o comprimento permitido." });

                string tempDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "temp_certs");
                Directory.CreateDirectory(tempDir);
                
                string uniqueId = Guid.NewGuid().ToString("N");
                string pdfFileName = $"certificado_{uniqueId}.pdf";
                string pdfPath = Path.Combine(tempDir, pdfFileName);

                try
                {
                    string scriptPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Certificados", "gerar_certificado.py");
                    if (!File.Exists(scriptPath))
                    {
                        scriptPath = Path.Combine(Directory.GetCurrentDirectory(), "Certificados", "gerar_certificado.py");
                    }

                    string pythonExecutable = "python";
                    
                    var processInfo = new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = pythonExecutable,
                        Arguments = $"\"{scriptPath}\" \"{nomeSafe}\" \"{dataSafe}\" \"{codigoSafe}\" \"{pdfPath}\"",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };

                    using (var process = System.Diagnostics.Process.Start(processInfo))
                    {
                        if (process == null)
                        {
                            return Results.Problem("Não foi possível iniciar o interpretador Python.");
                        }

                        await process.WaitForExitAsync();
                        string output = await process.StandardOutput.ReadToEndAsync();
                        string error = await process.StandardError.ReadToEndAsync();

                        if (process.ExitCode != 0)
                        {
                            Console.WriteLine($"Erro do Python: {error}");
                            return Results.Problem("Ocorreu um erro ao gerar o certificado PDF.");
                        }
                    }

                    if (!File.Exists(pdfPath))
                    {
                        return Results.Problem("O arquivo PDF do certificado não foi gerado pelo script.");
                    }

                    byte[] pdfBytes = await File.ReadAllBytesAsync(pdfPath);
                    try { File.Delete(pdfPath); } catch { }

                    return Results.File(pdfBytes, "application/pdf", $"certificado_{nomeSafe.Replace(" ", "_")}.pdf");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro interno no certificado: {ex.Message}");
                    return Results.Problem("Erro interno do servidor ao gerar o certificado.");
                }
            });
        }
    }

    // DTOs para requests
    public record RegisterRequest(string Username, string Email, string Password);
    public record LoginRequest(string Username, string Password);
    public record ProgressoUpdate(int UsuarioId, int FlashcardId, int Qualidade);
    public record UserStatsUpdate(int XP, int Moedas, int Nivel);
    public record NovoFlashcardRequest(string CodigoFase, string Frente, string Verso, string? Dica);
}
