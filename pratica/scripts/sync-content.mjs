/**
 * Sincroniza o conteúdo canônico de apps/web para packages/shared.
 *
 * O app vanilla (apps/web) é a fonte da verdade: ele guarda os flashcards em
 * assets/js/data.js, os módulos em pages/dashboard/js/app.js e os rótulos das
 * fases no HTML do dashboard. Este script lê esses três arquivos e gera
 * packages/shared/src/content.js, além de copiar o CSS, para que apps/react-web
 * e apps/react-mobile consumam exatamente o mesmo material.
 *
 * Uso: node scripts/sync-content.mjs [--check]
 *   --check  não escreve nada; falha se o gerado estiver desatualizado.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEB = path.join(ROOT, 'apps', 'web');
const SHARED = path.join(ROOT, 'packages', 'shared');
const CHECK = process.argv.includes('--check');

const read = (...p) => fs.readFileSync(path.join(...p), 'utf8').replace(/^﻿/, '');

// --- 1. flashcards: apps/web/assets/js/data.js -----------------------------

function lerBancoDeDados() {
  const src = read(WEB, 'assets', 'js', 'data.js');
  const inicio = src.indexOf('{');
  const fim = src.lastIndexOf('}');
  if (inicio < 0 || fim < 0) throw new Error('data.js: objeto bancoDeDados não encontrado');
  const corpo = src
    .slice(inicio, fim + 1)
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(corpo);
}

// --- 2. módulos: apps/web/pages/dashboard/js/app.js ------------------------

function lerModulos() {
  const src = read(WEB, 'pages', 'dashboard', 'js', 'app.js');
  const m = src.match(/const modulos = (\[[\s\S]*?\]);/);
  if (!m) throw new Error('app.js: const modulos não encontrada');
  const itens = [...m[1].matchAll(/\{\s*nome:\s*"([^"]+)",\s*fases:\s*\[([^\]]+)\],\s*cor:\s*'([^']+)'\s*\}/g)];
  if (!itens.length) throw new Error('app.js: nenhum módulo reconhecido');
  return itens.map(([, nome, fases, cor]) => ({
    nome,
    cor,
    fases: [...fases.matchAll(/'([^']+)'/g)].map((f) => f[1]),
  }));
}

function lerFrasesMotivacionais() {
  const src = read(WEB, 'pages', 'dashboard', 'js', 'app.js');
  const m = src.match(/const frasesMotivacionais = \[([\s\S]*?)\];/);
  if (!m) throw new Error('app.js: const frasesMotivacionais não encontrada');
  return [...m[1].matchAll(/"([^"]+)"/g)].map((f) => f[1]);
}

// --- 3. rótulos e preços: apps/web/pages/dashboard/index.html --------------

const semTags = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function lerPainelLateral() {
  const src = read(WEB, 'pages', 'dashboard', 'index.html');
  const inicio = src.search(/<nav[^>]*class="left-panel"/);
  const fim = src.search(/<div[^>]*class="painel-header"/);
  if (inicio < 0 || fim < 0) throw new Error('index.html: painel lateral não encontrado');
  const painel = src.slice(inicio, fim);

  const cabecalhos = [...painel.matchAll(/<div class="dia-header mod-(\d+)">\s*<span class="tech-font">\[([^\]]+)\]<\/span>([^<]+)/g)]
    .map(([, numero, codigo, titulo]) => ({
      numero: Number(numero),
      codigo: codigo.trim(),
      titulo: titulo.trim(),
    }));

  const itens = [...painel.matchAll(/<div class="aula-item[^"]*" id="menu-([^"]+)"([\s\S]*?)(?=<div class="aula-item|<div class="dia-header|$)/g)];

  const fases = [];
  const testes = [];
  const bonus = [];

  for (const [, id, corpo] of itens) {
    const titulo = (corpo.match(/<span class="aula-title[^"]*">([^<]+)<\/span>/) || [])[1]?.trim() ?? '';
    const xp = Number((corpo.match(/>(\d+) XP</) || [])[1] ?? 0);
    const moedas = Number((corpo.match(/toll<\/span>\s*(\d+)/) || [])[1] ?? 0);
    const aula = corpo.match(/carregarAula\('([^']+)',\s*'([^']*)'/);
    const compra = corpo.match(/tentarAbrirBonus\('([^']+)',\s*(\d+),\s*'([^']*)'/);

    if (compra) {
      bonus.push({ id: compra[1], nome: compra[3], titulo, custoMoedas: Number(compra[2]) });
    } else if (aula && aula[1].startsWith('teste-')) {
      testes.push({ id: aula[1], nome: aula[2], titulo, xp });
    } else if (aula) {
      fases.push({ id: aula[1], nome: aula[2], titulo, xp, moedas });
    } else {
      // itens sem onclick de aula (ex.: certificado) entram como especiais
      fases.push({ id, nome: semTags(titulo), titulo, xp, moedas, especial: true });
    }
  }

  return { cabecalhos, fases, testes, bonus };
}

// --- 4. geração ------------------------------------------------------------

function montarConteudo() {
  const banco = lerBancoDeDados();
  const modulos = lerModulos();
  const painel = lerPainelLateral();

  const porId = new Map(painel.fases.map((f) => [f.id, f]));
  const bonusPorId = new Map(painel.bonus.map((b) => [b.id, b]));
  const testePorModulo = new Map(painel.testes.map((t) => [t.id, t]));

  const modulosCompletos = modulos.map((modulo, indice) => {
    const cabecalho = painel.cabecalhos[indice];
    const idTeste = `teste-mod${indice + 1}`;
    const idBonus = `bonus${indice + 1}`;
    return {
      id: `mod${indice + 1}`,
      numero: indice + 1,
      nome: modulo.nome,
      codigo: cabecalho?.codigo ?? `Mod_0${indice + 1}`,
      titulo: cabecalho?.titulo ?? modulo.nome,
      cor: modulo.cor,
      fases: modulo.fases.map((id) => {
        const meta = porId.get(id) ?? {};
        return {
          id,
          nome: meta.nome ?? id,
          titulo: meta.titulo ?? id,
          xp: meta.xp ?? 5,
          moedas: meta.moedas ?? 10,
          totalCards: (banco[id] ?? []).length,
        };
      }),
      teste: testePorModulo.has(idTeste)
        ? { ...testePorModulo.get(idTeste), moduloId: `mod${indice + 1}` }
        : null,
      bonus: bonusPorId.has(idBonus)
        ? { ...bonusPorId.get(idBonus), totalCards: (banco[idBonus] ?? []).length }
        : null,
    };
  });

  const totalCards = Object.values(banco).reduce((soma, cards) => soma + cards.length, 0);

  return { banco, modulos: modulosCompletos, totalCards, frases: lerFrasesMotivacionais() };
}

function gerarArquivo({ banco, modulos, totalCards, frases }) {
  const aviso = `/**\n * ARQUIVO GERADO - não edite à mão.\n *\n * Fonte: apps/web (data.js, app.js e dashboard/index.html).\n * Regenere com: npm run sync:content\n *\n * ${Object.keys(banco).length} fases - ${totalCards} cards - ${modulos.length} módulos.\n */\n\n`;
  return (
    aviso +
    `export const BANCO_DE_DADOS = ${JSON.stringify(banco, null, 2)};\n\n` +
    `export const MODULOS = ${JSON.stringify(modulos, null, 2)};\n\n` +
    `export const FRASES_MOTIVACIONAIS = ${JSON.stringify(frases, null, 2)};

` +
    `export const FASES = MODULOS.flatMap((m) => m.fases);\n\n` +
    `export const BONUS = MODULOS.map((m) => m.bonus).filter(Boolean);\n\n` +
    `export const TESTES = MODULOS.map((m) => m.teste).filter(Boolean);\n\n` +
    `export function cardsDaFase(faseId) {\n  return BANCO_DE_DADOS[faseId] ?? [];\n}\n\n` +
    `export function moduloDaFase(faseId) {\n  return MODULOS.find((m) => m.fases.some((f) => f.id === faseId)) ?? null;\n}\n`
  );
}

const ARQUIVOS_CSS = [
  ['assets/css/global.css', 'css/global.css'],
  ['pages/dashboard/style.css', 'css/dashboard.css'],
  ['pages/login/login.css', 'css/login.css'],
  ['assets/css/splash.css', 'css/splash.css'],
];

// Imagens usadas pelas telas portadas (cabeçalho, rodapé, frase motivacional).
const IMAGENS = [
  ['assets/img/logo.png', 'img/logo.png'],
  ['assets/img/terminal-icon.png', 'img/terminal-icon.png'],
];

// Motores do vanilla que viram módulos ESM: o arquivo original é um IIFE que
// se publica em window; aqui a última linha vira export, preservando o corpo.
const MOTORES = [
  ['assets/js/audio.js', 'src/audio.js', 'AudioEngine'],
  ['assets/js/confetti.js', 'src/confetti.js', 'ConfettiEngine'],
  ['assets/js/api.js', 'src/api.js', 'ApiService'],
];

function gerarMotor(origem, nome) {
  const src = read(WEB, ...origem.split('/'));
  const linhaWindow = new RegExp(`^window\\.${nome}\\s*=\\s*${nome};\\s*$`, 'm');
  if (!linhaWindow.test(src)) throw new Error(`${origem}: linha "window.${nome} = ${nome};" não encontrada`);
  const corpo = src.replace(linhaWindow, '');
  return (
    `/**\n * ARQUIVO GERADO a partir de apps/web/${origem} - não edite à mão.\n` +
    ` * Regenere com: npm run sync:content\n */\n\n` +
    `${corpo.trim()}\n\n` +
    `if (typeof window !== 'undefined') window.${nome} = ${nome};\n\n` +
    `export { ${nome} };\nexport default ${nome};\n`
  );
}

// Semente do banco (Azure SQL) consumida pelo ConteudoSeeder da API C#.
function gerarSementeApi({ banco, modulos }) {
  const fases = modulos.flatMap((m) => [...m.fases, ...(m.bonus ? [m.bonus] : [])]);
  const semente = {
    fases: fases.map((f) => ({ codigo: f.id, descricao: f.nome })),
    flashcards: fases.flatMap((f) =>
      (banco[f.id] ?? []).map((c) => ({
        codigoFase: f.id,
        frente: c.frente,
        verso: c.verso,
        dica: c.dica ?? null,
        opcoes: c.opcoes ?? null,
        correta: c.correta ?? null,
      })),
    ),
  };
  return `${JSON.stringify(semente, null, 2)}
`;
}

const SEMENTE_API = path.join(ROOT, 'apps', 'api', 'Data', 'Seed', 'conteudo.json');

function main() {
  const conteudo = gerarArquivo(montarConteudo());
  const destino = path.join(SHARED, 'src', 'content.js');

  const pendentes = [];
  const atual = fs.existsSync(destino) ? fs.readFileSync(destino, 'utf8') : null;
  if (atual !== conteudo) pendentes.push(path.relative(ROOT, destino));

  const gerados = [
    ...ARQUIVOS_CSS.map(([origem, alvo]) => [alvo, read(WEB, ...origem.split('/'))]),
    ...MOTORES.map(([origem, alvo, nome]) => [alvo, gerarMotor(origem, nome)]),
    [path.relative(SHARED, SEMENTE_API), gerarSementeApi(montarConteudo())],
  ];

  for (const [alvo, texto] of gerados) {
    const caminho = path.resolve(SHARED, ...alvo.split(/[\/]/));
    const existente = fs.existsSync(caminho) ? fs.readFileSync(caminho, 'utf8') : null;
    if (existente !== texto) pendentes.push(path.relative(ROOT, caminho));
    if (!CHECK) {
      fs.mkdirSync(path.dirname(caminho), { recursive: true });
      fs.writeFileSync(caminho, texto, 'utf8');
    }
  }

  for (const [origem, alvo] of IMAGENS) {
    const bytes = fs.readFileSync(path.join(WEB, ...origem.split('/')));
    const caminho = path.join(SHARED, ...alvo.split('/'));
    const existente = fs.existsSync(caminho) ? fs.readFileSync(caminho) : null;
    if (!existente || !existente.equals(bytes)) pendentes.push(path.relative(ROOT, caminho));
    if (!CHECK) {
      fs.mkdirSync(path.dirname(caminho), { recursive: true });
      fs.writeFileSync(caminho, bytes);
    }
  }

  if (CHECK) {
    if (pendentes.length) {
      console.error('Conteúdo compartilhado desatualizado em relação a apps/web:');
      pendentes.forEach((p) => console.error(`  - ${p}`));
      console.error('Rode: npm run sync:content');
      process.exit(1);
    }
    console.log('Conteúdo compartilhado está sincronizado com apps/web.');
    return;
  }

  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, conteudo, 'utf8');

  const { banco, modulos, totalCards } = montarConteudo();
  console.log(`packages/shared/src/content.js gerado:`);
  console.log(`  ${Object.keys(banco).length} fases, ${totalCards} cards, ${modulos.length} módulos`);
  modulos.forEach((m) => {
    const cards = m.fases.reduce((s, f) => s + f.totalCards, 0);
    console.log(`  - ${m.codigo}: ${m.fases.length} fases (${cards} cards)` +
      `${m.teste ? ', teste' : ''}${m.bonus ? `, bônus ${m.bonus.totalCards} cards` : ''}`);
  });
  console.log(`  CSS copiado: ${ARQUIVOS_CSS.length} arquivos`);
  console.log(`  imagens copiadas: ${IMAGENS.length}`);
  console.log(`  semente da API: ${path.relative(ROOT, SEMENTE_API)}`);
  console.log(`  motores ESM: ${MOTORES.map(([, , nome]) => nome).join(', ')}`);
}

main();
