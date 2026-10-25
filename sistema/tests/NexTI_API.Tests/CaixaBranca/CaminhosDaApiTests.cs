using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using NexTI_API.Data;
using NexTI_API.Services;
using NexTI_API.Services.Seed;
using NexTI_API.Tests.CaixaPreta;

namespace NexTI_API.Tests.CaixaBranca;

/// <summary>
/// Caixa branca: escritos com o relatório de cobertura na mão, olhando o código. Cada teste
/// percorre um caminho (um if, uma validação, um catch) que nenhum outro teste percorria.
/// </summary>
public class CaminhosDaApiTests
{
    // --- AuthService.CadastrarAsync / EntrarAsync: cada validação pelos dois lados ---------

    [Theory]
    [InlineData("", "a@exemplo.test", "Forte!942z")]          // nickname vazio
    [InlineData("ab", "a@exemplo.test", "Forte!942z")]        // nickname curto (regex 3 a 30)
    [InlineData("nome com espaço", "a@exemplo.test", "Forte!942z")]
    [InlineData("cb_email", "sem-arroba", "Forte!942z")]      // e-mail inválido
    [InlineData("cb_senha", "a@exemplo.test", "")]            // senha vazia
    public async Task Cadastro_RecusaCadaCampoInvalido(string usuario, string email, string senha)
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var r = await api.CreateClient().PostAsJsonAsync("/api/auth/register", new { username = usuario, email, password = senha });
        Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode);
    }

    [Fact]
    public async Task Login_SemCredenciais_E400_ENaoVazaSeOUsuarioExiste()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var http = api.CreateClient();

        Assert.Equal(HttpStatusCode.BadRequest, (await http.PostAsJsonAsync("/api/auth/login", new { username = "", password = "" })).StatusCode);
        // Usuário que não existe e senha errada dão a mesma resposta: não dá para descobrir quem tem conta.
        Assert.Equal(HttpStatusCode.Unauthorized, (await http.PostAsJsonAsync("/api/auth/login", new { username = "ninguem_aqui", password = "Forte!942z" })).StatusCode);
    }

    [Fact]
    public async Task Login_AceitaOEmailNoLugarDoNickname()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        await api.CadastrarELogarAsync("cb_email_login");

        var r = await api.CreateClient().PostAsJsonAsync("/api/auth/login", new { username = "cb_email_login@exemplo.test", password = "Forte!942z" });
        Assert.Equal(HttpStatusCode.OK, r.StatusCode);
    }

    // --- Rotas de progresso (EndpointExtensions 121–142) -----------------------------------

    [Fact]
    public async Task Progresso_RegistraAResposta_ListaELeAsEstatisticas()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("cb_progresso");
        var carta = (await (await aluno.GetAsync("/api/fases/fase1/flashcards")).JsonAsync())[0].GetProperty("id").GetInt32();

        var resposta = await aluno.PostAsJsonAsync("/api/progresso/atualizar", new { usuarioId = 0, flashcardId = carta, qualidade = 5 });
        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
        Assert.Equal(3, (await resposta.JsonAsync()).GetProperty("intervaloDias").GetDouble());   // Fácil numa carta nova: 3 dias

        var lista = await (await aluno.GetAsync("/api/progresso/usuario")).JsonAsync();
        Assert.Equal(carta, lista[0].GetProperty("flashcardId").GetInt32());
        Assert.Equal(HttpStatusCode.OK, (await aluno.GetAsync("/api/usuarios/cb_progresso/stats-detalhadas")).StatusCode);
    }

    [Fact]
    public async Task Progresso_NaoGravaEmNomeDeOutroUsuario()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("cb_outro");

        var r = await aluno.PostAsJsonAsync("/api/progresso/atualizar", new { usuarioId = 999, flashcardId = 1, qualidade = 4 });
        Assert.Equal(HttpStatusCode.Forbidden, r.StatusCode);
    }

    [Fact]
    public async Task Progresso_CartaQueNaoExiste_E404()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("cb_sem_carta");

        var r = await aluno.PostAsJsonAsync("/api/progresso/atualizar", new { usuarioId = 0, flashcardId = 999_999, qualidade = 4 });
        Assert.Equal(HttpStatusCode.NotFound, r.StatusCode);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(6)]
    [InlineData(99)]
    public async Task Progresso_NotaForaDe0a5_E400(int qualidade)
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("cb_nota");
        var carta = (await (await aluno.GetAsync("/api/fases/fase1/flashcards")).JsonAsync())[0].GetProperty("id").GetInt32();

        var r = await aluno.PostAsJsonAsync("/api/progresso/atualizar", new { usuarioId = 0, flashcardId = carta, qualidade });
        Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode);
    }

    // --- Normalização da fase e do bônus (GamificacaoService 86 e 124) --------------------

    [Fact]
    public async Task ConcluirFase_AceitaCodigoComEspacosEMaiusculas()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("cb_normaliza");

        var r = await (await aluno.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId = "  FASE1 ", acertos = 0, total = 0 })).JsonAsync();
        Assert.Equal(5, r.GetProperty("premio").GetProperty("xp").GetInt32());
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public async Task ConcluirFase_SemCodigo_E400(string? faseId)
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("cb_sem_fase");

        var r = await aluno.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId, acertos = 0, total = 0 });
        Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode);
    }

    // --- Conteúdo (ConteudoService 39–107) ------------------------------------------------

    [Fact]
    public async Task CriarCarta_SemFrenteOuVerso_E400()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("cb_carta");

        var r = await aluno.PostAsJsonAsync("/api/flashcards", new { codigoFase = "fase1", frente = "  ", verso = "algo", dica = (string?)null });
        Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode);
    }

    [Fact]
    public async Task Simulados_ListamAreasEQuestoesComAlternativas()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var http = api.CreateClient();

        var areas = await (await http.GetAsync("/api/simulados/areas")).JsonAsync();
        var questoes = await (await http.GetAsync("/api/simulados/questoes")).JsonAsync();

        Assert.True(areas.GetArrayLength() > 0);
        Assert.True(questoes.GetArrayLength() > 0);
        Assert.True(questoes[0].GetProperty("alternativas").GetArrayLength() > 1);
    }

    // --- Minha conta (ContaEndpoints 19–24) ----------------------------------------------

    [Fact]
    public async Task Conta_TrocaEmailESenha_EOTokenAntigoDeixaDeValer()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("cb_conta");

        Assert.Equal(HttpStatusCode.BadRequest, (await aluno.PutAsJsonAsync("/api/conta/email", new { email = "novo@exemplo.test", senhaAtual = "Errada!123x" })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await aluno.PutAsJsonAsync("/api/conta/email", new { email = "novo@exemplo.test", senhaAtual = "Forte!942z" })).StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, (await aluno.PutAsJsonAsync("/api/conta/senha", new { senhaAtual = "Forte!942z", novaSenha = "Outra!Senha77" })).StatusCode);

        Assert.Equal(HttpStatusCode.Unauthorized, (await aluno.GetAsync("/api/conta/")).StatusCode);   // sessão antiga revogada
        var deNovo = await api.LogarAsync("cb_conta", "Outra!Senha77");
        Assert.Equal("novo@exemplo.test", (await (await deNovo.GetAsync("/api/conta/")).JsonAsync()).GetProperty("email").GetString());
    }

    // --- DatabaseSeeder: uma etapa com erro não derruba as outras ------------------------

    private sealed class EtapaQueFalha : IEtapaSeed
    {
        public string Nome => "quebrada";
        public Task<int> ExecutarAsync(AppDbContext db) => throw new InvalidOperationException("falha de propósito");
    }

    private sealed class EtapaQueConta : IEtapaSeed
    {
        public bool Rodou { get; private set; }
        public string Nome => "seguinte";
        public Task<int> ExecutarAsync(AppDbContext db) { Rodou = true; return Task.FromResult(1); }
    }

    [Fact]
    public async Task Seeder_EtapaComErroNaoImpedeAsSeguintes()
    {
        await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase($"seed-{Guid.NewGuid()}").Options);
        var seguinte = new EtapaQueConta();
        var seeder = new DatabaseSeeder(new IEtapaSeed[] { new EtapaQueFalha(), seguinte }, NullLogger<DatabaseSeeder>.Instance);

        await seeder.SeedAsync(db);

        Assert.True(seguinte.Rodou);
    }
}
