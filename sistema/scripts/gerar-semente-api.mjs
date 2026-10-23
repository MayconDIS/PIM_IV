/**
 * Gera a semente do banco da API C# a partir do conteúdo canônico de @nexti/shared.
 *
 * packages/shared/src/content.js é a fonte da verdade dos flashcards: o React
 * (web e mobile) o importa direto, e a API recebe o mesmo material por
 * apps/api/Data/Seed/conteudo.json, lido pelo ConteudoSeeder no start.
 * As provas oficiais do ENADE (packages/shared/src/enadeOficial.js) vão para
 * apps/api/Data/Seed/simulados.json, lido pelo SimuladoSeeder.
 *
 * Uso: node scripts/gerar-semente-api.mjs [--check]
 *   --check  não escreve nada; falha se algum JSON estiver desatualizado.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTEUDO = path.join(ROOT, 'packages', 'shared', 'src', 'content.js');
const ENADE = path.join(ROOT, 'packages', 'shared', 'src', 'enadeOficial.js');
const SEMENTE = path.join(ROOT, 'apps', 'api', 'Data', 'Seed', 'conteudo.json');
const SIMULADOS = path.join(ROOT, 'apps', 'api', 'Data', 'Seed', 'simulados.json');
const CHECK = process.argv.includes('--check');

const { BANCO_DE_DADOS, MODULOS } = await import(pathToFileURL(CONTEUDO).href);
const { PROVAS_ENADE, indiceDaLetra } = await import(pathToFileURL(ENADE).href);

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

const simulados = {
  provas: PROVAS_ENADE.map((p) => ({
    ano: p.ano,
    tipo: p.tipo,
    questoes: p.questoes.map((q) => ({
      numero: q.numero,
      area: q.area,
      enunciado: q.enunciado,
      alternativas: q.opcoes,
      correta: indiceDaLetra(q.correta),
    })),
  })),
};

const arquivos = [
  [SEMENTE, semente, `${semente.fases.length} fases, ${semente.flashcards.length} flashcards`],
  [SIMULADOS, simulados, `${simulados.provas.length} provas, ${simulados.provas.reduce((n, p) => n + p.questoes.length, 0)} questões`],
];

let desatualizado = false;
for (const [destino, dados, resumo] of arquivos) {
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
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, json, 'utf8');
    console.log(`${relativo}: ${resumo}.`);
  }
}

if (desatualizado) {
  console.error('Rode: npm run seed:api');
  process.exit(1);
}
