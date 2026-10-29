// Gera o PDF dos slides (A4 paisagem, uma folha por slide) com o Chrome sem janela.
// Antes de gravar, confere se algum conteúdo passou da borda de algum slide e avisa.
// Uso, nesta pasta: node gerar-pdf.mjs
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PASTA = dirname(fileURLToPath(import.meta.url));
const SLIDES = join(PASTA, 'slides.html');
const SAIDA = join(PASTA, 'Nex_TI - Apresentacao PIM IV.pdf');
const PORTA = 9355;

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const navegador = CHROMES.find(existsSync);
if (!navegador) {
  console.error('Não achei o Chrome nem o Edge. Abra slides.html no Chrome e use Ctrl+P (A4, paisagem, margens "Nenhuma", "Gráficos de segundo plano").');
  process.exit(1);
}

const perfil = mkdtempSync(join(tmpdir(), 'nexti-slides-'));
const chrome = spawn(navegador, ['--headless=new', `--remote-debugging-port=${PORTA}`, `--user-data-dir=${perfil}`, 'about:blank'], { stdio: 'ignore' });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let alvo;
  for (let i = 0; i < 40 && !alvo; i++) {
    await espera(250);
    try { alvo = (await (await fetch(`http://127.0.0.1:${PORTA}/json`)).json()).find((t) => t.type === 'page'); } catch { /* ainda abrindo */ }
  }
  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0;
  const pendentes = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pendentes.has(m.id)) { pendentes.get(m.id)(m.result); pendentes.delete(m.id); }
  });
  const cdp = (method, params = {}) => new Promise((r) => { const n = ++id; pendentes.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  const js = async (expr) => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

  await cdp('Page.enable');
  await cdp('Page.navigate', { url: pathToFileURL(SLIDES).href });
  for (let i = 0; i < 60 && (await js('document.readyState')) !== 'complete'; i++) await espera(250);
  await js('document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => null)))).then(() => true)');
  await cdp('Emulation.setEmulatedMedia', { media: 'print' });

  // Conteúdo fora da folha: algum elemento passa da borda do slide, ou alguma imagem não carregou.
  const problemas = JSON.parse(await js(`JSON.stringify([...document.querySelectorAll('.slide')].flatMap((s, i) => {
    const f = s.getBoundingClientRect();
    const fora = [...s.querySelectorAll('.slide-body *, .rodape *')].filter((e) => { const r = e.getBoundingClientRect(); return r.height && (r.bottom > f.bottom - 4 || r.right > f.right - 4); });
    const sem = [...s.querySelectorAll('img')].filter((im) => !im.naturalWidth).map((im) => im.getAttribute('src'));
    return [...(fora.length ? ['slide ' + (i + 1) + ': conteúdo passou da borda'] : []), ...sem.map((src) => 'slide ' + (i + 1) + ': imagem não encontrada ' + src)];
  }))`));
  const total = await js(`document.querySelectorAll('.slide').length`);

  const { data } = await cdp('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, landscape: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
  writeFileSync(SAIDA, Buffer.from(data, 'base64'));
  console.log(`PDF gravado: ${SAIDA} (${total} slides)`);
  if (problemas.length) {
    console.log('Atenção:');
    for (const p of problemas) console.log('  - ' + p);
    process.exitCode = 1;
  } else {
    console.log('Nenhum slide com conteúdo fora da folha ou imagem faltando.');
  }
  ws.close();
} finally {
  chrome.kill();
  await espera(500);
  try { rmSync(perfil, { recursive: true, force: true }); } catch { /* o Chrome ainda segura algum arquivo */ }
}
