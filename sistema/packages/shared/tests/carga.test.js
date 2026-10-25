// Carga: as funções que rodam no navegador e no celular a cada fase aberta aguentam muito mais
// do que o Nex_TI tem? Hoje são 702 cartas; um aluno que estudou tudo tem 702 registros de
// progresso. Os testes usam 50.000 e 100.000 (70 a 140 vezes o real).
//
// Duas checagens por função, como no programa de testes do CasalFlow:
//  - FORMA DA CURVA: dobrar a entrada não pode mais que ~dobrar o tempo (pega um laço dentro de
//    laço, que quadruplica). Não depende da velocidade da máquina.
//  - TETO: um limite em milissegundos com folga de ~10x sobre o medido (pega a função que ficou
//    muito mais lenta sem mudar a curva).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aplicarResposta, ESTADO_INICIAL } from '../src/sm2.js';
import { montarDeckDaFase } from '../src/deck.js';
import { fasesLiberadasNoServidor } from '../src/gamificacao.js';
import { FASES } from '../src/content.js';

/** Menor tempo de 5 rodadas (o menor descarta pausas do coletor de lixo e de outros programas). */
function medir(fn) {
  let melhor = Infinity;
  for (let i = 0; i < 5; i++) {
    const inicio = performance.now();
    fn();
    melhor = Math.min(melhor, performance.now() - inicio);
  }
  return melhor;
}

function curvaLinear(nome, montar, n) {
  const pequeno = montar(n);
  const grande = montar(2 * n);
  const t1 = medir(pequeno);
  const t2 = medir(grande);
  // Linear: ~2x. Laço dentro de laço: ~4x. Margem para o ruído de medir coisas de poucos ms.
  assert.ok(t2 / Math.max(t1, 0.05) < 3.2, `${nome}: ${n} → ${t1.toFixed(2)} ms, ${2 * n} → ${t2.toFixed(2)} ms (razão ${(t2 / t1).toFixed(2)})`);
  return t2;
}

const cartas = (n) => Array.from({ length: n }, (_, i) => ({ id: i, frente: `Pergunta ${i}`, verso: `Resposta ${i}` }));
const progressoDe = (n) => {
  // n registros espalhados pelas fases reais, como o /api/progresso/usuario devolve
  const fases = FASES.filter((f) => f.totalCards > 0);
  return Array.from({ length: n }, (_, i) => ({ codigoFase: fases[i % fases.length].id, flashcardId: i }));
};

test('carga · montarDeckDaFase: linear e abaixo de 100 ms com 100.000 cartas', () => {
  const montar = (n) => {
    const lista = cartas(n);
    const srs = Object.fromEntries(lista.filter((_, i) => i % 2).map((c) => [c.frente, { ...ESTADO_INICIAL, next: Date.now() + 86_400_000 }]));
    return () => montarDeckDaFase(lista, srs);
  };
  const t = curvaLinear('montarDeckDaFase', montar, 50_000);
  assert.ok(t < 100, `100.000 cartas em ${t.toFixed(1)} ms`);
});

test('carga · fasesLiberadasNoServidor: linear e abaixo de 50 ms com 100.000 registros', () => {
  const montar = (n) => {
    const progresso = progressoDe(n);
    return () => fasesLiberadasNoServidor({ nivel: 1, progresso });
  };
  const t = curvaLinear('fasesLiberadasNoServidor', montar, 50_000);
  assert.ok(t < 50, `100.000 registros em ${t.toFixed(1)} ms`);
});

test('carga · aplicarResposta (SM-2): 1 milhão de respostas abaixo de 1 s', () => {
  const respostas = ['again', 'hard', 'good', 'easy'];
  const montar = (n) => () => {
    let estado = ESTADO_INICIAL;
    for (let i = 0; i < n; i++) estado = aplicarResposta(i % 7 === 0 ? ESTADO_INICIAL : estado, respostas[i % 4], 0);
    return estado;
  };
  const t = curvaLinear('aplicarResposta', montar, 500_000);
  assert.ok(t < 1000, `1.000.000 de respostas em ${t.toFixed(1)} ms`);
});

test('carga · o tamanho real (702 cartas) cabe num quadro de tela (16 ms)', () => {
  const lista = cartas(702);
  const progresso = progressoDe(702);
  const t = medir(() => {
    montarDeckDaFase(lista, {});
    fasesLiberadasNoServidor({ nivel: 1, progresso });
  });
  assert.ok(t < 16, `uma fase aberta com o conteúdo real levou ${t.toFixed(2)} ms`);
});
