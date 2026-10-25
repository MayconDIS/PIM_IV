import React from 'react';
import { useEstudo } from '../../context/EstudoContext';

/** Porte de `mostrarToast` (app.js): mesmas classes, ícones e animação de saída. */
const ICONES = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };

export function Toasts() {
  const { toasts, removerToast } = useEstudo();

  return (
    <section id="toast-container" aria-label="Avisos" aria-live="polite">
      {/* Erro é anunciado na hora (alert); os outros esperam o leitor terminar a frase (status). */}
      {toasts.map((t) => (
        <article key={t.id} role={t.tipo === 'error' ? 'alert' : 'status'} className={`toast-item toast-${t.tipo}${t.saindo ? ' toast-leaving' : ''}`}>
          <span className="material-symbols-outlined toast-icon" style={{ fontSize: '1.3rem' }} aria-hidden="true">
            {ICONES[t.tipo] ?? 'info'}
          </span>
          <div className="toast-content">
            <strong className="toast-title">{t.titulo}</strong>
            <p className="toast-message">{t.mensagem}</p>
          </div>
          <button type="button" className="toast-close" aria-label={`Fechar o aviso: ${t.titulo}`} title="Fechar" onClick={() => removerToast(t.id)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }} aria-hidden="true">close</span>
          </button>
        </article>
      ))}
    </section>
  );
}
