import test from 'node:test';
import assert from 'node:assert/strict';

import { BANCO_DE_DADOS } from '../src/content.js';
import { fasesConcluidas } from '../src/gamificacao.js';

// Estado do SM-2 das cartas respondidas, como o site guarda: { frente: estado }.
const responder = (cartas) => Object.fromEntries(cartas.map((c) => [c.frente, { rep: 1, interval: 1, ease: 2.5, next: 0 }]));

test('fasesConcluidas: aluno novo não concluiu nenhuma fase', () => {
  assert.deepEqual(fasesConcluidas(BANCO_DE_DADOS, {}), []);
});

test('fasesConcluidas: fase com todas as cartas respondidas conta', () => {
  assert.deepEqual(fasesConcluidas(BANCO_DE_DADOS, responder(BANCO_DE_DADOS.fase1)), ['fase1']);
});

test('fasesConcluidas: faltando uma carta, a fase ainda não conta', () => {
  assert.deepEqual(fasesConcluidas(BANCO_DE_DADOS, responder(BANCO_DE_DADOS.fase1.slice(1))), []);
});

test('fasesConcluidas: cartas respondidas de várias fases sem fechar nenhuma (o caso do diagnóstico)', () => {
  // O diagnóstico libera as fases até o fim do Mod 02, mas liberar não é concluir.
  const algumas = ['fase1', 'fase2', 'fase6'].flatMap((f) => BANCO_DE_DADOS[f].slice(0, 7));
  assert.deepEqual(fasesConcluidas(BANCO_DE_DADOS, responder(algumas)), []);
});

test('fasesConcluidas: errar uma carta não desfaz a fase (a carta continua respondida)', () => {
  const srs = responder(BANCO_DE_DADOS.fase2);
  srs[BANCO_DE_DADOS.fase2[0].frente] = { rep: 0, interval: 1, ease: 2.3, next: 0 };
  assert.deepEqual(fasesConcluidas(BANCO_DE_DADOS, srs), ['fase2']);
});
