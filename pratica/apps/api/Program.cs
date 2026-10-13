using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Services;
using NexTI_API.Services.Seed;
using NexTI_API.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Alguns hosts de contêiner informam a porta pela variável PORT; o App Service não precisa.
var porta = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(porta)) builder.WebHost.UseUrls($"http://0.0.0.0:{porta}");

// CORS: localhost sempre; domínios de produção em Cors:Origens (separados por vírgula)
// e, opcionalmente, os previews *.vercel.app.
var origensPermitidas = (builder.Configuration["Cors:Origens"] ?? string.Empty)
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .Select(o => o.TrimEnd('/'))
    .ToHashSet(StringComparer.OrdinalIgnoreCase);
var permitirPreviewsVercel = builder.Configuration.GetValue("Cors:PermitirPreviewsVercel", false);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin) || !Uri.TryCreate(origin, UriKind.Absolute, out var uri)) return false;
                if (uri.Host == "localhost" || uri.Host == "127.0.0.1") return true;
                if (origensPermitidas.Contains(origin.TrimEnd('/'))) return true;
                return permitirPreviewsVercel && uri.Scheme == "https" && uri.Host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase);
            })
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Autenticação JWT — em produção a chave vem da variável Jwt__Key.
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? "NexTI_Secret_Key_2026_Super_Secure_Key_123!";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = "NexTI_API",
            ValidateAudience = true,
            ValidAudience = "NexTI_Frontend"
        };
    });

builder.Services.AddAuthorization();

// Injeção de Dependências Customizadas (SOLID - SRP / DIP)
builder.Services.AddSingleton<ISm2Engine, Sm2Engine>();
builder.Services.AddSingleton<IPoliticaDeSenha, PoliticaDeSenha>();

// Login e cadastro: 30 tentativas por minuto por IP (força bruta / criação em massa).
// Não é menor porque uma turma inteira sai pelo mesmo IP do Wi-Fi da faculdade.
builder.Services.AddRateLimiter(opcoes =>
{
    opcoes.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    opcoes.AddPolicy(EndpointExtensions.PoliticaDeAutenticacao, contexto =>
        RateLimitPartition.GetFixedWindowLimiter(
            contexto.Connection.RemoteIpAddress?.ToString() ?? "desconhecido",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 30,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));
});

// Atrás do front-end do App Service o IP do cliente chega em X-Forwarded-For.
// ForwardLimit = 1 usa só a última entrada — a que o próprio proxy da Azure
// acrescenta —, então o cliente não consegue forjar o IP do rate limiting.
builder.Services.Configure<ForwardedHeadersOptions>(opcoes =>
{
    opcoes.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    opcoes.ForwardLimit = 1;
    opcoes.KnownIPNetworks.Clear();
    opcoes.KnownProxies.Clear();
});
builder.Services.AddScoped<IEtapaSeed>(_ => new ConteudoSeeder());
builder.Services.AddScoped<IEtapaSeed, SimuladoSeeder>();
builder.Services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();

// Entity Framework + SQL Server (Azure SQL Database em produção, LocalDB local).
// Tabelas e colunas em snake_case. O retry cobre o "acordar" do banco serverless.
var connectionString = ConexaoBanco.Resolver(builder.Configuration);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure(
            maxRetryCount: 6,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null))
        .UseSnakeCaseNamingConvention());

builder.Services.AddOpenApi();

var app = builder.Build();

if (!app.Environment.IsDevelopment() && jwtKey.StartsWith("NexTI_Secret_Key_2026"))
{
    app.Logger.LogWarning("Jwt:Key está com o valor padrão do repositório. Defina a variável Jwt__Key em produção.");
}

app.UseForwardedHeaders();
app.UseCors("AllowFrontend");
app.UseRateLimiter();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();

// Registro Modular de Endpoints (SOLID - SRP)
app.MapNexTiEndpoints(key);

// Aplica as migrations pendentes e povoa o banco (idempotente).
// Desative com Database__MigrarAoIniciar=false se o schema for gerenciado fora da API.
if (app.Configuration.GetValue("Database:MigrarAoIniciar", true))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();

    await db.Database.MigrateAsync();
    await seeder.SeedAsync(db);
}

app.Run();
