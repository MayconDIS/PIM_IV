/**
 * Regras de progressão do Nex_TI: ordem das fases, desbloqueio, XP, moedas,
 * ranks e aprovação nos testes de módulo.
 *
 * Porte fiel do dashboard vanilla original (`ordemFases`,
 * `atualizarBarraNivel`, `finalizarTesteModulo` e `irParaProximaAula`).
 */

/** Sequência oficial de desbloqueio: fases e testes, na ordem do menu. */
export const ORDEM_FASES = Object.freeze([
  'fase1', 'fase2', 'fase3', 'fase4', 'fase5', 'teste-mod1',
  'fase6', 'fase7', 'fase8', 'fase9', 'fase10', 'teste-mod2',
  'fase11', 'fase12', 'fase13', 'fase14', 'fase15', 'teste-mod3',
  'fase16', 'fase17', 'fase18', 'fase19', 'fase20', 'teste-mod4',
  'fase21', 'fase22', 'teste-mod5',
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
export function progressoDeNivel(xp) {
  const rank = RANKS.find((r) => xp >= r.xpMinimo) ?? RANKS[RANKS.length - 1];
  const noTopo = rank.alvo === rank.xpMinimo;
  const percentual = noTopo
    ? 100
    : Math.min(100, Math.max(0, Math.round(((xp - rank.xpMinimo) / (rank.alvo - rank.xpMinimo)) * 100)));

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
export function nivelPorXp(xp) {
  if (xp >= 300) return 6;
  if (xp >= 100) return 3;
  return 1;
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

/**
 * XP e moedas pagos ao concluir uma fase, teste ou bônus.
 * Teste reprovado não paga nada.
 */
export function recompensa(faseId, { acertos = 0, total = 0 } = {}) {
  if (isTeste(faseId)) {
    if (!passouNoTeste(faseId, acertos, total)) return { xp: 0, moedas: 0 };
    return { xp: faseId === 'teste-mod5' ? 50 : 25, moedas: 0 };
  }

  if (isBonus(faseId)) return { xp: 25, moedas: 15 };

  const numero = Number(String(faseId).replace('fase', ''));
  if (!Number.isFinite(numero)) return { xp: 0, moedas: 0 };
  if (numero <= 5) return { xp: 5, moedas: 10 };
  if (numero <= 10) return { xp: 10, moedas: 10 };
  if (numero <= 15) return { xp: 15, moedas: 10 };
  if (numero <= 20) return { xp: 20, moedas: 10 };
  if (numero <= 22) return { xp: 30, moedas: 70 };
  return { xp: 0, moedas: 0 };
}

/** Próxima fase da trilha, ou null se for a última. */
export function proximaFase(faseId) {
  const indice = ORDEM_FASES.indexOf(faseId);
  if (indice < 0 || indice >= ORDEM_FASES.length - 1) return null;
  return ORDEM_FASES[indice + 1];
}

/** true quando concluir esta fase libera o certificado. */
export function liberaCertificado(faseId) {
  return faseId === 'teste-mod5';
}

/** O aluno pode comprar este bônus com o saldo atual de moedas? */
export function podeComprarBonus(moedas, custo) {
  return moedas >= custo;
}
