import React from 'react';
import { useEstudo } from '../../context/EstudoContext';

/** Porte de `mostrarToast` (app.js): mesmas classes, ícones e animação de saída. */
const ICONES = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };

export function Toasts() {
  const { toasts, removerToast } = useEstudo();

  return (
    <div id="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-${t.tipo}${t.saindo ? ' toast-leaving' : ''}`}>
          <span className="material-symbols-outlined toast-icon" style={{ fontSize: '1.3rem' }}>
            {ICONES[t.tipo] ?? 'info'}
          </span>
          <div className="toast-content">
            <div className="toast-title">{t.titulo}</div>
            <div className="toast-message">{t.mensagem}</div>
          </div>
          <button className="toast-close" title="Fechar" onClick={() => removerToast(t.id)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
