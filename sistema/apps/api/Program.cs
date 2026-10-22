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
using Azure.Monitor.OpenTelemetry.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Alguns hosts de contêiner informam a porta pela variável PORT; o App Service não precisa.
var porta = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(porta)) builder.WebHost.UseUrls($"http://0.0.0.0:{porta}");

// CORS: ver PoliticaDeCors (localhost, Cors:Origens e os previews do próprio projeto).
// Sem AllowCredentials: a API autentica por header Authorization, não por cookie.
var politicaDeCors = new PoliticaDeCors(
    builder.Configuration["Cors:Origens"],
    builder.Configuration["Cors:PreviewsVercel"]);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.SetIsOriginAllowed(politicaDeCors.Permite)
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Autenticação JWT. Fora do ambiente de desenvolvimento a chave TEM de vir da
// configuração (Jwt__Key no App Service): subir com uma chave conhecida
// deixaria qualquer um forjar tokens válidos.
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    if (!builder.Environment.IsDevelopment())
        throw new InvalidOperationException("Jwt:Key não configurada. Defina a variável de ambiente Jwt__Key.");
    jwtKey = "NexTI_chave_somente_para_desenvolvimento_local_2026";
}
if (Encoding.ASCII.GetByteCount(jwtKey) < 32)
    throw new InvalidOperationException("Jwt:Key precisa ter pelo menos 32 caracteres (HMAC-SHA256).");
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = AuthService.Emissor,
            ValidateAudience = true,
            ValidAudience = AuthService.Publico
        };
    });

builder.Services.AddAuthorization();

// Injeção de Dependências Customizadas (SOLID - SRP / DIP)
builder.Services.AddSingleton<ISm2Engine, Sm2Engine>();
builder.Services.AddSingleton<IPoliticaDeSenha, PoliticaDeSenha>();
builder.Services.AddSingleton(new ChaveJwt(key));

// Camada de serviços: regra de negócio fora dos endpoints (um por requisição, como o DbContext).
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProgressoService, ProgressoService>();
builder.Services.AddScoped<IGamificacaoService, GamificacaoService>();
builder.Services.AddScoped<IConteudoService, ConteudoService>();

// Login e cadastro: 30 tentativas por minuto por IP (força bruta / criação em massa).
// Não é menor porque uma turma inteira sai pelo mesmo IP do Wi-Fi da faculdade.
// Monitoramento: com APPLICATIONINSIGHTS_CONNECTION_STRING (app setting do App Service),
// requisições, erros, tempo de resposta e consultas ao SQL vão para o Application Insights.
// Sem a variável (PC, Docker, testes), nada é enviado.
if (!string.IsNullOrWhiteSpace(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]))
    builder.Services.AddOpenTelemetry().UseAzureMonitor();

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
app.MapNexTiEndpoints();

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
