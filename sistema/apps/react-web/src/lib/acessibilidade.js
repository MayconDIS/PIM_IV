/**
 * Zoom de texto e alto contraste — porte da seção 7 de app.js.
 * Atuam direto no <html>/<body>, como no vanilla, e lembram a escolha no localStorage.
 */

const ZOOM_MIN = 80;
const ZOOM_MAX = 150;

const ler = (chave) => {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
};

const gravar = (chave, valor) => {
  try {
    localStorage.setItem(chave, String(valor));
  } catch {
    /* sem persistência, segue valendo nesta sessão */
  }
};

let zoomAtual = Number.parseInt(ler('quest_zoom'), 10) || 100;
let altoContraste = ler('quest_high_contrast') === 'true';

/**
 * onKeyDown para um elemento que não é <button> mas age como um (role="button"): Enter e Espaço
 * fazem o mesmo que o clique, como num botão de verdade (WAI-ARIA, padrão "button").
 */
export function ativarComTeclado(acao, teclas = ['Enter', ' ']) {
  return (e) => {
    if (!teclas.includes(e.key)) return;
    e.preventDefault();
    acao(e);
  };
}

export function aplicarPreferencias() {
  document.documentElement.style.fontSize = `${zoomAtual}%`;
  document.body.classList.toggle('high-contrast-mode', altoContraste);
}

export function mudarZoom(direcao) {
  if (direcao > 0 && zoomAtual < ZOOM_MAX) zoomAtual += 10;
  else if (direcao < 0 && zoomAtual > ZOOM_MIN) zoomAtual -= 10;
  document.documentElement.style.fontSize = `${zoomAtual}%`;
  gravar('quest_zoom', zoomAtual);
}

export function alternarAltoContraste() {
  altoContraste = !altoContraste;
  document.body.classList.toggle('high-contrast-mode', altoContraste);
  gravar('quest_high_contrast', altoContraste);
}
