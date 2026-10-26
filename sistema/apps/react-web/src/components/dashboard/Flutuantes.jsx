import React, { useEffect, useState } from 'react';
import { useEstudo } from '../../context/EstudoContext';
import { alternarAltoContraste, mudarZoom } from '../../lib/acessibilidade';

/** Widget de acessibilidade fixo no canto (A-, A+, alto contraste). */
export function WidgetAcessibilidade() {
  const [aberto, setAberto] = useState(false);
  return (
    <div className={`a11y-widget${aberto ? ' open' : ''}`}>
      <button className="a11y-toggle flex-align-center" onClick={() => setAberto((v) => !v)} title="Acessibilidade">
        <span className="material-symbols-outlined large-icon" aria-hidden="true">accessibility_new</span>
      </button>
      <div className="a11y-options">
        <button className="btn-action tech-font flex-align-center" onClick={() => mudarZoom(-1)} title="Diminuir Texto">A-</button>
        <button className="btn-action tech-font flex-align-center" onClick={() => mudarZoom(1)} title="Aumentar Texto">A+</button>
        <button className="btn-action tech-font flex-align-center" onClick={alternarAltoContraste} title="Alternar Alto Contraste">
          <span className="material-symbols-outlined" aria-hidden="true">contrast</span>
        </button>
      </div>
    </div>
  );
}

/** Botão "voltar ao topo" (seção 6 de app.js): some no celular enquanto há uma fase aberta. */
export function BotaoTopo() {
  const { faseAtiva } = useEstudo();
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 300);
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  const estudandoNoCelular = faseAtiva && window.innerWidth <= 600;
  return (
    <button
      id="btn-voltar-topo"
      title="Voltar ao topo"
      style={{ display: rolou && !estudandoNoCelular ? 'flex' : 'none' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <span className="material-symbols-outlined" aria-hidden="true">keyboard_arrow_up</span>
    </button>
  );
}
