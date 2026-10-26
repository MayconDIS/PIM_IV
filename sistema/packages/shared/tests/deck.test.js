import test from 'node:test';
import assert from 'node:assert/strict';

import {
  QUESTOES_POR_TESTE,
  embaralhar,
  fasesDoModulo,
  isCartaEnade,
  montarDeckDaFase,
  montarTesteDoModulo,
} from '../src/deck.js';
import { BANCO_DE_DADOS } from '../src/content.js';

/** Gerador determinístico para os testes: sempre devolve o primeiro índice. */
const semSorteio = () => 0;

test('embaralhar devolve uma nova lista com os mesmos itens', () => {
  const original = [1, 2, 3, 4, 5];
  const saida = embaralhar(original, semSorteio);
  assert.notEqual(saida, original);
  assert.deepEqual([...saida].sort(), [...original].sort());
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test('cartas novas ou vencidas vêm antes das já revisadas', () => {
  const cards = [
    { frente: 'revisada' },
    { frente: 'nova' },
    { frente: 'vencida' },
  ];
  const agora = 1000;
  const srs = {
    revisada: { next: agora + 5000 },
    vencida: { next: agora - 1 },
  };

  const deck = montarDeckDaFase(cards, srs, agora, semSorteio);
  assert.equal(deck.length, 3);
  assert.equal(deck[deck.length - 1].frente, 'revisada');
  assert.deepEqual(deck.slice(0, 2).map((c) => c.frente).sort(), ['nova', 'vencida']);
});

test('deck de fase preserva todas as cartas', () => {
  const cards = BANCO_DE_DADOS.fase1;
  const deck = montarDeckDaFase(cards, {}, Date.now(), semSorteio);
  assert.equal(deck.length, cards.length);
});

test('fasesDoModulo segue a composição dos módulos', () => {
  assert.deepEqual(fasesDoModulo('teste-mod1'), ['fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'fase26', 'fase27', 'fase28', 'fase29']);
  assert.deepEqual(fasesDoModulo('teste-mod5'), ['fase21', 'fase22', 'fase23', 'fase24', 'fase25']);
  assert.deepEqual(fasesDoModulo('teste-mod9'), []);
});

test('teste de módulo sorteia 20 questões de múltipla escolha', () => {
  const questoes = montarTesteDoModulo('teste-mod1', { aleatorio: semSorteio });
  assert.equal(questoes.length, QUESTOES_POR_TESTE);

  for (const questao of questoes) {
    assert.ok(isCartaEnade(questao));
    assert.equal(questao.opcoes.length, 4);
    assert.ok(questao.correta >= 0 && questao.correta < 4);
    const escolhida = questao.opcoes[questao.correta];
    assert.ok(escolhida.endsWith(questao.verso), `alternativa correta não bate: ${escolhida}`);
    assert.equal(new Set(questao.opcoes).size, 4, 'alternativas repetidas');
    assert.match(questao.opcoes[0], /^A\) /);
  }
});

test('o teste do módulo 5 usa apenas as fases do ENADE', () => {
  const fasesEnade = ['fase21', 'fase22', 'fase23', 'fase24', 'fase25'];
  const frentesDoModulo = new Set(fasesEnade.flatMap((f) => BANCO_DE_DADOS[f]).map((c) => c.frente));
  for (const questao of montarTesteDoModulo('teste-mod5', { aleatorio: semSorteio })) {
    assert.ok(frentesDoModulo.has(questao.frente), `questão fora do módulo: ${questao.frente}`);
  }
});

test('não repete a mesma questão dentro de um teste', () => {
  let semente = 0;
  const pseudoAleatorio = () => {
    semente = (semente * 9301 + 49297) % 233280;
    return semente / 233280;
  };
  const questoes = montarTesteDoModulo('teste-mod2', { aleatorio: pseudoAleatorio });
  assert.equal(new Set(questoes.map((q) => q.frente)).size, questoes.length);
});
