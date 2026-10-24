import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GUIA_DE_ESTUDOS, PROVAS_ENADE, cartasDaProva } from '../src/enadeOficial.js';
import { BANCO_DE_DADOS } from '../src/content.js';

test('as provas oficiais têm 5 alternativas e uma resposta válida por questão', () => {
  assert.deepEqual(PROVAS_ENADE.map((p) => p.ano), [2017, 2021]);
  for (const prova of PROVAS_ENADE) {
    const numeros = prova.questoes.map((q) => q.numero);
    assert.equal(new Set(numeros).size, numeros.length, `questão repetida em ${prova.ano}`);
    for (const questao of prova.questoes) {
      assert.equal(questao.opcoes.length, 5, `${prova.ano}/${questao.numero}`);
      assert.match(questao.correta, /^[A-E]$/);
      assert.ok(questao.enunciado.length > 40 && questao.explicacao.length > 20);
    }
  }
});

test('o gabarito bate com o gabarito definitivo do INEP', () => {
  const gabarito = (ano) => Object.fromEntries(PROVAS_ENADE.find((p) => p.ano === ano).questoes.map((q) => [q.numero, q.correta]));
  assert.deepEqual(gabarito(2017), {
    10: 'C', 11: 'C', 12: 'D', 13: 'C', 14: 'C', 16: 'A', 17: 'D', 18: 'A', 19: 'C', 21: 'D', 22: 'B', 23: 'B',
    24: 'E', 25: 'A', 26: 'A', 28: 'E', 29: 'D', 30: 'A', 31: 'B', 32: 'C', 33: 'D', 34: 'B', 35: 'C',
  });
  assert.deepEqual(gabarito(2021), {
    9: 'C', 11: 'E', 12: 'C', 13: 'C', 14: 'E', 17: 'C', 18: 'A', 19: 'A', 20: 'E', 21: 'B', 22: 'A', 23: 'B',
    24: 'D', 25: 'E', 26: 'E', 27: 'C', 28: 'B', 29: 'D', 30: 'C', 31: 'D', 32: 'B', 33: 'D', 34: 'A',
  });
});

test('as cartas das provas apontam a alternativa certa e citam a fonte', () => {
  const cartas = cartasDaProva(2021);
  const q27 = cartas.find((c) => c.frente.includes('Questão 27'));
  assert.equal(q27.opcoes[q27.correta], 'C) (277)₁₀');
  assert.ok(q27.verso.startsWith('Alternativa C.'));
  assert.ok(cartas.every((c) => c.verso.includes('Fonte: INEP, ENADE 2021')));
  assert.deepEqual(cartasDaProva(1999), []);
});

test('o guia de estudos é a fase 23 e tem cartas de conceito, sem alternativas', () => {
  assert.equal(BANCO_DE_DADOS.fase23.length, GUIA_DE_ESTUDOS.length);
  assert.ok(GUIA_DE_ESTUDOS.length >= 30);
  for (const carta of GUIA_DE_ESTUDOS) {
    assert.ok(carta.frente.endsWith('?'), carta.frente);
    assert.ok(carta.verso && carta.dica);
    assert.equal(carta.opcoes, undefined);
  }
  assert.equal(BANCO_DE_DADOS.fase24.length, 23);
  assert.equal(BANCO_DE_DADOS.fase25.length, 23);
});
