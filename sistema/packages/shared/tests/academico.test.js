import test from 'node:test';
import assert from 'node:assert/strict';
import { BANCO_DE_DADOS, FASES, MODULOS } from '../src/content.js';
import { DISCIPLINAS_ACADEMICAS } from '../src/academico/catalogo.js';
import { responderPergunta } from '../src/assistente.js';
import { formatarDica } from '../src/rotulos.js';

test('o acervo AVA e ED cobre as 31 disciplinas dos quatro semestres sem criar módulos paralelos', () => {
  assert.deepEqual([1, 2, 3, 4].map(s => DISCIPLINAS_ACADEMICAS.filter(d => d.semestre === s).length), [9, 5, 9, 8]);
  assert.equal(MODULOS.length, 5);
  assert.deepEqual(MODULOS.slice(0, 4).map(m => m.semestre), [1, 2, 3, 4]);
  assert.deepEqual(MODULOS.slice(0, 4).map(m => m.codigo), ['MOD 01', 'MOD 02', 'MOD 03', 'MOD 04']);
  for (const modulo of MODULOS.slice(0, 4)) assert.ok(modulo.nome.startsWith(`Módulo ${modulo.numero}:`));
  assert.equal(formatarDica('ED · 1º semestre · Pense na entrada.'), 'Módulo 1 · Pense na entrada.');
  assert.equal(formatarDica('AVA · 4º semestre · Revise o conceito.'), 'Módulo 4 · Revise o conceito.');
  assert.equal(formatarDica('Dica personalizada: ED e AVA'), 'Dica personalizada: ED e AVA');
  assert.equal(formatarDica(null), '');
  assert.equal(MODULOS[4].id, 'mod5');
  assert.deepEqual(MODULOS[4].fases.map(f => f.id), ['fase21', 'fase22', 'fase23', 'fase24', 'fase25']);
  assert.equal(new Set(DISCIPLINAS_ACADEMICAS.map(d => d.faseId)).size, 31);
});

test('cada disciplina tem resumo, tópicos, cartas e referências verificáveis no acervo', () => {
  for (const d of DISCIPLINAS_ACADEMICAS) {
    assert.ok(['AVA', 'ED'].includes(d.origem), d.nome);
    assert.ok(d.resumo.length >= 2 && d.resumo.join(' ').split(/\s+/).length >= 100, d.nome);
    assert.ok(d.topicos.length >= 4 && d.cartas.length >= 16, d.nome);
    assert.equal(FASES.find(f => f.id === d.faseId)?.academico.id, d.id);
    assert.equal(MODULOS[d.semestre - 1].fases.some(f => f.id === d.faseId), true);
    for (const carta of d.cartas) {
      const fonte = d.fontes.find(f => f.id === carta.fonteId);
      assert.ok(fonte && fonte.paginas.includes(carta.pagina), `${d.nome}: ${carta.frente}`);
      assert.ok(Number.isInteger(carta.pagina) && carta.pagina > 0);
      assert.ok(fonte.arquivo.startsWith(`${d.semestre}° Semestre`), fonte.arquivo);
      assert.ok(carta.verso.length > 30 && carta.frente.length > 15);
    }
  }
});

test('as novas perguntas não colidem com chaves do SM-2 existentes nem entre disciplinas', () => {
  const todas = Object.values(BANCO_DE_DADOS).flat();
  for (const carta of todas.filter(c => c.origemAcademica)) {
    assert.equal(todas.filter(c => c.frente === carta.frente).length, 1, carta.frente);
  }
  assert.equal(BANCO_DE_DADOS.fase1.find(c => c.frente === 'O que é uma Variável?').verso, 'Um espaço reservado na memória para armazenar um dado.');
});

test('o Nexor encontra cartas de todas as disciplinas e explica como acessar a Trilha', () => {
  for (const d of DISCIPLINAS_ACADEMICAS) {
    const carta = d.cartas[0];
    const resposta = responderPergunta(carta.frente);
    assert.ok(resposta.fontes.some(f => f.texto === carta.verso && f.faseId === d.faseId), d.nome);
  }
  assert.match(responderPergunta('Onde fica a trilha?').fontes[0].texto, /Mapa Neural/);
});
