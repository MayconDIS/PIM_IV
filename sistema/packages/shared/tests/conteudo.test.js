import test from 'node:test';
import assert from 'node:assert/strict';

import { BANCO_DE_DADOS, BONUS, FASES, MODULOS, TESTES, cardsDaFase, moduloDaFase } from '../src/content.js';
import {
  ORDEM_FASES,
  aproveitamento,
  corteDoTeste,
  isBonus,
  isTeste,
  liberaCertificado,
  nivelPorXp,
  passouNoTeste,
  podeComprarBonus,
  progressoDeNivel,
  proximaFase,
  recompensa,
} from '../src/gamificacao.js';

test('o conteúdo canônico tem o material completo', () => {
  assert.equal(Object.keys(BANCO_DE_DADOS).length, 29);
  const total = Object.values(BANCO_DE_DADOS).reduce((soma, cards) => soma + cards.length, 0);
  assert.equal(total, 702);
  assert.equal(MODULOS.length, 5);
  assert.equal(FASES.length, 25);
  assert.equal(BONUS.length, 4);
  assert.equal(TESTES.length, 5);
});

test('toda fase da trilha existe no banco e tem nome legível', () => {
  for (const fase of FASES) {
    assert.ok(cardsDaFase(fase.id).length > 0, `fase sem cards: ${fase.id}`);
    assert.notEqual(fase.nome, fase.id, `fase sem nome: ${fase.id}`);
    assert.equal(fase.totalCards, cardsDaFase(fase.id).length);
  }
  for (const bonus of BONUS) {
    assert.ok(cardsDaFase(bonus.id).length > 0, `bônus sem cards: ${bonus.id}`);
    assert.ok(bonus.custoMoedas > 0, `bônus sem preço: ${bonus.id}`);
  }
});

test('a ordem de desbloqueio cobre todas as fases e testes', () => {
  const naTrilha = new Set(ORDEM_FASES);
  for (const fase of FASES) assert.ok(naTrilha.has(fase.id), `fora da trilha: ${fase.id}`);
  for (const teste of TESTES) assert.ok(naTrilha.has(teste.id), `fora da trilha: ${teste.id}`);
  assert.equal(ORDEM_FASES.length, FASES.length + TESTES.length);
});

test('cada card tem frente e verso, e os do ENADE têm alternativas', () => {
  let comAlternativas = 0;
  for (const [faseId, cards] of Object.entries(BANCO_DE_DADOS)) {
    for (const card of cards) {
      assert.ok(card.frente?.trim(), `card sem frente em ${faseId}`);
      assert.ok(card.verso?.trim(), `card sem verso em ${faseId}`);
      if (card.opcoes) {
        comAlternativas += 1;
        assert.ok(Array.isArray(card.opcoes) && card.opcoes.length >= 2, `alternativas inválidas em ${faseId}`);
        assert.ok(
          Number.isInteger(card.correta) && card.correta >= 0 && card.correta < card.opcoes.length,
          `índice de resposta inválido em ${faseId}`,
        );
      }
    }
  }
  assert.equal(comAlternativas, 146); // 100 no estilo ENADE + 46 das provas oficiais
});

test('moduloDaFase devolve o módulo dono da fase', () => {
  assert.equal(moduloDaFase('fase1').id, 'mod1');
  assert.equal(moduloDaFase('fase21').id, 'mod5');
  assert.equal(moduloDaFase('inexistente'), null);
});

test('ranks mudam nos limites de 100, 300 e 600 XP', () => {
  assert.equal(progressoDeNivel(0).rank, 'Ingressante');
  assert.equal(progressoDeNivel(99).rank, 'Ingressante');
  assert.equal(progressoDeNivel(100).rank, 'Intermediário');
  assert.equal(progressoDeNivel(299).rank, 'Intermediário');
  assert.equal(progressoDeNivel(300).rank, 'Expert');
  assert.equal(progressoDeNivel(599).rank, 'Expert');
  assert.equal(progressoDeNivel(600).rank, 'Mestre da Computação');

  assert.equal(progressoDeNivel(50).percentual, 50);
  assert.equal(progressoDeNivel(200).percentual, 50);
  assert.equal(progressoDeNivel(700).percentual, 100);
  assert.equal(progressoDeNivel(700).rotuloProximo, '⭐ NÍVEL MÁXIMO');
  assert.equal(progressoDeNivel(150).rotuloProgresso, '150 / 300 XP (25%)');

  assert.equal(nivelPorXp(0), 1);
  assert.equal(nivelPorXp(100), 3);
  assert.equal(nivelPorXp(300), 6);
});

test('recompensas seguem a faixa de cada fase', () => {
  assert.deepEqual(recompensa('fase1'), { xp: 5, moedas: 10 });
  assert.deepEqual(recompensa('fase6'), { xp: 10, moedas: 10 });
  assert.deepEqual(recompensa('fase11'), { xp: 15, moedas: 10 });
  assert.deepEqual(recompensa('fase16'), { xp: 20, moedas: 10 });
  assert.deepEqual(recompensa('fase21'), { xp: 30, moedas: 70 });
  assert.deepEqual(recompensa('bonus1'), { xp: 25, moedas: 15 });
});

test('teste de módulo só paga quando o aluno passa', () => {
  assert.equal(corteDoTeste('teste-mod1'), 70);
  assert.equal(corteDoTeste('teste-mod5'), 80);

  assert.deepEqual(recompensa('teste-mod1', { acertos: 7, total: 10 }), { xp: 25, moedas: 0 });
  assert.deepEqual(recompensa('teste-mod1', { acertos: 6, total: 10 }), { xp: 0, moedas: 0 });
  assert.deepEqual(recompensa('teste-mod5', { acertos: 8, total: 10 }), { xp: 50, moedas: 0 });
  assert.deepEqual(recompensa('teste-mod5', { acertos: 7, total: 10 }), { xp: 0, moedas: 0 });

  assert.ok(passouNoTeste('teste-mod2', 7, 10));
  assert.ok(!passouNoTeste('teste-mod5', 7, 10));
  assert.equal(aproveitamento(0, 0), 0);
});

test('a trilha avança na ordem e o ENADE libera o certificado', () => {
  assert.equal(proximaFase('fase5'), 'teste-mod1');
  assert.equal(proximaFase('teste-mod1'), 'fase6');
  assert.equal(proximaFase('fase22'), 'fase23');
  assert.equal(proximaFase('fase25'), 'teste-mod5');
  assert.equal(proximaFase('teste-mod5'), null);
  assert.ok(liberaCertificado('teste-mod5'));
  assert.ok(!liberaCertificado('teste-mod4'));
});

test('classificação de fase, teste e bônus', () => {
  assert.ok(isTeste('teste-mod3'));
  assert.ok(!isTeste('fase3'));
  assert.ok(isBonus('bonus2'));
  assert.ok(podeComprarBonus(50, 50));
  assert.ok(!podeComprarBonus(49, 50));
});
