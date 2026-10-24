import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiService } from '../src/api.js';
import { dadosLocaisDaConta, encerrarSessaoDaConta } from '../../../apps/react-web/src/lib/conta.js';

test('exportação e limpeza local não incluem credenciais nem outra conta com prefixo igual', () => {
  const dados = new Map([['quest_ana_xp', '100'], ['quest_ana_bia_xp', '200'], ['quest_jwt_token', 'segredo'], ['quest_user_name', 'ana']]);
  const storage = { getItem: (k) => dados.get(k) ?? null, removeItem: (k) => dados.delete(k) };
  assert.deepEqual(dadosLocaisDaConta('ana', storage), { xp: '100' });
  encerrarSessaoDaConta('ana', true, storage);
  assert.deepEqual([...dados], [['quest_ana_bia_xp', '200']]);
});

test('troca de senha encerra sessão mas preserva progresso local', () => {
  const dados = new Map([['quest_ana_srs', '{}'], ['quest_jwt_token', 'segredo']]);
  encerrarSessaoDaConta('ana', false, { removeItem: (k) => dados.delete(k) });
  assert.deepEqual([...dados], [['quest_ana_srs', '{}']]);
});

test('cliente de conta envia JWT e senha no corpo sem aceitar ID arbitrário', async (t) => {
  const chamadas = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    chamadas.push({ url, ...options });
    return new Response(null, { status: 204 });
  });
  const anterior = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => 'jwt-teste' };
  try {
    await ApiService.alterarMeuEmail('novo@example.com', 'senha');
    await ApiService.alterarMinhaSenha('senha', 'nova');
    await ApiService.excluirMinhaConta('senha');
    assert.deepEqual(chamadas.map((c) => c.method), ['PUT', 'PUT', 'POST']);
    assert.ok(chamadas.every((c) => c.headers.Authorization === 'Bearer jwt-teste' && new URL(c.url).search === ''));
    assert.deepEqual(JSON.parse(chamadas[0].body), { email: 'novo@example.com', senhaAtual: 'senha' });
    assert.deepEqual(JSON.parse(chamadas[2].body), { senhaAtual: 'senha' });
  } finally { globalThis.localStorage = anterior; }
});

test('cliente não informa sucesso em falha de rede ou senha incorreta', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ message: 'Senha atual incorreta.' }), { status: 400 }));
  await assert.rejects(ApiService.excluirMinhaConta('errada'), /Senha atual incorreta/);
  globalThis.fetch = async () => { throw new Error('offline'); };
  await assert.rejects(ApiService.exportarMinhaConta(), /Servidor indisponível/);
});
