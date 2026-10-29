import React, { createContext, useContext } from 'react';
import { confete, som } from './estudo/apoio.js';
import { useAcoesDoAluno } from './estudo/useAcoesDoAluno.js';
import { useInicializacao } from './estudo/useInicializacao.js';
import { useInterface } from './estudo/useInterface.js';
import { useProgresso } from './estudo/useProgresso.js';
import { useSessaoDeEstudo } from './estudo/useSessaoDeEstudo.js';

/**
 * Estado do dashboard — porte do dashboard vanilla original (app.js).
 *
 * As chaves do localStorage, as recompensas, a ordem de desbloqueio e o fluxo
 * das cartas são os mesmos do app vanilla. O estado fica dividido em partes,
 * cada uma num arquivo da pasta estudo/:
 * - useInterface: avisos, diálogo, modal aberto e áudio;
 * - useProgresso: o que fica salvo (XP, moedas, rank, SM-2, decks, fases liberadas);
 * - useSessaoDeEstudo: a fase aberta (deck, respostas, concluir a fase);
 * - useAcoesDoAluno: bônus, certificado, nivelamento, criar carta, apagar dados e sair;
 * - useInicializacao: o que roda ao abrir o painel.
 * Os componentes continuam usando só o useEstudo(), com o mesmo objeto de antes.
 */
const EstudoContext = createContext(null);

export function EstudoProvider({ children }) {
  const nomeUsuario = localStorage.getItem('quest_user_name') || 'Desenvolvedor';
  const userKey = `quest_${nomeUsuario}_`;

  const ui = useInterface(userKey);
  const progresso = useProgresso(userKey);
  const sessao = useSessaoDeEstudo({ userKey, progresso, ui });
  const acoes = useAcoesDoAluno({ nomeUsuario, userKey, progresso, ui, sessao });
  useInicializacao({ nomeUsuario, userKey, progresso, ui, sessao });

  const valor = {
    nomeUsuario,
    userKey,
    xp: progresso.xp,
    moedas: progresso.moedas,
    rank: progresso.rank,
    diagnostico: progresso.diagnostico,
    srsData: progresso.srsData,
    decks: progresso.decks,
    fasesDesbloqueadas: progresso.fasesDesbloqueadas,
    bonusDesbloqueados: progresso.bonusDesbloqueados,
    certificadoLiberado: progresso.certificadoLiberado,
    avatar: progresso.avatar,
    trocarAvatar: progresso.trocarAvatar,
    apiOnline: progresso.apiOnline,
    faseLiberada: progresso.faseLiberada,
    faseAtiva: sessao.faseAtiva,
    deck: sessao.deck,
    indice: sessao.indice,
    cartaAtual: sessao.cartaAtual,
    enade: sessao.enade,
    virada: sessao.virada,
    fim: sessao.fim,
    respostaEnade: sessao.respostaEnade,
    avisoRevisao: sessao.avisoRevisao,
    carregarAula: sessao.carregarAula,
    virarCarta: sessao.virarCarta,
    responder: sessao.responder,
    responderEnade: sessao.responderEnade,
    concluirRotina: sessao.concluirRotina,
    ...acoes,
    toasts: ui.toasts,
    dialogo: ui.dialogo,
    modal: ui.modal,
    audioMudo: ui.audioMudo,
    abrirModal: ui.abrirModal,
    fecharModal: ui.fecharModal,
    alternarAudio: ui.alternarAudio,
    toast: ui.toast,
    removerToast: ui.removerToast,
    confirmar: ui.confirmar,
    responderDialogo: ui.responderDialogo,
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
