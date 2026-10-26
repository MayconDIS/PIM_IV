using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;
using NexTI_API.Services;
using NexTI_API.Tests.CaixaPreta;

namespace NexTI_API.Tests;

public class DiagnosticoTests
{
    private static CatalogoDiagnostico Catalogo => CatalogoDiagnostico.Carregar();

    private static List<RespostaDiagnostico?> Respostas(Func<PerguntaDiagnostico, bool>? acertar = null) =>
        Catalogo.Perguntas.GroupBy(p => p.Modulo).OrderBy(g => g.Key).SelectMany(g => g.Take(5))
            .Select(p => (RespostaDiagnostico?)new RespostaDiagnostico(p.Id, acertar?.Invoke(p) != false ? p.Certa : null)).ToList();

    private static async Task<AppDbContext> Banco(int nivel = 1)
    {
        var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        db.Usuarios.Add(new Usuario { Id = 1, Username = "ana", Email = "ana@exemplo.test", SenhaHash = "hash", Nivel = nivel, XP = 17, Moedas = 9 });
        await db.SaveChangesAsync();
        return db;
    }

    [Fact]
    public void Catalogo_CobreAsDisciplinasDosQuatroModulos()
    {
        var c = Catalogo;
        Assert.Equal(2, c.Versao);
        Assert.Equal(34, c.Perguntas.Count);
        Assert.Equal(new[] { 9, 8, 9, 8 }, c.Perguntas.GroupBy(p => p.Modulo).OrderBy(g => g.Key).Select(g => g.Count()));
        Assert.Equal(34, c.Perguntas.Select(p => p.Id).Distinct().Count());
        Assert.All(c.Perguntas, p => Assert.InRange(p.Certa, 0, p.R.Count - 1));
    }

    [Fact]
    public void TodasCorretas_RecomendaEnadeSemConcluirOuLiberarTodasAsFasesDele()
    {
        var r = Catalogo.Avaliar(Respostas());
        Assert.True(r.Sucesso);
        Assert.Equal(20, r.Valor!.Acertos);
        Assert.Equal(5, r.Valor.ModuloRecomendado);
        Assert.Equal("fase21", r.Valor.FaseRecomendada);
        Assert.Equal("fase21", r.Valor.Fases.Last());
        Assert.DoesNotContain("teste-mod5", r.Valor.Fases);
        Assert.All(r.Valor.Modulos, m => Assert.True(m.Dominio));
    }

    [Fact]
    public void BaseFraca_NaoECompensadaPorModulosAvancados()
    {
        var r = Catalogo.Avaliar(Respostas(p => p.Modulo != 1));
        Assert.Equal(15, r.Valor!.Acertos);
        Assert.Equal(1, r.Valor.ModuloRecomendado);
        Assert.Equal(new[] { "fase1" }, r.Valor.Fases);
    }

    [Fact]
    public void CortePorModulo_QuatroAcertosAvancamETresRecomendamRevisao()
    {
        var respostas = Respostas();
        respostas[0] = respostas[0]! with { Alternativa = null };
        respostas[5] = respostas[5]! with { Alternativa = null };
        respostas[6] = respostas[6]! with { Alternativa = null };
        var r = Catalogo.Avaliar(respostas).Valor!;
        Assert.Equal(2, r.ModuloRecomendado);
        Assert.True(r.Modulos[0].Dominio);
        Assert.False(r.Modulos[1].Dominio);
        Assert.Equal("fase6", r.FaseRecomendada);
    }

    [Theory]
    [InlineData("vazio")]
    [InlineData("incompleto")]
    [InlineData("excesso")]
    [InlineData("duplicado")]
    [InlineData("desconhecido")]
    [InlineData("nulo")]
    [InlineData("negativo")]
    [InlineData("fora")]
    [InlineData("distribuicao")]
    public void RespostasInvalidas_NaoGeramResultado(string caso)
    {
        var respostas = Respostas();
        switch (caso)
        {
            case "vazio": Assert.False(Catalogo.Avaliar(null).Sucesso); return;
            case "incompleto": respostas.RemoveAt(0); break;
            case "excesso": respostas.Add(respostas[0]); break;
            case "duplicado": respostas[0] = respostas[1]; break;
            case "desconhecido": respostas[0] = new("inexistente", 0); break;
            case "nulo": respostas[0] = null; break;
            case "negativo": respostas[0] = respostas[0]! with { Alternativa = -1 }; break;
            case "fora": respostas[0] = respostas[0]! with { Alternativa = 4 }; break;
            case "distribuicao": respostas[0] = new(Catalogo.Perguntas.Where(p => p.Modulo == 2).Skip(5).First().Id, 0); break;
        }
        Assert.Equal(TipoFalha.Invalido, Catalogo.Avaliar(respostas).Falha);
    }

    [Fact]
    public async Task RefazerComNotaMenor_PreservaAcessosNivelSaldoEConclusoes()
    {
        using var db = await Banco();
        db.FasesConcluidas.Add(new FaseConcluida { UsuarioId = 1, CodigoFase = "fase1" });
        await db.SaveChangesAsync();
        var service = new DiagnosticoService(db, Catalogo);
        var primeiro = (await service.ConcluirAsync(1, Respostas())).Valor!;
        var segundo = (await service.ConcluirAsync(1, Respostas(_ => false))).Valor!;
        Assert.Equal(0, segundo.Acertos);
        Assert.Equal(1, segundo.ModuloRecomendado);
        Assert.Equal(primeiro.FasesLiberadas, segundo.FasesLiberadas);
        var aluno = await db.Usuarios.SingleAsync();
        Assert.Equal((17, 9, 1), (aluno.XP, aluno.Moedas, aluno.Nivel));
        Assert.Single(db.FasesConcluidas);
        Assert.NotNull(segundo.RealizadoEm);
        var perfil = await new GamificacaoService(db).PerfilAsync("ana");
        Assert.Equal(0, perfil!.Diagnostico!.Acertos);
        Assert.Equal(primeiro.FasesLiberadas, perfil.Diagnostico.FasesLiberadas);
    }

    [Theory]
    [InlineData(1, "fase1")]
    [InlineData(3, "teste-mod2")]
    [InlineData(6, "teste-mod5")]
    public async Task PrimeiroDiagnosticoNovo_PreservaAcessosDoLegado(int nivel, string ultima)
    {
        using var db = await Banco(nivel);
        var r = (await new DiagnosticoService(db, Catalogo).ConcluirAsync(1, Respostas(_ => false))).Valor!;
        Assert.Equal(ultima, r.FasesLiberadas!.Last());
        Assert.Equal(nivel, (await db.Usuarios.SingleAsync()).Nivel);
    }

    [Fact]
    public async Task RequisicaoInvalidaOuUsuarioInexistente_NaoGrava()
    {
        using var db = await Banco();
        var s = new DiagnosticoService(db, Catalogo);
        Assert.Equal(TipoFalha.Invalido, (await s.ConcluirAsync(1, [])).Falha);
        Assert.Null((await db.Usuarios.SingleAsync()).DiagnosticoJson);
        Assert.Equal(TipoFalha.NaoEncontrado, (await s.ConcluirAsync(99, Respostas())).Falha);
    }

    [Fact]
    public async Task Http_ExigeLogin_CorrigeNoServidor_EExportaResultadoDoProprioAluno()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var body = new { respostas = Respostas(), usuarioId = 999, acertos = 0 };
        using var anonimo = api.CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonimo.PostAsJsonAsync("/api/diagnostico", body)).StatusCode);
        using var aluno = await api.CadastrarELogarAsync("diag_ana");
        using var outro = await api.CadastrarELogarAsync("diag_bia");
        var resposta = await aluno.PostAsJsonAsync("/api/diagnostico", body);
        resposta.EnsureSuccessStatusCode();
        var resultado = await resposta.Content.ReadFromJsonAsync<ResultadoDiagnostico>();
        Assert.Equal(20, resultado!.Acertos);
        var perfil = await aluno.GetFromJsonAsync<PerfilUsuario>("/api/usuarios/diag_ana");
        Assert.Equal(20, perfil!.Diagnostico!.Acertos);
        Assert.Equal((0, 0, 1), (perfil.XP, perfil.Moedas, perfil.Nivel));
        var outroPerfil = await outro.GetFromJsonAsync<PerfilUsuario>("/api/usuarios/diag_bia");
        Assert.Null(outroPerfil!.Diagnostico);
        // O histórico exportado usa SQL; o teste em memória cobre a exportação via serviço com histórico vazio.
        await api.NoBancoAsync(async db =>
        {
            var exportacao = await new ContaService(db, new PoliticaDeSenha(), new HistoricoVazio()).ExportarAsync(perfil.Id);
            Assert.Equal(20, exportacao.Valor!.Diagnostico!.Acertos);
            Assert.DoesNotContain("senhaHash", JsonSerializer.Serialize(exportacao.Valor, CatalogoDiagnostico.Json));
        });
        Assert.Equal(HttpStatusCode.BadRequest, (await aluno.PostAsJsonAsync("/api/diagnostico", new { respostas = new[] { new { perguntaId = "diag-fase1" } } })).StatusCode);
    }

    private sealed class HistoricoVazio : IHistoricoConta
    {
        public Task<List<RevisaoExportada>> LerAsync(int usuarioId) => Task.FromResult(new List<RevisaoExportada>());
    }
}
