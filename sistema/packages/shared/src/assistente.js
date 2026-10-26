import { BANCO_DE_DADOS, FASES, BONUS } from './content.js';
import { ORIENTACOES_ASSISTENTE } from './orientacoesAssistente.js';

const SUGESTOES = ['Como funciona o SM-2?', 'Como ganhar XP?', 'O que é uma variável?', 'Como usar o ENADE?'];
const IGNORADAS = new Set(('a o os as um uma uns umas de da do das dos em no na nos nas e ou que qual quais '
  + 'como para por porque pq com sem se ao aos pelo pela pelos pelas eu me meu minha meus minhas voce '
  + 'voces ele ela isso isto esse essa esses essas este esta estes estas ser estar e eh sao um tem tenho '
  + 'quero queria gostaria favor pode poderia preciso saber explique explicar explica funciona funcionar '
  + 'sobre mais melhor exemplo exemplos ne conceito conceitos significa significado definicao entender ajuda').split(' '));

function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/c\+\+/g, ' cpp ').replace(/c#/g, ' csharp ').replace(/\.net\b/g, ' dotnet ')
    .replace(/sm[\s-]*2/g, ' sm2 ').replace(/e-mail/g, ' email ').replace(/[^a-z0-9]+/g, ' ').trim();
}

function radical(palavra) {
  if (palavra.endsWith('veis')) return palavra.slice(0, -4) + 'vel';
  if (palavra.endsWith('coes')) return palavra.slice(0, -4) + 'cao';
  if (palavra.endsWith('oes')) return palavra.slice(0, -3) + 'ao';
  return palavra.length > 4 && palavra.endsWith('s') ? palavra.slice(0, -1) : palavra;
}

function termos(texto) {
  return [...new Set(normalizar(texto).split(' ').filter(t => t && !IGNORADAS.has(t)).map(radical))];
}

function documento(titulo, perguntas, texto, tipo, faseId) {
  return { titulo, texto, tipo, faseId, chaves: new Set(termos(perguntas.join(' '))),
    corpo: new Set(termos(texto)), perguntas: perguntas.map(p => termos(p).join(' ')) };
}

// Montado apenas na primeira pergunta. Nenhuma rede, banco ou armazenamento do navegador.
let indice;
function obterIndice() {
  if (indice) return indice;
  const guias = ORIENTACOES_ASSISTENTE.map(o => documento(
    `Guia do Nex_TI · ${o.titulo}`, o.perguntas, o.texto, 'orientacao',
  ));
  // Questões de múltipla escolha precisam do enunciado e alternativas: não oferecemos
  // um gabarito isolado como se fosse a explicação de um conceito.
  const cartas = [...FASES, ...BONUS].flatMap(fase => (BANCO_DE_DADOS[fase.id] ?? []).filter(c => !c.opcoes).map(c => documento(
    `${fase.titulo} · ${c.frente}`, [c.frente], c.verso, 'conteudo', fase.id,
  )));
  indice = [...guias, ...cartas];
  return indice;
}

function classificar(doc, busca, frase) {
  const noTitulo = busca.filter(t => doc.chaves.has(t)).length;
  const presentes = busca.filter(t => doc.chaves.has(t) || doc.corpo.has(t)).length;
  // Exige a maioria dos termos; uma palavra conhecida numa pergunta alheia não basta.
  if (presentes / busca.length < 0.75 || (!noTitulo && presentes !== busca.length)) return 0;
  const exata = doc.perguntas.includes(frase);
  return (exata ? 100 : 0) + 10 * noTitulo / busca.length + presentes / busca.length
    + (doc.tipo === 'orientacao' ? 0.2 : 0) - doc.chaves.size * 0.002;
}

function semResposta(texto) {
  return { tipo: 'nao-encontrado', texto, fontes: [], sugestoes: [...SUGESTOES] };
}

/** Pesquisa literal nos materiais locais; não produz explicações ou fatos novos. */
export function responderPergunta(pergunta) {
  if (typeof pergunta !== 'string' || !pergunta.trim()) {
    return semResposta('Escreva uma dúvida sobre o Nex_TI ou um assunto de TI.');
  }
  if (pergunta.length > 400) return semResposta('Use até 400 caracteres e faça uma pergunta por vez.');
  const limpo = normalizar(pergunta);
  if (/^(oi|ola|bom dia|boa tarde|boa noite|obrigado|obrigada|valeu)$/.test(limpo)) {
    return { tipo: 'orientacao', texto: 'Olá! Eu sou o Nexor, seu assistente de estudos. Posso buscar conteúdos de TI e orientações do Nex_TI. Sobre qual assunto você quer perguntar?', fontes: [], sugestoes: [...SUGESTOES] };
  }
  const busca = termos(pergunta);
  if (!busca.length) return semResposta('Diga qual assunto você quer consultar, como variável, SQL ou revisão SM-2.');
  const resultados = obterIndice().map(doc => ({ doc, pontos: classificar(doc, busca, busca.join(' ')) }))
    .filter(r => r.pontos > 0).sort((a, b) => b.pontos - a.pontos);
  if (!resultados.length) {
    return semResposta('Não encontrei uma resposta suficientemente próxima nos materiais locais. Tente citar o conceito ou a ferramenta e faça uma pergunta por vez. Não consigo buscar na internet nem criar uma explicação nova.');
  }
  const melhor = resultados[0];
  const selecionados = melhor.doc.tipo === 'orientacao' || melhor.pontos >= 100
    ? [melhor] : resultados.filter(r => r.doc.tipo === melhor.doc.tipo && r.pontos >= melhor.pontos * 0.9).slice(0, 3);
  return {
    tipo: melhor.doc.tipo,
    texto: melhor.doc.tipo === 'orientacao' ? 'Encontrei esta orientação do Nex_TI:' : 'Encontrei estes trechos nas cartas de estudo:',
    fontes: selecionados.map(({ doc }) => ({ titulo: doc.titulo, texto: doc.texto, ...(doc.faseId ? { faseId: doc.faseId } : {}) })),
    sugestoes: [],
  };
}
