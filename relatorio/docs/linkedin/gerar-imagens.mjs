// Gera as imagens da publicação no LinkedIn a partir de carrossel.html, com o Chrome sem janela:
// um PNG 1080x1350 por slide (pasta imagens/) e o PDF do carrossel (o LinkedIn publica PDF como
// carrossel, em "Documento"). Antes de gravar, confere se algum texto passou da borda do slide.
// Uso, nesta pasta: node gerar-imagens.mjs
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PASTA = dirname(fileURLToPath(import.meta.url));
const PAGINA = join(PASTA, 'carrossel.html');
const IMAGENS = join(PASTA, 'imagens');
const PDF = join(PASTA, 'Nex_TI - Carrossel LinkedIn.pdf');
const PORTA = 9356;

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const navegador = CHROMES.find(existsSync);
if (!navegador) {
  console.error('Não achei o Chrome nem o Edge para gerar as imagens.');
  process.exit(1);
}

const perfil = mkdtempSync(join(tmpdir(), 'nexti-linkedin-'));
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
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1350, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: pathToFileURL(PAGINA).href });
  for (let i = 0; i < 60 && (await js('document.readyState')) !== 'complete'; i++) await espera(250);
  await js('document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => null)))).then(() => true)');

  // Texto ou imagem que passou da borda do slide (o rodapé fica de fora da conta), ou imagem que não carregou.
  const problemas = JSON.parse(await js(`JSON.stringify([...document.querySelectorAll('.slide')].flatMap((s) => {
    const f = s.getBoundingClientRect();
    const nome = s.dataset.nome;
    const fora = [...s.children].filter((e) => !e.classList.contains('rodape')).filter((e) => { const r = e.getBoundingClientRect(); return r.height && (r.bottom > f.bottom - 100 || r.right > f.right - 4); });
    const sem = [...s.querySelectorAll('img')].filter((im) => !im.naturalWidth).map((im) => im.getAttribute('src'));
    return [...(fora.length ? [nome + ': conteúdo encostou no rodapé ou passou da borda'] : []), ...sem.map((src) => nome + ': imagem não encontrada ' + src)];
  }))`));

  mkdirSync(IMAGENS, { recursive: true });
  const caixas = JSON.parse(await js(`JSON.stringify([...document.querySelectorAll('.slide')].map((s) => {
    const r = s.getBoundingClientRect();
    return { nome: s.dataset.nome, x: r.left + scrollX, y: r.top + scrollY };
  }))`));
  for (const c of caixas) {
    const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: c.x, y: c.y, width: 1080, height: 1350, scale: 1 } });
    writeFileSync(join(IMAGENS, `${c.nome}.png`), Buffer.from(data, 'base64'));
  }

  // PDF só com os slides do carrossel; vem em partes (stream), como no PDF dos slides do PIM.
  await js(`document.querySelectorAll('.slide:not([data-carrossel])').forEach((s) => s.remove()); true`);
  await cdp('Emulation.setEmulatedMedia', { media: 'print' });
  const { stream } = await cdp('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, transferMode: 'ReturnAsStream' });
  const partes = [];
  for (let fim = false; !fim;) {
    const r = await cdp('IO.read', { handle: stream, size: 1 << 20 });
    partes.push(Buffer.from(r.data, r.base64Encoded ? 'base64' : 'utf8'));
    fim = r.eof;
  }
  await cdp('IO.close', { handle: stream });
  writeFileSync(PDF, Buffer.concat(partes));

  console.log(`${caixas.length} imagens em ${IMAGENS}`);
  console.log(`PDF do carrossel: ${PDF}`);
  if (problemas.length) {
    console.log('Atenção:');
    for (const p of problemas) console.log('  - ' + p);
    process.exitCode = 1;
  } else {
    console.log('Nenhum slide com conteúdo fora da borda ou imagem faltando.');
  }
  ws.close();
} finally {
  chrome.kill();
  await espera(300);
  try { rmSync(perfil, { recursive: true, force: true }); } catch { /* o Chrome ainda segura algum arquivo */ }
}
