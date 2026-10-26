import React, { useEffect, useState } from 'react';
import { useEstudo } from '../../context/EstudoContext';

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
