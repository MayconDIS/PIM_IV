import React from 'react';

/**
 * Moldura `.modal-overlay` > `.modal-content` do dashboard vanilla.
 * Sem `onFechar`, o modal não mostra o botão X (caso do diagnóstico).
 */
export function Modal({ aberto, escuro = false, classeConteudo = '', classeCabecalho = '', classeTitulo = '', icone, titulo, onFechar, children }) {
  if (!aberto) return null;

  return (
    <div className={`modal-overlay${escuro ? ' modal-overlay-dark' : ''} show`}>
      <div className={`modal-content ${classeConteudo}`.trim()}>
        <div className={`modal-header ${classeCabecalho}`.trim()}>
          <h2 className={`${classeTitulo} flex-align`.trim()}>
            <span className="material-symbols-outlined modal-title-icon">{icone}</span> {titulo}
          </h2>
          {onFechar && (
            <button className="btn-close flex-align" onClick={onFechar} title="Fechar">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
