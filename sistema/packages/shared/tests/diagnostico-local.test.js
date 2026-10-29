import test from 'node:test';
import assert from 'node:assert/strict';
import { selecionarPerguntasDiagnostico, resultadoDoDiagnostico } from '../src/diagnostico.js';
import { ORDEM_FASES } from '../src/gamificacao.js';
import { concluirDiagnosticoLocal, reenviarDiagnostico, lerDiagnosticoLocal } from '../../../apps/react-web/src/lib/diagnosticoLocal.js';
import { dadosLocaisDaConta, encerrarSessaoDaConta } from '../../../apps/react-web/src/lib/conta.js';

function memoria() {
  const dados = new Map();
  return { getItem: k => dados.get(k) ?? null, setItem: (k, v) => dados.set(k, v), removeItem: k => dados.delete(k) };
}
const respostas = selecionarPerguntasDiagnostico(() => .5).map(p => ({ perguntaId: p.id, alternativa: null }));

test('diagnóstico offline guarda respostas por conta e preserva acessos sem tocar no progresso', async () => {
  const storage = memoria();
  storage.setItem('quest_ana_xp', '200'); storage.setItem('quest_ana_srs', '{"carta":1}');
  const resultado = await concluirDiagnosticoLocal({ userKey: 'quest_ana_', respostas, anteriores: ORDEM_FASES,
    temConta: true, online: false, storage });
  assert.equal(resultado.moduloRecomendado, 1);
  assert.deepEqual(resultado.fasesLiberadas, ORDEM_FASES);
  assert.equal(resultado.sincronizacao, 'pendente');
  assert.equal(storage.getItem('quest_ana_xp'), '200');
  assert.equal(storage.getItem('quest_ana_srs'), '{"carta":1}');
  assert.deepEqual(lerDiagnosticoLocal('quest_ana_', 'diagnostico_pendente', storage).respostas, respostas);
  assert.equal(lerDiagnosticoLocal('quest_bia_', 'diagnostico_pendente', storage), null);
});

test('falha ao enviar diagnóstico não informa sucesso e o reenvio usa o resultado do servidor', async () => {
  const storage = memoria();
  const falha = () => { throw new Error('Sem conexão'); };
  const local = await concluirDiagnosticoLocal({ userKey: 'quest_ana_', respostas, temConta: true, online: true, storage, enviar: falha });
  assert.equal(local.sincronizacao, 'pendente');
  await assert.rejects(reenviarDiagnostico('quest_ana_', falha, storage), /Sem conexão/);
  assert.ok(lerDiagnosticoLocal('quest_ana_', 'diagnostico_pendente', storage));
  const servidor = { ...resultadoDoDiagnostico(respostas), fasesLiberadas: ORDEM_FASES, realizadoEm: '2026-10-26T18:00:00Z' };
  const salvo = await reenviarDiagnostico('quest_ana_', async enviadas => { assert.deepEqual(enviadas, respostas); return servidor; }, storage);
  assert.equal(salvo.sincronizacao, 'salvo');
  assert.deepEqual(salvo.fasesLiberadas, ORDEM_FASES);
  assert.equal(lerDiagnosticoLocal('quest_ana_', 'diagnostico_pendente', storage), null);
});

test('diagnóstico inválido não grava resultado nem envia requisição', async () => {
  const storage = memoria(); let enviou = false;
  await assert.rejects(concluirDiagnosticoLocal({ userKey: 'quest_ana_', respostas: [], temConta: true, online: true, storage,
    enviar: () => { enviou = true; } }));
  assert.equal(enviou, false); assert.equal(storage.getItem('quest_ana_diagnostico'), null);
});

test('sem armazenamento nem conexão, resultado informa que existe só na sessão', async () => {
  const storage = { getItem: () => null, setItem: () => { throw new Error('Cota'); }, removeItem: () => {} };
  const resultado = await concluirDiagnosticoLocal({ userKey: 'quest_ana_', respostas, temConta: true, online: false, storage });
  assert.equal(resultado.sincronizacao, 'sessao');
});

test('exportação e exclusão local incluem diagnóstico, respostas pendentes e rascunho da conta correta', () => {
  const storage = memoria();
  for (const chave of ['diagnostico', 'diagnostico_pendente', 'diagnostico_rascunho']) storage.setItem('quest_ana_' + chave, '{}');
  storage.setItem('quest_ana_bia_diagnostico', '{}');
  assert.equal(Object.keys(dadosLocaisDaConta('ana', storage)).length, 3);
  encerrarSessaoDaConta('ana', true, storage);
  assert.deepEqual(dadosLocaisDaConta('ana', storage), {});
  assert.equal(storage.getItem('quest_ana_bia_diagnostico'), '{}');
});

function adiada() {
  let resolver;
  const promessa = new Promise(resolve => { resolver = resolve; });
  return { promessa, resolver };
}
function remotoDas(enviadas) {
  const resultado = resultadoDoDiagnostico(enviadas);
  return { ...resultado, fasesLiberadas: resultado.fases, realizadoEm: '2026-10-26T18:00:00Z' };
}

test('a resposta de um envio antigo não apaga um rascunho iniciado depois', async () => {
  const storage = memoria(), iniciou = adiada(), retorno = adiada();
  const envio = concluirDiagnosticoLocal({ userKey: 'ana_', respostas, temConta: true, online: true, storage,
    enviar: () => { iniciou.resolver(); return retorno.promessa; } });
  await iniciou.promessa;
  const novoRascunho = { versao: 2, ids: ['pergunta-nova'], respostas: [] };
  storage.setItem('ana_diagnostico_rascunho', JSON.stringify(novoRascunho));
  retorno.resolver(remotoDas(respostas));
  await envio;
  assert.deepEqual(lerDiagnosticoLocal('ana_', 'diagnostico_rascunho', storage), novoRascunho);
});

test('avaliações concorrentes enviam em ordem e o retorno antigo não substitui a tentativa nova', async () => {
  const storage = memoria(), inicioA = adiada(), inicioB = adiada(), retornoA = adiada(), retornoB = adiada();
  const novas = selecionarPerguntasDiagnostico(() => .2).map(p => ({ perguntaId: p.id, alternativa: p.certa }));
  const chamadas = [];
  const primeira = concluirDiagnosticoLocal({ userKey: 'ana_', respostas, temConta: true, online: true, storage,
    enviar: () => { chamadas.push('antiga'); inicioA.resolver(); return retornoA.promessa; } });
  await inicioA.promessa;
  const segunda = concluirDiagnosticoLocal({ userKey: 'ana_', respostas: novas, temConta: true, online: true, storage,
    enviar: () => { chamadas.push('nova'); inicioB.resolver(); return retornoB.promessa; } });
  await Promise.resolve();
  assert.deepEqual(chamadas, ['antiga']);
  retornoA.resolver(remotoDas(respostas));
  const retornoAntigo = await primeira;
  await inicioB.promessa;
  assert.equal(retornoAntigo.acertos, 20);
  assert.deepEqual(lerDiagnosticoLocal('ana_', 'diagnostico_pendente', storage).respostas, novas);
  assert.equal(lerDiagnosticoLocal('ana_', 'diagnostico', storage).acertos, 20);
  retornoB.resolver(remotoDas(novas));
  const resultado = await segunda;
  assert.equal(resultado.acertos, 20);
  assert.equal(resultado.sincronizacao, 'salvo');
  assert.deepEqual(chamadas, ['antiga', 'nova']);
  assert.equal(lerDiagnosticoLocal('ana_', 'diagnostico_pendente', storage), null);
});

test('um reenvio antigo não remove respostas de um diagnóstico novo concluído sem conexão', async () => {
  const storage = memoria(), inicio = adiada(), retorno = adiada();
  await concluirDiagnosticoLocal({ userKey: 'ana_', respostas, temConta: true, online: false, storage });
  const reenvio = reenviarDiagnostico('ana_', () => { inicio.resolver(); return retorno.promessa; }, storage);
  await inicio.promessa;
  const novas = selecionarPerguntasDiagnostico(() => .1).map(p => ({ perguntaId: p.id, alternativa: p.certa }));
  const local = await concluirDiagnosticoLocal({ userKey: 'ana_', respostas: novas, temConta: true, online: false, storage });
  retorno.resolver(remotoDas(respostas));
  const resultado = await reenvio;
  assert.equal(resultado.tentativaId, local.tentativaId);
  assert.equal(resultado.sincronizacao, 'pendente');
  assert.deepEqual(lerDiagnosticoLocal('ana_', 'diagnostico_pendente', storage).respostas, novas);
  assert.equal(lerDiagnosticoLocal('ana_', 'diagnostico', storage).acertos, 20);
});

test('dois cliques de reenvio não duplicam o POST da mesma tentativa', async () => {
  const storage = memoria(), inicio = adiada(), retorno = adiada(); let chamadas = 0;
  await concluirDiagnosticoLocal({ userKey: 'ana_', respostas, temConta: true, online: false, storage });
  const enviar = () => { chamadas++; inicio.resolver(); return retorno.promessa; };
  const primeiro = reenviarDiagnostico('ana_', enviar, storage);
  await inicio.promessa;
  const segundo = reenviarDiagnostico('ana_', enviar, storage);
  retorno.resolver(remotoDas(respostas));
  const resultados = await Promise.all([primeiro, segundo]);
  assert.equal(chamadas, 1);
  assert.ok(resultados.every(resultado => resultado.sincronizacao === 'salvo'));
});

test('respostas retidas na sessão podem ser reenviadas quando o armazenamento está cheio', async () => {
  const storage = { getItem: () => null, setItem: () => { throw new Error('Cota'); }, removeItem: () => {} };
  await concluirDiagnosticoLocal({ userKey: 'ana_', respostas, temConta: true, online: false, storage });
  let chamadas = 0;
  const resultado = await reenviarDiagnostico('ana_', async enviadas => {
    chamadas++; assert.deepEqual(enviadas, respostas); return remotoDas(enviadas);
  }, storage);
  assert.equal(chamadas, 1);
  assert.equal(resultado.sincronizacao, 'salvo');
  assert.equal(await reenviarDiagnostico('ana_', () => { throw new Error('Não deve reenviar'); }, storage), null);
});
