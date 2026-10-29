import { useRef, useState } from 'react';
import {
  ApiService,
  aplicarResposta,
  aproveitamento,
  corteDoTeste,
  devolveParaRevisao,
  estadoDaCarta,
  isBonus,
  isCartaEnade,
  isTeste,
  liberaCertificado,
  montarDeckDaFase,
  montarTesteDoModulo,
  passouNoTeste,
  proximaFase,
  qualidadeSm2,
  recompensa,
  somDaResposta,
} from '@nexti/shared';
import { consultarCartasDaFase, confete, gravaJson, nivelParaApi, rankPorXp, som } from './apoio.js';

const TEMPO_TROCA_CARTA = 300;
const TEMPO_REVELA_ENADE = 2200;

/**
 * A fase aberta no painel: o deck, a carta da vez, as respostas e o fim da fase.
 * Some quando o painel fecha (não fica salva, como no vanilla).
 */
export function useSessaoDeEstudo({ userKey, progresso, ui }) {
  const [faseAtiva, setFaseAtiva] = useState(null); // { id, nome }
  const [deck, setDeck] = useState([]);
  const [indice, setIndice] = useState(0);
  const [virada, setVirada] = useState(false);
  const [fim, setFim] = useState(null); // { tipo: 'fase' } | { tipo: 'teste', acertos, total, percentual, passou }
  const [respostaEnade, setRespostaEnade] = useState(null); // { escolhida, correta, acertou, revelada }
  const [avisoRevisao, setAvisoRevisao] = useState(false);
  const deckRevisao = useRef([]);
  const acertosTeste = useRef(0);
  const concluindo = useRef(false); // espera a API: um segundo clique não conclui a fase de novo
  const trocandoCarta = useRef(false);

  const { toast } = ui;

  const fecharPainel = () => {
    setFaseAtiva(null);
    localStorage.removeItem(`${userKey}active_state`);
  };

  /** Cartas da fase: da API quando ela está no ar, senão do deck local; vencidas primeiro. */
  async function cartasDaFase(faseId) {
    if (isTeste(faseId)) return montarTesteDoModulo(faseId, { banco: progresso.decks });
    const cartas = await consultarCartasDaFase({
      faseId, online: progresso.apiOnlineRef.current,
      consultar: (id) => ApiService.getFlashcardsPorFase(id), locais: progresso.decks[faseId],
      salvar: (confirmadas) => progresso.setDecks((atual) => {
        const atualizado = { ...atual, [faseId]: confirmadas };
        gravaJson(`${userKey}decks`, atualizado);
        return atualizado;
      }),
    });
    return montarDeckDaFase(cartas, progresso.srsData, Date.now());
  }

  const carregarAula = async (faseId, nomeAula, { ignorarBloqueio = false } = {}) => {
    if (!ignorarBloqueio && !progresso.faseLiberada(faseId)) {
      som('playError');
      toast('warning', 'Fase trancada', 'Conclua as fases e os testes anteriores para liberar esta.');
      return;
    }

    // clicar de novo na fase aberta fecha o painel, como no vanilla
    if (faseAtiva?.id === faseId) {
      fecharPainel();
      return;
    }

    const cartas = await cartasDaFase(faseId);
    if (!cartas.length) {
      fecharPainel();
      return;
    }

    acertosTeste.current = 0;
    deckRevisao.current = [];
    trocandoCarta.current = false;
    setFaseAtiva({ id: faseId, nome: nomeAula });
    setDeck(cartas);
    setIndice(0);
    setVirada(false);
    setFim(null);
    setRespostaEnade(null);
    setAvisoRevisao(false);
    gravaJson(`${userKey}active_state`, { type: 'aula', id: faseId, title: nomeAula });
  };

  const cartaAtual = fim ? null : deck[indice] ?? null;
  const enade = isCartaEnade(cartaAtual);

  const virarCarta = () => {
    if (!cartaAtual) return;
    if (enade && !respostaEnade?.revelada) return; // no ENADE a carta só vira depois de responder
    som('playFlip');
    setVirada((v) => !v);
  };

  const encerrarDeck = () => {
    if (faseAtiva && isTeste(faseAtiva.id)) {
      const acertos = acertosTeste.current;
      const total = deck.length;
      const passou = passouNoTeste(faseAtiva.id, acertos, total);
      if (passou) {
        som('playLevelUp');
        confete('celebrate');
      } else {
        som('playError');
      }
      setFim({ tipo: 'teste', acertos, total, percentual: aproveitamento(acertos, total), passou });
      return;
    }

    if (deckRevisao.current.length) {
      setDeck([...deckRevisao.current]);
      deckRevisao.current = [];
      setIndice(0);
      setAvisoRevisao(true);
      return;
    }

    som('playLevelUp');
    confete('burst', 50);
    setFim({ tipo: 'fase' });
  };

  const responder = (resultado) => {
    if (!cartaAtual || trocandoCarta.current) return;
    trocandoCarta.current = true;

    som(resultado === 'proxima-teste' ? 'playClick' : somDaResposta(resultado));
    if (devolveParaRevisao(resultado)) deckRevisao.current.push(cartaAtual);

    if (faseAtiva && !isTeste(faseAtiva.id)) {
      const novo = aplicarResposta(estadoDaCarta(progresso.srsData, cartaAtual.frente), resultado);
      progresso.setSrsData((atual) => ({ ...atual, [cartaAtual.frente]: novo }));

      const usuarioId = Number.parseInt(localStorage.getItem('quest_user_id'), 10) || 0;
      if (progresso.apiOnlineRef.current && usuarioId && cartaAtual.id) {
        ApiService.atualizarProgresso(usuarioId, cartaAtual.id, qualidadeSm2(resultado)).catch(() => {
          /* sincronização é melhor-esforço, como no vanilla */
        });
      }
    }

    setVirada(false);
    const proximo = indice + 1;
    setTimeout(() => {
      trocandoCarta.current = false;
      setRespostaEnade(null);
      setAvisoRevisao(false);
      if (proximo < deck.length) setIndice(proximo);
      else encerrarDeck();
    }, TEMPO_TROCA_CARTA);
  };

  const responderEnade = (escolhida) => {
    if (!cartaAtual || respostaEnade) return;
    const correta = cartaAtual.correta;
    const acertou = escolhida === correta;
    som(acertou ? 'playCorrect' : 'playError');
    if (acertou && faseAtiva && isTeste(faseAtiva.id)) acertosTeste.current += 1;

    setRespostaEnade({ escolhida, correta, acertou, revelada: false });
    setTimeout(() => {
      setRespostaEnade((atual) => (atual ? { ...atual, revelada: true } : atual));
      setVirada(true);
    }, TEMPO_REVELA_ENADE);
  };

  /**
   * Manda a conclusão para a API, que paga o prêmio só na primeira vez e devolve o que pagou e os
   * totais. Sem a API, paga na hora pela mesma tabela e envia os totais depois.
   */
  async function pagarPremio(faseId, acertos, total) {
    if (progresso.apiOnlineRef.current) {
      try {
        const r = await ApiService.concluirFase(faseId, acertos, total);
        progresso.setXp(r.xp);
        progresso.setMoedas(r.moedas);
        const novoRank = rankPorXp(progresso.rank, r.xp);
        if (novoRank !== progresso.rank) progresso.definirRank(novoRank);
        return r.premio ?? recompensa(faseId, { acertos, total });
      } catch {
        /* segue pelo cálculo local */
      }
    }
    const premio = recompensa(faseId, { acertos, total });
    const novoXp = progresso.xp + premio.xp;
    const novasMoedas = progresso.moedas + premio.moedas;
    progresso.setXp(novoXp);
    progresso.setMoedas(novasMoedas);
    const novoRank = rankPorXp(progresso.rank, novoXp);
    if (novoRank !== progresso.rank) progresso.definirRank(novoRank);
    if (progresso.apiOnlineRef.current) {
      ApiService.updateUserStats(novoXp, novasMoedas, nivelParaApi(novoRank, novoXp)).catch(() => {});
    }
    return premio;
  }

  /** Concluir fase: entrega XP/moedas, libera a próxima fase e fecha o painel. */
  const concluirRotina = async () => {
    if (!faseAtiva || !fim || concluindo.current) return;
    concluindo.current = true;
    try {
      await concluirAgora();
    } finally {
      concluindo.current = false;
    }
  };

  const concluirAgora = async () => {
    const faseId = faseAtiva.id;
    const total = deck.length;
    const acertos = acertosTeste.current;
    const percentual = aproveitamento(acertos, total);

    if (isTeste(faseId) && !passouNoTeste(faseId, acertos, total)) {
      som('playError');
      toast('error', 'Ainda não foi desta vez', `Você acertou ${percentual}% (o mínimo é ${corteDoTeste(faseId)}%). Revise o módulo e tente de novo.`);
      fecharPainel();
      return;
    }

    const premio = await pagarPremio(faseId, acertos, total);
    const seguinte = proximaFase(faseId);
    const jaLiberada = seguinte && progresso.fasesDesbloqueadas.includes(seguinte);

    if (isTeste(faseId)) {
      if (seguinte) {
        if (!jaLiberada) {
          progresso.liberarFase(seguinte);
          som('playLevelUp');
          confete('burst', 50);
          toast('success', 'Teste aprovado!', `Você acertou ${percentual}% e liberou o próximo módulo (+${premio.xp} XP).`);
        } else {
          toast('success', 'Teste refeito', `Você acertou ${percentual}% (+${premio.xp} XP).`);
        }
      } else if (liberaCertificado(faseId)) {
        localStorage.setItem(`${userKey}certificado_unlocked`, 'true');
        progresso.setCertificadoLiberado(true);
        som('playLevelUp');
        confete('celebrate');
        toast('success', 'Certificado Desbloqueado! 📜', `Parabéns! Aproveitamento de ${percentual}% no ENADE! (+${premio.xp} XP)`);
      }
    } else if (isBonus(faseId)) {
      toast('success', 'Bônus Concluído', `O bônus rendeu +${premio.xp} XP e +${premio.moedas} moedas.`);
    } else if (seguinte) {
      // Prêmio zerado = a API já tinha pagado esta fase antes: é revisão, mesmo que a próxima
      // ainda não estivesse liberada neste aparelho.
      const revisao = !premio.xp && !premio.moedas;
      if (!jaLiberada) {
        progresso.liberarFase(seguinte);
        if (!revisao) som('playLevelUp');
      }
      if (!revisao && !jaLiberada) {
        toast('success', 'Fase concluída! 🔓', `Próxima fase liberada (+${premio.xp} XP, +${premio.moedas} moedas).`);
      } else if (!revisao) {
        toast('info', 'Revisão concluída', `Revisão finalizada (+${premio.xp} XP, +${premio.moedas} moedas).`);
      } else {
        toast('info', 'Revisão concluída', 'O prêmio desta fase já foi recebido; a revisão conta para o SM-2.');
      }
    } else {
      toast('success', 'Prova concluída', `Você terminou a prova do ENADE (+${premio.xp} XP, +${premio.moedas} moedas).`);
    }

    fecharPainel();
  };

  return {
    faseAtiva, deck, indice, cartaAtual, enade, virada, fim, respostaEnade, avisoRevisao,
    carregarAula, virarCarta, responder, responderEnade, concluirRotina,
  };
}
