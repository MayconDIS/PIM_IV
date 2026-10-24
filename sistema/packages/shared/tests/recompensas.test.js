import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { nivelPorXp, recompensa, tabelaDeRecompensas } from '../src/gamificacao.js';

// A API calcula o prêmio com recompensas.json e confere recompensa-casos.json (Recompensas Tests).
// Se algum destes testes falhar depois de mudar o conteúdo ou a regra, rode: npm run seed:api
const ler = (relativo) => JSON.parse(fs.readFileSync(new URL(relativo, import.meta.url), 'utf8'));

test('a tabela da API (recompensas.json) é a mesma do site e do app', () => {
  assert.deepEqual(ler('../../../apps/api/Data/Seed/recompensas.json'), tabelaDeRecompensas());
});

test('os casos de prêmio conferidos pela API batem com o cálculo daqui', () => {
  const casos = ler('./recompensa-casos.json');
  for (const c of casos.premios) assert.deepEqual(recompensa(c.faseId, c), c.esperado, c.faseId);
  for (const n of casos.niveis) assert.equal(nivelPorXp(n.xp), n.nivel);
});

test('toda fase da trilha paga alguma coisa', () => {
  for (const [id, premio] of Object.entries(tabelaDeRecompensas().fases)) assert.ok(premio.xp > 0, id);
});
