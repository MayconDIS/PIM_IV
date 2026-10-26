import { useRef, useState } from 'react';
import { AudioEngine } from '@nexti/shared/audio';
import { gravaJson, leJson, som } from './apoio.js';

const TEMPO_TOAST = 4500;
const TEMPO_SAIDA_TOAST = 300;

/** Avisos (toasts), o diálogo de confirmação, o modal aberto e o áudio. */
export function useInterface(userKey) {
  const [toasts, setToasts] = useState([]);
  const [dialogo, setDialogo] = useState(null); // { titulo, mensagem }
  const resolverDialogo = useRef(null);
  const [modal, setModal] = useState(null);
  // A janela foi aberta pelo menu do cabeçalho: no celular, a barra do rodapé fica escondida até ela fechar.
  const [modalDoMenu, setModalDoMenu] = useState(false);
  const [audioMudo, setAudioMudo] = useState(() => Boolean(AudioEngine?.isMuted?.()));

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

  const abrirModal = (id, { peloMenu = false } = {}) => {
    setModal(id);
    setModalDoMenu(peloMenu);
    gravaJson(`${userKey}active_state`, { type: 'modal', id });
  };

  const fecharModal = () => {
    const estado = leJson(`${userKey}active_state`, null);
    if (estado?.type === 'modal') localStorage.removeItem(`${userKey}active_state`);
    setModal(null);
    setModalDoMenu(false);
  };

  const alternarAudio = () => {
    if (!AudioEngine) return;
    const mudo = AudioEngine.toggleMute();
    setAudioMudo(mudo);
    if (!mudo) som('playClick');
  };

  return {
    toasts, dialogo, modal, modalDoMenu, audioMudo, setModal,
    removerToast, toast, confirmar, responderDialogo, abrirModal, fecharModal, alternarAudio,
  };
}
