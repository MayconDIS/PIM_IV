/**
 * Certificado de conclusão do Nex_TI como documento A4 (paisagem) pronto para
 * impressão / "Salvar como PDF".
 *
 * Substitui o endpoint /api/certificado/pdf, que executava um script Python no
 * servidor (superfície de injeção de comando e indisponível no App Service).
 * Função pura: devolve a string HTML e não toca no DOM — dá para testar.
 */

const escaparHtml = (texto) => String(texto ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

/** Código de autenticidade determinístico por aluno + data (o mesmo hash do app original). */
export function dadosDoCertificado(nomeAluno, hoje = new Date()) {
  const dataNumerica = hoje.toLocaleDateString('pt-BR');
  const dataPorExtenso = hoje.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

  let hash = 0;
  const base = `${nomeAluno}${dataNumerica}NexTI_Academy_Enade_PIMIV`;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return { dataPorExtenso, codigo: `NEX-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${dataNumerica.replace(/\//g, '')}` };
}

/**
 * "Nex_TI" em SVG com cores sólidas: o "T" ciano e o "I" roxo, as duas pontas do degradê
 * do logo. Nada de `background-clip: text` (o Chrome não imprime) nem de `url(#degrade)`:
 * impresso pelo iframe (srcdoc), o degradê não era encontrado e o "TI" sumia do certificado.
 */
const MARCA_SVG = `<svg class="marca" viewBox="0 0 260 56" role="img" aria-label="Nex_TI" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="44" font-family="Orbitron, Segoe UI, sans-serif" font-size="44" font-weight="800" fill="#ffffff">Nex_<tspan fill="#00e6e6">T</tspan><tspan fill="#8a2be2">I</tspan></text>
</svg>`;

export function gerarCertificadoHtml({ nome, dataPorExtenso, codigo }) {
  const n = escaparHtml(nome);
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Certificado Nex_TI — ${n}</title>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Orbitron:wght@700;800&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 297mm; height: 210mm; }
  body {
    background: #0b0c10; color: #c5c6c7;
    font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .folha { width: 297mm; height: 210mm; padding: 12mm; }
  .moldura {
    height: 100%; border: 1px solid rgba(0, 230, 230, 0.35); border-radius: 6px;
    padding: 12mm 18mm; display: flex; flex-direction: column; align-items: center;
    justify-content: space-between; text-align: center;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M10 30 L20 40 L10 50 M25 50 L35 50' stroke='rgba(0, 230, 230, 0.05)' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  }
  .marca { width: 62mm; height: auto; }
  .sub { font-family: 'Fira Code', monospace; font-size: 9pt; letter-spacing: 3px; text-transform: uppercase; color: #8b92a5; margin-top: 2mm; }
  h1 { font-family: 'Orbitron', sans-serif; font-size: 40pt; color: #fff; letter-spacing: 2px; }
  .rotulo { font-size: 13pt; color: #8b92a5; }
  .aluno { font-size: 30pt; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(138, 43, 226, 0.6); padding: 0 8mm 2mm; }
  .desc { font-size: 12pt; line-height: 1.7; max-width: 220mm; }
  .curso { display: block; font-family: 'Orbitron', sans-serif; font-size: 13pt; color: #00e6e6; margin: 2mm 0; }
  .meta { font-size: 11pt; }
  .codigo { font-family: 'Fira Code', monospace; }
  .codigo strong { color: #00e6e6; }
  .nota { font-size: 8pt; color: #6e7681; border-top: 1px solid #30363d; padding-top: 3mm; width: 100%; }
  .assinatura { width: 70mm; }
  .assinatura svg { width: 100%; height: 14mm; border-bottom: 1px solid rgba(0, 230, 230, 0.4); }
  .assinatura span { display: block; font-size: 9pt; color: #8b92a5; margin-top: 1.5mm; }
</style>
</head>
<body>
<main class="folha">
  <div class="moldura">
    <header>${MARCA_SVG}<div class="sub">EdTech Learning Platform</div></header>
    <h1>Certificado</h1>
    <p class="rotulo">Certificamos que</p>
    <p class="aluno">${n}</p>
    <p class="desc">concluiu com êxito a trilha de aprendizado de estudo ativo na plataforma
      <span class="curso">NEX_TI — EDTECH LEARNING PLATFORM == 20 HORAS</span>
      com duração total de 20 horas, realizando todas as atividades e avaliações necessárias,
      com aproveitamento superior a 80% no Simulado ENADE final.</p>
    <div class="meta">
      <p>A conclusão foi registrada em ${escaparHtml(dataPorExtenso)}.</p>
      <p class="codigo">Código do Certificado: <strong>${escaparHtml(codigo)}</strong></p>
    </div>
    <div class="assinatura">
      <svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <path d="M 20 45 Q 60 15 100 40 T 160 25 T 180 35" fill="none" stroke="#00e6e6" stroke-width="2" stroke-linecap="round"/>
        <path d="M 50 35 Q 90 55 130 30" fill="none" stroke="#00e6e6" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>Diretoria Nex_TI Academy</span>
    </div>
    <p class="nota">*Certificado válido, amparado pela Lei nº 9.394 de Diretrizes e Bases da Educação Nacional · Nex_TI Academy EdTech – PIM IV UNIP</p>
  </div>
</main>
</body>
</html>`;
}
