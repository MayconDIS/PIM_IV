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
  'relatorio/README.md', 'relatorio/index.html',
  'sistema/docs/apresentacao-pa/slides.html', 'sistema/docs/apresentacao-pa/ROTEIRO_DO_PALESTRANTE.md',
].filter(existe);
const textos = Object.fromEntries(DOCUMENTOS.map((d) => [d, ler(d).replace(/<[^>]+>/g, ' ')]));

function citacoes(regex) {
  const achados = [];
  for (const [doc, texto] of Object.entries(textos)) for (const m of texto.matchAll(regex)) achados.push({ doc, m });
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

// --- 3. testes da API: o mesmo número em todos os documentos --------------------------
const testes = citacoes(/\b(\d+) testes(?: automáticos)? da API\b/g).map(({ doc, m }) => ({ doc, n: Number(m[1]) }));
const valores = [...new Set(testes.map((t) => t.n))];
checar('testes da API iguais em todos os documentos', valores.length <= 1,
  testes.map((t) => `${t.doc}: ${t.n}`).join('; '));

// --- 4. diagramas: só do Astah ----------------------------------------------------------
const ASTAH = 'modelagem-uml/02_Modelagem_UML/imagens-astah';
const pngsAstah = arquivos(ASTAH, (c) => c.endsWith('.png'));
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
for (const [doc, base] of [['relatorio/index.html', 'relatorio'], ['sistema/docs/apresentacao-pa/slides.html', 'sistema/docs/apresentacao-pa']]) {
  if (!existe(doc)) continue;
  for (const m of ler(doc).matchAll(/<img[^>]+src="([^"]+)"/g)) {
    if (/^https?:/.test(m[1])) continue;
    const alvo = join(base, decodeURI(m[1])).replaceAll('\\', '/');
    checar(`imagem de ${doc}: ${m[1]}`, existe(alvo));
  }
}

// --- 5. só PIM IV: o PIM III aparece apenas na comparação de melhorias -----------------------
const PERMITIDOS = ['README.md', 'modelagem-uml/README.md', 'relatorio/README.md', 'relatorio/index.html',
  'sistema/docs/apresentacao-pa/slides.html', 'sistema/docs/apresentacao-pa/ROTEIRO_DO_PALESTRANTE.md'];
// Os arquivos de regras (AGENTS.md, CLAUDE.md, GEMINI.md e os agentes) citam o PIM III para proibi-lo.
const REGRAS = (f) => /(^|\/)(AGENTS|CLAUDE|GEMINI)\.md$/.test(f) || f.startsWith('.claude/');
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
for (const pasta of ['sistema', 'relatorio', 'modelagem-uml']) {
  checar(`${pasta} tem AGENTS.md, CLAUDE.md e GEMINI.md`, ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'].every((f) => existe(`${pasta}/${f}`)));
}
// O Claude lê o que o Gemini lê: cada CLAUDE.md importa o GEMINI.md, que importa o AGENTS.md.
for (const pasta of ['.', 'sistema', 'relatorio', 'modelagem-uml']) {
  const claude = existe(`${pasta}/CLAUDE.md`) ? ler(`${pasta}/CLAUDE.md`) : '';
  const gemini = existe(`${pasta}/GEMINI.md`) ? ler(`${pasta}/GEMINI.md`) : '';
  checar(`${pasta}/CLAUDE.md importa o GEMINI.md`, /^@(\.\/)?GEMINI\.md$/m.test(claude));
  checar(`${pasta}/GEMINI.md importa o AGENTS.md`, /^@(\.\/)?AGENTS\.md$/m.test(gemini));
}
const raiz = ler('CLAUDE.md');
checar('CLAUDE.md da raiz importa o GEMINI.md de cada pasta', ['sistema', 'relatorio', 'modelagem-uml'].every((p) => raiz.includes(`@${p}/GEMINI.md`)));

// --- resultado --------------------------------------------------------------------------
console.log(`Sincronia do projeto: ${ok.length} ok, ${falhas.length} com problema.`);
for (const f of falhas) console.log(`  ✗ ${f}`);
if (process.argv.includes('--detalhes')) for (const o of ok) console.log(`  ✓ ${o}`);
process.exit(falhas.length ? 1 : 0);
