import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import { avaliarSenha, mensagemDeSenhaFraca, senhaEhForte, TAMANHO_MINIMO_DE_SENHA } from '../src/senha.js';
import { mensagemDeSenhaVazada, sha1HexWeb, verificarSenhaVazada } from '../src/senhaVazada.js';

const sha1 = async (t) => createHash('sha1').update(t).digest('hex');

test('senha forte cumpre as seis regras', () => {
  const r = avaliarSenha('Ótimo#2026', { nickname: 'maycon', email: 'dev@nexti.com' });
  assert.equal(r.total, 6);
  assert.equal(r.cumpridas, 6);
  assert.equal(r.forte, true);
});

test('maiúscula e minúscula acentuadas contam (\\p{Lu}, não [A-Z])', () => {
  assert.equal(avaliarSenha('ÉÇÃ').regras.find((r) => r.id === 'maiuscula').cumprida, true);
  assert.equal(avaliarSenha('éçã').regras.find((r) => r.id === 'minuscula').cumprida, true);
});

test('recusa senha com o nickname ou a parte local do e-mail', () => {
  const ctx = { nickname: 'Maycon', email: 'mdcode@exemplo.com' };
  assert.equal(senhaEhForte('Maycon@2026', ctx), false);
  assert.equal(senhaEhForte('Xmdcode#99', ctx), false);
  assert.equal(senhaEhForte('Girassol#77', ctx), true);
});

test('pedaços curtos do nickname não reprovam senha boa', () => {
  assert.equal(senhaEhForte('Analise#2026', { nickname: 'Ana' }), true);
});

test('senha vazia não cumpre nada e é marcada como vazia', () => {
  const r = avaliarSenha('');
  assert.equal(r.vazia, true);
  assert.equal(r.cumpridas, 0);
});

test('mensagem nomeia o que falta e fala do tamanho primeiro', () => {
  assert.match(mensagemDeSenhaFraca('Ab1!'), new RegExp(`${TAMANHO_MINIMO_DE_SENHA} caracteres`));
  assert.equal(mensagemDeSenhaFraca('abcdefgh'), 'A senha ainda precisa de: uma letra maiúscula, um número e um símbolo (! @ # $).');
});

test('HIBP: só o prefixo de 5 caracteres sai e o sufixo é comparado aqui', async () => {
  const hash = (await sha1('senha123')).toUpperCase();
  let urlPedida = '';
  const buscar = async (url) => {
    urlPedida = url;
    return { ok: true, text: async () => `00000000000000000000000000000000000:0\r\n${hash.slice(5)}:42\r\n` };
  };
  const r = await verificarSenhaVazada('senha123', { sha1, buscar });
  assert.deepEqual(r, { verificado: true, vazada: true, vezes: 42 });
  assert.ok(urlPedida.endsWith(`/range/${hash.slice(0, 5)}`));
  assert.ok(!urlPedida.includes('senha123'));
});

test('HIBP: registro de enchimento (contagem 0) não marca como vazada', async () => {
  const hash = (await sha1('Girassol#77')).toUpperCase();
  const buscar = async () => ({ ok: true, text: async () => `${hash.slice(5)}:0` });
  assert.deepEqual(await verificarSenhaVazada('Girassol#77', { sha1, buscar }), { verificado: true, vazada: false, vezes: 0 });
});

test('HIBP: falha aberta quando a rede cai ou o hash é inválido', async () => {
  const caiu = async () => { throw new TypeError('Failed to fetch'); };
  const erro = console.error;
  console.error = () => {};
  try {
    assert.deepEqual(await verificarSenhaVazada('x', { sha1, buscar: caiu }), { verificado: false, vazada: false, vezes: 0 });
  } finally {
    console.error = erro;
  }
  assert.equal((await verificarSenhaVazada('x', { sha1: async () => 'abc', buscar: caiu })).verificado, false);
});

test('sha1HexWeb bate com o SHA-1 do Node', async () => {
  assert.equal(await sha1HexWeb('Nex_TI'), await sha1('Nex_TI'));
});

test('mensagem de vazamento formata o número em pt-BR', () => {
  assert.match(mensagemDeSenhaVazada(24230), /24\.230 vazamentos/);
  assert.match(mensagemDeSenhaVazada(1), /1 vazamento de/);
});
