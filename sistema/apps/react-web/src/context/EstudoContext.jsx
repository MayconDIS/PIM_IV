import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  ApiService,
  BANCO_DE_DADOS,
  FASES_INICIAIS,
  ORDEM_FASES,
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
  resultadoDoDiagnostico,
  somDaResposta,
} from '@nexti/shared';
import { AudioEngine } from '@nexti/shared/audio';
import { ConfettiEngine } from '@nexti/shared/confetti';

/**
 * Estado do dashboard — porte do dashboard vanilla original (app.js).
 *
 * As chaves do localStorage, as recompensas, a ordem de desbloqueio e o fluxo
 * das cartas são os mesmos do app vanilla; o que muda é só a forma de pintar
 * a tela (React em vez de manipulação direta do DOM).
 */
const EstudoContext = createContext(null);

const TEMPO_TOAST = 4500;
const TEMPO_SAIDA_TOAST = 300;
const TEMPO_TROCA_CARTA = 300;
const TEMPO_REVELA_ENADE = 2200;

const leJson = (chave, padrao) => {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
};

const gravaJson = (chave, valor) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* modo privado / cota cheia: seguimos só com o estado em memória */
  }
};

/** Mesma verificação de integridade do vanilla: versão antiga ou texto com mojibake volta ao banco canônico. */
function carregarDecks(chave) {
  const salvos = leJson(chave, null);
  let integros = Boolean(salvos?.fase22 && salvos.fase22.length >= 50);
  if (integros) {
    const amostra = JSON.stringify(salvos.fase1 || []) + JSON.stringify(salvos.fase2 || []);
    if (/Ã|Ã§|Ã£|Ã©/.test(amostra)) integros = false;
  }
  if (!integros) return structuredClone(BANCO_DE_DADOS);
  // Fases criadas depois que o deck foi salvo (ex.: provas oficiais do ENADE) entram do banco canônico.
  for (const [faseId, cartas] of Object.entries(BANCO_DE_DADOS)) {
    if (!salvos[faseId]) salvos[faseId] = structuredClone(cartas);
  }
  return salvos;
}

/** Nível enviado à API: o maior entre o que o rank salvo indica e o que o XP garante. */
function nivelParaApi(rotuloRank, xp) {
  let nivel = 1;
  if (rotuloRank.includes('Expert')) nivel = 6;
  else if (rotuloRank.includes('Intermediário')) nivel = 3;
  if (xp >= 300) nivel = Math.max(nivel, 6);
  else if (xp >= 100) nivel = Math.max(nivel, 3);
  return nivel;
}

function rotuloDoNivelDaApi(nivel) {
  if (nivel === 1) return 'Rank: Ingressante';
  if (nivel >= 2 && nivel <= 5) return 'Rank: Intermediário';
  if (nivel > 5) return 'Rank: Expert';
  return `Rank: Nível ${nivel}`;
}

const som = (metodo) => {
  try {
    AudioEngine?.[metodo]?.();
  } catch {
    /* áudio é enfeite: nunca pode derrubar o estudo */
  }
};

const confete = (metodo, ...args) => {
  try {
    ConfettiEngine?.[metodo]?.(...args);
  } catch {
    /* idem */
  }
};

export function EstudoProvider({ children }) {
  const nomeUsuario = localStorage.getItem('quest_user_name') || 'Desenvolvedor';
  const userKey = `quest_${nomeUsuario}_`;

  // --- progresso persistido ------------------------------------------------
  const [xp, setXp] = useState(() => Number.parseInt(localStorage.getItem(`${userKey}xp`), 10) || 0);
  const [moedas, setMoedas] = useState(() => Number.parseInt(localStorage.getItem(`${userKey}coins`), 10) || 0);
  const [rank, setRank] = useState(() => localStorage.getItem(`${userKey}rank`) || 'Rank: Pendente');
  const [srsData, setSrsData] = useState(() => leJson(`${userKey}srs`, {}));
  const [decks, setDecks] = useState(() => carregarDecks(`${userKey}decks`));
  const [fasesDesbloqueadas, setFasesDesbloqueadas] = useState(() =>
    leJson(`${userKey}desbloqueadas`, [...FASES_INICIAIS]),
  );
  const [bonusDesbloqueados, setBonusDesbloqueados] = useState(() => leJson(`${userKey}bonus_unlocked`, []));
  const [certificadoLiberado, setCertificadoLiberado] = useState(
    () => localStorage.getItem(`${userKey}certificado_unlocked`) === 'true',
  );

  // --- sessão de estudo (volátil, como no vanilla) -------------------------
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

  // --- interface -----------------------------------------------------------
  const [toasts, setToasts] = useState([]);
  const [dialogo, setDialogo] = useState(null); // { titulo, mensagem }
  const resolverDialogo = useRef(null);
  const [modal, setModal] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const apiOnlineRef = useRef(false);
  const [audioMudo, setAudioMudo] = useState(() => Boolean(AudioEngine?.isMuted?.()));

  // --- persistência --------------------------------------------------------
  useEffect(() => localStorage.setItem(`${userKey}xp`, String(xp)), [userKey, xp]);
  useEffect(() => localStorage.setItem(`${userKey}coins`, String(moedas)), [userKey, moedas]);
  useEffect(() => gravaJson(`${userKey}srs`, srsData), [userKey, srsData]);
  useEffect(() => gravaJson(`${userKey}decks`, decks), [userKey, decks]);
  useEffect(() => gravaJson(`${userKey}desbloqueadas`, fasesDesbloqueadas), [userKey, fasesDesbloqueadas]);
  useEffect(() => gravaJson(`${userKey}bonus_unlocked`, bonusDesbloqueados), [userKey, bonusDesbloqueados]);

  // --- toasts e diálogo ----------------------------------------------------
  const removerToast = (id) => {
    setToasts((atuais) => atuais.map((t) => (t.id === id ? { ...t, saindo: true } : t)));
    setTimeout(() => setToasts((atuais) => atuais.filter((t) => t.id !== id)), TEMPO_SAIDA_TOAST);
  };

  const toast = (tipo, titulo, mensagem) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((atuais) => [...atuais, { id, tipo, titulo, mensagem, saindo: false }]);
    setTimeout(() => removerToast(id), TEMPO_TOAST);
  };

  /** Substitui o confirm() nativo pelo "Cyber Dialog" do vanilla. */
  const confirmar = (titulo, mensagem) =>
    new Promise((resolve) => {
      resolverDialogo.current = resolve;
      setDialogo({ titulo, mensagem });
    });

  const responderDialogo = (confirmou) => {
    resolverDialogo.current?.(confirmou);
    resolverDialogo.current = null;
    setDialogo(null);
  };

  // --- modais --------------------------------------------------------------
  const abrirModal = (id) => {
    setModal(id);
    gravaJson(`${userKey}active_state`, { type: 'modal', id });
  };

  const fecharModal = () => {
    const estado = leJson(`${userKey}active_state`, null);
    if (estado?.type === 'modal') localStorage.removeItem(`${userKey}active_state`);
    setModal(null);
  };

  // --- áudio ---------------------------------------------------------------
  const alternarAudio = () => {
    if (!AudioEngine) return;
    const mudo = AudioEngine.toggleMute();
    setAudioMudo(mudo);
    if (!mudo) som('playClick');
  };

  // --- fases ---------------------------------------------------------------
  const faseLiberada = (faseId) => fasesDesbloqueadas.includes(faseId) || bonusDesbloqueados.includes(faseId);

  const fecharPainel = () => {
    setFaseAtiva(null);
    localStorage.removeItem(`${userKey}active_state`);
  };

  const carregarAula = async (faseId, nomeAula, { ignorarBloqueio = false } = {}) => {
    if (!ignorarBloqueio && !faseLiberada(faseId)) {
      som('playError');
      toast('warning', 'Acesso Bloqueado', 'Conclua as disciplinas e testes anteriores para desbloquear!');
      return;
    }

    // clicar de novo na fase aberta fecha o painel, como no vanilla
    if (faseAtiva?.id === faseId) {
      fecharPainel();
      return;
    }

    let cartas = [];
    if (isTeste(faseId)) {
      cartas = montarTesteDoModulo(faseId, { banco: decks });
    } else {
      if (apiOnlineRef.current) {
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
      if (!cartas.length) cartas = [...(decks[faseId] ?? [])];
      cartas = montarDeckDaFase(cartas, srsData, Date.now());
    }

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
      const novo = aplicarResposta(estadoDaCarta(srsData, cartaAtual.frente), resultado);
      setSrsData((atual) => ({ ...atual, [cartaAtual.frente]: novo }));

      const usuarioId = Number.parseInt(localStorage.getItem('quest_user_id'), 10) || 0;
      if (apiOnlineRef.current && usuarioId && cartaAtual.id) {
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

    const premio = recompensa(faseId, { acertos, total });
    const novoXp = xp + premio.xp;
    const novasMoedas = moedas + premio.moedas;
    setXp(novoXp);
    setMoedas(novasMoedas);

    let novoRank = rank;
    if (novoXp >= 300) novoRank = 'Rank: Expert';
    else if (novoXp >= 100) novoRank = 'Rank: Intermediário';
    if (novoRank !== rank) {
      setRank(novoRank);
      localStorage.setItem(`${userKey}rank`, novoRank);
    }

    if (apiOnlineRef.current) {
      // O servidor calcula o prêmio e devolve os totais; o site mostra o mesmo valor na hora.
      ApiService.concluirFase(faseId, acertos, total)
        .then((r) => {
          setXp(r.xp);
          setMoedas(r.moedas);
        })
        .catch(() => ApiService.updateUserStats(novoXp, novasMoedas, nivelParaApi(novoRank, novoXp)).catch(() => {}));
    }

    const seguinte = proximaFase(faseId);
    const liberar = (id) => setFasesDesbloqueadas((atual) => (atual.includes(id) ? atual : [...atual, id]));

    if (isTeste(faseId)) {
      if (seguinte) {
        if (!fasesDesbloqueadas.includes(seguinte)) {
          liberar(seguinte);
          som('playLevelUp');
          confete('burst', 50);
          toast('success', 'Novo Acesso Concedido', `Teste concluído com ${percentual}%! (+${premio.xp} XP)`);
        } else {
          toast('success', 'Teste Revisitado', `Aproveitamento: ${percentual}% (+${premio.xp} XP)`);
        }
      } else if (liberaCertificado(faseId)) {
        localStorage.setItem(`${userKey}certificado_unlocked`, 'true');
        setCertificadoLiberado(true);
        som('playLevelUp');
        confete('celebrate');
        toast('success', 'Certificado Desbloqueado! 📜', `Parabéns! Aproveitamento de ${percentual}% no ENADE! (+${premio.xp} XP)`);
      }
    } else if (isBonus(faseId)) {
      toast('success', 'Bônus Concluído', `Conhecimento extra rendeu +${premio.xp} XP e +${premio.moedas} Coins!`);
    } else if (seguinte) {
      if (!fasesDesbloqueadas.includes(seguinte)) {
        liberar(seguinte);
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

  // --- bônus pagos com moedas ---------------------------------------------
  const abrirBonus = async (bonus) => {
    if (bonusDesbloqueados.includes(bonus.id)) {
      carregarAula(bonus.id, bonus.nome);
      return;
    }

    const ok = await confirmar(
      'Transação de Loja',
      `Deseja desbloquear a disciplina bônus "${bonus.nome}" por ${bonus.custoMoedas} Coins?\n\nSaldo atual: ${moedas} Coins.`,
    );
    if (!ok) return;

    if (moedas < bonus.custoMoedas) {
      som('playError');
      toast('error', 'Saldo Insuficiente', `Você possui ${moedas} Coins, mas são necessários ${bonus.custoMoedas} Coins.`);
      return;
    }

    if (apiOnlineRef.current) {
      // Online, quem confere o saldo e desconta é o servidor.
      try {
        const r = await ApiService.comprarBonus(bonus.id);
        setMoedas(r.moedas);
      } catch (erro) {
        som('playError');
        toast('error', 'Compra não concluída', erro.message);
        return;
      }
    } else {
      setMoedas((m) => m - bonus.custoMoedas);
    }
    setBonusDesbloqueados((atual) => [...atual, bonus.id]);
    som('playUnlock');
    toast('success', 'Acesso Concedido', `Disciplina "${bonus.nome}" desbloqueada com sucesso!`);
    carregarAula(bonus.id, bonus.nome, { ignorarBloqueio: true });
  };

  // --- certificado ---------------------------------------------------------
  const abrirCertificado = () => {
    if (!certificadoLiberado) {
      som('playError');
      toast('warning', 'Certificado Bloqueado', 'Conclua o Teste do Módulo 05 (ENADE) com pelo menos 80% de aproveitamento para liberar o certificado.');
      return;
    }
    som('playUnlock');
    abrirModal('modalCertificado');
  };

  // --- diagnóstico de nivelamento -----------------------------------------
  const concluirDiagnostico = (acertos) => {
    const resultado = resultadoDoDiagnostico(acertos);
    localStorage.setItem(`${userKey}nivelado`, 'true');
    localStorage.setItem(`${userKey}rank`, resultado.rotuloRank);
    setFasesDesbloqueadas(resultado.fases);
    setRank(resultado.rotuloRank);

    if (apiOnlineRef.current) {
      ApiService.updateUserStats(xp, moedas, resultado.nivel).catch(() => {});
    }

    som('playLevelUp');
    confete('burst', 60);
    return resultado;
  };

  // --- criação de carta ----------------------------------------------------
  const criarCarta = ({ faseId, frente, verso, dica }) => {
    const fase = String(faseId || '').trim().toLowerCase();
    const f = frente.trim();
    const v = verso.trim();
    const d = dica.trim();

    if (!fase || !f || !v) {
      som('playError');
      toast('warning', 'Campos Obrigatórios', 'Por favor, preencha Frente e Verso da carta.');
      return false;
    }

    setDecks((atual) => ({ ...atual, [fase]: [...(atual[fase] ?? []), { frente: f, verso: v, dica: d }] }));
    if (apiOnlineRef.current) {
      ApiService.criarFlashcard(fase, f, v, d).catch(() => {
        /* fica salvo localmente, como no vanilla */
      });
    }

    som('playUnlock');
    toast('success', 'Flashcard Salvo', 'Novo dado registrado com sucesso na disciplina!');
    return true;
  };

  // --- sessão --------------------------------------------------------------
  const resetarProgresso = async () => {
    const ok = await confirmar(
      'Formatação de Save Data',
      `Usuário logado: ${nomeUsuario}\n\nIsso apagará permanentemente TODO o seu histórico de XP, Moedas, Árvore de Permissões e progresso SM-2.\n\nTem certeza que deseja formatar os dados?`,
    );
    if (!ok) return;
    ['xp', 'coins', 'nivelado', 'desbloqueadas', 'bonus_unlocked', 'decks', 'rank', 'srs', 'map_state',
      'avatar_custom', 'certificado_unlocked', 'active_state']
      .forEach((sufixo) => localStorage.removeItem(userKey + sufixo));
    window.location.reload();
  };

  const deslogar = async () => {
    const ok = await confirmar('Encerrar Sessão', 'Deseja encerrar a sessão atual e retornar à tela de autenticação?');
    if (!ok) return;
    ['quest_user_name', 'quest_jwt_token', 'quest_user_id', 'quest_user_perfil'].forEach((chave) => localStorage.removeItem(chave));
    window.location.reload();
  };

  // --- inicialização: API, diagnóstico e estado restaurado -----------------
  const inicializado = useRef(false);
  useEffect(() => {
    if (inicializado.current) return; // StrictMode monta duas vezes em dev
    inicializado.current = true;

    (async () => {
      let online = false;
      try {
        online = Boolean(await ApiService.checkStatus());
      } catch {
        online = false;
      }
      apiOnlineRef.current = online;
      setApiOnline(online);

      if (online && nomeUsuario !== 'Desenvolvedor' && nomeUsuario !== 'Admin') {
        try {
          const usuario = await ApiService.getUsuario(nomeUsuario);
          if (usuario) {
            const rotulo = rotuloDoNivelDaApi(usuario.nivel);
            setXp(usuario.xp);
            setMoedas(usuario.moedas);
            setRank(rotulo);
            localStorage.setItem(`${userKey}rank`, rotulo);
          }
        } catch {
          /* segue com o que está salvo localmente */
        }

        try {
          const remoto = await ApiService.getProgressoUsuario();
          if (remoto?.length) {
            setSrsData((atual) => {
              const mesclado = { ...atual };
              remoto.forEach((p) => {
                if (!p.frente) return;
                mesclado[p.frente] = {
                  rep: p.repeticoes,
                  interval: p.intervaloDias,
                  ease: p.fatorFacilidade,
                  next: new Date(p.dataProximaRevisao).getTime(),
                };
              });
              return mesclado;
            });
          }
        } catch {
          /* idem */
        }
      }

      if (!localStorage.getItem(`${userKey}nivelado`)) {
        setModal('modalNivelamento');
        return;
      }

      const ativo = leJson(`${userKey}active_state`, null);
      if (ativo?.type === 'modal' && ativo.id !== 'modalCertificado') setModal(ativo.id);
      else if (ativo?.type === 'aula' && ORDEM_FASES.concat(bonusDesbloqueados).includes(ativo.id)) {
        carregarAula(ativo.id, ativo.title);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valor = {
    nomeUsuario,
    userKey,
    xp,
    moedas,
    rank,
    srsData,
    decks,
    fasesDesbloqueadas,
    bonusDesbloqueados,
    certificadoLiberado,
    faseAtiva,
    deck,
    indice,
    cartaAtual,
    enade,
    virada,
    fim,
    respostaEnade,
    avisoRevisao,
    toasts,
    dialogo,
    modal,
    apiOnline,
    audioMudo,
    faseLiberada,
    carregarAula,
    virarCarta,
    responder,
    responderEnade,
    concluirRotina,
    abrirBonus,
    abrirCertificado,
    concluirDiagnostico,
    criarCarta,
    resetarProgresso,
    deslogar,
    abrirModal,
    fecharModal,
    alternarAudio,
    toast,
    removerToast,
    confirmar,
    responderDialogo,
    som,
    confete,
  };

  return <EstudoContext.Provider value={valor}>{children}</EstudoContext.Provider>;
}

export function useEstudo() {
  const contexto = useContext(EstudoContext);
  if (!contexto) throw new Error('useEstudo deve ser usado dentro de um EstudoProvider');
  return contexto;
}
