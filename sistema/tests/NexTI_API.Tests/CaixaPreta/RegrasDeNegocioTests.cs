using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Models;

namespace NexTI_API.Tests.CaixaPreta;

/// <summary>
/// Caixa preta: cada teste sai de uma regra de negócio do relatório (seção 2.2.2), não do código,
/// e entra só pela porta da frente, as rotas HTTP. O que se confere é o que a regra PROMETE.
/// </summary>
public class RegrasDeNegocioTests
{
    // --- RN01 · Recompensa só no servidor --------------------------------------------------

    [Fact]
    public async Task RN01_FasePaga5XpE10MoedasSoNaPrimeiraConclusao()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn01_aluno");

        var primeira = await (await aluno.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId = "fase1", acertos = 0, total = 0 })).JsonAsync();
        var revisao = await (await aluno.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId = "fase1", acertos = 0, total = 0 })).JsonAsync();

        Assert.True(primeira.GetProperty("primeiraVez").GetBoolean());
        Assert.Equal(5, primeira.GetProperty("premio").GetProperty("xp").GetInt32());
        Assert.Equal(10, primeira.GetProperty("premio").GetProperty("moedas").GetInt32());
        Assert.False(revisao.GetProperty("primeiraVez").GetBoolean());
        Assert.Equal(0, revisao.GetProperty("premio").GetProperty("xp").GetInt32());
        Assert.Equal(5, revisao.GetProperty("xp").GetInt32());          // o total não mudou
        Assert.Equal(10, revisao.GetProperty("moedas").GetInt32());
    }

    [Theory]
    [InlineData("teste-mod1", 7, 10, true, 25)]    // 70%: passa
    [InlineData("teste-mod1", 6, 10, false, 0)]    // 60%: não paga
    [InlineData("teste-mod5", 8, 10, true, 50)]    // módulo 5 (ENADE): corte de 80%, 50 XP
    [InlineData("teste-mod5", 7, 10, false, 0)]
    public async Task RN01_TesteDeModuloSoPagaComOAproveitamentoMinimo(string teste, int acertos, int total, bool aprovado, int xp)
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn01_teste");

        var r = await (await aluno.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId = teste, acertos, total })).JsonAsync();

        Assert.Equal(aprovado, r.GetProperty("aprovado").GetBoolean());
        Assert.Equal(xp, r.GetProperty("premio").GetProperty("xp").GetInt32());
    }

    [Fact]
    public async Task RN01_FaseQueNaoExisteNaoPaga()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn01_fase");

        var r = await aluno.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId = "fase999", acertos = 0, total = 0 });

        Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode);
    }

    // --- RN02 · Perfis de acesso ------------------------------------------------------------

    [Fact]
    public async Task RN02_AlunoCriaCartaMasNaoEditaNemExclui_TutorModera()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn02_aluno");
        var tutor = await api.UsuarioComPerfilAsync("rn02_tutor", Perfis.Tutor);

        var criada = await aluno.PostAsJsonAsync("/api/flashcards", new { codigoFase = "fase1", frente = "O que é RN02?", verso = "Perfis de acesso", dica = (string?)null });
        Assert.Equal(HttpStatusCode.Created, criada.StatusCode);
        var id = (await criada.JsonAsync()).GetProperty("id").GetInt32();
        var edicao = new { frente = "O que é RN02?", verso = "Perfis de acesso, conferidos em cada rota", dica = (string?)null };

        Assert.Equal(HttpStatusCode.Forbidden, (await aluno.PutAsJsonAsync($"/api/flashcards/{id}", edicao)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await aluno.DeleteAsync($"/api/flashcards/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await tutor.PutAsJsonAsync($"/api/flashcards/{id}", edicao)).StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, (await tutor.DeleteAsync($"/api/flashcards/{id}")).StatusCode);
    }

    [Fact]
    public async Task RN02_PaineisSoParaQuemTemOPerfil()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn02_aluno");
        var tutor = await api.UsuarioComPerfilAsync("rn02_tutor", Perfis.Tutor);
        var admin = await api.UsuarioComPerfilAsync("rn02_admin", Perfis.Admin);

        Assert.Equal(HttpStatusCode.Forbidden, (await aluno.GetAsync("/api/tutor/alunos")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await tutor.GetAsync("/api/tutor/alunos")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await tutor.GetAsync("/api/admin/usuarios")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await admin.GetAsync("/api/admin/usuarios")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await admin.GetAsync("/api/tutor/alunos")).StatusCode);   // o Admin também acompanha
    }

    [Fact]
    public async Task RN02_SoOAdminMudaPerfil()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var tutor = await api.UsuarioComPerfilAsync("rn02_tutor", Perfis.Tutor);
        var admin = await api.UsuarioComPerfilAsync("rn02_admin", Perfis.Admin);
        await api.CadastrarELogarAsync("rn02_aluno");
        var idAluno = 0;
        await api.NoBancoAsync(async db => idAluno = (await db.Usuarios.SingleAsync(u => u.Username == "rn02_aluno")).Id);

        Assert.Equal(HttpStatusCode.Forbidden, (await tutor.PutAsJsonAsync($"/api/admin/usuarios/{idAluno}/perfil", new { perfil = Perfis.Admin })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await admin.PutAsJsonAsync($"/api/admin/usuarios/{idAluno}/perfil", new { perfil = Perfis.Tutor })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await admin.PutAsJsonAsync($"/api/admin/usuarios/{idAluno}/perfil", new { perfil = "Diretor" })).StatusCode);
    }

    [Fact]
    public async Task RN02_SemLoginAsRotasProtegidasRecusam()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var anonimo = api.CreateClient();

        foreach (var rota in new[] { "/api/conta/", "/api/progresso/usuario", "/api/tutor/alunos", "/api/admin/usuarios", "/api/usuarios/alguem" })
            Assert.True((await anonimo.GetAsync(rota)).StatusCode == HttpStatusCode.Unauthorized, rota);
        Assert.Equal(HttpStatusCode.Unauthorized,
            (await anonimo.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId = "fase1", acertos = 0, total = 0 })).StatusCode);
    }

    [Fact]
    public async Task RN02_AlunoNaoLeOsDadosDeOutroAluno()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var ana = await api.CadastrarELogarAsync("rn02_ana");
        await api.CadastrarELogarAsync("rn02_bia");

        Assert.Equal(HttpStatusCode.OK, (await ana.GetAsync("/api/usuarios/rn02_ana")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await ana.GetAsync("/api/usuarios/rn02_bia")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await ana.GetAsync("/api/usuarios/rn02_bia/stats-detalhadas")).StatusCode);
    }

    // --- RN03 · Moedas só na loja -------------------------------------------------------------

    [Fact]
    public async Task RN03_BonusCusta50MoedasERecusaSemSaldo()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn03_aluno");

        Assert.Equal(HttpStatusCode.BadRequest, (await aluno.PostAsync("/api/usuarios/bonus/bonus1/comprar", null)).StatusCode);

        foreach (var fase in new[] { "fase1", "fase2", "fase3", "fase4", "fase5" })   // 5 × 10 = 50 moedas
            (await aluno.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId = fase, acertos = 0, total = 0 })).EnsureSuccessStatusCode();

        var compra = await aluno.PostAsync("/api/usuarios/bonus/bonus1/comprar", null);
        Assert.Equal(HttpStatusCode.OK, compra.StatusCode);
        Assert.Equal(0, (await compra.JsonAsync()).GetProperty("moedas").GetInt32());
        Assert.Equal(HttpStatusCode.BadRequest, (await aluno.PostAsync("/api/usuarios/bonus/naoexiste/comprar", null)).StatusCode);
    }

    // --- RN04 · Trilha em ordem ---------------------------------------------------------------

    [Fact]
    public async Task RN04_FasesVemNaOrdemDaTrilha()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();

        var fases = await (await api.CreateClient().GetAsync("/api/fases")).JsonAsync();
        var codigos = fases.EnumerateArray().Select(f => f.GetProperty("codigoFase").GetString()).ToList();

        Assert.Equal("fase1", codigos[0]);
        Assert.True(codigos.IndexOf("fase1") < codigos.IndexOf("fase2") && codigos.IndexOf("fase2") < codigos.IndexOf("fase25"));
    }

    [Fact]
    public async Task RN04_FaseConcluidaFicaGuardadaNoServidor()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn04_aluno");
        (await aluno.PostAsJsonAsync("/api/progresso/concluir-fase", new { faseId = "fase1", acertos = 0, total = 0 })).EnsureSuccessStatusCode();

        // "Quem troca de aparelho continua de onde parou": um login novo vê o mesmo progresso.
        var outroAparelho = await api.LogarAsync("rn04_aluno");
        var perfil = await (await outroAparelho.GetAsync("/api/usuarios/rn04_aluno")).JsonAsync();
        Assert.Equal(5, perfil.GetProperty("xp").GetInt32());
    }

    // --- RN05 · Progresso não volta ----------------------------------------------------------

    [Theory]
    [InlineData(200, 0, 1, HttpStatusCode.OK)]            // sobe até 200 de uma vez: aceito
    [InlineData(201, 0, 1, HttpStatusCode.BadRequest)]    // salto de mais de 200: suspeito
    public async Task RN05_SaltoDeMaisDe200XpERecusado(int xp, int moedas, int nivel, HttpStatusCode esperado)
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn05_aluno");

        Assert.Equal(esperado, (await aluno.PutAsJsonAsync("/api/usuarios/stats", new { xp, moedas, nivel })).StatusCode);
    }

    [Fact]
    public async Task RN05_XpENivelNaoDiminuem()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var aluno = await api.CadastrarELogarAsync("rn05_aluno");
        (await aluno.PutAsJsonAsync("/api/usuarios/stats", new { xp = 150, moedas = 0, nivel = 3 })).EnsureSuccessStatusCode();

        Assert.Equal(HttpStatusCode.BadRequest, (await aluno.PutAsJsonAsync("/api/usuarios/stats", new { xp = 100, moedas = 0, nivel = 3 })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await aluno.PutAsJsonAsync("/api/usuarios/stats", new { xp = 150, moedas = 0, nivel = 1 })).StatusCode);
    }

    // --- RN06 · Sempre um Administrador ------------------------------------------------------

    [Fact]
    public async Task RN06_UltimoAdminNaoPerdeOPerfilNemExcluiAConta()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        var admin = await api.UsuarioComPerfilAsync("rn06_admin", Perfis.Admin);
        var idAdmin = 0;
        await api.NoBancoAsync(async db => idAdmin = (await db.Usuarios.SingleAsync(u => u.Username == "rn06_admin")).Id);

        Assert.Equal(HttpStatusCode.BadRequest, (await admin.PutAsJsonAsync($"/api/admin/usuarios/{idAdmin}/perfil", new { perfil = Perfis.Aluno })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await admin.PostAsJsonAsync("/api/conta/excluir", new { senhaAtual = "Forte!942z" })).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await admin.GetAsync("/api/conta/")).StatusCode);   // a conta continua lá
    }

    // --- RN07 · Senha segura -------------------------------------------------------------------

    [Theory]
    [InlineData("Curta1!")]                                   // 7 caracteres
    [InlineData("rn07_mariaSenha!9")]                         // contém o nome de usuário
    [InlineData("Aa1!aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")]   // 73 caracteres
    public async Task RN07_CadastroRecusaSenhaFraca(string senha)
    {
        await using var api = await ApiEmMemoria.IniciarAsync();

        var r = await api.CreateClient().PostAsJsonAsync("/api/auth/register", new { username = "rn07_maria", email = "rn07@exemplo.test", password = senha });

        Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode);
    }

    [Fact]
    public async Task RN07_SenhaAceitaEGuardadaComBCrypt()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        await api.CadastrarELogarAsync("rn07_joao", "Quadro!Verde2026");

        string hash = "";
        await api.NoBancoAsync(async db => hash = (await db.Usuarios.SingleAsync(u => u.Username == "rn07_joao")).SenhaHash);
        Assert.StartsWith("$2", hash);                       // prefixo do BCrypt
        Assert.DoesNotContain("Quadro!Verde2026", hash);
        Assert.True(BCrypt.Net.BCrypt.Verify("Quadro!Verde2026", hash));
    }

    [Fact]
    public async Task RN07_LoginComSenhaErradaERecusado()
    {
        await using var api = await ApiEmMemoria.IniciarAsync();
        await api.CadastrarELogarAsync("rn07_lia");

        var r = await api.CreateClient().PostAsJsonAsync("/api/auth/login", new { username = "rn07_lia", password = "Errada!123x" });

        Assert.Equal(HttpStatusCode.Unauthorized, r.StatusCode);
    }
}
