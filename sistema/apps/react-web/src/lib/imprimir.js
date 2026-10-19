/**
 * Abre o diálogo de impressão do navegador com um documento próprio — dali o
 * aluno escolhe "Salvar como PDF". Porte do `imprimirDocumento` do CasalFlow.
 *
 * - iframe fora da tela, e não `window.open`: bloqueador de pop-up mata a
 *   janela nova em silêncio e o botão "não faz nada".
 * - O iframe tem tamanho de A4 e fica VISÍVEL (só deslocado): com
 *   `visibility: hidden`, `display: none` ou tamanho zero o navegador não pinta
 *   e a folha sai em branco.
 * - Espera fontes e imagens antes de imprimir, senão a folha sai sem elas.
 */
const ESTILO_QUADRO = Object.freeze({
  position: 'fixed',
  left: '-10000px',
  top: '0',
  width: '297mm',
  height: '210mm',
  border: '0',
});

export function imprimirDocumento(html, { aoFalhar } = {}) {
  const quadro = document.createElement('iframe');
  quadro.setAttribute('aria-hidden', 'true');
  quadro.setAttribute('title', 'Documento para impressão');
  quadro.setAttribute('tabindex', '-1');
  Object.assign(quadro.style, ESTILO_QUADRO);

  const remover = () => quadro.remove();

  const esperarRecursos = async (doc) => {
    const imagens = Array.from(doc?.images || []).map((img) => (img.complete
      ? Promise.resolve()
      : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; })));
    // fontes do Google demoram; limite de 3 s para não travar o botão
    const fontes = doc?.fonts?.ready ?? Promise.resolve();
    await Promise.race([Promise.all([...imagens, fontes]), new Promise((r) => setTimeout(r, 3000))]);
  };

  quadro.onload = () => {
    esperarRecursos(quadro.contentDocument).then(() => {
      // dois quadros: garante que o CSS já foi aplicado ao layout
      requestAnimationFrame(() => requestAnimationFrame(() => {
        try {
          quadro.contentWindow.focus();
          quadro.contentWindow.print();
        } catch (erro) {
          console.error('[impressão] o diálogo não abriu', { motivo: erro?.message });
          aoFalhar?.(erro);
        }
        // O Safari devolve antes de o usuário responder: remover na hora cancelaria.
        setTimeout(remover, 2000);
      }));
    });
  };

  document.body.appendChild(quadro);
  quadro.srcdoc = html;
}
