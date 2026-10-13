/**
 * Gera a semente do banco da API C# a partir do conteúdo canônico de @nexti/shared.
 *
 * packages/shared/src/content.js é a fonte da verdade dos flashcards: o React
 * (web e mobile) o importa direto, e a API recebe o mesmo material por
 * apps/api/Data/Seed/conteudo.json, lido pelo ConteudoSeeder no start.
 *
 * Uso: node scripts/gerar-semente-api.mjs [--check]
 *   --check  não escreve nada; falha se o JSON estiver desatualizado.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTEUDO = path.join(ROOT, 'packages', 'shared', 'src', 'content.js');
const SEMENTE = path.join(ROOT, 'apps', 'api', 'Data', 'Seed', 'conteudo.json');
const CHECK = process.argv.includes('--check');

const { BANCO_DE_DADOS, MODULOS } = await import(pathToFileURL(CONTEUDO).href);

const fases = MODULOS.flatMap((m) => [...m.fases, ...(m.bonus ? [m.bonus] : [])]);
const semente = {
  fases: fases.map((f) => ({ codigo: f.id, descricao: f.nome })),
  flashcards: fases.flatMap((f) =>
    (BANCO_DE_DADOS[f.id] ?? []).map((c) => ({
      codigoFase: f.id,
      frente: c.frente,
      verso: c.verso,
      dica: c.dica ?? null,
      opcoes: c.opcoes ?? null,
      correta: c.correta ?? null,
    })),
  ),
};
const json = `${JSON.stringify(semente, null, 2)}\n`;

const atual = fs.existsSync(SEMENTE) ? fs.readFileSync(SEMENTE, 'utf8') : null;
const relativo = path.relative(ROOT, SEMENTE);

if (CHECK) {
  if (atual !== json) {
    console.error(`${relativo} está desatualizado em relação a packages/shared/src/content.js.`);
    console.error('Rode: npm run seed:api');
    process.exit(1);
  }
  console.log(`${relativo} está sincronizado com packages/shared.`);
} else {
  fs.mkdirSync(path.dirname(SEMENTE), { recursive: true });
  fs.writeFileSync(SEMENTE, json, 'utf8');
  console.log(`${relativo}: ${semente.fases.length} fases, ${semente.flashcards.length} flashcards.`);
}
