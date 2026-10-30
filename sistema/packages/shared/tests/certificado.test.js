import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gerarCertificadoHtml } from '../../../apps/react-web/src/lib/certificado.js';

test('certificado impresso traz o "TI" do Nex_TI em cor sólida e escapa o nome', () => {
  const html = gerarCertificadoHtml({ nome: '<admin>', dataPorExtenso: '30 de outubro de 2026', codigo: 'NEX-TESTE' });
  const marca = html.match(/<svg class="marca"[\s\S]*?<\/svg>/)[0];
  assert.match(marca, /Nex_<tspan fill="#00e6e6">T<\/tspan><tspan fill="#8a2be2">I<\/tspan>/);
  assert.doesNotMatch(marca, /url\(/, 'um url(#...) no iframe de impressão some do papel');
  assert.ok(html.includes('&lt;admin&gt;') && !html.includes('<admin>'));
});
