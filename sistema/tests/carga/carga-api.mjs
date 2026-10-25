// Teste de carga da API do Nex_TI. Precisa da API rodando (npm run dev:api, ou dotnet run -c Release).
// Uso: node tests/carga/carga-api.mjs [url-base] [requisições por cenário] [em paralelo]
//
// Responde: quantas requisições por segundo a API atende e quanto demora a mais lenta, nas rotas
// que todo aluno chama ao abrir o site (fases, cartas, simulados) e na que grava cada resposta.
// Também confere que o limite de tentativas de login (30 por minuto por IP) segura uma rajada.
//
// Não responde: como a API se sai na Azure (plano gratuito, banco serverless que "dorme"). Lá o
// número é outro; aqui o que interessa é achar gargalo no código, não medir a nuvem.

const BASE = process.argv[2] ?? 'http://localhost:5000';
const TOTAL = Number(process.argv[3] ?? 2000);
const PARALELO = Number(process.argv[4] ?? 50);

function percentil(tempos, p) {
  const ordenados = [...tempos].sort((a, b) => a - b);
  return ordenados[Math.min(ordenados.length - 1, Math.floor((p / 100) * ordenados.length))];
}

/** Dispara TOTAL requisições, PARALELO de cada vez, e mede cada uma. */
async function cenario(nome, fazer, total = TOTAL) {
  const tempos = [];
  const status = {};
  let proxima = 0;
  const inicio = performance.now();
  async function trabalhador() {
    while (proxima < total) {
      const i = proxima++;
      const t0 = performance.now();
      let codigo;
      try {
        const r = await fazer(i);
        await r.arrayBuffer();
        codigo = r.status;
      } catch {
        codigo = 'erro de rede';
      }
      tempos.push(performance.now() - t0);
      status[codigo] = (status[codigo] ?? 0) + 1;
    }
  }
  await Promise.all(Array.from({ length: PARALELO }, trabalhador));
  const segundos = (performance.now() - inicio) / 1000;
  const linha = {
    cenario: nome,
    requisicoes: total,
    'req/s': Math.round(total / segundos),
    'p50 (ms)': percentil(tempos, 50).toFixed(1),
    'p95 (ms)': percentil(tempos, 95).toFixed(1),
    'p99 (ms)': percentil(tempos, 99).toFixed(1),
    status: Object.entries(status).map(([c, n]) => `${c}×${n}`).join(' '),
  };
  console.log(JSON.stringify(linha));
  return { ...linha, status };
}

const json = (corpo, token) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: JSON.stringify(corpo),
});

const online = await fetch(`${BASE}/api/status`).then((r) => r.ok).catch(() => false);
if (!online) {
  console.error(`A API não respondeu em ${BASE}/api/status. Suba a API antes (npm run dev:api).`);
  process.exit(1);
}

// Um aluno de teste para os cenários com login (gasta 2 das 30 tentativas do minuto).
const usuario = `carga_${Date.now().toString(36)}`;
const senha = 'Carga!Teste2026';
await fetch(`${BASE}/api/auth/register`, json({ username: usuario, email: `${usuario}@exemplo.test`, password: senha }));
const { token } = await (await fetch(`${BASE}/api/auth/login`, json({ username: usuario, password: senha }))).json();
const cartas = await (await fetch(`${BASE}/api/fases/fase1/flashcards`)).json();

console.log(`Carga em ${BASE}: ${TOTAL} requisições por cenário, ${PARALELO} em paralelo.`);
const resultados = [
  await cenario('GET /api/status', () => fetch(`${BASE}/api/status`)),
  await cenario('GET /api/fases', () => fetch(`${BASE}/api/fases`)),
  await cenario('GET /api/fases/fase1/flashcards', () => fetch(`${BASE}/api/fases/fase1/flashcards`)),
  await cenario('GET /api/simulados/questoes', () => fetch(`${BASE}/api/simulados/questoes`)),
  await cenario('POST /api/progresso/atualizar (grava no banco)', (i) =>
    fetch(`${BASE}/api/progresso/atualizar`, json({ usuarioId: 0, flashcardId: cartas[i % cartas.length].id, qualidade: [1, 3, 4, 5][i % 4] }, token))),
];

// Rajada de login: o limite precisa barrar o excesso com 429, e não deixar a API cair.
const rajada = await cenario('POST /api/auth/login (rajada de 60)', () =>
  fetch(`${BASE}/api/auth/login`, json({ username: usuario, password: 'Errada!123x' })), 60);

const falhas = resultados.filter((r) => Object.keys(r.status).some((c) => c !== '200'));
const barrou = (rajada.status['429'] ?? 0) > 0 && !rajada.status['500'];
console.log(falhas.length === 0 && barrou
  ? 'OK: nenhuma requisição falhou e o limite de login barrou a rajada com 429.'
  : `ATENÇÃO: ${falhas.map((f) => f.cenario).join(', ') || ''}${barrou ? '' : ' (o limite de login não barrou a rajada)'}`);
process.exit(falhas.length === 0 && barrou ? 0 : 1);
