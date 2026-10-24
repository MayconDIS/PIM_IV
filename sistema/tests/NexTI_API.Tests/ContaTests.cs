using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;
using NexTI_API.Services;

namespace NexTI_API.Tests;

public class ContaTests
{
    private const string Senha = "Forte!942z";
    private static readonly string Hash = BCrypt.Net.BCrypt.HashPassword(Senha, 4);
    private static readonly ChaveJwt Chave = new(Encoding.UTF8.GetBytes("chave-de-teste-com-mais-de-trinta-e-dois-caracteres"));

    private sealed class HistoricoFake : IHistoricoConta
    {
        public int? UsuarioConsultado { get; private set; }
        public Task<List<RevisaoExportada>> LerAsync(int usuarioId)
        {
            UsuarioConsultado = usuarioId;
            return Task.FromResult(new List<RevisaoExportada> { new() { FlashcardId = 7, Repeticoes = 2 } });
        }
    }

    private static async Task<AppDbContext> Banco()
    {
        var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        db.Usuarios.AddRange(
            new Usuario { Id = 1, Username = "ana", Email = "ana@example.com", SenhaHash = Hash },
            new Usuario { Id = 2, Username = "bia", Email = "bia@example.com", SenhaHash = Hash, Perfil = Perfis.Admin });
        await db.SaveChangesAsync();
        return db;
    }
    private static ContaService Servico(AppDbContext db) => new(db, new PoliticaDeSenha(), new HistoricoFake());

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("errada")]
    public async Task Mutacoes_ExigemSenhaAtual(string? senha)
    {
        using var db = await Banco();
        var servico = Servico(db);
        Assert.False((await servico.AlterarEmailAsync(1, "novo@example.com", senha)).Sucesso);
        Assert.False((await servico.AlterarSenhaAsync(1, senha, "Outra!872x")).Sucesso);
        Assert.False((await servico.ExcluirAsync(1, senha)).Sucesso);
        Assert.Equal(2, await db.Usuarios.CountAsync());
        Assert.Equal("ana@example.com", (await db.Usuarios.FindAsync(1))!.Email);
        Assert.Equal(Hash, (await db.Usuarios.FindAsync(1))!.SenhaHash);
    }

    [Theory]
    [InlineData("")]
    [InlineData("invalido")]
    [InlineData("BIA@example.com")]
    public async Task Email_InvalidoOuDuplicado_NaoAlteraConta(string email)
    {
        using var db = await Banco();
        Assert.False((await Servico(db).AlterarEmailAsync(1, email, Senha)).Sucesso);
        Assert.Equal("ana@example.com", (await db.Usuarios.FindAsync(1))!.Email);
    }

    [Fact]
    public async Task Email_NormalizaEspacosESoAlteraOProprioUsuario()
    {
        using var db = await Banco();
        var resultado = await Servico(db).AlterarEmailAsync(1, " novo@example.com ", Senha);
        Assert.True(resultado.Sucesso);
        Assert.Equal("novo@example.com", resultado.Valor!.Email);
        Assert.Equal("bia@example.com", (await db.Usuarios.FindAsync(2))!.Email);
        var login = await new AuthService(db, new PoliticaDeSenha(), Chave).EntrarAsync("novo@example.com", Senha);
        Assert.True(login.Sucesso);
    }

    [Theory]
    [InlineData("fraca")]
    [InlineData(Senha)]
    public async Task Senha_FracaOuIgual_Recusada(string nova)
    {
        using var db = await Banco();
        Assert.False((await Servico(db).AlterarSenhaAsync(1, Senha, nova)).Sucesso);
        Assert.Equal(Hash, (await db.Usuarios.FindAsync(1))!.SenhaHash);
    }

    [Fact]
    public async Task SenhaNova_InvalidaSessaoAntigaEAceitaNovoLogin()
    {
        using var db = await Banco();
        var u = (await db.Usuarios.FindAsync(1))!;
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(SessaoAtual.ClaimCredencial, SessaoAtual.Assinatura(u, Chave)) }));
        Assert.True(SessaoAtual.Valida(principal, u, Chave));
        Assert.True((await Servico(db).AlterarSenhaAsync(1, Senha, "Outra!872x")).Sucesso);
        Assert.False(SessaoAtual.Valida(principal, u, Chave));
        var auth = new AuthService(db, new PoliticaDeSenha(), Chave);
        Assert.False((await auth.EntrarAsync("ana", Senha)).Sucesso);
        Assert.True((await auth.EntrarAsync("ana", "Outra!872x")).Sucesso);
    }

    [Fact]
    public void Sessao_UsuarioExcluidoOuTokenLegado_Recusados()
    {
        Assert.False(SessaoAtual.Valida(new ClaimsPrincipal(), null, Chave));
        Assert.False(SessaoAtual.Valida(new ClaimsPrincipal(), new Usuario { SenhaHash = Hash }, Chave));
    }

    [Fact]
    public async Task Exportacao_SoContemDadosDoTitularESemCredenciais()
    {
        using var db = await Banco();
        db.Progresso_Flashcards.AddRange(new ProgressoFlashcard { UsuarioId = 1, FlashcardId = 7 }, new ProgressoFlashcard { UsuarioId = 2, FlashcardId = 8 });
        await db.SaveChangesAsync();
        var historico = new HistoricoFake();
        var resultado = await new ContaService(db, new PoliticaDeSenha(), historico).ExportarAsync(1);
        Assert.True(resultado.Sucesso);
        Assert.Equal(1, historico.UsuarioConsultado);
        Assert.Equal(7, Assert.Single(resultado.Valor!.Progresso).FlashcardId);
        Assert.Single(resultado.Valor.Historico);
        var json = JsonSerializer.Serialize(resultado.Valor);
        Assert.DoesNotContain("Senha", json);
        Assert.DoesNotContain(Hash, json);
        Assert.DoesNotContain("bia@example.com", json);
    }

    [Fact]
    public async Task Exclusao_PreservaUltimoAdmin()
    {
        using var db = await Banco();
        Assert.False((await Servico(db).ExcluirAsync(2, Senha)).Sucesso);
        Assert.NotNull(await db.Usuarios.FindAsync(2));
        (await db.Usuarios.FindAsync(1))!.Perfil = Perfis.Admin;
        await db.SaveChangesAsync();
        Assert.True((await Servico(db).ExcluirAsync(2, Senha)).Sucesso);
        Assert.Null(await db.Usuarios.FindAsync(2));
    }

    [Fact]
    public async Task ContaInexistente_NaoExportaNemMudaDados()
    {
        using var db = await Banco();
        var s = Servico(db);
        Assert.Equal(TipoFalha.NaoEncontrado, (await s.LerAsync(99)).Falha);
        Assert.Equal(TipoFalha.NaoEncontrado, (await s.ExportarAsync(99)).Falha);
        Assert.Equal(TipoFalha.NaoEncontrado, (await s.AlterarEmailAsync(99, "novo@example.com", Senha)).Falha);
        Assert.Equal(TipoFalha.NaoEncontrado, (await s.AlterarSenhaAsync(99, Senha, "Outra!872x")).Falha);
        Assert.Equal(TipoFalha.NaoEncontrado, (await s.ExcluirAsync(99, Senha)).Falha);
    }
}
