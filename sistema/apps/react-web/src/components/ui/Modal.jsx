import React, { useEffect, useId, useRef } from 'react';

/**
 * Moldura das janelas do painel: `.modal-overlay` > `<section role="dialog">`.
 * O leitor de tela anuncia "diálogo" com o título; ao abrir, o foco entra na janela e, ao fechar,
 * volta para onde estava. Sem `onFechar`, o modal não mostra o botão X (caso do diagnóstico).
 */
export function Modal({ aberto, escuro = false, classeConteudo = '', classeCabecalho = '', classeTitulo = '', icone, titulo, onFechar, children }) {
  const idTitulo = useId();
  const janela = useRef(null);
  // Quem tinha o foco ao abrir é lido aqui, na renderização: os efeitos dos filhos (que podem pôr
  // o foco num campo da janela) rodam antes do efeito deste componente.
  const focoAntes = useRef(null);
  if (!aberto) focoAntes.current = null;
  else if (!focoAntes.current) focoAntes.current = document.activeElement;

  useEffect(() => {
    if (!aberto) return undefined;
    if (!janela.current?.contains(document.activeElement)) janela.current?.focus();
    return () => focoAntes.current?.focus?.();
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className={`modal-overlay${escuro ? ' modal-overlay-dark' : ''} show`}>
      <section
        ref={janela}
        className={`modal-content ${classeConteudo}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
      >
        <header className={`modal-header ${classeCabecalho}`.trim()}>
          <h2 id={idTitulo} className={`${classeTitulo} flex-align`.trim()}>
            <span className="material-symbols-outlined modal-title-icon" aria-hidden="true">{icone}</span> {titulo}
          </h2>
          {onFechar && (
            <button type="button" className="btn-close flex-align" onClick={onFechar} aria-label="Fechar janela" title="Fechar">
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          )}
        </header>
        {children}
      </section>
    </div>
  );
}
