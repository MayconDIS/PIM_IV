/**
 * Gera tests/sm2-casos.json a partir de src/sm2.js, a regra oficial do SM-2.
 *
 * O mesmo arquivo é testado aqui (sm2-casos.test.js) e na API C#
 * (tests/NexTI_API.Tests/Sm2EngineTests.cs): se as duas regras divergirem,
 * os dois testes quebram. Rode depois de mudar a regra: node tests/gerar-sm2-casos.mjs
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { aplicarResposta, ESTADO_INICIAL } from '../src/sm2.js';

export const SEQUENCIAS = [
  ['carta nova: Errei', ['again']],
  ['carta nova: Difícil', ['hard']],
  ['carta nova: Bom', ['good']],
  ['carta nova: Fácil', ['easy']],
  ['Bom, Bom, Bom', ['good', 'good', 'good']],
  ['Fácil, Fácil, Fácil', ['easy', 'easy', 'easy']],
  ['Bom, Difícil, Bom', ['good', 'hard', 'good']],
  ['Bom, Bom, Errei, Bom', ['good', 'good', 'again', 'good']],
  ['Difícil 12 vezes (soma pelo menos 1 dia; o fator para em 1,3)', Array(12).fill('hard')],
  ['Errei 8 vezes (o fator para em 1,3)', Array(8).fill('again')],
  ['Fácil, Bom, Difícil, Errei, Bom, Fácil', ['easy', 'good', 'hard', 'again', 'good', 'easy']],
  ['Fácil 20 vezes (o intervalo para em 36.500 dias)', Array(20).fill('easy')],
];

const arredondar = (x) => Math.round(x * 1e6) / 1e6;

export function calcularCasos() {
  return SEQUENCIAS.map(([nome, respostas]) => {
    let estado = { ...ESTADO_INICIAL };
    for (const resposta of respostas) estado = aplicarResposta(estado, resposta, 0);
    return {
      nome,
      respostas,
      esperado: { repeticoes: estado.rep, intervaloDias: estado.interval, fatorFacilidade: arredondar(estado.ease) },
    };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const destino = new URL('./sm2-casos.json', import.meta.url);
  fs.writeFileSync(destino, `${JSON.stringify(calcularCasos(), null, 2)}\n`);
  console.log(`sm2-casos.json: ${SEQUENCIAS.length} casos`);
}
