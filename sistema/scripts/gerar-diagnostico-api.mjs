/** Gera o mesmo banco e a mesma política do diagnóstico para a API. Use --check para conferir. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODULOS } from '../packages/shared/src/content.js';
import { ORDEM_FASES } from '../packages/shared/src/gamificacao.js';
import {
  PERGUNTAS_DIAGNOSTICO, VERSAO_DIAGNOSTICO, PERGUNTAS_POR_MODULO, MINIMO_ACERTOS_POR_MODULO,
} from '../packages/shared/src/diagnostico.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destino = path.join(raiz, 'apps/api/Data/Seed/diagnostico.json');
const dados = {
  versao: VERSAO_DIAGNOSTICO,
  perguntasPorModulo: PERGUNTAS_POR_MODULO,
  minimoAcertosPorModulo: MINIMO_ACERTOS_POR_MODULO,
  modulos: MODULOS.map(({ numero, codigo, titulo, fases, teste }) => ({
    numero, codigo, titulo, fases: fases.map(fase => fase.id), testeId: teste?.id ?? null,
  })),
  ordemFases: ORDEM_FASES,
  perguntas: PERGUNTAS_DIAGNOSTICO,
};
const json = `${JSON.stringify(dados, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (!fs.existsSync(destino) || fs.readFileSync(destino, 'utf8') !== json) {
    console.error('diagnostico.json está desatualizado. Rode node scripts/gerar-diagnostico-api.mjs.');
    process.exit(1);
  }
  console.log('Diagnóstico da API sincronizado: 34 perguntas, 20 por avaliação.');
} else {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, json, 'utf8');
  console.log('Diagnóstico da API gerado: 34 perguntas, 20 por avaliação.');
}
