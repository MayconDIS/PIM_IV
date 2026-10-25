// Auditoria do código JavaScript/JSX do Nex_TI (site, app e pacote compartilhado).
// Uso: node scripts/auditoria-codigo.mjs   (na pasta sistema/; sai com 1 se achar problema)
//
// Confere o que um revisor procuraria à mão:
//  1. arquivos que ninguém importa (código morto);
//  2. funções exportadas pelo @nexti/shared que nenhum app usa;
//  3. restos de depuração: console.log, debugger, TODO/FIXME e linhas de código comentadas;
//  4. tamanho: arquivos com mais de 400 linhas e funções/componentes com mais de 120;
//  5. acessibilidade nos .jsx: <img> sem alt, botão só com ícone sem aria-label/title,
//     onClick em <div>/<span> sem role e teclado, <input> sem rótulo.
// O conteúdo de estudo (content.js, enadeOficial.js) é dado, não código: fica fora do tamanho.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, extname } from 'node:path';

const RAIZ = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const rel = (f) => relative(RAIZ, f).replaceAll('\\', '/');
const ler = (f) => readFileSync(f, 'utf8');

function arquivos(dir, exts = ['.js', '.jsx', '.mjs']) {
  const saida = [];
  const andar = (d) => {
    for (const nome of readdirSync(d)) {
      if (['node_modules', 'dist', '.expo', 'tests', 'coverage'].includes(nome)) continue;
      const c = join(d, nome);
      if (statSync(c).isDirectory()) andar(c);
      else if (exts.includes(extname(c))) saida.push(c);
    }
  };
  andar(dir);
  return saida;
}

const achados = [];
const achar = (tipo, onde, detalhe) => achados.push({ tipo, onde, detalhe });

// --- 1. arquivos que ninguém importa -----------------------------------------------------------
const PASTAS = {
  'apps/react-web/src': ['apps/react-web/src/main.jsx'],
  'apps/react-mobile': ['apps/react-mobile/App.js', 'apps/react-mobile/index.js'],
  'packages/shared/src': ['packages/shared/src/index.js'],
};
const importa = /(?:import\s[^'"]*?from\s*|import\s*\(\s*|export\s[^'"]*?from\s*|require\(\s*)['"]([^'"]+)['"]/g;
// O pacote compartilhado também é importado pelo nome ("@nexti/shared/audio"), pelo mapa de exports.
const exportsDoPacote = JSON.parse(readFileSync(join(RAIZ, 'packages/shared/package.json'), 'utf8')).exports;
function resolverImport(de, alvo) {
  if (alvo.startsWith('@nexti/shared')) {
    const caminho = exportsDoPacote['.' + alvo.slice('@nexti/shared'.length)];
    return caminho ? resolve(join(RAIZ, 'packages/shared'), caminho) : null;
  }
  if (!alvo.startsWith('.')) return null;
  const base = resolve(dirname(de), alvo);
  for (const tentativa of [base, `${base}.js`, `${base}.jsx`, `${base}.mjs`, join(base, 'index.js'), join(base, 'index.jsx')])
    if (existsSync(tentativa) && statSync(tentativa).isFile()) return tentativa;
  return null;
}
for (const [pasta, entradas] of Object.entries(PASTAS)) {
  const todos = arquivos(join(RAIZ, pasta)).filter((f) => !f.includes('babel.config') && !f.includes('metro.config') && !f.includes('vite.config'));
  const vistos = new Set();
  // O pacote compartilhado é usado pelos apps: o que eles importam dele também está em uso.
  const sementes = pasta === 'packages/shared/src'
    ? [...entradas, 'apps/react-web/src/main.jsx', 'apps/react-mobile/App.js']
    : entradas;
  const fila = sementes.map((e) => join(RAIZ, e)).filter(existsSync);
  while (fila.length) {
    const f = fila.pop();
    if (vistos.has(f)) continue;
    vistos.add(f);
    for (const m of ler(f).matchAll(importa)) {
      const alvo = resolverImport(f, m[1]);
      if (alvo) fila.push(alvo);
    }
  }
  for (const f of todos) if (!vistos.has(f)) achar('arquivo sem uso', rel(f), 'nenhum arquivo importa');
}

// --- 2. exports do @nexti/shared que nenhum app usa ------------------------------------------
const indice = ler(join(RAIZ, 'packages/shared/src/index.js'));
const exportados = new Set();
for (const m of indice.matchAll(/export\s*\{([^}]*)\}/g)) m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => exportados.add(n));
for (const m of indice.matchAll(/export \* from '([^']+)'/g)) {
  const modulo = ler(resolve(join(RAIZ, 'packages/shared/src'), m[1]));
  for (const e of modulo.matchAll(/export (?:const|function|class) ([A-Za-z_$][\w$]*)/g)) exportados.add(e[1]);
}
const consumidores = [
  ...arquivos(join(RAIZ, 'apps/react-web/src')),
  ...arquivos(join(RAIZ, 'apps/react-mobile')),
  ...arquivos(join(RAIZ, 'scripts')),
].map(ler).join('\n');
const usoInterno = arquivos(join(RAIZ, 'packages/shared/src')).map(ler).join('\n');
for (const nome of exportados) {
  const fora = new RegExp(`\\b${nome.replace('$', '\\$')}\\b`).test(consumidores);
  const dentro = (usoInterno.match(new RegExp(`\\b${nome.replace('$', '\\$')}\\b`, 'g')) ?? []).length > 1;
  if (!fora && !dentro) achar('export sem uso', 'packages/shared', `${nome} não é usado por nenhum app nem dentro do pacote`);
}

// --- 3, 4 e 5: varredura arquivo a arquivo -----------------------------------------------------
const DADOS = ['content.js', 'enadeOficial.js'];
const codigo = [
  ...arquivos(join(RAIZ, 'apps/react-web/src')),
  ...arquivos(join(RAIZ, 'apps/react-mobile/src')),
  join(RAIZ, 'apps/react-mobile/App.js'),
  ...arquivos(join(RAIZ, 'packages/shared/src')),
].filter(existsSync);
for (const f of codigo) {
  const texto = ler(f);
  const linhas = texto.split('\n');
  linhas.forEach((l, i) => {
    const onde = `${rel(f)}:${i + 1}`;
    if (/\bconsole\.log\(/.test(l)) achar('console.log', onde, l.trim().slice(0, 90));
    if (/\bdebugger\b/.test(l)) achar('debugger', onde, l.trim());
    // Só em comentário: "TODO o seu histórico" numa mensagem é português, não pendência.
    if (/(\/\/|\/\*|^\s*\*)\s*(TODO|FIXME|XXX|HACK)\b/.test(l)) achar('TODO', onde, l.trim().slice(0, 90));
    // Código comentado: comentário de linha que termina como código (; { } ) ou começa com palavra de código.
    if (/^\s*\/\/\s*(const|let|var|return|if|for|await|import|export|[\w.]+\(.*\)\s*;)\b/.test(l) && !/eslint/.test(l))
      achar('código comentado', onde, l.trim().slice(0, 90));
  });
  if (!DADOS.some((d) => f.endsWith(d)) && linhas.length > 400) achar('arquivo grande', rel(f), `${linhas.length} linhas`);
  // Funções e componentes longos: do "function X(" ou "const X = (...) =>" até a chave que fecha.
  if (!DADOS.some((d) => f.endsWith(d))) {
    const inicio = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+(\w+)|^(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{/;
    linhas.forEach((l, i) => {
      const m = l.match(inicio);
      if (!m) return;
      let nivel = 0;
      for (let j = i; j < linhas.length; j++) {
        for (const ch of linhas[j]) nivel += ch === '{' ? 1 : ch === '}' ? -1 : 0;
        if (nivel === 0 && j > i) {
          if (j - i + 1 > 120) achar('função longa', `${rel(f)}:${i + 1}`, `${m[1] ?? m[2]}: ${j - i + 1} linhas`);
          break;
        }
      }
    });
  }
  if (extname(f) === '.jsx') {
    for (const m of texto.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) achar('a11y: img sem alt', rel(f), m[0].slice(0, 80));
    for (const m of texto.matchAll(/<(div|span|li)\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*>/g))
      if (/onClick=/.test(m[0]) && (!/\brole=/.test(m[0]) || !/(tabIndex|onKeyDown)/.test(m[0]))) achar('a11y: clique em div/span', rel(f), m[0].replace(/\s+/g, ' ').slice(0, 100));
    for (const m of texto.matchAll(/<button\b([^>]*)>\s*(<span className="material-symbols-outlined[^"]*"[^>]*>[^<]*<\/span>)\s*<\/button>/g))
      if (!/aria-label=|title=/.test(m[1])) achar('a11y: botão só com ícone', rel(f), m[0].replace(/\s+/g, ' ').slice(0, 100));
    for (const m of texto.matchAll(/<input\b[^>]*>/g)) {
      const tag = m[0];
      if (/type="(hidden|file)"/.test(tag)) continue;
      if (/\bid=\{/.test(tag)) continue;   // id vindo de variável: o rótulo é conferido onde o componente é usado
      const id = tag.match(/\bid=["{]?([\w-]+)/)?.[1];
      const antes = texto.slice(Math.max(0, m.index - 300), m.index);
      const dentroDeLabel = antes.lastIndexOf('<label') > antes.lastIndexOf('</label>');
      const temRotulo = /aria-label=|aria-labelledby=/.test(tag) || dentroDeLabel
        || (id && new RegExp(`htmlFor=["{]?${id}`).test(texto));
      if (!temRotulo) achar('a11y: input sem rótulo', rel(f), tag.replace(/\s+/g, ' ').slice(0, 100));
    }
  }
}

const porTipo = {};
for (const a of achados) (porTipo[a.tipo] ??= []).push(a);
for (const [tipo, lista] of Object.entries(porTipo)) {
  console.log(`\n${tipo} (${lista.length})`);
  for (const a of lista) console.log(`  ${a.onde}${a.detalhe ? ` — ${a.detalhe}` : ''}`);
}
// Tamanho é aviso (dívida técnica registrada em docs/AUDITORIA.md); o resto reprova.
const AVISOS = ['função longa', 'arquivo grande'];
const problemas = achados.filter((a) => !AVISOS.includes(a.tipo));
console.log(`\nAuditoria do código: ${problemas.length} problema(s) e ${achados.length - problemas.length} aviso(s) de tamanho.`);
process.exit(problemas.length === 0 ? 0 : 1);
