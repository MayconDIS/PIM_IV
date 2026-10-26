using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Nodes;
using NexTI.Desktop.Aplicacao;
using NexTI.Desktop.Dominio.Regras;
using NexTI.Desktop.Infraestrutura.Dados;

namespace NexTI.Desktop.Testes;

/// <summary>
/// Os casos de uso de ponta a ponta, passando por todas as camadas de verdade
/// (serviços → repositórios EF Core → SQLite em memória, com a migration e o conteúdo reais).
/// </summary>
public sealed class CasosDeUsoTestes : IDisposable
{
    private class RelogioFixo : IRelogio
    {
        public DateOnly Hoje { get; set; } = new(2026, 10, 27);
    }

    private readonly SqliteConnection _conexao = new("Data Source=:memory:");
    private readonly RelogioFixo _relogio = new();
    private ContextoNexTI _contexto;
    private ServicoDeAlunos _alunos = null!;
    private ServicoDeEstudo _estudo = null!;

    public CasosDeUsoTestes()
    {
        _conexao.Open();   // o banco em memória vive enquanto a conexão estiver aberta
        _contexto = AbrirContexto();
        _contexto.Database.Migrate();
        SemeadorDeConteudo.Semear(_contexto, Path.Combine(AppContext.BaseDirectory, "Dados", "conteudo.json"));
        MontarServicos();
    }

    private ContextoNexTI AbrirContexto() => new(new DbContextOptionsBuilder<ContextoNexTI>().UseSqlite(_conexao).Options);

    private void MontarServicos()
    {
        var unidade = new UnidadeDeTrabalho(_contexto);
        _alunos = new ServicoDeAlunos(new RepositorioDeAlunos(_contexto), unidade);
        _estudo = new ServicoDeEstudo(new RepositorioDeFases(_contexto), new RepositorioDeRevisoes(_contexto), unidade,
            new AgendadorSm2(), TabelaDeRecompensas.Carregar(Path.Combine(AppContext.BaseDirectory, "Dados", "recompensas.json")), _relogio);
    }

    /// <summary>Fecha o contexto e abre outro no mesmo banco, como se o programa fosse aberto de novo.</summary>
    private void ReabrirPrograma()
    {
        _contexto.Dispose();
        _contexto = AbrirContexto();
        MontarServicos();
    }

    public void Dispose()
    {
        _contexto.Dispose();
        _conexao.Dispose();
    }

    private void EstudarTudo(Dominio.Entidades.Aluno aluno, SessaoDeEstudo sessao, Resposta resposta = Resposta.Bom)
    {
        while (!sessao.Terminou) _estudo.Responder(aluno, sessao, resposta);
    }

    [Fact]
    public void Semente_TrazAsFasesDaTrilhaComAsCartasDoSite()
    {
        var fases = _estudo.ListarFases(_alunos.Entrar("maycon"));

        var semente = JsonNode.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Dados", "conteudo.json")))!;
        var codigos = semente["fases"]!.AsArray().Select(f => f!["codigo"]!.GetValue<string>())
            .Where(c => c.StartsWith("fase")).ToArray();
        Assert.Equal(codigos, fases.Select(f => f.Codigo));
        Assert.Equal("fase1", fases[0].Codigo);
        Assert.All(fases, f => Assert.True(f.TotalDeCartas > 0, $"{f.Codigo} sem cartas"));
    }

    [Fact]
    public void Entrar_ComOMesmoNickname_VoltaOMesmoAluno()
    {
        var primeiro = _alunos.Entrar("maycon");
        ReabrirPrograma();
        var segundo = _alunos.Entrar(" maycon ");

        Assert.Equal(primeiro.Id, segundo.Id);
    }

    [Fact]
    public void Trilha_SoAPrimeiraFaseComecaLiberada()
    {
        var aluno = _alunos.Entrar("maycon");
        var fases = _estudo.ListarFases(aluno);

        Assert.True(fases[0].Liberada);
        Assert.All(fases.Skip(1), f => Assert.False(f.Liberada));
        Assert.Throws<InvalidOperationException>(() => _estudo.IniciarSessao(aluno, "fase2"));
    }

    [Fact]
    public void ConcluirFase_PagaUmaVezLiberaAProximaEGuardaNoBanco()
    {
        var aluno = _alunos.Entrar("maycon");
        var sessao = _estudo.IniciarSessao(aluno, "fase1");
        EstudarTudo(aluno, sessao);

        var primeira = _estudo.ConcluirFase(aluno, sessao);

        Assert.True(primeira.PrimeiraVez);
        Assert.Equal(new Premio(5, 10), primeira.Premio);
        Assert.NotNull(primeira.FaseLiberada);

        ReabrirPrograma();
        aluno = _alunos.Entrar("maycon");
        Assert.Equal(5, aluno.Xp);
        Assert.Equal(10, aluno.Moedas);
        Assert.True(_estudo.ListarFases(aluno)[1].Liberada);

        var revisao = _estudo.IniciarSessao(aluno, "fase1");
        EstudarTudo(aluno, revisao);
        var segunda = _estudo.ConcluirFase(aluno, revisao);

        Assert.False(segunda.PrimeiraVez);
        Assert.Equal(Premio.Nenhum, segunda.Premio);
        Assert.Equal(5, aluno.Xp);
    }

    [Fact]
    public void ConcluirFase_ComCartasFaltando_ERecusado()
    {
        var aluno = _alunos.Entrar("maycon");
        var sessao = _estudo.IniciarSessao(aluno, "fase1");

        Assert.Throws<InvalidOperationException>(() => _estudo.ConcluirFase(aluno, sessao));
    }

    [Fact]
    public void Responder_GravaORevisaoEAsVencidasVemPrimeiro()
    {
        var aluno = _alunos.Entrar("maycon");
        var sessao = _estudo.IniciarSessao(aluno, "fase1");
        var primeira = sessao.CartaAtual!;
        _estudo.Responder(aluno, sessao, Resposta.Bom);     // carta nova + Bom: volta em 1 dia

        ReabrirPrograma();
        aluno = _alunos.Entrar("maycon");
        _relogio.Hoje = _relogio.Hoje.AddDays(1);

        Assert.Equal(1, _estudo.ListarFases(aluno)[0].ParaRevisarHoje);
        Assert.Equal(primeira.Id, _estudo.IniciarSessao(aluno, "fase1").CartaAtual!.Id);
    }

    private static string SementeComDisciplinaInserida()
    {
        var conteudo = JsonNode.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Dados", "conteudo.json")))!;
        conteudo["fases"]!.AsArray().Insert(1, new JsonObject { ["codigo"] = "faseExtra", ["descricao"] = "Disciplina nova" });
        conteudo["flashcards"]!.AsArray().Add(new JsonObject { ["codigoFase"] = "fase1", ["frente"] = "Conceito novo do semestre", ["verso"] = "Nova explicação" });
        conteudo["flashcards"]!.AsArray().Add(new JsonObject { ["codigoFase"] = "faseExtra", ["frente"] = "Conceito da disciplina nova", ["verso"] = "Explicação" });
        var caminho = Path.GetTempFileName();
        File.WriteAllText(caminho, conteudo.ToJsonString());
        return caminho;
    }

    [Fact]
    public void SementeIncremental_PreservaIdsRevisoesPremiosECartasDoAluno()
    {
        var aluno = _alunos.Entrar("atualizacao");
        var sessao = _estudo.IniciarSessao(aluno, "fase1");
        var primeiraCarta = sessao.CartaAtual!.Id;
        EstudarTudo(aluno, sessao);
        _estudo.ConcluirFase(aluno, sessao);
        var revisaoAntes = _contexto.Revisoes.Single(r => r.AlunoId == aluno.Id && r.FlashcardId == primeiraCarta);
        var dataAntes = revisaoAntes.ProximaRevisao;
        var idAntes = revisaoAntes.Id;
        _contexto.Flashcards.Add(new Dominio.Entidades.Flashcard("fase1", "Carta escrita pelo aluno", "Resposta pessoal", null));
        _contexto.SaveChanges();
        var quantidade = _contexto.Flashcards.Count();
        var caminho = SementeComDisciplinaInserida();
        try
        {
            Assert.Equal(1, SemeadorDeConteudo.Semear(_contexto, caminho));
            Assert.Equal(0, SemeadorDeConteudo.Semear(_contexto, caminho));
            Assert.Equal(quantidade + 2, _contexto.Flashcards.Count());
            Assert.Equal(2, _contexto.Fases.Single(f => f.Codigo == "faseExtra").Ordem);
            ReabrirPrograma();
            aluno = _alunos.Entrar("atualizacao");
            var revisao = _contexto.Revisoes.Single(r => r.AlunoId == aluno.Id && r.FlashcardId == primeiraCarta);
            Assert.Equal(idAntes, revisao.Id);
            Assert.Equal(dataAntes, revisao.ProximaRevisao);
            Assert.Equal(5, aluno.Xp);
            Assert.Equal(10, aluno.Moedas);
            Assert.True(aluno.JaConcluiu("fase1"));
            Assert.Contains(_contexto.Flashcards, c => c.Frente == "Carta escrita pelo aluno");
            var revisaoSessao = _estudo.IniciarSessao(aluno, "fase1");
            EstudarTudo(aluno, revisaoSessao);
            Assert.Equal(Premio.Nenhum, _estudo.ConcluirFase(aluno, revisaoSessao).Premio);
        }
        finally { File.Delete(caminho); }
    }

    [Fact]
    public void SementeAtualizada_CorrigeTextoSemPerderIdentidadeProgressoOuCartasExtras()
    {
        var aluno = _alunos.Entrar("conteudoatual");
        var sessao = _estudo.IniciarSessao(aluno, "fase1");
        var carta = sessao.CartaAtual!;
        EstudarTudo(aluno, sessao);
        _estudo.ConcluirFase(aluno, sessao);
        var revisaoAntes = _contexto.Revisoes.AsNoTracking().Single(r => r.AlunoId == aluno.Id && r.FlashcardId == carta.Id);
        var conclusaoAntes = _contexto.FasesConcluidas.AsNoTracking().Single(f => f.AlunoId == aluno.Id);
        var extra = new Dominio.Entidades.Flashcard("fase1", "Carta fora da fonte", "Resposta preservada", "Dica preservada");
        _contexto.Flashcards.Add(extra);
        _contexto.SaveChanges();
        var idsAntes = _contexto.Flashcards.OrderBy(c => c.Id).Select(c => c.Id).ToArray();
        var conteudo = JsonNode.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Dados", "conteudo.json")))!;
        var atualizada = conteudo["flashcards"]!.AsArray().First(c =>
            c!["codigoFase"]!.GetValue<string>() == carta.CodigoFase && c["frente"]!.GetValue<string>() == carta.Frente)!;
        atualizada["verso"] = "Explicação corrigida da disciplina";
        atualizada["dica"] = "Mod_01 · Material atualizado";
        var caminho = Path.GetTempFileName();
        try
        {
            File.WriteAllText(caminho, conteudo.ToJsonString());
            Assert.Equal(0, SemeadorDeConteudo.Semear(_contexto, caminho));
            Assert.Equal(0, SemeadorDeConteudo.Semear(_contexto, caminho));
            ReabrirPrograma();
            aluno = _alunos.Entrar("conteudoatual");
            var salva = _contexto.Flashcards.Single(c => c.Id == carta.Id);
            Assert.Equal(carta.Frente, salva.Frente);
            Assert.Equal(carta.CodigoFase, salva.CodigoFase);
            Assert.Equal("Explicação corrigida da disciplina", salva.Verso);
            Assert.Equal("Mod_01 · Material atualizado", salva.Dica);
            Assert.Equal(idsAntes, _contexto.Flashcards.OrderBy(c => c.Id).Select(c => c.Id).ToArray());
            var revisao = _contexto.Revisoes.Single(r => r.AlunoId == aluno.Id && r.FlashcardId == carta.Id);
            Assert.Equal(revisaoAntes.Id, revisao.Id);
            Assert.Equal(revisaoAntes.Repeticoes, revisao.Repeticoes);
            Assert.Equal(revisaoAntes.IntervaloDias, revisao.IntervaloDias);
            Assert.Equal(revisaoAntes.FatorFacilidade, revisao.FatorFacilidade);
            Assert.Equal(revisaoAntes.ProximaRevisao, revisao.ProximaRevisao);
            Assert.Equal(conclusaoAntes.Id, _contexto.FasesConcluidas.Single(f => f.AlunoId == aluno.Id).Id);
            Assert.Equal(5, aluno.Xp);
            Assert.Equal(10, aluno.Moedas);
            Assert.True(_estudo.ListarFases(aluno).Single(f => f.Codigo == "fase2").Liberada);
            var cartaExtra = _contexto.Flashcards.Single(c => c.Id == extra.Id);
            Assert.Equal("Resposta preservada", cartaExtra.Verso);
            Assert.Equal("Dica preservada", cartaExtra.Dica);
            atualizada["dica"] = null;
            File.WriteAllText(caminho, conteudo.ToJsonString());
            SemeadorDeConteudo.Semear(_contexto, caminho);
            ReabrirPrograma();
            Assert.Null(_contexto.Flashcards.Single(c => c.Id == carta.Id).Dica);
        }
        finally { File.Delete(caminho); }
    }

    [Fact]
    public void DisciplinaJaIniciada_NaoTrancaQuandoUmaNovaEInseridaAntes()
    {
        var aluno = _alunos.Entrar("retomada");
        var primeira = _estudo.IniciarSessao(aluno, "fase1");
        EstudarTudo(aluno, primeira);
        _estudo.ConcluirFase(aluno, primeira);
        var segunda = _estudo.IniciarSessao(aluno, "fase2");
        _estudo.Responder(aluno, segunda, Resposta.Bom);
        var caminho = SementeComDisciplinaInserida();
        try
        {
            SemeadorDeConteudo.Semear(_contexto, caminho);
            ReabrirPrograma();
            aluno = _alunos.Entrar("retomada");
            Assert.True(_estudo.ListarFases(aluno).Single(f => f.Codigo == "fase2").Liberada);
            Assert.NotNull(_estudo.IniciarSessao(aluno, "fase2").CartaAtual);
            var novo = _alunos.Entrar("alunonovo");
            Assert.False(_estudo.ListarFases(novo).Single(f => f.Codigo == "fase2").Liberada);
            Assert.False(_estudo.ListarFases(novo).Single(f => f.Codigo == "faseExtra").Liberada);
        }
        finally { File.Delete(caminho); }
    }
}
