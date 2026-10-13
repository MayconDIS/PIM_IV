/**
 * A senha já apareceu em vazamento público? Consulta ao HaveIBeenPwned sem
 * entregar a senha (k-anonymity) — adaptado do CasalFlow.
 *
 * - Só saem do aparelho os 5 primeiros caracteres hex do SHA-1; o serviço
 *   devolve ~800 sufixos e a comparação acontece aqui. `Add-Padding` evita que
 *   o tamanho da resposta revele o prefixo.
 * - Falha ABERTA: rede fora, tempo esgotado ou CSP bloqueando devolvem
 *   `verificado: false` e o cadastro segue. Um serviço de terceiro fora do ar
 *   não pode impedir alguém de criar conta.
 * - O SHA-1 é injetado (crypto.subtle na web, expo-crypto no mobile), então este
 *   arquivo não depende de plataforma e roda nos testes do Node. SHA-1 aqui é só
 *   o índice de busca que a API publica, não proteção.
 */

const ENDERECO = 'https://api.pwnedpasswords.com/range/';
const LIMITE_DE_ESPERA_MS = 5000;

/**
 * @param {string} senha
 * @param {{ sha1: (texto: string) => Promise<string>, buscar?: typeof fetch }} deps
 * @returns {Promise<{ verificado: boolean, vazada: boolean, vezes: number }>}
 *   `verificado: false` quer dizer "não deu para saber", e NÃO "está limpa".
 */
export async function verificarSenhaVazada(senha, { sha1, buscar = globalThis.fetch } = {}) {
  const naoVerificado = { verificado: false, vazada: false, vezes: 0 };
  if (typeof senha !== 'string' || !senha || typeof sha1 !== 'function' || typeof buscar !== 'function') {
    return naoVerificado;
  }

  try {
    const hash = String(await sha1(senha)).toUpperCase();
    // Hash de outro tamanho = função injetada errada; comparar assim mesmo
    // diria "não vazada" para tudo, a falha silenciosa mais perigosa aqui.
    if (!/^[0-9A-F]{40}$/.test(hash)) return naoVerificado;

    const prefixo = hash.slice(0, 5);
    const sufixo = hash.slice(5);

    const controle = new AbortController();
    const relogio = setTimeout(() => controle.abort(), LIMITE_DE_ESPERA_MS);
    let resposta;
    try {
      resposta = await buscar(ENDERECO + prefixo, { signal: controle.signal, headers: { 'Add-Padding': 'true' } });
    } finally {
      clearTimeout(relogio);
    }
    if (!resposta?.ok) return naoVerificado;

    // "SUFIXO:CONTAGEM" por linha; o enchimento vem com contagem 0.
    for (const linha of (await resposta.text()).split('\n')) {
      const [suf, cont] = linha.trim().split(':');
      if (suf === sufixo) {
        const vezes = Number(cont) || 0;
        return { verificado: true, vazada: vezes > 0, vezes };
      }
    }
    return { verificado: true, vazada: false, vezes: 0 };
  } catch (erro) {
    // Nunca logar a senha nem o hash: o que ajuda a depurar é o motivo.
    console.error('[senha] não deu para consultar vazamentos', {
      motivo: erro?.name === 'AbortError' ? 'tempo esgotado' : erro?.message,
    });
    return naoVerificado;
  }
}

export function mensagemDeSenhaVazada(vezes) {
  const contagem = new Intl.NumberFormat('pt-BR').format(vezes);
  return `Esta senha já apareceu em ${contagem} vazamento${vezes === 1 ? '' : 's'} de dados públicos, `
    + 'usados por atacantes para testar contas. Escolha outra — e troque também onde mais você a usa.';
}

/** SHA-1 em hex com a Web Crypto API (navegador). */
export async function sha1HexWeb(texto) {
  const bytes = new TextEncoder().encode(texto);
  const digest = await globalThis.crypto.subtle.digest('SHA-1', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}
