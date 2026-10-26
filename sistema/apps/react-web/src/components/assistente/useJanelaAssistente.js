import { useEffect, useState } from 'react';

/** Mantém a janela dentro da área visível quando o teclado do celular abre. */
export function useJanelaAssistente(aberto) {
  const [janela, setJanela] = useState({ altura: window.innerHeight, teclado: 0 });
  useEffect(() => {
    const visual = window.visualViewport;
    const atualizar = () => setJanela({
      altura: visual?.height ?? window.innerHeight,
      teclado: Math.max(0, window.innerHeight - (visual?.height ?? window.innerHeight) - (visual?.offsetTop ?? 0)),
    });
    atualizar();
    window.addEventListener('resize', atualizar);
    visual?.addEventListener('resize', atualizar);
    visual?.addEventListener('scroll', atualizar);
    return () => {
      window.removeEventListener('resize', atualizar);
      visual?.removeEventListener('resize', atualizar);
      visual?.removeEventListener('scroll', atualizar);
    };
  }, [aberto]);
  return janela;
}

/** O botão cede espaço quando passaria por cima dos comandos de uma carta no celular. */
export function useEvitarControles(aberto, faseAtiva) {
  const [sobreControles, setSobreControles] = useState(false);
  useEffect(() => {
    const conferir = () => {
      if (aberto || !faseAtiva || window.innerWidth > 800) {
        setSobreControles(false);
        return;
      }
      const botao = document.querySelector('.assistente-abrir')?.getBoundingClientRect();
      const comandos = document.querySelectorAll('#right-panel .game-controls, #right-panel .btn-proxima');
      setSobreControles(Boolean(botao && [...comandos].some(comando => {
        const r = comando.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.left < botao.right && r.right > botao.left && r.top < botao.bottom && r.bottom > botao.top;
      })));
    };
    conferir();
    window.addEventListener('scroll', conferir, { passive: true });
    window.addEventListener('resize', conferir);
    const painel = document.getElementById('right-panel');
    const observador = new ResizeObserver(conferir);
    if (painel) observador.observe(painel);
    return () => {
      window.removeEventListener('scroll', conferir);
      window.removeEventListener('resize', conferir);
      observador.disconnect();
    };
  }, [aberto, faseAtiva]);
  return sobreControles;
}
