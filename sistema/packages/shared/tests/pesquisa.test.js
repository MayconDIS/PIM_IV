import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LINK_PESQUISA } from '../../../apps/react-web/src/lib/pesquisa.js';

test('o link do painel e o endereço curto /pesquisa levam ao mesmo formulário', () => {
  const vercel = JSON.parse(readFileSync(new URL('../../../apps/react-web/vercel.json', import.meta.url), 'utf8'));
  const redirect = vercel.redirects.find((r) => r.source === '/pesquisa');
  assert.ok(redirect, 'falta o redirect /pesquisa no vercel.json');
  assert.equal(redirect.destination, LINK_PESQUISA);
  assert.match(LINK_PESQUISA, /^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/viewform$/);
});
