import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiService } from '../src/api.js';
import { EVENTO_SESSAO_EXPIRADA, tokenVencido, validadeDoToken } from '../src/sessao.js';
import { encerrarSessaoVencida, lerAvisoDeSessaoExpirada } from '../../../apps/react-web/src/lib/sessao.js';

// JWT de teste: só o campo "exp" importa (a assinatura não é conferida no navegador).
const jwt = (corpo) => ['e30', Buffer.from(JSON.stringify(corpo)).toString('base64url'), 'assinatura'].join('.');
const agora = Date.UTC(2026, 9, 30, 12);

test('token com validade futura continua valendo; vencido ou a 30 s de vencer, não', () => {
  const expEm = (ms) => jwt({ sub: '1', exp: Math.floor((agora + ms) / 1000) });
  assert.equal(validadeDoToken(expEm(3_600_000)), agora + 3_600_000);
  assert.equal(tokenVencido(expEm(3_600_000), agora), false);
  assert.equal(tokenVencido(expEm(-1000), agora), true);
  assert.equal(tokenVencido(expEm(10_000), agora), true);
});

test('sem token, token ilegível ou sem "exp" conta como vencido', () => {
  for (const token of [null, '', 'abc', 'a.b.c', jwt({ sub: '1' })]) {
    assert.equal(tokenVencido(token, agora), true, String(token));
  }
});

test('401 com token avisa o site; 401 sem token (senha errada no login) não avisa', async (t) => {
  const avisos = [];
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({}), { status: 401 }));
  // No navegador o evento vai para window; aqui o dispatchEvent é simulado.
  globalThis.dispatchEvent = (evento) => avisos.push(evento.type);
  const anterior = globalThis.localStorage;
  try {
    globalThis.localStorage = { getItem: () => 'jwt-vencido' };
    await assert.rejects(ApiService.getMinhaConta(), /Sessão expirada/);
    assert.deepEqual(await ApiService.getProgressoUsuario(), []);
    assert.deepEqual(avisos, [EVENTO_SESSAO_EXPIRADA, EVENTO_SESSAO_EXPIRADA]);
    globalThis.localStorage = { getItem: () => null };
    await assert.rejects(ApiService.login('ana', 'errada'), /incorretos/);
    assert.equal(avisos.length, 2);
  } finally {
    delete globalThis.dispatchEvent;
    globalThis.localStorage = anterior;
  }
});

test('sessão vencida sai da conta, guarda o progresso e deixa um aviso que o login lê uma vez', () => {
  const dados = new Map([['quest_user_name', 'ana'], ['quest_jwt_token', 'velho'], ['quest_user_id', '7'], ['quest_ana_xp', '120']]);
  const storage = { getItem: (k) => dados.get(k) ?? null, removeItem: (k) => dados.delete(k) };
  const abaDados = new Map();
  const aba = { getItem: (k) => abaDados.get(k) ?? null, setItem: (k, v) => abaDados.set(k, v), removeItem: (k) => abaDados.delete(k) };
  encerrarSessaoVencida(storage, aba);
  assert.deepEqual([...dados], [['quest_ana_xp', '120']]);
  assert.equal(lerAvisoDeSessaoExpirada(aba), true);
  assert.equal(lerAvisoDeSessaoExpirada(aba), false);
});
