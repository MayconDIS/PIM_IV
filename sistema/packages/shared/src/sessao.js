/**
 * Sessão do aluno. O JWT da API vale 24 horas (AuthService); o nome do aluno fica no
 * navegador sem prazo. Sem esta conferência, o painel abria com o token vencido e
 * toda chamada à API voltava "Sessão expirada".
 */

/** Evento disparado quando a API recusa o token (401): o site encerra a sessão e volta ao login. */
export const EVENTO_SESSAO_EXPIRADA = 'nexti:sessao-expirada';

// Folga para o token não vencer no meio da primeira requisição.
const FOLGA_MS = 30_000;

/** Lê o campo "exp" do JWT (em segundos). Devolve null se o token não for um JWT legível. */
export function validadeDoToken(token) {
    const partes = typeof token === 'string' ? token.split('.') : [];
    if (partes.length !== 3) return null;
    try {
        const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
        const { exp } = JSON.parse(atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')));
        return Number.isFinite(exp) ? exp * 1000 : null;
    } catch {
        return null;
    }
}

/** true quando não há token, ele não é legível ou já venceu (com 30 s de folga). */
export function tokenVencido(token, agora = Date.now()) {
    const validade = validadeDoToken(token);
    return validade === null || validade <= agora + FOLGA_MS;
}
