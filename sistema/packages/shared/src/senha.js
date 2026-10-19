/**
 * Regras de senha do Nex_TI — a lista que a tela mostra enquanto a pessoa digita.
 *
 * A API C# aplica as mesmas regras no cadastro (Services/PoliticaDeSenha.cs):
 * regra que só existe no navegador é contornável por quem chamar a API direto.
 * Mudou aqui, muda lá.
 *
 * Adaptado do CasalFlow (packages/shared/src/utils/senha.js):
 * - lista que diz o que falta, em vez de barra "fraca/média/forte";
 * - `\p{Lu}`/`\p{Ll}` em vez de `[A-Z]`, para "Ótimo" contar como maiúscula;
 * - a última regra recusa senha que contém o nickname ou o e-mail.
 */

export const TAMANHO_MINIMO_DE_SENHA = 8;

/** Partes do nickname/e-mail com menos de 4 letras aparecem por acaso em senha boa. */
const PEDACO_MINIMO = 4;

function naoUsaDadosPessoais(senha, contexto = {}) {
  const alvo = String(senha).toLowerCase();
  if (!alvo) return false;

  const local = String(contexto.email || '').split('@')[0];
  const pedacos = [local, contexto.nickname]
    .map((p) => String(p || '').trim().toLowerCase())
    .filter((p) => p.length >= PEDACO_MINIMO);

  return !pedacos.some((p) => alvo.includes(p));
}

/** Ordem de digitação: o tamanho é a primeira coisa que alguém cumpre. */
const REGRAS = [
  ['tamanho', `Pelo menos ${TAMANHO_MINIMO_DE_SENHA} caracteres`, (s) => s.length >= TAMANHO_MINIMO_DE_SENHA],
  ['maiuscula', 'Uma letra maiúscula', (s) => /\p{Lu}/u.test(s)],
  ['minuscula', 'Uma letra minúscula', (s) => /\p{Ll}/u.test(s)],
  ['numero', 'Um número', (s) => /\p{Nd}/u.test(s)],
  ['simbolo', 'Um símbolo (! @ # $)', (s) => /[^\p{L}\p{N}]/u.test(s)],
  ['sem_dados_seus', 'Não contém seu nickname nem seu e-mail', naoUsaDadosPessoais],
];

/**
 * Avalia a senha contra todas as regras. Devolve a lista inteira (cumpridas e
 * pendentes): a tela precisa das duas para mostrar progresso.
 *
 * @param {string} senha
 * @param {{ email?: string, nickname?: string }} [contexto]
 */
export function avaliarSenha(senha, contexto = {}) {
  const texto = typeof senha === 'string' ? senha : '';
  const regras = REGRAS.map(([id, rotulo, testa]) => ({
    id,
    rotulo,
    cumprida: texto.length > 0 && testa(texto, contexto),
  }));

  return {
    regras,
    cumpridas: regras.filter((r) => r.cumprida).length,
    total: regras.length,
    forte: regras.every((r) => r.cumprida),
    vazia: texto.length === 0,
  };
}

export function senhaEhForte(senha, contexto = {}) {
  return avaliarSenha(senha, contexto).forte;
}

/** Frase de erro que nomeia o que falta, em vez de um "senha fraca" genérico. */
export function mensagemDeSenhaFraca(senha, contexto = {}) {
  const { regras } = avaliarSenha(senha, contexto);
  if (!(typeof senha === 'string' && senha.length >= TAMANHO_MINIMO_DE_SENHA)) {
    return `A senha deve ter no mínimo ${TAMANHO_MINIMO_DE_SENHA} caracteres.`;
  }
  const faltando = regras.filter((r) => !r.cumprida).map((r) => r.rotulo.toLowerCase());
  if (!faltando.length) return '';
  const lista = faltando.length === 1
    ? faltando[0]
    : `${faltando.slice(0, -1).join(', ')} e ${faltando.at(-1)}`;
  return `A senha ainda precisa de: ${lista}.`;
}
