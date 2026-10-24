/**
 * Regras de progressão do Nex_TI: ordem das fases, desbloqueio, XP, moedas,
 * ranks e aprovação nos testes de módulo.
 *
 * O prêmio de cada fase sai do próprio conteúdo (content.js) e vira uma tabela
 * única: o site e o app a usam aqui, e a API recebe a mesma tabela em
 * apps/api/Data/Seed/recompensas.json para calcular o XP e as moedas no servidor.
 */

import { BONUS, FASES, TESTES } from './content.js';

/** Sequência oficial de desbloqueio: fases e testes, na ordem do menu. */
export const ORDEM_FASES = Object.freeze([
  'fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'teste-mod1',
  'fase6', 'fase7', 'fase8', 'fase9', 'fase10', 'teste-mod2',
  'fase11', 'fase12', 'fase13', 'fase14', 'fase15', 'teste-mod3',
  'fase16', 'fase17', 'fase18', 'fase19', 'fase20', 'teste-mod4',
  'fase21', 'fase22', 'fase23', 'fase24', 'fase25', 'teste-mod5',
]);

/** Fase liberada no primeiro acesso. */
export const FASES_INICIAIS = Object.freeze(['fase1']);

/** Faixas de XP de cada rank, do maior para o menor. */
export const RANKS = Object.freeze([
  { nome: 'Mestre da Computação', xpMinimo: 600, proximo: 'Nível Máximo', alvo: 600, nivel: 6 },
  { nome: 'Expert', xpMinimo: 300, proximo: 'Mestre da Computação', alvo: 600, nivel: 6 },
  { nome: 'Intermediário', xpMinimo: 100, proximo: 'Expert', alvo: 300, nivel: 3 },
  { nome: 'Ingressante', xpMinimo: 0, proximo: 'Intermediário', alvo: 100, nivel: 1 },
]);

export const isTeste = (faseId) => String(faseId).startsWith('teste-mod');
export const isBonus = (faseId) => String(faseId).startsWith('bonus');

/** Progresso para a barra de nível: rank atual, próximo e percentual. */
export function progressoDeNivel(xp, nivel = 1) {
  const pelaXp = RANKS.find((r) => xp >= r.xpMinimo) ?? RANKS[RANKS.length - 1];
  // O nivelamento grava o nível na API: quem começou como Intermediário não volta a Ingressante
  // só porque ainda tem pouco XP. Vale o maior dos dois ranks.
  // RANKS vai do maior para o menor; o Mestre só se alcança por XP.
  const peloNivel = RANKS.find((r) => r.xpMinimo < 600 && nivel >= r.nivel) ?? pelaXp;
  const rank = peloNivel.xpMinimo > pelaXp.xpMinimo ? peloNivel : pelaXp;
  const noTopo = rank.alvo === rank.xpMinimo;
  const base = xp >= rank.xpMinimo ? rank.xpMinimo : 0;
  const percentual = noTopo
    ? 100
    : Math.min(100, Math.max(0, Math.round(((xp - base) / (rank.alvo - base)) * 100)));

  return {
    rank: rank.nome,
    proximo: rank.proximo,
    xpMinimo: rank.xpMinimo,
    xpAlvo: rank.alvo,
    percentual,
    noTopo,
    rotuloRank: `Rank: ${rank.nome}`,
    rotuloProximo: noTopo ? '⭐ NÍVEL MÁXIMO' : `Próximo: ${rank.proximo}`,
    rotuloProgresso: noTopo ? `${xp} XP (100%)` : `${xp} / ${rank.alvo} XP (${percentual}%)`,
  };
}

/** Nível numérico enviado para a API (1, 3 ou 6). */
/** Nível pelo XP total, do maior para o menor. */
export const NIVEIS = Object.freeze([
  { xpMinimo: 300, nivel: 6 },
  { xpMinimo: 100, nivel: 3 },
  { xpMinimo: 0, nivel: 1 },
]);

export function nivelPorXp(xp) {
  return (NIVEIS.find((n) => xp >= n.xpMinimo) ?? NIVEIS[NIVEIS.length - 1]).nivel;
}

/** Percentual mínimo de acertos para passar: 80% no ENADE, 70% nos demais. */
export function corteDoTeste(faseId) {
  return faseId === 'teste-mod5' ? 80 : 70;
}

export function aproveitamento(acertos, total) {
  if (!total) return 0;
  return Math.round((acertos / total) * 100);
}

export function passouNoTeste(faseId, acertos, total) {
  return aproveitamento(acertos, total) >= corteDoTeste(faseId);
}

/** XP e moedas de uma disciplina bônus (o conteúdo só define o custo). */
export const XP_BONUS = 25;
export const MOEDAS_BONUS = 15;

/**
 * Prêmio de cada fase, teste e bônus, montado a partir do conteúdo. É a tabela que
 * a API recebe (recompensas.json): os dois lados pagam o mesmo valor.
 */
export function tabelaDeRecompensas() {
  return {
    fases: Object.fromEntries(FASES.map((f) => [f.id, { xp: f.xp, moedas: f.moedas }])),
    testes: Object.fromEntries(TESTES.map((t) => [t.id, { xp: t.xp, corte: corteDoTeste(t.id) }])),
    bonus: Object.fromEntries(BONUS.map((b) => [b.id, { xp: XP_BONUS, moedas: MOEDAS_BONUS, custo: b.custoMoedas }])),
    niveis: NIVEIS.map((n) => ({ ...n })),
  };
}

const TABELA = tabelaDeRecompensas();

/**
 * XP e moedas pagos ao concluir uma fase, teste ou bônus.
 * Teste reprovado não paga nada; fase desconhecida também não.
 */
export function recompensa(faseId, { acertos = 0, total = 0 } = {}) {
  const teste = TABELA.testes[faseId];
  if (teste) return passouNoTeste(faseId, acertos, total) ? { xp: teste.xp, moedas: 0 } : { xp: 0, moedas: 0 };
  const premio = TABELA.fases[faseId] ?? TABELA.bonus[faseId];
  return premio ? { xp: premio.xp, moedas: premio.moedas } : { xp: 0, moedas: 0 };
}

/** Próxima fase da trilha, ou null se for a última. */
export function proximaFase(faseId) {
  const indice = ORDEM_FASES.indexOf(faseId);
  if (indice < 0 || indice >= ORDEM_FASES.length - 1) return null;
  return ORDEM_FASES[indice + 1];
}

/**
 * Fases liberadas pelo que está no servidor, para o aluno continuar em outro aparelho:
 * - o nível gravado na API (vem do nivelamento) dá o ponto de partida, como no diagnóstico;
 * - fase com todas as cartas respondidas conta como concluída e libera a trilha até a seguinte.
 * Com `pularTestes` (app, que não tem os testes de módulo), a fase depois do teste também é liberada.
 */
export function fasesLiberadasNoServidor({ nivel = 1, progresso = [], pularTestes = false } = {}) {
  const liberadas = new Set(FASES_INICIAIS);
  if (nivel >= 6) ORDEM_FASES.forEach((f) => liberadas.add(f));
  else if (nivel >= 3) ORDEM_FASES.slice(0, ORDEM_FASES.indexOf('teste-mod2') + 1).forEach((f) => liberadas.add(f));

  const respondidas = {};
  for (const p of progresso) (respondidas[p.codigoFase] ??= new Set()).add(p.flashcardId);
  let ultimaConcluida = -1;
  for (const fase of FASES) {
    if (fase.totalCards > 0 && (respondidas[fase.id]?.size ?? 0) >= fase.totalCards) {
      ultimaConcluida = Math.max(ultimaConcluida, ORDEM_FASES.indexOf(fase.id));
    }
  }
  if (ultimaConcluida >= 0) {
    let ate = ultimaConcluida + 1;
    if (pularTestes && isTeste(ORDEM_FASES[ate] ?? '')) ate += 1;
    ORDEM_FASES.slice(0, ate + 1).forEach((f) => liberadas.add(f));
  }
  return ORDEM_FASES.filter((f) => liberadas.has(f));
}

/** true quando concluir esta fase libera o certificado. */
export function liberaCertificado(faseId) {
  return faseId === 'teste-mod5';
}

/** O aluno pode comprar este bônus com o saldo atual de moedas? */
export function podeComprarBonus(moedas, custo) {
  return moedas >= custo;
}
