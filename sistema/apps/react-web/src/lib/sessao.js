import { encerrarSessaoDaConta } from './conta.js';

/** Marca, em sessionStorage, que a tela de inicialização já foi exibida nesta aba. */
export const CHAVE_SPLASH_EXIBIDO = 'nexti_splash_exibido';

/** Marca, em sessionStorage, que a sessão venceu: o login mostra o aviso uma vez. */
export const CHAVE_SESSAO_EXPIRADA = 'nexti_sessao_expirada';

/** Sai da conta com o token vencido. O progresso guardado neste navegador continua. */
export function encerrarSessaoVencida(storage = localStorage, aba = sessionStorage) {
  encerrarSessaoDaConta(storage.getItem('quest_user_name'), false, storage);
  try {
    aba.setItem(CHAVE_SESSAO_EXPIRADA, 'true');
  } catch {
    // Sem sessionStorage o login abre sem o aviso.
  }
}

/** Lê e apaga o aviso de sessão vencida. */
export function lerAvisoDeSessaoExpirada(aba = sessionStorage) {
  try {
    const venceu = aba.getItem(CHAVE_SESSAO_EXPIRADA) === 'true';
    aba.removeItem(CHAVE_SESSAO_EXPIRADA);
    return venceu;
  } catch {
    return false;
  }
}
