import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarSincronizador } from '../src/services/sincronizacao.js';
import { criarApi, ErroDaApi, ErroDeRede } from '../src/services/api.js';

function memoria() {
  const dados = {};
  return { ler: async (c) => dados[c] ?? null, gravar: async (c, v) => { dados[c] = structuredClone(v); }, dados };
}

/** API falsa: registra as chamadas; `falha` decide o erro de cada chamada. */
function apiFalsa({ falha = () => null, perfil = { xp: 0, moedas: 0, nivel: 1 }, progresso = [] } = {}) {
  const chamadas = [];
  const chamar = async (nome, args, resposta) => {
    chamadas.push([nome, ...args]);
    const erro = falha(nome);
    if (erro) throw erro;
    return resposta;
  };
  return {
    chamadas,
    registrarResposta: (...a) => chamar('registrarResposta', a, {}),
    atualizarStats: (...a) => chamar('atualizarStats', a, {}),
    perfil: (...a) => chamar('perfil', a, perfil),
    progresso: (...a) => chamar('progresso', a, progresso),
  };
}

const carta = { id: 7, frente: 'O que é SM-2?' };

test('resposta com internet vai direto para a API', async () => {
  const api = apiFalsa();
  const s = criarSincronizador({ api, armazenamento: memoria(), username: 'ana', agora: () => 0 });
  await s.carregar();
  await s.responder(carta, 'good');
  assert.deepEqual(api.chamadas, [['registrarResposta', 7, 4]]);
  assert.equal(s.estado.fila.length, 0);
  assert.equal(s.estado.srs[7].rep, 1);
});

test('sem internet a resposta vai para a fila e sai na sincronização', async () => {
  let online = false;
  const api = apiFalsa({ falha: () => (online ? null : new ErroDeRede('off')) });
  const arm = memoria();
  const s = criarSincronizador({ api, armazenamento: arm, username: 'ana' });
  await s.carregar();
  await s.responder(carta, 'again');
  assert.deepEqual(s.estado.fila, [{ tipo: 'resposta', flashcardId: 7, qualidade: 1 }]);
  assert.equal(arm.dados.nexti_estado_ana.fila.length, 1, 'a fila fica salva no aparelho');

  online = true;
  await s.sincronizar();
  assert.equal(s.estado.fila.length, 0);
  assert.deepEqual(api.chamadas.at(-3), ['registrarResposta', 7, 1]);
});

test('sincronizar traz XP, moedas e o SM-2 da API', async () => {
  const api = apiFalsa({
    perfil: { xp: 120, moedas: 40, nivel: 3 },
    progresso: [{ flashcardId: 9, repeticoes: 2, intervaloDias: 6, fatorFacilidade: 2.6, dataProximaRevisao: '2026-11-01T00:00:00Z' }],
  });
  const s = criarSincronizador({ api, armazenamento: memoria(), username: 'ana' });
  await s.carregar();
  await s.sincronizar();
  assert.equal(s.estado.xp, 120);
  assert.equal(s.estado.moedas, 40);
  assert.equal(s.estado.nivel, 3);
  assert.deepEqual(s.estado.srs[9], { rep: 2, interval: 6, ease: 2.6, next: Date.parse('2026-11-01T00:00:00Z') });
});

test('concluir a fase 5 paga o prêmio do site e libera a fase 6 (pula o teste)', async () => {
  const api = apiFalsa();
  const s = criarSincronizador({ api, armazenamento: memoria(), username: 'ana' });
  await s.carregar();
  const { premio, seguinte } = await s.concluirFase('fase5');
  assert.deepEqual(premio, { xp: 5, moedas: 10 });
  assert.equal(seguinte, 'fase6');
  assert.ok(s.estado.liberadas.includes('fase6'));
  assert.deepEqual(api.chamadas, [['atualizarStats', 5, 10, 1]]);
});

test('sem internet só o último envio de XP fica na fila', async () => {
  const api = apiFalsa({ falha: () => new ErroDeRede('off') });
  const s = criarSincronizador({ api, armazenamento: memoria(), username: 'ana' });
  await s.carregar();
  await s.concluirFase('fase1');
  await s.concluirFase('fase2');
  assert.deepEqual(s.estado.fila, [{ tipo: 'stats', xp: 10, moedas: 20, nivel: 1 }]);
});

test('erro de regra da API (400) não fica na fila', async () => {
  const api = apiFalsa({ falha: () => new ErroDaApi(400, 'XP não pode diminuir') });
  const s = criarSincronizador({ api, armazenamento: memoria(), username: 'ana' });
  await s.carregar();
  await s.concluirFase('fase1');
  assert.equal(s.estado.fila.length, 0);
});

test('sessão expirada (401) sobe como erro e mantém a resposta na fila', async () => {
  const api = apiFalsa({ falha: () => new ErroDaApi(401, 'Sessão expirada') });
  const s = criarSincronizador({ api, armazenamento: memoria(), username: 'ana' });
  await s.carregar();
  await assert.rejects(() => s.responder(carta, 'good'), (e) => e.status === 401);
  assert.equal(s.estado.fila.length, 1);
});

test('cartas vencidas ou novas vêm primeiro', async () => {
  const s = criarSincronizador({ api: apiFalsa(), armazenamento: memoria(), username: 'ana', agora: () => 1000 });
  await s.carregar();
  s.estado.srs[1] = { next: 5000 };   // ainda não venceu
  s.estado.srs[2] = { next: 500 };    // vencida
  const ordem = s.ordenarCartas([{ id: 1 }, { id: 2 }, { id: 3 }]).map((c) => c.id);
  assert.deepEqual(ordem, [2, 3, 1]);
});

// --- cliente HTTP ---

test('api: sem conexão vira ErroDeRede e erro do servidor traz a mensagem', async () => {
  const semRede = criarApi({ baseUrl: 'x', fetchFn: async () => { throw new TypeError('fetch failed'); } });
  await assert.rejects(() => semRede.progresso(), ErroDeRede);

  const resposta = (status, corpo) => ({ ok: status < 300, status, text: async () => corpo });
  const comErro = criarApi({ baseUrl: 'x', fetchFn: async () => resposta(400, '{"message":"Este nickname já está em uso."}') });
  await assert.rejects(() => comErro.cadastrar('a', 'b', 'c'), { message: 'Este nickname já está em uso.', status: 400 });

  const html = criarApi({ baseUrl: 'x', fetchFn: async () => resposta(502, '<html>Bad Gateway</html>') });
  await assert.rejects(() => html.progresso(), { status: 502 });

  const login = criarApi({ baseUrl: 'x', fetchFn: async () => resposta(401, '') });
  await assert.rejects(() => login.entrar('a', 'b'), { message: 'Usuário ou senha incorretos.' });
});

test('api: envia o token no cabeçalho', async () => {
  let cabecalhos;
  const api = criarApi({ baseUrl: 'x', obterToken: () => 'abc', fetchFn: async (_, o) => { cabecalhos = o.headers; return { ok: true, status: 200, text: async () => '[]' }; } });
  await api.progresso();
  assert.equal(cabecalhos.Authorization, 'Bearer abc');
});
