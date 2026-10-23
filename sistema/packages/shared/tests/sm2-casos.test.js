import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calcularCasos } from './gerar-sm2-casos.mjs';

// Os mesmos casos são conferidos pela API C# (Sm2EngineTests). Se este teste falhar
// depois de mudar a regra, rode: node tests/gerar-sm2-casos.mjs
const casos = JSON.parse(fs.readFileSync(new URL('./sm2-casos.json', import.meta.url), 'utf8'));

test('sm2-casos.json está em dia com a regra de src/sm2.js', () => {
  assert.deepEqual(casos, calcularCasos());
});

test('os casos cobrem as quatro respostas e o limite do fator', () => {
  const respostas = new Set(casos.flatMap((c) => c.respostas));
  assert.deepEqual([...respostas].sort(), ['again', 'easy', 'good', 'hard']);
  assert.ok(casos.some((c) => c.esperado.fatorFacilidade === 1.3));
});
