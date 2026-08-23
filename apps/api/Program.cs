using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Services;
using NexTI_API.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuração de CORS Resiliente (Suporte Local e Nuvem)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;
                var uri = new Uri(origin);
                return uri.Host == "localhost" || uri.Host == "127.0.0.1";
            })
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Configuração de Autenticação JWT
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
builder.Services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();

// Configuração do Entity Framework (Compatível com LocalDB e Azure SQL Database)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration["AZURE_SQL_CONNECTIONSTRING"]
    ?? "Server=(localdb)\\mssqllocaldb;Database=NexTI_DB;Trusted_Connection=True;TrustServerCertificate=True;";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null
        );
    }));

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// Registro Modular de Endpoints (SOLID - SRP)
app.MapNexTiEndpoints(key);

// Inicialização automática do banco e auto-seeding
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();

    db.Database.EnsureCreated();
    await seeder.SeedAsync(db);
}

app.Run();
