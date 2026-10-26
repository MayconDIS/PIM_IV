import React from 'react';
import { useEstudo } from '../../context/EstudoContext';

/** Porte de `confirmarCyberDialog` (app.js): o confirm() estilizado do Nex_TI. */
export function CyberDialog() {
  const { dialogo, responderDialogo } = useEstudo();

  return (
    <div
      className={`cyber-dialog-overlay${dialogo ? ' show' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cyber-dialog-title"
    >
      <div className="cyber-dialog-box">
        <div className="cyber-dialog-title tech-font" id="cyber-dialog-title">
          <span className="material-symbols-outlined text-cyan" aria-hidden="true">terminal</span> {dialogo?.titulo ?? 'Confirmação'}
        </div>
        <div className="cyber-dialog-desc" style={{ whiteSpace: 'pre-line' }}>
          {dialogo?.mensagem ?? 'Deseja prosseguir com esta operação?'}
        </div>
        <div className="cyber-dialog-actions tech-font">
          <button className="cyber-dialog-btn-cancel" onClick={() => responderDialogo(false)}>CANCELAR</button>
          <button className="cyber-dialog-btn-confirm" onClick={() => responderDialogo(true)}>CONFIRMAR</button>
        </div>
      </div>
    </div>
  );
}
