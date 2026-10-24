using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexTI_API.Data;
using NexTI_API.Models;
using NexTI_API.Services;
using Xunit;

namespace NexTI_API.Tests
{
    /// <summary>
    /// O prêmio calculado pela API tem de ser o mesmo do site e do app. Os casos vêm de
    /// packages/shared/tests/recompensa-casos.json, gerado do gamificacao.js.
    /// </summary>
    public class RecompensasTests
    {
        private static readonly TabelaDeRecompensas Tabela = TabelaDeRecompensas.Padrao;

        private record PremioEsperado(int Xp, int Moedas);
        private record CasoPremio(string FaseId, int Acertos, int Total, PremioEsperado Esperado);
        private record CasoNivel(int Xp, int Nivel);
        private record Casos(List<CasoPremio> Premios, List<CasoNivel> Niveis);

        private static Casos Ler() => JsonSerializer.Deserialize<Casos>(
            File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "recompensa-casos.json")),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

        public static IEnumerable<object[]> CasosDePremio() =>
            Ler().Premios.Select(c => new object[] { c.FaseId, c.Acertos, c.Total, c.Esperado.Xp, c.Esperado.Moedas });

        public static IEnumerable<object[]> CasosDeNivel() => Ler().Niveis.Select(c => new object[] { c.Xp, c.Nivel });

        private static AppDbContext BancoComAluno(int xp = 0, int moedas = 0, int nivel = 1)
        {
            var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase($"nexti-{Guid.NewGuid()}").Options);
            db.Usuarios.Add(new Usuario { Id = 1, Username = "ana", Email = "ana@nexti.com", SenhaHash = "x", XP = xp, Moedas = moedas, Nivel = nivel });
            db.SaveChanges();
            return db;
        }

        [Theory]
        [MemberData(nameof(CasosDePremio))]
        public void Premio_IgualAoDoSite(string faseId, int acertos, int total, int xp, int moedas)
        {
            Assert.Equal(new Premio(xp, moedas), Tabela.PremioDe(faseId, acertos, total));
        }

        [Theory]
        [MemberData(nameof(CasosDeNivel))]
        public void Nivel_IgualAoDoSite(int xp, int nivel)
        {
            Assert.Equal(nivel, Tabela.NivelPorXp(xp));
        }

        [Fact]
        public async Task ConcluirFase_SomaOPremioCalculadoNoServidor()
        {
            using var db = BancoComAluno(xp: 95, moedas: 3);

            var r = await new GamificacaoService(db).ConcluirFaseAsync(1, "fase1", 0, 0);

            Assert.True(r.Sucesso);
            Assert.Equal(new Premio(5, 10), r.Valor!.Premio);
            Assert.Equal((100, 13, 3), (r.Valor.XP, r.Valor.Moedas, r.Valor.Nivel));   // 100 XP sobe para o nível 3
        }

        [Fact]
        public async Task MesmaFaseDeNovo_NaoPagaOutraVez()
        {
            using var db = BancoComAluno();
            var servico = new GamificacaoService(db);

            var primeira = await servico.ConcluirFaseAsync(1, "fase1", 0, 0);
            var revisao = await servico.ConcluirFaseAsync(1, "fase1", 0, 0);

            Assert.True(primeira.Valor!.PrimeiraVez);
            Assert.False(revisao.Valor!.PrimeiraVez);
            Assert.Equal(new Premio(0, 0), revisao.Valor.Premio);
            Assert.Equal((5, 10), (revisao.Valor.XP, revisao.Valor.Moedas));
            Assert.Single(db.FasesConcluidas);
        }

        [Fact]
        public async Task TesteReprovado_PodeSerRefeito_EPagaQuandoPassa()
        {
            using var db = BancoComAluno();
            var servico = new GamificacaoService(db);

            await servico.ConcluirFaseAsync(1, "teste-mod1", 5, 20);    // reprovado: não conta como concluído
            var aprovado = await servico.ConcluirFaseAsync(1, "teste-mod1", 18, 20);

            Assert.True(aprovado.Valor!.Aprovado);
            Assert.Equal(25, aprovado.Valor.XP);
            Assert.Equal("teste-mod1", Assert.Single(db.FasesConcluidas).CodigoFase);
        }

        [Fact]
        public async Task FaseConcluida_PorUmAluno_NaoAfetaOutro()
        {
            using var db = BancoComAluno();
            db.Usuarios.Add(new Usuario { Id = 2, Username = "bia", Email = "bia@exemplo.test", SenhaHash = "x" });
            await db.SaveChangesAsync();
            var servico = new GamificacaoService(db);

            await servico.ConcluirFaseAsync(1, "fase1", 0, 0);
            var outra = await servico.ConcluirFaseAsync(2, "fase1", 0, 0);

            Assert.True(outra.Valor!.PrimeiraVez);
            Assert.Equal(5, outra.Valor.XP);
        }

        [Fact]
        public async Task TesteReprovado_NaoPaga()
        {
            using var db = BancoComAluno();

            var r = await new GamificacaoService(db).ConcluirFaseAsync(1, "teste-mod5", 14, 20);   // 70%, o corte é 80%

            Assert.False(r.Valor!.Aprovado);
            Assert.Equal(0, r.Valor.XP);
        }

        [Fact]
        public async Task NivelDadoPeloDiagnostico_NaoDesce()
        {
            using var db = BancoComAluno(xp: 0, nivel: 6);

            var r = await new GamificacaoService(db).ConcluirFaseAsync(1, "fase1", 0, 0);

            Assert.Equal(6, r.Valor!.Nivel);
        }

        [Theory]
        [InlineData("fase-inexistente", 0, 0)]
        [InlineData("teste-mod1", 21, 20)]
        [InlineData("teste-mod1", -1, 20)]
        [InlineData("teste-mod1", 5, 500)]
        public async Task PedidoInvalido_ERecusado(string faseId, int acertos, int total)
        {
            using var db = BancoComAluno();

            var r = await new GamificacaoService(db).ConcluirFaseAsync(1, faseId, acertos, total);

            Assert.Equal(TipoFalha.Invalido, r.Falha);
            Assert.Equal(0, (await db.Usuarios.FindAsync(1))!.XP);
        }

        [Fact]
        public async Task ComprarBonus_DescontaAsMoedas()
        {
            using var db = BancoComAluno(moedas: 60);

            var r = await new GamificacaoService(db).ComprarBonusAsync(1, "bonus1");

            Assert.True(r.Sucesso);
            Assert.Equal(60 - Tabela.Bonus["bonus1"].Custo, r.Valor!.Moedas);
        }

        [Fact]
        public async Task ComprarBonus_SemSaldo_ERecusado()
        {
            using var db = BancoComAluno(moedas: 10);

            var r = await new GamificacaoService(db).ComprarBonusAsync(1, "bonus1");

            Assert.Equal(TipoFalha.Invalido, r.Falha);
            Assert.Equal(10, (await db.Usuarios.FindAsync(1))!.Moedas);
        }
    }
}
