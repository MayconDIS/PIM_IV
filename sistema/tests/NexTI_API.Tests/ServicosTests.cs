using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Endpoints;
using NexTI_API.Models;
using NexTI_API.Services;
using Xunit;

namespace NexTI_API.Tests
{
    /// <summary>Camada de serviços contra um banco em memória: a regra de negócio sem HTTP.</summary>
    public class ServicosTests
    {
        private const string SenhaForte = "Estudar#Muito2026";
        private static readonly ChaveJwt Chave = new(Encoding.ASCII.GetBytes("chave_de_teste_com_pelo_menos_32_caracteres"));

        private static AppDbContext NovoBanco() =>
            new(new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"nexti-{Guid.NewGuid()}")
                .Options);

        private static AuthService NovoAuth(AppDbContext db) => new(db, new PoliticaDeSenha(), Chave);

        // --- AuthService ---

        [Fact]
        public async Task Cadastro_NormalizaEGravaSenhaComHash()
        {
            using var db = NovoBanco();

            var resultado = await NovoAuth(db).CadastrarAsync("  aluno_01 ", " aluno@nexti.com ", SenhaForte);

            Assert.True(resultado.Sucesso);
            var gravado = await db.Usuarios.SingleAsync();
            Assert.Equal("aluno_01", gravado.Username);
            Assert.Equal("aluno@nexti.com", gravado.Email);
            Assert.NotEqual(SenhaForte, gravado.SenhaHash);
            Assert.True(BCrypt.Net.BCrypt.Verify(SenhaForte, gravado.SenhaHash));
        }

        [Fact]
        public async Task Cadastro_RecusaNicknameEEmailRepetidos()
        {
            using var db = NovoBanco();
            var auth = NovoAuth(db);
            await auth.CadastrarAsync("aluno_01", "aluno@nexti.com", SenhaForte);

            var mesmoNick = await auth.CadastrarAsync("aluno_01", "outro@nexti.com", SenhaForte);
            var mesmoEmail = await auth.CadastrarAsync("aluno_02", "aluno@nexti.com", SenhaForte);

            Assert.Equal(TipoFalha.Invalido, mesmoNick.Falha);
            Assert.Equal("Este nickname já está em uso.", mesmoNick.Mensagem);
            Assert.Equal("Este e-mail já está cadastrado.", mesmoEmail.Mensagem);
            Assert.Equal(1, await db.Usuarios.CountAsync());
        }

        [Fact]
        public async Task Cadastro_RecusaSenhaFraca()
        {
            using var db = NovoBanco();

            var resultado = await NovoAuth(db).CadastrarAsync("aluno_01", "aluno@nexti.com", "fraca");

            Assert.Equal(TipoFalha.Invalido, resultado.Falha);
            Assert.StartsWith("A senha ainda precisa de:", resultado.Mensagem);
            Assert.Empty(db.Usuarios);
        }

        [Fact]
        public async Task Login_PorNicknameOuEmail_GeraTokenComOsDadosDoUsuario()
        {
            using var db = NovoBanco();
            var auth = NovoAuth(db);
            await auth.CadastrarAsync("aluno_01", "aluno@nexti.com", SenhaForte);

            var porNick = await auth.EntrarAsync("aluno_01", SenhaForte);
            var porEmail = await auth.EntrarAsync("aluno@nexti.com", SenhaForte);

            Assert.True(porNick.Sucesso);
            Assert.True(porEmail.Sucesso);
            var token = new JwtSecurityTokenHandler().ReadJwtToken(porNick.Valor!.Token);
            Assert.Equal(AuthService.Emissor, token.Issuer);
            Assert.Contains(AuthService.Publico, token.Audiences);
            Assert.Contains(token.Claims, c => c.Value == "aluno_01");
        }

        [Fact]
        public async Task Login_ComSenhaErrada_NaoAutoriza()
        {
            using var db = NovoBanco();
            var auth = NovoAuth(db);
            await auth.CadastrarAsync("aluno_01", "aluno@nexti.com", SenhaForte);

            var resultado = await auth.EntrarAsync("aluno_01", "Senha#Errada2026");

            Assert.Equal(TipoFalha.NaoAutorizado, resultado.Falha);
            Assert.Null(resultado.Valor);
        }

        // --- ProgressoService ---

        [Fact]
        public async Task PrimeiraResposta_CriaProgressoEAplicaSm2()
        {
            using var db = NovoBanco();
            var progresso = new ProgressoService(db, new Sm2Engine());

            var registro = await progresso.RegistrarRespostaAsync(usuarioId: 1, flashcardId: 7, qualidade: 5);

            Assert.Equal(1, registro.Repeticoes);
            Assert.Equal(3, registro.IntervaloDias);   // Fácil numa carta nova: 3 dias, como no site
            Assert.Equal(DateTime.UtcNow.Date.AddDays(3), registro.DataProximaRevisao);
            Assert.Equal(1, await db.Progresso_Flashcards.CountAsync());
        }

        [Fact]
        public async Task RespostasSeguidas_AtualizamOMesmoRegistro()
        {
            using var db = NovoBanco();
            var progresso = new ProgressoService(db, new Sm2Engine());

            await progresso.RegistrarRespostaAsync(1, 7, 5);
            var segunda = await progresso.RegistrarRespostaAsync(1, 7, 4);

            Assert.Equal(2, segunda.Repeticoes);
            Assert.Equal(8, segunda.IntervaloDias);   // Bom: 3 dias × fator 2,65 = 7,95 → 8
            Assert.Equal(1, await db.Progresso_Flashcards.CountAsync());
        }

        [Fact]
        public async Task Estatisticas_SeparamCartasMadurasDasEmAprendizado()
        {
            using var db = NovoBanco();
            db.Usuarios.Add(new Usuario { Id = 1, Username = "aluno_01", Email = "a@nexti.com", SenhaHash = "x" });
            db.Progresso_Flashcards.AddRange(
                new ProgressoFlashcard { UsuarioId = 1, FlashcardId = 1, IntervaloDias = 30, FatorFacilidade = 2.6 },
                new ProgressoFlashcard { UsuarioId = 1, FlashcardId = 2, IntervaloDias = 6, FatorFacilidade = 2.4 });
            await db.SaveChangesAsync();

            var resultado = await new ProgressoService(db, new Sm2Engine()).EstatisticasAsync("aluno_01");

            Assert.True(resultado.Sucesso);
            Assert.Equal(2, resultado.Valor!.TotalEstudados);
            Assert.Equal(1, resultado.Valor.CartasMaduras);
            Assert.Equal(1, resultado.Valor.CartasEmAprendizado);
            Assert.Equal(2.5, resultado.Valor.FacilidadeMedia);
        }

        [Fact]
        public async Task Estatisticas_DeUsuarioInexistente_NaoEncontrado()
        {
            using var db = NovoBanco();

            var resultado = await new ProgressoService(db, new Sm2Engine()).EstatisticasAsync("ninguem");

            Assert.Equal(TipoFalha.NaoEncontrado, resultado.Falha);
        }

        // --- GamificacaoService ---

        [Fact]
        public async Task Gamificacao_GravaRecompensaValida()
        {
            using var db = NovoBanco();
            db.Usuarios.Add(new Usuario { Id = 1, Username = "aluno_01", Email = "a@nexti.com", SenhaHash = "x", XP = 100, Moedas = 10 });
            await db.SaveChangesAsync();

            var resultado = await new GamificacaoService(db).AtualizarAsync(1, xp: 150, moedas: 20, nivel: 2);

            Assert.True(resultado.Sucesso);
            var usuario = await db.Usuarios.SingleAsync();
            Assert.Equal((150, 20, 2), (usuario.XP, usuario.Moedas, usuario.Nivel));
        }

        [Fact]
        public async Task Gamificacao_RecusaTrapacaSemAlterarOBanco()
        {
            using var db = NovoBanco();
            db.Usuarios.Add(new Usuario { Id = 1, Username = "aluno_01", Email = "a@nexti.com", SenhaHash = "x", XP = 100 });
            await db.SaveChangesAsync();

            var resultado = await new GamificacaoService(db).AtualizarAsync(1, xp: 5000, moedas: 0, nivel: 1);

            Assert.Equal(TipoFalha.Invalido, resultado.Falha);
            Assert.Equal(100, (await db.Usuarios.SingleAsync()).XP);
        }

        [Fact]
        public async Task Ranking_OrdenaPorXpELimitaOTamanho()
        {
            using var db = NovoBanco();
            foreach (var (nome, xp) in new[] { ("ana", 50), ("bia", 300), ("caio", 120) })
                db.Usuarios.Add(new Usuario { Username = nome, Email = $"{nome}@nexti.com", SenhaHash = "x", XP = xp });
            await db.SaveChangesAsync();

            var resumo = await new GamificacaoService(db).ResumoAsync(tamanhoDoRanking: 2);

            Assert.Equal(3, resumo.TotalUsuarios);
            Assert.Equal(new[] { "bia", "caio" }, resumo.TopAlunos.Select(a => a.Username));
        }

        // --- ConteudoService ---

        [Fact]
        public async Task CriarFlashcard_EmFaseInexistente_ERecusado()
        {
            using var db = NovoBanco();

            var resultado = await new ConteudoService(db).CriarFlashcardAsync("fase_x", "Frente", "Verso", null);

            Assert.Equal(TipoFalha.Invalido, resultado.Falha);
            Assert.Empty(db.Flashcards);
        }

        [Fact]
        public async Task CriarFlashcard_NormalizaOsCampos()
        {
            using var db = NovoBanco();
            db.Fases.Add(new Fase { CodigoFase = "logica", Descricao = "Lógica" });
            await db.SaveChangesAsync();

            var resultado = await new ConteudoService(db).CriarFlashcardAsync("  LOGICA ", "  O que é SM-2? ", " Repetição espaçada ", "   ");

            Assert.True(resultado.Sucesso);
            Assert.Equal("logica", resultado.Valor!.CodigoFase);
            Assert.Equal("O que é SM-2?", resultado.Valor.Frente);
            Assert.Equal("Repetição espaçada", resultado.Valor.Verso);
            Assert.Null(resultado.Valor.Dica);
        }

        // --- Endpoints: tradução de falha em HTTP ---

        [Fact]
        public void ParaHttp_TraduzCadaFalhaNoStatusCerto()
        {
            int Status(Resultado<int> r) =>
                ((Microsoft.AspNetCore.Http.IStatusCodeHttpResult)EndpointExtensions.ParaHttp(r, v => Microsoft.AspNetCore.Http.Results.Ok(v))).StatusCode!.Value;

            Assert.Equal(200, Status(Resultado<int>.Ok(1)));
            Assert.Equal(400, Status(Resultado<int>.Erro(TipoFalha.Invalido, "x")));
            Assert.Equal(404, Status(Resultado<int>.Erro(TipoFalha.NaoEncontrado, "x")));
            Assert.Equal(401, Status(Resultado<int>.Erro(TipoFalha.NaoAutorizado)));
        }

        [Fact]
        public void IdDoUsuario_LeOClaimDoToken()
        {
            var comId = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, "42") }));
            var invalido = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, "abc") }));

            Assert.Equal(42, EndpointExtensions.IdDoUsuario(comId));
            Assert.Null(EndpointExtensions.IdDoUsuario(invalido));
            Assert.Null(EndpointExtensions.IdDoUsuario(new ClaimsPrincipal()));
        }
    }
}
