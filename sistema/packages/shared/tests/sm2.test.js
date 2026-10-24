import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ESTADO_INICIAL,
  aplicarResposta,
  devolveParaRevisao,
  estadoDaCarta,
  formatarIntervalo,
  previsoes,
  qualidadeSm2,
  somDaResposta,
} from '../src/sm2.js';

test('formatarIntervalo usa os mesmos rótulos do dashboard', () => {
  assert.equal(formatarIntervalo(0), '<10m');
  assert.equal(formatarIntervalo(1), '1d');
  assert.equal(formatarIntervalo(12), '12d');
  assert.equal(formatarIntervalo(60), '2m');
  assert.equal(formatarIntervalo(730), '2a');
});

test('carta nova mostra as previsões fixas', () => {
  assert.deepEqual(previsoes(ESTADO_INICIAL), {
    again: '<1m',
    hard: '<6m',
    good: '<10m',
    easy: '3d',
  });
});

test('carta já estudada projeta intervalo a partir do fator de facilidade', () => {
  assert.deepEqual(previsoes({ rep: 2, interval: 10, ease: 2.5 }), {
    again: '<1m',
    hard: '12d',
    good: '25d',
    easy: '1m',
  });
});

test('"bom" na primeira vez agenda para 1 dia e mantém a facilidade', () => {
  const novo = aplicarResposta(ESTADO_INICIAL, 'good', 0);
  assert.equal(novo.rep, 1);
  assert.equal(novo.interval, 1);
  assert.equal(novo.ease, 2.5);
  assert.equal(novo.next, 86400000);
});

test('"fácil" na primeira vez agenda para 3 dias e sobe a facilidade', () => {
  const novo = aplicarResposta(ESTADO_INICIAL, 'easy', 0);
  assert.equal(novo.interval, 3);
  assert.equal(novo.ease, 2.65);
});

test('"difícil" multiplica por 1.2 e desce 0,15 na facilidade', () => {
  const novo = aplicarResposta({ rep: 2, interval: 10, ease: 2.5 }, 'hard', 0);
  assert.equal(novo.interval, 12);
  assert.equal(novo.ease, 2.35);
  assert.equal(novo.rep, 3);
});

test('"de novo" zera as repetições e devolve a carta para a fila', () => {
  const novo = aplicarResposta({ rep: 5, interval: 30, ease: 2.5 }, 'again', 0);
  assert.equal(novo.rep, 0);
  assert.equal(novo.interval, 1);
  assert.equal(novo.ease, 2.3);
  assert.ok(devolveParaRevisao('again'));
  assert.ok(devolveParaRevisao('errei'));
  assert.ok(!devolveParaRevisao('good'));
});

test('a facilidade nunca cai abaixo de 1,3, mesmo errando sempre', () => {
  let estado = ESTADO_INICIAL;
  for (let i = 0; i < 40; i += 1) estado = aplicarResposta(estado, 'again', 0);
  assert.equal(estado.ease, 1.3);
  assert.ok(estado.interval >= 1);
});

test('"difícil" sempre soma pelo menos 1 dia (não fica preso em 1 dia)', () => {
  let estado = aplicarResposta(ESTADO_INICIAL, 'hard', 0);
  assert.equal(estado.interval, 1);
  estado = aplicarResposta(estado, 'hard', 0);
  assert.equal(estado.interval, 2);
  estado = aplicarResposta(estado, 'hard', 0);
  assert.equal(estado.interval, 3);
});

test('o intervalo nunca fica negativo em longas sequências de "difícil"', () => {
  let estado = { rep: 1, interval: 1, ease: 1.3 };
  for (let i = 0; i < 40; i += 1) {
    estado = aplicarResposta(estado, 'hard', 0);
    assert.ok(estado.interval >= 1, `intervalo inválido: ${estado.interval}`);
    assert.ok(estado.ease >= 1.3, `facilidade inválida: ${estado.ease}`);
  }
});

test('"próxima" dos testes de módulo não mexe no agendamento', () => {
  const estado = { rep: 3, interval: 15, ease: 2.4, next: 999 };
  assert.deepEqual(aplicarResposta(estado, 'proxima-teste', 0), estado);
});

test('aplicarResposta não altera o estado recebido', () => {
  const estado = { rep: 1, interval: 5, ease: 2.5, next: 0 };
  const copia = { ...estado };
  aplicarResposta(estado, 'good', 0);
  assert.deepEqual(estado, copia);
});

test('estadoDaCarta completa os campos que faltam', () => {
  assert.deepEqual(estadoDaCarta({ 'O que é X?': { rep: 2 } }, 'O que é X?'), {
    rep: 2,
    interval: 0,
    ease: 2.5,
    next: 0,
  });
  assert.deepEqual(estadoDaCarta({}, 'nova'), ESTADO_INICIAL);
});

test('qualidade e som seguem o mapeamento do vanilla', () => {
  assert.equal(qualidadeSm2('again'), 1);
  assert.equal(qualidadeSm2('hard'), 3);
  assert.equal(qualidadeSm2('good'), 4);
  assert.equal(qualidadeSm2('acertei'), 4);
  assert.equal(qualidadeSm2('easy'), 5);

  assert.equal(somDaResposta('again'), 'playError');
  assert.equal(somDaResposta('hard'), 'playClick');
  assert.equal(somDaResposta('good'), 'playCorrect');
  assert.equal(somDaResposta('easy'), 'playUnlock');
});
