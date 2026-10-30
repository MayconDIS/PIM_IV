// Lê as respostas da pesquisa (CSV baixado da planilha do Google Forms) e escreve um resumo em
// Markdown com os dois tipos de dado:
// - quantitativo: perfil, nota SUS, partes mais úteis, preço, pagamento, ofertas e canais (4 P's),
//   recomendação e opinião sobre a apresentação;
// - qualitativo: as respostas abertas de cada pergunta e uma primeira separação por temas
//   (palavras-chave), para a equipe revisar e escolher as citações do relatório.
// Uso, nesta pasta: node analisar-respostas.mjs respostas.csv > RESULTADOS.md
import { readFileSync } from 'node:fs';

const arquivo = process.argv[2];
if (!arquivo) {
  console.error('Uso: node analisar-respostas.mjs <respostas.csv>');
  process.exit(1);
}

/** CSV com aspas (como o Google exporta): campos com vírgula, aspas dobradas e quebras de linha. */
function lerCsv(texto) {
  const linhas = [];
  let linha = [], campo = '', aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; } else if (c === '"') aspas = false; else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ',') { linha.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      linha.push(campo); linhas.push(linha); linha = []; campo = '';
    } else campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas.filter((l) => l.some((v) => v.trim()));
}

const [cabecalho, ...dados] = lerCsv(readFileSync(arquivo, 'utf8').replace(/^﻿/, ''));
const coluna = (inicio) => cabecalho.findIndex((t) => t.trim().startsWith(inicio));
const cConsentimento = coluna('Você concorda em participar');
const respostas = dados.filter((r) => cConsentimento < 0 || /^Sim/.test(r[cConsentimento] ?? ''));
const valores = (inicio) => { const c = coluna(inicio); return c < 0 ? [] : respostas.map((r) => (r[c] ?? '').trim()).filter(Boolean); };

const pct = (n, total) => (total ? `${Math.round((n / total) * 100)}%` : '–');
const media = (lista) => (lista.length ? lista.reduce((a, b) => a + b, 0) / lista.length : NaN);
const num = (v) => v.toFixed(1).replace('.', ',');
const umaLinha = (t) => t.replace(/\s+/g, ' ');

// ---------------------------------------------------------------- quantitativo

/** Tabela de quantas vezes cada opção apareceu (perguntas de várias respostas vêm separadas por ", "). */
function contagem(inicio, varias = false) {
  const lista = valores(inicio);
  if (!lista.length) return '_Sem respostas._\n';
  const vezes = new Map();
  for (const v of lista) for (const op of varias ? v.split(', ') : [v]) vezes.set(op, (vezes.get(op) ?? 0) + 1);
  return '| Opção | Respostas | % |\n|---|---|---|\n' + [...vezes].sort((a, b) => b[1] - a[1])
    .map(([op, n]) => `| ${op} | ${n} | ${pct(n, lista.length)} |`).join('\n') + `\n\n_${lista.length} respostas._\n`;
}

/** Média de uma escala (1 a 5 ou 0 a 10). */
function escala(inicio) {
  const lista = valores(inicio).map(Number).filter((n) => !Number.isNaN(n));
  return lista.length ? `Média **${num(media(lista))}** (${lista.length} respostas).` : '_Sem respostas._';
}

// SUS: itens ímpares valem (nota − 1), pares valem (5 − nota); a soma × 2,5 vai de 0 a 100.
const cSus = Array.from({ length: 10 }, (_, i) => coluna(`S${i + 1}.`));
const notasSus = cSus.every((c) => c >= 0)
  ? respostas.map((r) => cSus.map((c) => Number(r[c])))
    .filter((n) => n.every((v) => v >= 1 && v <= 5))
    .map((n) => n.reduce((soma, v, i) => soma + (i % 2 === 0 ? v - 1 : 5 - v), 0) * 2.5)
  : [];
const leituraSus = (s) => (s >= 85 ? 'excelente' : s >= 71 ? 'boa' : s >= 51 ? 'aceitável' : 'abaixo do aceitável');
const textoSus = notasSus.length
  ? `Nota média **${num(media(notasSus))}** de 100 (${notasSus.length} respostas completas): usabilidade ` +
    `**${leituraSus(media(notasSus))}**. Menor nota ${num(Math.min(...notasSus))}, maior ${num(Math.max(...notasSus))}. ` +
    'Referência: 68 é a média dos sistemas avaliados com a SUS.'
  : '_Sem respostas completas._';

// Recomendação (0 a 10): promotores 9–10, neutros 7–8, detratores 0–6.
const recomendacoes = valores('De 0 a 10, quanto você recomendaria').map(Number);
const promotores = recomendacoes.filter((n) => n >= 9).length;
const detratores = recomendacoes.filter((n) => n <= 6).length;
const textoRecomendacao = recomendacoes.length
  ? `Média **${num(media(recomendacoes))}** · promotores (9–10) ${pct(promotores, recomendacoes.length)} · ` +
    `detratores (0–6) ${pct(detratores, recomendacoes.length)} · índice de recomendação (NPS) ` +
    `**${Math.round(((promotores - detratores) / recomendacoes.length) * 100)}** (${recomendacoes.length} respostas).`
  : '_Sem respostas._';

// ---------------------------------------------------------------- qualitativo

/** Todas as respostas abertas de uma pergunta, uma por linha. */
function textos(inicio) {
  const lista = valores(inicio);
  return lista.length ? lista.map((t) => `- ${umaLinha(t)}`).join('\n') + '\n' : '_Sem respostas._\n';
}

// Temas das respostas abertas: uma resposta entra em todos os temas cujas palavras cita
// (comparadas sem acento e em minúsculas).
const TEMAS = [
  ['Facilidade de uso', ['facil', 'simples', 'intuitiv', 'dificil', 'confus', 'complicad', 'entend', 'perdid']],
  ['Conteúdo e cartas', ['carta', 'conteudo', 'materia', 'disciplina', 'resumo', 'enade', 'questao', 'pergunta']],
  ['Revisão e memória', ['revis', 'lembr', 'esquec', 'memor', 'sm-2', 'repeti', 'fixar']],
  ['Gamificação e motivação', ['xp', 'moeda', 'nivel', 'rank', 'ponto', 'jogo', 'motiv', 'divert']],
  ['Celular', ['celular', 'app', 'mobile', 'telefone']],
  ['Visual', ['visual', 'cor', 'design', 'bonit', 'tela', 'layout', 'escuro', 'fonte']],
  ['Lentidão e erros', ['lent', 'demor', 'erro', 'bug', 'trav', 'carreg', 'caiu', 'nao funcion']],
  ['Preço', ['pag', 'preco', 'caro', 'barato', 'gratis', 'gratuit', 'dinheiro', 'assinatura']],
  ['Apresentação e relatório', ['apresenta', 'slide', 'explic', 'relatorio', 'tempo', 'exemplo']],
];
const PERGUNTAS_ABERTAS = ['Conte com suas palavras', 'Qual foi sua primeira impressão', 'Conte uma situação',
  'O que faltou ou atrapalhou', 'Se pudesse mudar uma coisa', 'Por que você pagaria', 'Por que você deu essa nota',
  'O que mais chamou sua atenção', 'O que ficou confuso ou poderia melhorar', 'Quer deixar mais algum comentário'];
const semAcento = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// A palavra-chave vale no começo de uma palavra: "xp" não casa com "explicou".
const citaTema = (resposta, palavras) => palavras.some((p) => new RegExp(`(^|[^a-z0-9])${p}`).test(semAcento(resposta)));

function tabelaDeTemas() {
  const abertas = PERGUNTAS_ABERTAS.flatMap((p) => valores(p));
  if (!abertas.length) return '_Sem respostas abertas._\n';
  const linhas = TEMAS.map(([tema, palavras]) => {
    const achadas = abertas.filter((r) => citaTema(r, palavras));
    const exemplos = [...new Set(achadas.map(umaLinha))].slice(0, 2)
      .map((r) => `"${umaLinha(r).slice(0, 90)}${r.length > 90 ? '…' : ''}"`).join(' · ').replace(/\|/g, '/');
    return [tema, achadas.length, exemplos];
  }).filter(([, n]) => n).sort((a, b) => b[1] - a[1]);
  const semTema = abertas.filter((r) => !TEMAS.some(([, palavras]) => citaTema(r, palavras))).length;
  return '| Tema | Menções | Exemplos |\n|---|---|---|\n' + linhas.map(([t, n, e]) => `| ${t} | ${n} | ${e} |`).join('\n')
    + `\n\n_${abertas.length} respostas abertas; ${semTema} sem tema reconhecido (leia na lista de cada pergunta)._\n`;
}

// ---------------------------------------------------------------- resumo

console.log(`# Resultados da pesquisa do Nex_TI

Arquivo: \`${arquivo.split(/[\\/]/).pop()}\` · ${dados.length} respostas, ${respostas.length} com consentimento.

O resumo traz os **dados quantitativos** (contagens, médias, nota SUS e recomendação) e os **dados
qualitativos** (respostas abertas, marcadas com "qualitativo"). A tabela de temas no fim é uma primeira
separação automática por palavras-chave: revise antes de citar no relatório.

## Quem respondeu

### Curso
${contagem('Qual é o seu curso')}
### Semestre
${contagem('Em que semestre você está')}
### Como estuda
${contagem('Como você costuma estudar', true)}
### O que mais atrapalha
${contagem('O que mais atrapalha seus estudos', true)}
### Como é estudar TI hoje (qualitativo)
${textos('Conte com suas palavras')}
### Já usou o Nex_TI?
${contagem('Você já usou o Nex_TI')}
## Uso do sistema

### Onde usou
${contagem('Onde você usou o Nex_TI', true)}
### O que fez
${contagem('O que você fez no Nex_TI', true)}
### Primeira impressão (qualitativo)
${textos('Qual foi sua primeira impressão')}
### Facilidade de uso (SUS)
${textoSus}

## Opinião sobre o Nex_TI

### Partes mais úteis
${contagem('Quais partes foram mais úteis', true)}
### Motivação com XP, moedas e níveis (1 a 5)
${escala('O XP, as moedas e os níveis')}

### Uma situação em que ajudou ou não ajudou (qualitativo)
${textos('Conte uma situação')}
### O que faltou ou atrapalhou (qualitativo)
${textos('O que faltou ou atrapalhou')}
### O que mudaria (qualitativo)
${textos('Se pudesse mudar uma coisa')}
### Pagaria por um plano individual? (confere o preço do plano de negócios)
${contagem('Você pagaria por um plano individual')}
### Por que pagaria ou não (qualitativo)
${textos('Por que você pagaria')}
### Forma de pagamento preferida (4 P's: preço)
${contagem('Como você prefere pagar uma assinatura')}
### Ofertas que fariam assinar (4 P's: promoção)
${contagem('Que tipo de oferta faria você assinar', true)}
### Onde gostaria de conhecer o Nex_TI (4 P's: praça e promoção)
${contagem('Onde você gostaria de ficar sabendo do Nex_TI', true)}
### Recomendação (0 a 10)
${textoRecomendacao}

### Por que essa nota de recomendação (qualitativo)
${textos('Por que você deu essa nota')}
## Apresentação e relatório

### Clareza (1 a 5)
${escala('O projeto foi explicado de forma clara')}

### Tempo da apresentação
${contagem('O que achou do tempo da apresentação')}
### Partes para detalhar mais
${contagem('Que partes você gostaria de ver com mais detalhe', true)}
### O que mais chamou atenção (qualitativo)
${textos('O que mais chamou sua atenção')}
### O que ficou confuso ou poderia melhorar (qualitativo)
${textos('O que ficou confuso ou poderia melhorar')}
## Outros comentários (qualitativo)
${textos('Quer deixar mais algum comentário')}
## Temas das respostas abertas (qualitativo)
${tabelaDeTemas()}`);
