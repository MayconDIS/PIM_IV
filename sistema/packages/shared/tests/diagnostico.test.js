import test from 'node:test';
import assert from 'node:assert/strict';

import { PERGUNTAS_DIAGNOSTICO, resultadoDoDiagnostico } from '../src/diagnostico.js';
import { ORDEM_FASES } from '../src/gamificacao.js';

test('o diagnóstico tem 10 perguntas com gabarito válido', () => {
  assert.equal(PERGUNTAS_DIAGNOSTICO.length, 10);
  for (const { p, r, certa } of PERGUNTAS_DIAGNOSTICO) {
    assert.ok(p.length > 0);
    assert.ok(certa >= 0 && certa < r.length, `gabarito fora das alternativas em "${p}"`);
  }
});

test('até 3 acertos começa só na Fase 01, como Ingressante', () => {
  for (const acertos of [0, 3]) {
    const r = resultadoDoDiagnostico(acertos);
    assert.deepEqual(r.fases, ['fase1']);
    assert.equal(r.rotuloRank, 'Rank: Ingressante');
    assert.equal(r.nivel, 1);
  }
});

test('de 4 a 7 acertos libera os Módulos 01 e 02 com seus testes', () => {
  for (const acertos of [4, 7]) {
    const r = resultadoDoDiagnostico(acertos);
    assert.deepEqual(r.fases, [
      'fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'fase26', 'fase27', 'fase28', 'fase29', 'teste-mod1',
      'fase6', 'fase7', 'fase8', 'fase9', 'fase10', 'fase30', 'fase31', 'fase32', 'teste-mod2',
    ]);
    assert.equal(r.rotuloRank, 'Rank: Intermediário');
    assert.equal(r.nivel, 3);
  }
});

test('8 ou mais acertos libera toda a trilha regular', () => {
  const r = resultadoDoDiagnostico(8);
  assert.deepEqual(r.fases, [...ORDEM_FASES]);
  assert.equal(r.rotuloRank, 'Rank: Expert');
  assert.equal(r.nivel, 6);
});
