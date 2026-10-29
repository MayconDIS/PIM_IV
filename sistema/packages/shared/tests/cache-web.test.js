import test from 'node:test';
import assert from 'node:assert/strict';

const valores = new Map();
globalThis.localStorage = {
  getItem: (chave) => valores.get(chave) ?? null,
  setItem: (chave, valor) => valores.set(chave, String(valor)),
};
const { migrarDecksAcademicos, carregarDecks, gravaJson, consultarCartasDaFase, cartasConfirmadasPelaApi,
  exportarMetadadosDoConteudo, restaurarDecksDoBackup } =
  await import('../../../apps/react-web/src/context/estudo/apoio.js');
const { ApiService } = await import('../src/api.js');

const antiga = { frente: 'Carta antiga', verso: 'Resposta antiga' };
const academica = { frente: 'Nova carta AVA', verso: 'Resposta acadêmica', origemAcademica: { disciplinaId: 'ciber', fonteId: 'livro', pagina: 12 } };
const banco = { fase1: [antiga, academica], fase26: [{ ...academica, frente: 'Outra disciplina' }] };

test('cache acadêmico acrescenta novas cartas sem mudar as antigas e as criadas pelo aluno', () => {
  const local = { frente: 'Carta do aluno', verso: 'Resposta pessoal' };
  const salvo = { fase1: [{ ...antiga, verso: 'Resposta editada pelo Tutor' }, local] };
  const migrado = migrarDecksAcademicos(salvo, banco);
  assert.equal(migrado.decks.fase1.length, 3);
  assert.equal(migrado.decks.fase1[0].verso, 'Resposta editada pelo Tutor');
  assert.deepEqual(migrado.decks.fase1[1], local);
  assert.deepEqual(migrado.decks.fase26, banco.fase26);
  assert.equal(salvo.fase1.length, 2);
});

test('cache não reinsere cartas acadêmicas removidas depois da primeira incorporação', () => {
  const primeira = migrarDecksAcademicos({ fase1: [antiga] }, banco);
  primeira.decks.fase1 = [];
  const segunda = migrarDecksAcademicos(primeira.decks, banco, primeira.incorporadas);
  assert.deepEqual(segunda.decks.fase1, []);
  assert.equal(segunda.incorporadas.length, primeira.incorporadas.length);
});

test('consulta à API vazia prevalece sobre cartas antigas do cache e é persistida', async () => {
  let persistidas;
  const cartas = await consultarCartasDaFase({ faseId: 'fase1', online: true,
    consultar: async () => [], locais: [antiga], salvar: (valor) => { persistidas = valor; } });
  assert.deepEqual(cartas, []);
  assert.deepEqual(persistidas, []);
});

test('consulta mantém IDs e edição remota; sem internet usa o último deck conhecido', async () => {
  const remota = { id: 123, ...academica, verso: 'Explicação revisada pelo Tutor' };
  const confirmadas = cartasConfirmadasPelaApi('fase1', [remota], banco);
  assert.equal(confirmadas[0].id, 123);
  assert.equal(confirmadas[0].verso, remota.verso);
  assert.deepEqual(confirmadas[0].origemAcademica, academica.origemAcademica);
  const offline = await consultarCartasDaFase({ faseId: 'fase1', online: true,
    consultar: async () => { throw new Error('Sem rede'); }, locais: confirmadas,
    salvar: () => assert.fail('Falha de rede não deve sobrescrever o cache') });
  assert.deepEqual(offline, confirmadas);
});

test('migração do cache é atômica e mantém SM-2 e XP do aluno intactos', () => {
  const chave = 'quest_Migracao_decks';
  valores.set(chave, JSON.stringify({ fase1: [antiga] }));
  valores.set('quest_Migracao_srs', JSON.stringify({ [antiga.frente]: { rep: 4, interval: 30 } }));
  valores.set('quest_Migracao_xp', '150');
  const srs = valores.get('quest_Migracao_srs');
  const decks = carregarDecks(chave);
  const salvo = JSON.parse(valores.get(chave));
  assert.equal(salvo.versaoConteudo, 1);
  assert.deepEqual(salvo.decks, decks);
  assert.ok(Array.isArray(salvo.incorporadas));
  gravaJson(chave, { ...decks, fase1: [] });
  assert.deepEqual(carregarDecks(chave).fase1, []);
  assert.equal(valores.get('quest_Migracao_srs'), srs);
  assert.equal(valores.get('quest_Migracao_xp'), '150');
});

test('sem espaço para gravar, a migração e as exclusões continuam consistentes na sessão', () => {
  const original = globalThis.localStorage.setItem;
  globalThis.localStorage.setItem = () => { throw new Error('Sem espaço'); };
  try {
    const chave = 'quest_SemEspaco_decks';
    const decks = carregarDecks(chave);
    gravaJson(chave, { ...decks, fase1: [] });
    assert.deepEqual(carregarDecks(chave).fase1, []);
  } finally { globalThis.localStorage.setItem = original; }
});

test('backup restaura exclusões e IDs sem reinserir cartas, e ainda aceita backups antigos', () => {
  const origem = 'quest_BackupOrigem_decks';
  const decks = carregarDecks(origem);
  const preservada = { id: 456, ...antiga, verso: 'Resposta do Tutor' };
  gravaJson(origem, { ...decks, fase1: [], fase2: [preservada] });
  const backup = JSON.parse(JSON.stringify({
    decks: carregarDecks(origem), migracaoConteudo: exportarMetadadosDoConteudo(origem),
  }));
  const destino = 'quest_BackupDestino_decks';
  restaurarDecksDoBackup(destino, backup.decks, backup.migracaoConteudo);
  const restaurados = carregarDecks(destino);
  assert.deepEqual(restaurados.fase1, []);
  assert.deepEqual(restaurados.fase2, [preservada]);
  assert.deepEqual(JSON.parse(valores.get(destino)).incorporadas, backup.migracaoConteudo.incorporadas);
  const legado = 'quest_BackupLegado_decks';
  restaurarDecksDoBackup(legado, { fase1: [antiga] });
  const migrados = carregarDecks(legado);
  assert.deepEqual(migrados.fase1[0], antiga);
  assert.ok(migrados.fase1.some(carta => carta.origemAcademica));
});

test('cliente HTTP diferencia fase vazia de erro para não apagar o cache quando a rede falha', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({ ok: true, json: async () => [] });
    assert.deepEqual(await ApiService.getFlashcardsPorFase('fase1'), []);
    globalThis.fetch = async () => ({ ok: false, status: 503 });
    await assert.rejects(ApiService.getFlashcardsPorFase('fase1'));
    globalThis.fetch = async () => { throw new TypeError('Sem conexão'); };
    await assert.rejects(ApiService.getFlashcardsPorFase('fase1'));
    let gravou = false;
    const cartas = await consultarCartasDaFase({ faseId: 'fase1', online: true,
      consultar: ApiService.getFlashcardsPorFase, locais: [antiga], salvar: () => { gravou = true; } });
    assert.deepEqual(cartas, [antiga]);
    assert.equal(gravou, false);
  } finally { globalThis.fetch = original; }
});
