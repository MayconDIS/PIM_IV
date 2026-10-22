import React, { useEffect, useRef } from 'react';
import '@nexti/shared/css/global.css';
import '@nexti/shared/css/dashboard.css';
import { EstudoProvider, useEstudo } from '../context/EstudoContext';
import { aplicarPreferencias } from '../lib/acessibilidade';
import { Topo } from '../components/dashboard/Topo';
import { PainelUsuario } from '../components/dashboard/PainelUsuario';
import { Trilhas } from '../components/dashboard/Trilhas';
import { Rodape } from '../components/dashboard/Rodape';
import { BotaoTopo, WidgetAcessibilidade } from '../components/dashboard/Flutuantes';
import { ModalCriacao } from '../components/modais/ModalCriacao';
import { ModalAdmin } from '../components/modais/ModalAdmin';
import { ModalProgresso } from '../components/modais/ModalProgresso';
import { ModalNivelamento } from '../components/modais/ModalNivelamento';
import { ModalMapaNeural } from '../components/modais/ModalMapaNeural';
import { ModalCertificado } from '../components/modais/ModalCertificado';
import { Toasts } from '../components/ui/Toasts';
import { CyberDialog } from '../components/ui/CyberDialog';

/** Atalhos de teclado do vanilla: Esc, "/" e Espaço/1–4 durante o estudo. */
function useAtalhos(refBusca) {
  const estudo = useEstudo();
  const atual = useRef(estudo);
  atual.current = estudo;

  useEffect(() => {
    const aoTeclar = (e) => {
      const s = atual.current;
      const editando = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

      if (e.key === 'Escape') {
        if (s.dialogo) s.responderDialogo(false);
        else if (s.modal) s.fecharModal();
        return;
      }

      if (e.key === '/' && !editando) {
        e.preventDefault();
        refBusca.current?.focus();
        refBusca.current?.select();
        return;
      }

      if (!s.faseAtiva || !s.cartaAtual || s.enade || editando || s.modal || s.dialogo) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!s.virada) s.virarCarta();
        else s.responder('good');
      } else if (s.virada) {
        const mapa = { 1: 'again', 2: 'hard', 3: 'good', 4: 'easy' };
        if (mapa[e.key]) s.responder(mapa[e.key]);
      }
    };

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [refBusca]);
}

function Dashboard() {
  const refBusca = useRef(null);
  useAtalhos(refBusca);

  return (
    <>
      <Topo />
      <main className="container" role="main" aria-label="Dashboard Principal">
        <PainelUsuario />
        <div className="main-content">
          <Trilhas refBusca={refBusca} />
        </div>
      </main>

      <ModalCriacao />
      <ModalProgresso />
      <ModalNivelamento />
      <ModalMapaNeural />
      <ModalCertificado />
      <ModalAdmin />

      <Rodape />
      <BotaoTopo />
      <WidgetAcessibilidade />
      <Toasts />
      <CyberDialog />
    </>
  );
}

export default function DashboardPage() {
  useEffect(() => {
    document.title = 'Nex_TI';
    window.scrollTo(0, 0);
    aplicarPreferencias();
  }, []);

  return (
    <EstudoProvider>
      <Dashboard />
    </EstudoProvider>
  );
}
