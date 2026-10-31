// Gera o relatório em Word (.docx) a partir do index.html desta pasta, no padrão ABNT.
// Uso, nesta pasta: npm run gerar (ou node gerar-docx.js <pasta do index.html> <saida.docx>)
const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');
const { imageSize } = require('image-size');
const {
  AlignmentType, BorderStyle, Document, Footer, Header, HeadingLevel, ImageRun, LineRuleType, Packer, PageBreak,
  HeightRule, PageNumber, Paragraph, ShadingType, Table, TableCell, TableOfContents, TableRow, TextRun, VerticalAlign, WidthType,
} = require('docx');

const [PASTA, SAIDA] = process.argv.slice(2);
const html = parse(fs.readFileSync(path.join(PASTA, 'index.html'), 'utf8'));

const CM = 567; // 1 cm em DXA (twips)
const LARGURA_UTIL = Math.round(16 * CM); // A4 (21 cm) menos 3 + 2 cm de margem
const FONTE = 'Arial';
const ESPACO_15 = { line: 360, lineRule: LineRuleType.AUTO };

// ---------------------------------------------------------------- texto
const limpar = (t) => t.replace(/\s+/g, ' ');

/** Converte os filhos de um nó em TextRuns, mantendo negrito, itálico e quebras de linha. */
function runs(no, estilo = {}) {
  const saida = [];
  for (const filho of no.childNodes) {
    if (filho.nodeType === 3) {
      const texto = limpar(filho.rawText.replace(/&nbsp;/g, ' ')).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      if (texto) saida.push(new TextRun({ text: texto, font: FONTE, ...estilo }));
      continue;
    }
    const tag = filho.rawTagName?.toLowerCase();
    if (tag === 'br') saida.push(new TextRun({ break: 1 }));
    else if (tag === 'strong' || tag === 'b') saida.push(...runs(filho, { ...estilo, bold: true }));
    else if (tag === 'em' || tag === 'i') saida.push(...runs(filho, { ...estilo, italics: true }));
    else if (tag === 'code') saida.push(...runs(filho, { ...estilo }));
    else if (tag === 'span' && filho.classList?.contains('num-pagina')) continue;
    else saida.push(...runs(filho, estilo));
  }
  // tira espaço no começo e no fim do parágrafo
  return saida;
}

const paragrafo = (no, opcoes = {}) => new Paragraph({
  children: runs(no, opcoes.estilo || {}),
  alignment: opcoes.alinhamento ?? AlignmentType.JUSTIFIED,
  indent: opcoes.recuo === false ? undefined : { firstLine: Math.round(1.5 * CM) },
  spacing: { ...ESPACO_15, after: opcoes.depois ?? 120, before: opcoes.antes ?? 0 },
  keepNext: opcoes.keepNext,
});

// Parte nova (etapa, capítulo, ficha) começa em página nova pela quebra no próprio título: um parágrafo
// só com a quebra pode cair sozinho numa página e deixá-la em branco.
let quebraNoProximoTitulo = false;
const usarQuebra = () => {
  const quebrar = quebraNoProximoTitulo;
  quebraNoProximoTitulo = false;
  return quebrar || undefined;
};
const titulo = (texto, nivel, centro = false) => new Paragraph({
  children: [new TextRun({ text: limpar(texto).trim(), bold: true, font: FONTE, size: 24 })],
  heading: nivel,
  pageBreakBefore: usarQuebra(),
  alignment: centro ? AlignmentType.CENTER : AlignmentType.LEFT,
  spacing: { ...ESPACO_15, before: 240, after: 240 },
  keepNext: true,
});

// ---------------------------------------------------------------- imagens
function tamanhoImagem(arquivo) {
  const dados = fs.readFileSync(arquivo);
  const { width: w, height: h, type } = imageSize(dados);
  if (!w || !h || !['png', 'jpg', 'gif', 'bmp'].includes(type)) {
    throw new Error(`Formato de imagem não suportado no Word: ${arquivo}`);
  }
  return { w, h, dados, tipo: type };
}

function imagem(img, larguraFixaCm) {
  const src = decodeURI(img.getAttribute('src'));
  const arquivo = path.join(PASTA, src);
  const { w, h, dados, tipo } = tamanhoImagem(arquivo);
  const classe = img.getAttribute('class') || '';
  const estilo = /max-height:\s*([\d.]+)cm/.exec(img.getAttribute('style') || '');
  const porClasse = /img-height-(\d+)/.exec(classe);
  // altura máxima: a do style (Apêndice B), a da classe img-height-N (+20%, a folha do Word é mais alta) ou 17 cm
  const alturaMax = estilo ? Math.min(Number(estilo[1]), 17) : porClasse ? Math.min(Number(porClasse[1]) * 1.2, 17) : 17;
  const larguraMax = 16; // cm
  let largura = larguraFixaCm || larguraMax, altura = largura * h / w;
  if (altura > alturaMax) { altura = alturaMax; largura = alturaMax * w / h; }
  const px = (cm) => Math.round(cm / 2.54 * 96);
  return new Paragraph({
    children: [new ImageRun({ data: dados, type: tipo, transformation: { width: px(largura), height: px(altura) },
      altText: { name: img.getAttribute('alt') || 'Figura', description: img.getAttribute('alt') || '', title: img.getAttribute('alt') || '' } })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    keepNext: true,
  });
}

// ---------------------------------------------------------------- tabelas
const borda = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const bordas = { top: borda, bottom: borda, left: borda, right: borda };

function tabela(no, { semBorda = false, larguraCm = 16, fonte = 20 } = {}) {
  const linhas = no.querySelectorAll('tr');
  const preencher = (no.getAttribute('class') || '').includes('tabela-preencher');
  const nCol = Math.max(...linhas.map((l) => l.childNodes.filter((c) => ['td', 'th'].includes(c.rawTagName?.toLowerCase())).length));
  const largura = Math.round(larguraCm * CM);
  // larguras pelo tamanho médio do texto de cada coluna, com mínimo
  const tam = Array(nCol).fill(0);
  for (const l of linhas) {
    l.childNodes.filter((c) => ['td', 'th'].includes(c.rawTagName?.toLowerCase())).forEach((c, k) => { tam[k] += Math.min(limpar(c.text).length, 120) + 8; });
  }
  const soma = tam.reduce((a, b) => a + b, 0);
  let cols = tam.map((t) => Math.max(Math.round(largura * t / soma), Math.round(2.2 * CM)));
  // Largura fixa quando o HTML pede (col-width-N no cabeçalho): coluna vazia, como a do e-mail, não fica estreita.
  const fixas = linhas[0].childNodes.filter((c) => ['td', 'th'].includes(c.rawTagName?.toLowerCase()))
    .map((c) => Number((c.getAttribute('class') || '').match(/col-width-(\d+)/)?.[1]) || 0);
  if (fixas.length === nCol && fixas.every(Boolean)) cols = fixas.map((p) => Math.round(largura * p / 100));
  const ajuste = largura - cols.reduce((a, b) => a + b, 0);
  cols[cols.indexOf(Math.max(...cols))] += ajuste;
  return new Table({
    width: { size: largura, type: WidthType.DXA },
    columnWidths: cols,
    alignment: AlignmentType.CENTER,
    rows: linhas.map((l) => new TableRow({
      cantSplit: true,
      // Tabela preenchida à mão (ficha): linhas de dados com 0,9 cm para escrever.
      height: preencher && l.parentNode?.rawTagName?.toLowerCase() !== 'thead' && !l.querySelector('th')
        ? { value: Math.round(0.9 * CM), rule: HeightRule.ATLEAST } : undefined,
      tableHeader: l.parentNode?.rawTagName?.toLowerCase() === 'thead',
      children: l.childNodes.filter((c) => ['td', 'th'].includes(c.rawTagName?.toLowerCase())).map((c, k) => {
        const cab = c.rawTagName.toLowerCase() === 'th';
        return new TableCell({
          width: { size: cols[k], type: WidthType.DXA },
          borders: semBorda ? undefined : bordas,
          shading: cab && !semBorda ? { type: ShadingType.CLEAR, color: 'auto', fill: 'E7E6E6' } : undefined,
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            children: runs(c, { size: fonte, bold: cab || undefined }),
            alignment: cab ? AlignmentType.CENTER : AlignmentType.LEFT,
            spacing: { line: 240, after: 0 },
          })],
        });
      }),
    })),
  });
}

// ---------------------------------------------------------------- corpo de uma página
function blocos(no, saida, ultimoNaPagina = true) {
  const elementos = no.childNodes.filter((f) => f.nodeType !== 3 && f.rawTagName);
  for (const filho of no.childNodes) {
    if (filho.nodeType === 3) continue;
    const tag = filho.rawTagName?.toLowerCase();
    const cls = filho.getAttribute?.('class') || '';
    if (!tag || cls.includes('num-pagina')) continue;
    if (tag === 'h2') saida.push(titulo(filho.text, HeadingLevel.HEADING_1, cls.includes('center')));
    else if (tag === 'h3') saida.push(titulo(filho.text, HeadingLevel.HEADING_2));
    else if (tag === 'h4') saida.push(titulo(filho.text, HeadingLevel.HEADING_3));
    else if (tag === 'p') {
      if (cls.includes('legenda-topo')) saida.push(new Paragraph({ children: runs(filho, { bold: true, size: 20 }), alignment: AlignmentType.CENTER, spacing: { before: 240, after: 60 }, keepNext: true }));
      else if (cls.includes('legenda-fonte')) saida.push(new Paragraph({ children: runs(filho, { size: 20 }), alignment: AlignmentType.CENTER, spacing: { after: 240 } }));
      else if (cls.includes('referencia')) saida.push(new Paragraph({ children: runs(filho), alignment: AlignmentType.LEFT, spacing: { line: 240, after: 240 } }));
      else saida.push(paragrafo(filho, { recuo: cls.includes('paragrafo') ? undefined : false }));
    } else if (tag === 'table') {
      // Espaço depois da tabela só se ainda vem algo na página; no fim, ele poderia ir sozinho para uma folha nova.
      const ultimo = ultimoNaPagina && elementos[elementos.length - 1] === filho;
      saida.push(tabela(filho));
      if (!ultimo) saida.push(new Paragraph({ spacing: { after: 120 } }));
    }
    else if (tag === 'img') saida.push(imagem(filho));
    else if (tag === 'ul' || tag === 'ol') filho.querySelectorAll('li').forEach((li) => saida.push(paragrafo(li, { recuo: false })));
    else if (tag === 'br') continue;
    else blocos(filho, saida, ultimoNaPagina && elementos[elementos.length - 1] === filho); // div, header, nav, footer...
  }
}

// ---------------------------------------------------------------- páginas pré-textuais
const paginas = html.querySelectorAll('section.page');
const porRotulo = (r) => paginas.find((p) => p.getAttribute('aria-label') === r);

const centro = (texto, extra = {}) => new Paragraph({
  children: [new TextRun({ text: texto, font: FONTE, bold: extra.bold, size: 24 })],
  alignment: AlignmentType.CENTER, spacing: { ...ESPACO_15, after: 0, before: extra.antes ?? 0 },
});

function capa() {
  const p = porRotulo('Capa do Trabalho');
  const linhas = p.querySelector('.capa-header').innerHTML.split(/<br\s*\/?>/i).map((t) => limpar(t).trim());
  const logo = p.querySelector('img');
  const saida = [imagem(logo, 6)];
  let vazias = 0;
  for (const l of linhas) {
    if (!l) { vazias += 1; continue; }
    saida.push(centro(l.toUpperCase(), { bold: true, antes: vazias ? 240 * vazias : 0 }));
    vazias = 0;
  }
  saida.push(new Paragraph({ spacing: { before: 600 } }));
  saida.push(tabela(p.querySelector('table'), { semBorda: true, larguraCm: 12, fonte: 24 }));
  const rodape = p.querySelector('footer').innerHTML.split(/<br\s*\/?>/i).map((t) => limpar(t).trim().toUpperCase());
  saida.push(centro(rodape[0], { antes: 2400 }), centro(rodape[1]));
  return saida;
}

function folhaDeRosto() {
  const p = porRotulo('Folha de Rosto');
  const saida = [tabela(p.querySelector('table'), { semBorda: true, larguraCm: 12, fonte: 24 })];
  saida.push(new Paragraph({
    children: [new TextRun({ text: limpar(p.querySelector('.capa-titulo').text).trim(), bold: true, font: FONTE })],
    alignment: AlignmentType.CENTER, spacing: { ...ESPACO_15, before: 1700, after: 1700 },
  }));
  saida.push(new Paragraph({
    children: [new TextRun({ text: limpar(p.querySelector('.recuo-rosto').text).trim(), font: FONTE, size: 20 })],
    alignment: AlignmentType.JUSTIFIED, indent: { left: Math.round(8 * CM) }, spacing: { line: 240 },
  }));
  const rodape = p.querySelector('footer').innerHTML.split(/<br\s*\/?>/i).map((t) => limpar(t).trim().toUpperCase());
  saida.push(centro(rodape[0], { antes: 2600 }), centro(rodape[1]));
  return saida;
}

function resumo(rotulo) {
  const saida = [];
  blocos(porRotulo(rotulo), saida);
  return saida;
}

function sumario() {
  return [
    new Paragraph({ children: [new TextRun({ text: 'SUMÁRIO', bold: true, font: FONTE })], alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
    new TableOfContents('Sumário', { hyperlink: true, headingStyleRange: '1-3' }),
  ];
}

// ---------------------------------------------------------------- montagem
const quebra = () => new Paragraph({ children: [new PageBreak()] });
const pre = [...capa(), quebra(), ...folhaDeRosto(), quebra(), ...resumo('Resumo'), quebra(), ...resumo('Abstract'), quebra(), ...sumario()];

const textuais = [];
const inicio = paginas.findIndex((p) => p.getAttribute('aria-label') === '1 INTRODUÇÃO');
// Quebra de página só antes das partes principais; o resto do texto segue corrido.
const comecaParte = (pg) => {
  const h = pg.querySelector('h2, h3');
  if (!h) return false;
  return h.rawTagName.toLowerCase() === 'h2' || /^\d+\.\d+ Etapa/.test(h.text.trim());
};
paginas.slice(inicio).forEach((pg, k) => {
  if (k > 0 && (comecaParte(pg) || pg.getAttribute('aria-label') === 'Ficha')) quebraNoProximoTitulo = true;
  blocos(pg, textuais);
});

const cabecalho = new Header({
  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONTE, size: 20 })] })],
});
const pagina = { size: { width: 11906, height: 16838 }, margin: { top: Math.round(3 * CM), left: Math.round(3 * CM), bottom: Math.round(2 * CM), right: Math.round(2 * CM), header: Math.round(2 * CM) } };

const doc = new Document({
  creator: 'Equipe Nex_TI',
  title: 'Nex_TI – PIM IV',
  description: 'Relatório do Projeto Integrado Multidisciplinar IV',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONTE, size: 24 }, paragraph: { spacing: ESPACO_15 } } },
    paragraphStyles: [1, 2, 3].map((n) => ({
      id: `Heading${n}`, name: `Heading ${n}`, basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { font: FONTE, size: 24, bold: true, color: '000000' },
      paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: n - 1 },
    })),
  },
  sections: [
    { properties: { page: pagina }, children: pre },
    { properties: { page: { ...pagina, pageNumbers: { start: inicio + 1 } } }, headers: { default: cabecalho }, footers: { default: new Footer({ children: [] }) }, children: textuais },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(SAIDA, buf);
  console.log('ok:', SAIDA, Math.round(buf.length / 1024), 'KB; páginas do HTML a partir da introdução:', paginas.length - inicio);
});
