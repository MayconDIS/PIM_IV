/**
 * VLibras — tradutor de Libras do governo federal (porte do CasalFlow).
 *
 * Antes era um `<script>` embutido no index.html chamando `new VLibras.Widget`.
 * Com a CSP do vercel.json (`script-src 'self'`, sem 'unsafe-inline') script
 * embutido não executa; como módulo do bundle ele passa por 'self' e só o
 * domínio do gov.br precisa entrar na política.
 *
 * A marcação nasce no <body>, fora de #root: o widget reescreve os próprios nós
 * e dois donos (ele e o React) do mesmo DOM perdem um ao outro.
 * Se o gov.br estiver fora, a página segue sem o tradutor.
 */
const ENDERECO = 'https://vlibras.gov.br/app';
const PLUGIN = `${ENDERECO}/vlibras-plugin.js`;
const MARCA = 'data-nexti-vlibras';

function montarMarcacao() {
  // Os atributos sem valor (vw, vw-access-button, vw-plugin-wrapper) são os
  // seletores do próprio widget e não podem ser renomeados.
  const raiz = document.createElement('div');
  raiz.setAttribute('vw', '');
  raiz.setAttribute(MARCA, '');
  raiz.className = 'enabled';

  const botao = document.createElement('div');
  botao.setAttribute('vw-access-button', '');
  botao.className = 'active';

  const envoltorio = document.createElement('div');
  envoltorio.setAttribute('vw-plugin-wrapper', '');
  const topo = document.createElement('div');
  topo.className = 'vw-plugin-top-wrapper';
  envoltorio.appendChild(topo);

  raiz.append(botao, envoltorio);
  document.body.appendChild(raiz);
}

// O botão do plugin fica dentro de um shadow DOM (#vlibras-access-wrapper), fora do alcance do CSS
// da página. No celular ele ficava no meio da borda direita, por cima de campos e da busca: a regra
// abaixo, colocada dentro do shadow DOM, desce o botão para o canto inferior, acima do "voltar ao topo".
const POSICAO_NO_CELULAR = '@media (max-width: 640px) { #vlibras-access { top: auto !important; bottom: 96px !important; } }';

function ajustarPosicaoNoCelular(tentativas = 40) {
  const sombra = document.getElementById('vlibras-access-wrapper')?.shadowRoot;
  if (sombra) {
    const estilo = document.createElement('style');
    estilo.textContent = POSICAO_NO_CELULAR;
    sombra.appendChild(estilo);
  } else if (tentativas > 0) {
    setTimeout(() => ajustarPosicaoNoCelular(tentativas - 1), 250);
  }
}

export function instalarVLibras() {
  if (typeof document === 'undefined' || document.querySelector(`[${MARCA}]`)) return;

  montarMarcacao();

  const script = document.createElement('script');
  script.src = PLUGIN;
  script.async = true;
  script.onload = () => {
    try {
      new window.VLibras.Widget(ENDERECO);
      ajustarPosicaoNoCelular();
    } catch (erro) {
      console.warn('[VLibras] o plugin carregou mas não inicializou', { motivo: erro?.message });
    }
  };
  script.onerror = () => {
    document.querySelector(`[${MARCA}]`)?.remove();
    console.warn(`[VLibras] não foi possível carregar ${PLUGIN}; a página segue sem o tradutor.`);
  };
  document.head.appendChild(script);
}
