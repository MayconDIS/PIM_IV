import React, { useEffect, useLayoutEffect, useRef } from 'react';
import '@nexti/shared/css/global.css';
import '@nexti/shared/css/dashboard.css';
import { EstudoProvider, useEstudo } from '../context/EstudoContext';
import { aplicarPreferencias } from '../lib/acessibilidade';
import { Topo } from '../components/dashboard/Topo';
import { PainelUsuario } from '../components/dashboard/PainelUsuario';
import { Trilhas } from '../components/dashboard/Trilhas';
import { Rodape } from '../components/dashboard/Rodape';
import { BotaoTopo } from '../components/dashboard/Flutuantes';
import { NavegacaoCelular } from '../components/dashboard/NavegacaoCelular';
import { ModalCriacao } from '../components/modais/ModalCriacao';
import { ModalAdmin } from '../components/modais/ModalAdmin';
import { ModalConta } from '../components/modais/ModalConta';
import { ModalProgresso } from '../components/modais/ModalProgresso';
import { ModalNivelamento } from '../components/modais/ModalNivelamento';
import { ModalMapaNeural } from '../components/modais/ModalMapaNeural';
import { ModalTrilha } from '../components/modais/ModalTrilha';
import { ModalCertificado } from '../components/modais/ModalCertificado';
import { Toasts } from '../components/ui/Toasts';
import { CyberDialog } from '../components/ui/CyberDialog';
import { AssistenteNexTI } from '../components/assistente/AssistenteNexTI';

/** Atalhos de teclado do vanilla: Esc, "/" e Espaço/1–4 durante o estudo. */
function useAtalhos(refBusca) {
  const estudo = useEstudo();
  const atual = useRef(estudo);
  atual.current = estudo;

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.target.closest?.('[data-assistente-nexti]')) return;
      const s = atual.current;
      const editando = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

      if (e.key === 'Escape') {
        if (s.dialogo) s.responderDialogo(false);
        else if (s.modal) s.fecharModal();
        return;
      }

      if (e.key === '/' && !editando) {
        if (s.modal || s.dialogo) return;
        e.preventDefault();
        refBusca.current?.focus();
        refBusca.current?.select();
        return;
      }

      if (!s.faseAtiva || !s.cartaAtual || s.enade || editando || s.modal || s.dialogo || e.target.closest?.('.resumo-disciplina')) return;
      // Com o foco num botão (uma fase, a carta), o Espaço é dele: não vira a carta por aqui também.
      const emBotao = document.activeElement?.matches?.('button, [role="button"], a[href]');
      if (e.code === 'Space' && emBotao) return;

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
      <ModalTrilha />
      <ModalCertificado />
      <ModalAdmin />
      <ModalConta />

      <Rodape />
      <BotaoTopo />
      <NavegacaoCelular />
      <AssistenteNexTI />
      <Toasts />
      <CyberDialog />
    </>
  );
}

export default function DashboardPage() {
  useLayoutEffect(() => {
    document.title = 'Nex_TI';
    aplicarPreferencias();
    // Posiciona depois das preferências e antes de exibir o painel, sem rolagem animada.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <EstudoProvider>
      <Dashboard />
    </EstudoProvider>
  );
}
