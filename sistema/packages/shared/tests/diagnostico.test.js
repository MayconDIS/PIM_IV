import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  PERGUNTAS_DIAGNOSTICO, VERSAO_DIAGNOSTICO, PERGUNTAS_POR_MODULO,
  MINIMO_ACERTOS_POR_MODULO, selecionarPerguntasDiagnostico, resultadoDoDiagnostico,
} from '../src/diagnostico.js';
import { MODULOS } from '../src/content.js';
import { ORDEM_FASES } from '../src/gamificacao.js';

const escolhidas = MODULOS.slice(0, 4).flatMap(modulo =>
  PERGUNTAS_DIAGNOSTICO.filter(pergunta => pergunta.modulo === modulo.numero).slice(0, PERGUNTAS_POR_MODULO));
function respostasComAcertos(acertos = [0, 0, 0, 0]) {
  const indices = [0, 0, 0, 0];
  return escolhidas.map(pergunta => ({
    perguntaId: pergunta.id,
    alternativa: indices[pergunta.modulo - 1]++ < acertos[pergunta.modulo - 1] ? pergunta.certa : null,
  }));
}

test('o banco do diagnóstico cobre cada uma das 34 disciplinas dos quatro módulos, com alternativas e explicação', () => {
  const fases = MODULOS.slice(0, 4).flatMap(modulo => modulo.fases.map(fase => fase.id));
  assert.equal(PERGUNTAS_DIAGNOSTICO.length, 34);
  assert.deepEqual(PERGUNTAS_DIAGNOSTICO.map(pergunta => pergunta.faseId), fases);
  assert.equal(new Set(PERGUNTAS_DIAGNOSTICO.map(pergunta => pergunta.id)).size, fases.length);
  assert.deepEqual([1, 2, 3, 4].map(numero => PERGUNTAS_DIAGNOSTICO.filter(p => p.modulo === numero).length), [9, 8, 9, 8]);
  for (const pergunta of PERGUNTAS_DIAGNOSTICO) {
    assert.equal(pergunta.id, `diag-${pergunta.faseId}`);
    assert.equal(pergunta.r.length, 4);
    assert.equal(new Set(pergunta.r).size, 4);
    assert.ok(pergunta.p.length > 20 && pergunta.explicacao.length > 40);
    assert.ok(Number.isInteger(pergunta.certa) && pergunta.certa >= 0 && pergunta.certa < 4);
  }
  assert.equal(new Set(PERGUNTAS_DIAGNOSTICO.map(pergunta => pergunta.certa)).size, 4);
});

test('o sorteio mantém cinco perguntas por módulo sem repetição e não altera o banco', () => {
  const antes = JSON.stringify(PERGUNTAS_DIAGNOSTICO);
  const selecaoA = selecionarPerguntasDiagnostico(() => 0);
  const selecaoB = selecionarPerguntasDiagnostico(() => 0.999);
  for (const selecao of [selecaoA, selecaoB, selecionarPerguntasDiagnostico()]) {
    assert.equal(selecao.length, 20);
    assert.equal(new Set(selecao.map(pergunta => pergunta.id)).size, 20);
    assert.deepEqual([1, 2, 3, 4].map(numero => selecao.filter(p => p.modulo === numero).length), [5, 5, 5, 5]);
  }
  assert.notDeepEqual(selecaoA.map(p => p.id), selecaoB.map(p => p.id));
  assert.equal(JSON.stringify(PERGUNTAS_DIAGNOSTICO), antes);
});

test('o sorteio recusa fontes aleatórias inválidas', () => {
  for (const fonte of [null, 1, () => NaN, () => Infinity, () => -0.1, () => 1, () => '0.5']) {
    assert.throws(() => selecionarPerguntasDiagnostico(fonte));
  }
});

test('Não sei conta como resposta sem acerto e orienta começar pelos fundamentos sem conceder prêmio', () => {
  const resultado = resultadoDoDiagnostico(respostasComAcertos());
  assert.equal(resultado.versao, VERSAO_DIAGNOSTICO);
  assert.equal(resultado.total, 20);
  assert.equal(resultado.acertos, 0);
  assert.equal(resultado.moduloRecomendado, 1);
  assert.equal(resultado.faseRecomendada, 'fase1');
  assert.deepEqual(resultado.fases, ['fase1']);
  assert.ok(resultado.revisoes.every(item => item.respondida === null && !item.acertou));
  for (const campo of ['xp', 'moedas', 'nivel', 'rotuloRank', 'certificadoLiberado', 'fasesConcluidas']) {
    assert.equal(Object.hasOwn(resultado, campo), false, campo);
  }
});

test('o resultado identifica acertos por módulo e recomenda a primeira base ainda não consolidada', () => {
  const respostas = respostasComAcertos([4, 4, 3, 5]);
  const antes = structuredClone(respostas);
  const resultado = resultadoDoDiagnostico(respostas);
  assert.equal(resultado.acertos, 16);
  assert.equal(resultado.moduloRecomendado, 3);
  assert.equal(resultado.faseRecomendada, 'fase11');
  assert.deepEqual(resultado.modulos.map(m => [m.numero, m.acertos, m.total, m.dominio]), [[1, 4, 5, true], [2, 4, 5, true], [3, 3, 5, false], [4, 5, 5, true]]);
  assert.deepEqual(resultado.fases, ORDEM_FASES.slice(0, ORDEM_FASES.indexOf('fase11') + 1));
  assert.equal(resultado.fases.includes('fase12'), false);
  assert.deepEqual(respostas, antes);
});

test('acertos avançados não compensam dificuldades nos fundamentos', () => {
  const resultado = resultadoDoDiagnostico(respostasComAcertos([3, 5, 5, 5]));
  assert.equal(resultado.acertos, 18);
  assert.equal(resultado.moduloRecomendado, 1);
  assert.deepEqual(resultado.fases, ['fase1']);
});

test('dominar os quatro módulos orienta o início do ENADE sem concluir ou liberar automaticamente todo o preparatório', () => {
  const resultado = resultadoDoDiagnostico(respostasComAcertos([5, 5, 5, 5]));
  assert.equal(resultado.acertos, 20);
  assert.equal(resultado.moduloRecomendado, 5);
  assert.equal(resultado.faseRecomendada, 'fase21');
  assert.deepEqual(resultado.fases, ORDEM_FASES.slice(0, ORDEM_FASES.indexOf('fase21') + 1));
  assert.equal(resultado.fases.includes('teste-mod5'), false);
  assert.equal(resultado.fases.some(fase => fase.startsWith('bonus')), false);
  assert.ok(resultado.revisoes.every(item => item.acertou && item.respondida === item.correta));
});

test('o corte exige quatro acertos em cada bloco de cinco, inclusive nas fronteiras entre módulos', () => {
  assert.equal(MINIMO_ACERTOS_POR_MODULO, 4);
  for (let modulo = 1; modulo <= 4; modulo += 1) {
    const abaixo = [5, 5, 5, 5]; abaixo[modulo - 1] = 3;
    assert.equal(resultadoDoDiagnostico(respostasComAcertos(abaixo)).moduloRecomendado, modulo);
    const noCorte = [4, 4, 4, 4];
    assert.equal(resultadoDoDiagnostico(respostasComAcertos(noCorte)).moduloRecomendado, 5);
  }
});

test('respostas incompletas, alternativas inválidas e pontuações antigas são rejeitadas', () => {
  for (const entrada of [undefined, null, NaN, 20, [], respostasComAcertos().slice(1), [...respostasComAcertos(), {}], new Array(20)]) {
    assert.throws(() => resultadoDoDiagnostico(entrada));
  }
  for (const alternativa of [undefined, NaN, Infinity, -1, 4, 0.5, '1', true, {}]) {
    const respostas = respostasComAcertos(); respostas[0].alternativa = alternativa;
    assert.throws(() => resultadoDoDiagnostico(respostas), String(alternativa));
  }
  const omitida = respostasComAcertos(); delete omitida[0].alternativa;
  assert.throws(() => resultadoDoDiagnostico(omitida));
});

test('o resultado rejeita perguntas desconhecidas, repetidas e distribuição desigual entre módulos', () => {
  const desconhecida = respostasComAcertos(); desconhecida[0].perguntaId = 'diag-fase-inexistente';
  assert.throws(() => resultadoDoDiagnostico(desconhecida));
  const repetida = respostasComAcertos(); repetida[1] = { ...repetida[0] };
  assert.throws(() => resultadoDoDiagnostico(repetida));
  const desigual = respostasComAcertos();
  const extra = PERGUNTAS_DIAGNOSTICO.filter(p => p.modulo === 1)[5];
  desigual[19] = { perguntaId: extra.id, alternativa: null };
  assert.throws(() => resultadoDoDiagnostico(desigual), /Cada módulo/);
});

test('a API recebe exatamente o banco, os limites e a ordem de fases do diagnóstico compartilhado', () => {
  const semente = JSON.parse(fs.readFileSync(new URL('../../../apps/api/Data/Seed/diagnostico.json', import.meta.url), 'utf8'));
  assert.equal(semente.versao, VERSAO_DIAGNOSTICO);
  assert.equal(semente.perguntasPorModulo, PERGUNTAS_POR_MODULO);
  assert.equal(semente.minimoAcertosPorModulo, MINIMO_ACERTOS_POR_MODULO);
  assert.deepEqual(semente.perguntas, PERGUNTAS_DIAGNOSTICO);
  assert.deepEqual(semente.ordemFases, ORDEM_FASES);
  assert.deepEqual(semente.modulos, MODULOS.map(({ numero, codigo, titulo, fases, teste }) => ({
    numero, codigo, titulo, fases: fases.map(fase => fase.id), testeId: teste?.id ?? null,
  })));
});
