import React, { useEffect, useRef, useState } from 'react';
import { ORDEM_FASES } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { alternarAltoContraste } from '../../lib/acessibilidade';
import { montarMapaNeural } from '../../lib/mapaNeural';
import { Modal } from '../ui/Modal';

export function ModalMapaNeural() {
  const { modal, fecharModal } = useEstudo();
  const aberto = modal === 'modalMapaMental';

  return (
    <Modal
      aberto={aberto}
      escuro
      classeConteudo="modal-mapa"
      classeCabecalho="modal-header-purple"
      classeTitulo="text-purple"
      icone="hub"
      titulo="Mapa Neural"
      onFechar={fecharModal}
    >
      {aberto && <Teia />}
    </Modal>
  );
}

function Teia() {
  const { nomeUsuario, userKey, decks, srsData, fasesDesbloqueadas } = useEstudo();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mapaRef = useRef(null);
  const [controlesAbertos, setControlesAbertos] = useState(false);

  // monta uma vez por abertura: o mapa é uma foto do progresso naquele momento
  useEffect(() => {
    mapaRef.current = montarMapaNeural(containerRef.current, canvasRef.current, {
      nomeUsuario,
      chaveSave: `${userKey}map_state`,
      ordemFases: ORDEM_FASES,
      decks,
      srsData,
      fasesDesbloqueadas,
    });
    return () => mapaRef.current?.destruir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal-body modal-body-mapa" ref={containerRef}>
      <div className="neural-canvas" ref={canvasRef} />
      <div className={`a11y-widget map-a11y-widget${controlesAbertos ? ' open' : ''}`}>
        <button className="a11y-toggle flex-align-center" onClick={() => setControlesAbertos((v) => !v)} title="Controles da Câmera">
          <span className="material-symbols-outlined large-icon">settings_overscan</span>
        </button>
        <div className="a11y-options">
          <button className="btn-action tech-font flex-align-center" title="Afastar (Zoom Out)" onClick={() => mapaRef.current?.afastar()}>
            <span className="material-symbols-outlined">zoom_out</span>
          </button>
          <button className="btn-action tech-font flex-align-center" title="Aproximar (Zoom In)" onClick={() => mapaRef.current?.aproximar()}>
            <span className="material-symbols-outlined">zoom_in</span>
          </button>
          <button className="btn-action tech-font flex-align-center" title="Centralizar Câmera" onClick={() => mapaRef.current?.centralizar()}>
            <span className="material-symbols-outlined">filter_center_focus</span>
          </button>
          <button className="btn-action tech-font flex-align-center" title="Alternar Alto Contraste" onClick={alternarAltoContraste}>
            <span className="material-symbols-outlined">contrast</span>
          </button>
        </div>
      </div>
    </div>
  );
}
