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
import { confete, gravaJson, nivelParaApi, rankPorXp, som } from './apoio.js';

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
  const trocandoCarta = useRef(false);

  const { toast } = ui;

  const fecharPainel = () => {
    setFaseAtiva(null);
    localStorage.removeItem(`${userKey}active_state`);
  };

  /** Cartas da fase: da API quando ela está no ar, senão do deck local; vencidas primeiro. */
  async function cartasDaFase(faseId) {
    if (isTeste(faseId)) return montarTesteDoModulo(faseId, { banco: progresso.decks });
    let cartas = [];
    if (progresso.apiOnlineRef.current) {
      try {
        const daApi = await ApiService.getFlashcardsPorFase(faseId);
        if (daApi?.length) {
          cartas = daApi.map((c) => ({
            id: c.id,
            frente: c.frente,
            verso: c.verso,
            dica: c.dica,
            ...(c.opcoes ? { opcoes: Array.isArray(c.opcoes) ? c.opcoes : String(c.opcoes).split(';'), correta: c.correta } : {}),
          }));
        }
      } catch {
        /* API fora do ar: seguimos com o deck local */
      }
    }
    if (!cartas.length) cartas = [...(progresso.decks[faseId] ?? [])];
    return montarDeckDaFase(cartas, progresso.srsData, Date.now());
  }

  const carregarAula = async (faseId, nomeAula, { ignorarBloqueio = false } = {}) => {
    if (!ignorarBloqueio && !progresso.faseLiberada(faseId)) {
      som('playError');
      toast('warning', 'Acesso Bloqueado', 'Conclua as disciplinas e testes anteriores para desbloquear!');
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

  /** Paga o prêmio na hora e manda a conclusão para a API, que devolve os totais calculados lá. */
  function pagarPremio(faseId, acertos, total) {
    const premio = recompensa(faseId, { acertos, total });
    const novoXp = progresso.xp + premio.xp;
    const novasMoedas = progresso.moedas + premio.moedas;
    progresso.setXp(novoXp);
    progresso.setMoedas(novasMoedas);

    const novoRank = rankPorXp(progresso.rank, novoXp);
    if (novoRank !== progresso.rank) progresso.definirRank(novoRank);

    if (progresso.apiOnlineRef.current) {
      ApiService.concluirFase(faseId, acertos, total)
        .then((r) => {
          progresso.setXp(r.xp);
          progresso.setMoedas(r.moedas);
        })
        .catch(() => ApiService.updateUserStats(novoXp, novasMoedas, nivelParaApi(novoRank, novoXp)).catch(() => {}));
    }
    return premio;
  }

  /** CONCLUIR_ROTINA(): entrega XP/moedas, libera a próxima fase e fecha o painel. */
  const concluirRotina = () => {
    if (!faseAtiva || !fim) return;
    const faseId = faseAtiva.id;
    const total = deck.length;
    const acertos = acertosTeste.current;
    const percentual = aproveitamento(acertos, total);

    if (isTeste(faseId) && !passouNoTeste(faseId, acertos, total)) {
      som('playError');
      toast('error', 'Acesso Negado', `Aproveitamento de ${percentual}% (mínimo: ${corteDoTeste(faseId)}%). Estude o módulo e tente novamente!`);
      fecharPainel();
      return;
    }

    const premio = pagarPremio(faseId, acertos, total);
    const seguinte = proximaFase(faseId);
    const jaLiberada = seguinte && progresso.fasesDesbloqueadas.includes(seguinte);

    if (isTeste(faseId)) {
      if (seguinte) {
        if (!jaLiberada) {
          progresso.liberarFase(seguinte);
          som('playLevelUp');
          confete('burst', 50);
          toast('success', 'Novo Acesso Concedido', `Teste concluído com ${percentual}%! (+${premio.xp} XP)`);
        } else {
          toast('success', 'Teste Revisitado', `Aproveitamento: ${percentual}% (+${premio.xp} XP)`);
        }
      } else if (liberaCertificado(faseId)) {
        localStorage.setItem(`${userKey}certificado_unlocked`, 'true');
        progresso.setCertificadoLiberado(true);
        som('playLevelUp');
        confete('celebrate');
        toast('success', 'Certificado Desbloqueado! 📜', `Parabéns! Aproveitamento de ${percentual}% no ENADE! (+${premio.xp} XP)`);
      }
    } else if (isBonus(faseId)) {
      toast('success', 'Bônus Concluído', `Conhecimento extra rendeu +${premio.xp} XP e +${premio.moedas} Coins!`);
    } else if (seguinte) {
      if (!jaLiberada) {
        progresso.liberarFase(seguinte);
        som('playLevelUp');
        toast('success', 'Missão Concluída! 🔓', `Novo nível liberado! (+${premio.xp} XP, +${premio.moedas} Coins)`);
      } else {
        toast('info', 'Revisão Concluída', `Revisão finalizada (+${premio.xp} XP, +${premio.moedas} Coins)`);
      }
    } else {
      toast('success', 'ENADE Concluído', `Missão finalizada! (+${premio.xp} XP, +${premio.moedas} Coins)`);
    }

    fecharPainel();
  };

  return {
    faseAtiva, deck, indice, cartaAtual, enade, virada, fim, respostaEnade, avisoRevisao,
    carregarAula, virarCarta, responder, responderEnade, concluirRotina,
  };
}
