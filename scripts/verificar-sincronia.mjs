#!/usr/bin/env node
/**
 * Confere se as três partes do projeto (sistema, modelagem-uml e relatorio) contam a mesma história.
 * Cada número escrito nos documentos é comparado com o que existe de verdade no código e no Astah.
 *
 * Uso: node scripts/verificar-sincronia.mjs   (sai com erro se alguma checagem falhar)
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const ler = (rel) => readFileSync(join(RAIZ, rel), 'utf8');
const existe = (rel) => existsSync(join(RAIZ, rel));
const hash = (rel) => createHash('sha1').update(readFileSync(join(RAIZ, rel))).digest('hex');

function arquivos(dir, filtro = () => true) {
  const saida = [];
  const andar = (d) => {
    for (const nome of readdirSync(d)) {
      if (['node_modules', '.git', 'bin', 'obj', 'dist', '.agents'].includes(nome)) continue;
      const caminho = join(d, nome);
      if (statSync(caminho).isDirectory()) andar(caminho);
      else if (filtro(caminho)) saida.push(relative(RAIZ, caminho).replaceAll('\\', '/'));
    }
  };
  andar(join(RAIZ, dir));
  return saida;
}

const falhas = [];
const ok = [];
const checar = (nome, passou, detalhe) => (passou ? ok : falhas).push(`${nome}${detalhe ? ` — ${detalhe}` : ''}`);

// Documentos que falam do projeto: o que eles dizem tem de bater com o código.
const DOCUMENTOS = [
  'README.md', 'sistema/README.md', 'sistema/docs/MANUAL_TECNICO.md', 'modelagem-uml/README.md',
  'modelagem-uml/02_Modelagem_UML/gerador-astah/README.md', 'modelagem-uml/04_Banco_de_Dados/README.md',
  'relatorio/README.md', 'relatorio/index.html', 'sistema/docs/TESTES.md',
].filter(existe);
// A apresentação de P.A. em .NET é uma atividade à parte: fala só do Nex_TI Desktop e é conferida
// com o próprio programa (seção 2b), não com os números do site e da API.
const DOCUMENTOS_DESKTOP = ['sistema/apps/desktop/README.md', 'sistema/apps/desktop/ESTUDOS.md', 'sistema/apps/desktop/docs/apresentacao/slides.html',
  'sistema/apps/desktop/docs/apresentacao/ROTEIRO_DO_PALESTRANTE.md'].filter(existe);
// Sem as tags e com um espaço só entre as palavras: assim "<p>90</p><p>testes da API</p>" também é lido como "90 testes da API".
const semTags = (d) => ler(d).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const textos = Object.fromEntries(DOCUMENTOS.map((d) => [d, semTags(d)]));
const textosDesktop = Object.fromEntries(DOCUMENTOS_DESKTOP.map((d) => [d, semTags(d)]));

function citacoes(regex, deQuais = textos) {
  const achados = [];
  for (const [doc, texto] of Object.entries(deQuais)) for (const m of texto.matchAll(regex)) achados.push({ doc, m });
  return achados;
}

// --- 1. rotas da API ------------------------------------------------------------------
const rotas = new Set();
for (const f of arquivos('sistema/apps/api', (c) => c.endsWith('.cs'))) {
  for (const m of ler(f).matchAll(/\.Map(Get|Post|Put|Delete)\("([^"]*)"/g)) rotas.add(`${m[1]} ${m[2]}`);
}
for (const { doc, m } of citacoes(/\b(\d+) rotas\b/g)) {
  const n = Number(m[1]);
  if (n === 7) continue; // as 7 rotas do PIM III, citadas só na comparação de melhorias
  checar(`rotas em ${doc}`, n === rotas.size, `diz ${n}, o código tem ${rotas.size}`);
}

// --- 2. fases e cartas ------------------------------------------------------------------
const conteudo = JSON.parse(ler('sistema/apps/api/Data/Seed/conteudo.json'));
const fases = conteudo.fases.length;
const cartas = conteudo.flashcards.length;
for (const { doc, m } of citacoes(/\b(\d+) fases(?:,| e) (\d+) (?:cartas|flashcards)\b/g)) {
  checar(`fases e cartas em ${doc}`, Number(m[1]) === fases && Number(m[2]) === cartas,
    `diz ${m[1]} fases e ${m[2]} cartas, o conteúdo tem ${fases} e ${cartas}`);
}

// --- 2b. Nex_TI Desktop: os documentos dele batem com o próprio programa -------------------
// O desktop carrega só as fases da trilha (fase1 a fase25), sem os bônus (SemeadorDeConteudo.cs).
const fasesDesktop = conteudo.fases.filter((f) => f.codigo.startsWith('fase')).map((f) => f.codigo);
const cartasDesktop = conteudo.flashcards.filter((c) => fasesDesktop.includes(c.codigoFase)).length;
for (const { doc, m } of citacoes(/\b(\d+) fases(?:,| e) (\d+) (?:cartas|flashcards)\b/g, textosDesktop)) {
  checar(`fases e cartas em ${doc}`, Number(m[1]) === fasesDesktop.length && Number(m[2]) === cartasDesktop,
    `diz ${m[1]} fases e ${m[2]} cartas, o desktop carrega ${fasesDesktop.length} e ${cartasDesktop}`);
}
for (const { doc, m } of citacoes(/\b(\d+) fases\b/g, textosDesktop)) {
  checar(`fases em ${doc}`, Number(m[1]) === fasesDesktop.length, `diz ${m[1]}, o desktop carrega ${fasesDesktop.length}`);
}
// Testes do desktop: cada [Fact] e cada [InlineData] é um teste; a teoria do SM-2 roda um por caso do sm2-casos.json.
let testesDesktop = 0;
for (const f of arquivos('sistema/apps/desktop/tests', (c) => c.endsWith('.cs'))) {
  const codigo = ler(f);
  testesDesktop += (codigo.match(/\[Fact\]/g) ?? []).length + (codigo.match(/\[InlineData\(/g) ?? []).length;
  if (codigo.includes('MemberData(nameof(CasosSm2))')) testesDesktop += JSON.parse(ler('sistema/packages/shared/tests/sm2-casos.json')).length;
}
for (const { doc, m } of citacoes(/\b(\d+) testes\b/g, textosDesktop)) {
  checar(`testes do desktop em ${doc}`, Number(m[1]) === testesDesktop, `diz ${m[1]}, os testes do desktop são ${testesDesktop}`);
}

// --- 3. testes da API: o mesmo número em todos os documentos --------------------------
const testes = citacoes(/\b(\d+) testes(?: automáticos)? da API\b/g).map(({ doc, m }) => ({ doc, n: Number(m[1]) }));
const valores = [...new Set(testes.map((t) => t.n))];
checar('testes da API iguais em todos os documentos', valores.length <= 1,
  testes.map((t) => `${t.doc}: ${t.n}`).join('; '));

// --- 3b. testes do pacote compartilhado: cada test(...) dos arquivos de teste é um teste ---------
let testesShared = 0;
for (const f of arquivos('sistema/packages/shared/tests', (c) => c.endsWith('.test.js'))) {
  testesShared += (ler(f).match(/^\s*test\(/gm) ?? []).length;
}
for (const { doc, m } of [...citacoes(/\b(\d+) (?:no|do) pacote compartilhado\b/g), ...citacoes(/Pacote compartilhado[^|]*\| (\d+) \|/g)]) {
  checar(`testes do pacote compartilhado em ${doc}`, Number(m[1]) === testesShared, `diz ${m[1]}, os arquivos de teste têm ${testesShared}`);
}

// --- 4. diagramas: só do Astah ----------------------------------------------------------
const ASTAH = 'modelagem-uml/02_Modelagem_UML/imagens-astah';
// O Nex_TI Desktop (apresentação de P.A. em .NET) tem um .asta à parte, guardado com o programa em
// sistema/apps/desktop/docs/diagramas, com as imagens exportadas pelo Astah em exportadas-astah.
const DESKTOP = 'sistema/apps/desktop/docs/diagramas/exportadas-astah';
const pngsAstah = arquivos(ASTAH, (c) => c.endsWith('.png')).filter((f) => !f.startsWith(`${DESKTOP}/`));
const pastasCasos = readdirSync(join(RAIZ, ASTAH, 'Casos de uso')).filter((n) => statSync(join(RAIZ, ASTAH, 'Casos de uso', n)).isDirectory());
for (const { doc, m } of citacoes(/\b(\d+) diagramas\b/g)) {
  if (doc.includes('ROTEIRO')) continue; // o roteiro conta os diagramas mostrados nos slides
  checar(`diagramas em ${doc}`, Number(m[1]) === pngsAstah.length, `diz ${m[1]}, o Astah exportou ${pngsAstah.length}`);
}
for (const { doc, m } of citacoes(/\b(\d+) casos de uso\b/g)) {
  checar(`casos de uso em ${doc}`, Number(m[1]) === pastasCasos.length, `diz ${m[1]}, o .asta tem ${pastasCasos.length}`);
}
const puml = arquivos('modelagem-uml', (c) => c.endsWith('.puml'));
checar('nenhum diagrama em PlantUML', puml.length === 0, puml.join(', '));

// As imagens principais da modelagem são cópias das exportadas do Astah.
const PRINCIPAIS = {
  'modelagem-uml/02_Modelagem_UML/UseCase Diagram Nex_TI.png': 'Casos de uso/1. Casos de Uso.png',
  'modelagem-uml/02_Modelagem_UML/Class Diagram Nex_TI - Entidades.png': 'Modelo (entidades)/2. Classes - entidades do domínio.png',
  'modelagem-uml/02_Modelagem_UML/Class Diagram Nex_TI - Camadas.png': 'API (camadas)/3. Classes - camadas da API.png',
  'modelagem-uml/02_Modelagem_UML/Activity Diagram Nex_TI.png': '4. Atividade - sessão de estudo com flashcards.png',
  'modelagem-uml/02_Modelagem_UML/Sequence Diagram Nex_TI - Estudar Flashcards.png': 'Casos de uso/Estudar Flashcards/Sequência - Estudar Flashcards.png',
  'modelagem-uml/04_Banco_de_Dados/MER Nex_TI.png': 'Banco de dados/MER (conceitual)/5. MER - modelo conceitual.png',
  'modelagem-uml/04_Banco_de_Dados/DER Nex_TI.png': 'Banco de dados/DER (modelo lógico)/6. DER - modelo lógico.png',
  'modelagem-uml/04_Banco_de_Dados/Modelo Fisico Nex_TI.png': 'Banco de dados/Modelo físico (SQL Server)/7. Modelo físico - SQL Server.png',
};
for (const [principal, exportada] of Object.entries(PRINCIPAIS)) {
  const origem = `${ASTAH}/${exportada}`;
  checar(`${principal} igual à exportada do Astah`, existe(principal) && existe(origem) && hash(principal) === hash(origem));
}

// O README do Nex_TI Desktop usa cópias exatas dos diagramas exportados do Astah.
const DO_DESKTOP = {
  '1-casos-de-uso.png': 'Casos de uso/1. Casos de Uso - Nex_TI Desktop.png',
  '2-classes-camadas.png': 'Classes/2. Classes - camadas.png',
  '3-classes-dominio.png': 'Classes/3. Classes - domínio.png',
  '4-sequencia.png': 'Sequência/4. Sequência - responder carta e concluir fase.png',
  '5-atividade.png': 'Atividade/5. Atividade - sessão de estudo no desktop.png',
};
for (const [copia, exportada] of Object.entries(DO_DESKTOP)) {
  const destino = `sistema/apps/desktop/docs/diagramas/${copia}`, origem = `${DESKTOP}/${exportada}`;
  checar(`${destino} igual à exportada do Astah`, existe(destino) && existe(origem) && hash(destino) === hash(origem));
}

// O relatório usa cópias exatas das imagens da modelagem.
const porNome = Object.fromEntries(Object.keys(PRINCIPAIS).map((p) => [p.split('/').pop(), p]));
for (const f of arquivos('relatorio/assets/diagrams', (c) => c.endsWith('.png'))) {
  const original = porNome[f.split('/').pop()];
  checar(`${f} igual à da modelagem`, Boolean(original) && hash(f) === hash(original), original ? '' : 'não existe na modelagem');
}
const slug = (t) => t.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
for (const caso of pastasCasos) {
  for (const [tipo, arq] of [['Classes', 'classes'], ['Sequência', 'sequencia']]) {
    const rel = `relatorio/assets/casos-de-uso/${slug(caso)}-${arq}.png`;
    const origem = `${ASTAH}/Casos de uso/${caso}/${tipo} - ${caso}.png`;
    if (existe(rel)) checar(`${rel} igual à do Astah`, hash(rel) === hash(origem));
  }
}

// Toda imagem citada no relatório e nos slides existe.
for (const [doc, base] of [['relatorio/index.html', 'relatorio'], ['sistema/apps/desktop/docs/apresentacao/slides.html', 'sistema/apps/desktop/docs/apresentacao']]) {
  if (!existe(doc)) continue;
  for (const m of ler(doc).matchAll(/<img[^>]+src="([^"]+)"/g)) {
    if (/^https?:/.test(m[1])) continue;
    const alvo = join(base, decodeURI(m[1])).replaceAll('\\', '/');
    checar(`imagem de ${doc}: ${m[1]}`, existe(alvo));
  }
}

// --- 5. só PIM IV: o PIM III aparece apenas na comparação de melhorias -----------------------
const PERMITIDOS = ['README.md', 'modelagem-uml/README.md', 'relatorio/README.md', 'relatorio/index.html',
  'sistema/apps/desktop/docs/apresentacao/slides.html', 'sistema/apps/desktop/docs/apresentacao/ROTEIRO_DO_PALESTRANTE.md'];
// Os arquivos de regras (AGENTS.md, CLAUDE.md e os agentes) citam o PIM III para proibi-lo.
const REGRAS = (f) => /(^|\/)(AGENTS|CLAUDE)\.md$/.test(f) || f.startsWith('.claude/');
const comPim3 = arquivos('.', (c) => /\.(md|html|js|jsx|cs|java|json)$/.test(c))
  .filter((f) => !PERMITIDOS.includes(f) && !REGRAS(f) && !f.startsWith('relatorio/word/') && /PIM ?III/.test(ler(f)));
checar('PIM III só nas seções de melhorias', comPim3.length === 0, comPim3.join(', '));

// --- 6. uma pasta de skills só ---------------------------------------------------------------
// As skills ficam em .agents/ na raiz; as regras de cada pasta, no AGENTS.md dela.
const extras = [];
const procurar = (d) => {
  for (const nome of readdirSync(join(RAIZ, d))) {
    if (['node_modules', '.git', 'bin', 'obj', 'dist'].includes(nome)) continue;
    const rel = d === '.' ? nome : `${d}/${nome}`;
    if (!statSync(join(RAIZ, rel)).isDirectory()) continue;
    if ((nome === '.agents' && rel !== '.agents') || nome === '.planning') extras.push(rel);
    else procurar(rel);
  }
};
procurar('.');
checar('só a pasta .agents da raiz, sem .planning', extras.length === 0, extras.join(', '));
// O Claude lê as mesmas regras do Codex: cada CLAUDE.md importa o AGENTS.md (o Codex lê o AGENTS.md sozinho).
for (const pasta of ['.', 'sistema', 'relatorio', 'modelagem-uml']) {
  const claude = existe(`${pasta}/CLAUDE.md`) ? ler(`${pasta}/CLAUDE.md`) : '';
  checar(`${pasta} tem AGENTS.md`, existe(`${pasta}/AGENTS.md`));
  checar(`${pasta}/CLAUDE.md importa o AGENTS.md`, /^@(\.\/)?AGENTS\.md$/m.test(claude));
}
const raiz = ler('CLAUDE.md');
checar('CLAUDE.md da raiz importa o AGENTS.md de cada pasta', ['sistema', 'relatorio', 'modelagem-uml'].every((p) => raiz.includes(`@${p}/AGENTS.md`)));
const geminis = arquivos('.', (c) => c.endsWith('GEMINI.md'));
checar('nenhum GEMINI.md (a equipe usa Claude Code e Codex)', geminis.length === 0, geminis.join(', '));

// --- 7. manual, dicionário de dados e modelo do PIM ------------------------------------------
// Rotas do manual técnico = rotas da API (parâmetros {x} comparados sem o nome).
const normalizar = (r) => r.replace(/\{[^}]*\}/g, '{}').replace(/\/$/, '');
const rotasDoCodigo = new Set();
for (const f of arquivos('sistema/apps/api', (c) => c.endsWith('.cs'))) {
  const t = ler(f);
  const grupo = t.match(/MapGroup\("([^"]+)"\)/)?.[1] ?? '';
  for (const m of t.matchAll(/\.Map(Get|Post|Put|Delete)\("([^"]*)"/g)) {
    const caminho = m[2].startsWith('/api') ? m[2] : grupo + m[2];
    rotasDoCodigo.add(`${m[1].toUpperCase()} ${normalizar(caminho)}`);
  }
}
const manual = ler('sistema/docs/MANUAL_TECNICO.md');
const rotasDoManual = new Set([...manual.matchAll(/`(GET|POST|PUT|DELETE) (\/api[^`]*)`/g)].map((m) => `${m[1]} ${normalizar(m[2])}`));
const faltamNoManual = [...rotasDoCodigo].filter((r) => !rotasDoManual.has(r));
const sobramNoManual = [...rotasDoManual].filter((r) => !rotasDoCodigo.has(r));
checar('rotas do manual técnico iguais às da API', !faltamNoManual.length && !sobramNoManual.length,
  [faltamNoManual.length && `faltam: ${faltamNoManual.join(', ')}`, sobramNoManual.length && `sobram: ${sobramNoManual.join(', ')}`].filter(Boolean).join('; '));

const relatorio = ler('relatorio/index.html');
// Dicionário de dados (2.7.6) = tabelas do script do banco.
const tabelasDoBanco = new Set([...ler('sistema/database/NexTI_DB.sql').matchAll(/CREATE TABLE \[?(\w+)\]?/g)]
  .map((m) => m[1]).filter((t) => !t.startsWith('__')));
const secaoDicionario = relatorio.match(/aria-label="2\.7\.6 Dicionário de dados".*?<\/section>/s)?.[0] ?? '';
const tabelasDoDicionario = new Set([...secaoDicionario.matchAll(/<tr><td>(\w+)<\/td>/g)].map((m) => m[1]));
const difDicionario = [...tabelasDoBanco].filter((t) => !tabelasDoDicionario.has(t))
  .concat([...tabelasDoDicionario].filter((t) => !tabelasDoBanco.has(t)));
checar('dicionário de dados (2.7.6) com as tabelas do banco', Boolean(secaoDicionario) && !difDicionario.length, difDicionario.join(', '));

// Modelo do PIM: resumo de 200 a 250 palavras e figuras numeradas em sequência.
const resumo = relatorio.match(/<h2 class="center">RESUMO<\/h2><p class="paragrafo">(.*?)<\/p>/s)?.[1] ?? '';
const palavras = resumo.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
checar('resumo com 200 a 250 palavras', palavras >= 200 && palavras <= 250, `tem ${palavras}`);
const figuras = [...relatorio.matchAll(/<p class="legenda-topo">([^<]*)<\/p>/g)].map((m) => m[1]);
const foraDeOrdem = figuras.filter((f, i) => !f.startsWith(`Figura ${i + 1} – `));
checar('figuras numeradas em sequência (Figura N – título)', figuras.length > 0 && !foraDeOrdem.length, foraDeOrdem.slice(0, 3).join(' | '));

// --- resultado --------------------------------------------------------------------------
console.log(`Sincronia do projeto: ${ok.length} ok, ${falhas.length} com problema.`);
for (const f of falhas) console.log(`  ✗ ${f}`);
if (process.argv.includes('--detalhes')) for (const o of ok) console.log(`  ✓ ${o}`);
process.exit(falhas.length ? 1 : 0);
