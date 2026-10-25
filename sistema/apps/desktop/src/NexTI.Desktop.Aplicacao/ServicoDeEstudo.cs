using NexTI.Desktop.Dominio.Entidades;
using NexTI.Desktop.Dominio.Regras;
using NexTI.Desktop.Dominio.Repositorios;

namespace NexTI.Desktop.Aplicacao;

/// <summary>
/// Casos de uso do estudo: ver as fases, abrir uma fase, responder as cartas e concluir a fase.
/// Só conversa com as interfaces do domínio; não sabe que por baixo existe EF Core ou SQLite.
/// </summary>
public class ServicoDeEstudo
{
    private readonly IRepositorioDeFases _fases;
    private readonly IRepositorioDeRevisoes _revisoes;
    private readonly IUnidadeDeTrabalho _unidade;
    private readonly IAgendadorDeRevisao _agendador;
    private readonly TabelaDeRecompensas _recompensas;
    private readonly IRelogio _relogio;

    public ServicoDeEstudo(IRepositorioDeFases fases, IRepositorioDeRevisoes revisoes, IUnidadeDeTrabalho unidade,
        IAgendadorDeRevisao agendador, TabelaDeRecompensas recompensas, IRelogio relogio)
    {
        _fases = fases;
        _revisoes = revisoes;
        _unidade = unidade;
        _agendador = agendador;
        _recompensas = recompensas;
        _relogio = relogio;
    }

    public PainelDoAluno Painel(Aluno aluno) => new(aluno.Nickname, aluno.Perfil, aluno.Xp, aluno.Moedas,
        _recompensas.NivelPorXp(aluno.Xp), aluno.FasesConcluidas.Count, _fases.ListarComCartas().Count);

    /// <summary>As fases na ordem da trilha. A primeira começa liberada; cada fase concluída libera a seguinte.</summary>
    public IReadOnlyList<ResumoDaFase> ListarFases(Aluno aluno)
    {
        var revisoes = _revisoes.DoAluno(aluno.Id).ToDictionary(r => r.FlashcardId);
        var hoje = _relogio.Hoje;
        var lista = new List<ResumoDaFase>();
        var anteriorConcluida = true;
        foreach (var fase in _fases.ListarComCartas())
        {
            var paraRevisar = fase.Cartas.Count(c => revisoes.TryGetValue(c.Id, out var r) && r.VenceAte(hoje));
            var concluida = aluno.JaConcluiu(fase.Codigo);
            lista.Add(new ResumoDaFase(fase.Codigo, fase.Descricao, fase.Cartas.Count, paraRevisar, concluida, anteriorConcluida || concluida));
            anteriorConcluida = concluida;
        }
        return lista;
    }

    /// <summary>Abre a fase: primeiro as cartas vencidas, depois as novas e por fim as que ainda não venceram.</summary>
    public SessaoDeEstudo IniciarSessao(Aluno aluno, string codigoFase)
    {
        var resumo = ListarFases(aluno).FirstOrDefault(f => f.Codigo == codigoFase)
                     ?? throw new InvalidOperationException($"Fase {codigoFase} não existe.");
        if (!resumo.Liberada) throw new InvalidOperationException("Conclua a fase anterior para liberar esta.");

        var fase = _fases.ObterComCartas(codigoFase)!;
        var revisoes = _revisoes.DoAluno(aluno.Id).ToDictionary(r => r.FlashcardId);
        var hoje = _relogio.Hoje;
        var ordem = fase.Cartas
            .OrderBy(c => !revisoes.TryGetValue(c.Id, out var r) ? 1 : r.VenceAte(hoje) ? 0 : 2)
            .ThenBy(c => revisoes.TryGetValue(c.Id, out var r) ? r.ProximaRevisao : DateOnly.MinValue)
            .ThenBy(c => c.Id);
        return new SessaoDeEstudo(fase, ordem);
    }

    /// <summary>Registra a resposta da carta da vez no SM-2 e grava.</summary>
    public void Responder(Aluno aluno, SessaoDeEstudo sessao, Resposta resposta)
    {
        var carta = sessao.Avancar(resposta);
        var revisao = _revisoes.DoAluno(aluno.Id).FirstOrDefault(r => r.FlashcardId == carta.Id);
        if (revisao is null)
        {
            revisao = new Revisao(aluno.Id, carta.Id);
            _revisoes.Adicionar(revisao);
        }
        revisao.Registrar(resposta, _agendador, _relogio.Hoje);
        _unidade.Salvar();
    }

    /// <summary>Fecha a fase: paga XP e moedas só na primeira conclusão e diz qual fase foi liberada.</summary>
    public ResultadoDaConclusao ConcluirFase(Aluno aluno, SessaoDeEstudo sessao)
    {
        if (!sessao.Terminou) throw new InvalidOperationException("Ainda há cartas para responder.");

        var nivelAntes = _recompensas.NivelPorXp(aluno.Xp);
        var premio = _recompensas.PremioDe(sessao.Fase.Codigo);
        var primeiraVez = aluno.ReceberPremio(sessao.Fase.Codigo, premio);
        _unidade.Salvar();

        var proxima = _fases.ListarComCartas().FirstOrDefault(f => f.Ordem > sessao.Fase.Ordem);
        return new ResultadoDaConclusao(primeiraVez ? premio : Premio.Nenhum, primeiraVez, nivelAntes,
            _recompensas.NivelPorXp(aluno.Xp), primeiraVez ? proxima?.Descricao : null);
    }
}
