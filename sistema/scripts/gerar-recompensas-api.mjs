/**
 * Gera, a partir de packages/shared/src/gamificacao.js (que lê o conteúdo):
 *  - apps/api/Data/Seed/recompensas.json: a tabela de XP, moedas, notas de corte e níveis
 *    que a API usa para calcular o prêmio no servidor;
 *  - packages/shared/tests/recompensa-casos.json: casos (fase, acertos, total → prêmio)
 *    que o teste em C# confere contra o cálculo da API.
 *
 * Uso: node scripts/gerar-recompensas-api.mjs [--check]
 *   --check  não escreve nada; falha se algum JSON estiver desatualizado.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GAMIFICACAO = path.join(ROOT, 'packages', 'shared', 'src', 'gamificacao.js');
const TABELA = path.join(ROOT, 'apps', 'api', 'Data', 'Seed', 'recompensas.json');
const CASOS = path.join(ROOT, 'packages', 'shared', 'tests', 'recompensa-casos.json');
const CHECK = process.argv.includes('--check');

const { tabelaDeRecompensas, recompensa, nivelPorXp } = await import(pathToFileURL(GAMIFICACAO).href);
const tabela = tabelaDeRecompensas();

const casos = {
  premios: [
    ...Object.keys(tabela.fases).map((faseId) => ({ faseId, acertos: 0, total: 0 })),
    ...Object.keys(tabela.bonus).map((faseId) => ({ faseId, acertos: 0, total: 0 })),
    ...Object.keys(tabela.testes).flatMap((faseId) => [
      { faseId, acertos: 20, total: 20 },
      { faseId, acertos: 16, total: 20 },
      { faseId, acertos: 14, total: 20 },
      { faseId, acertos: 13, total: 20 },
      { faseId, acertos: 0, total: 0 },
    ]),
    { faseId: 'fase-que-nao-existe', acertos: 0, total: 0 },
  ].map((c) => ({ ...c, esperado: recompensa(c.faseId, c) })),
  niveis: [0, 99, 100, 299, 300, 5000].map((xp) => ({ xp, nivel: nivelPorXp(xp) })),
};

let desatualizado = false;
for (const [destino, dados] of [[TABELA, tabela], [CASOS, casos]]) {
  const json = `${JSON.stringify(dados, null, 2)}\n`;
  const atual = fs.existsSync(destino) ? fs.readFileSync(destino, 'utf8') : null;
  const relativo = path.relative(ROOT, destino);
  if (CHECK) {
    if (atual !== json) {
      console.error(`${relativo} está desatualizado em relação a packages/shared.`);
      desatualizado = true;
    } else {
      console.log(`${relativo} está sincronizado com packages/shared.`);
    }
  } else {
    fs.writeFileSync(destino, json, 'utf8');
    console.log(`${relativo}: gerado.`);
  }
}

if (desatualizado) {
  console.error('Rode: npm run seed:api');
  process.exit(1);
}
