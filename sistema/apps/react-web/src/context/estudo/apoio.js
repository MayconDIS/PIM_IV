import { BANCO_DE_DADOS } from '@nexti/shared';
import { AudioEngine } from '@nexti/shared/audio';
import { ConfettiEngine } from '@nexti/shared/confetti';

/** Funções sem estado usadas pelas partes do EstudoContext. */

export const leJson = (chave, padrao) => {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
};

export const gravaJson = (chave, valor) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* modo privado / cota cheia: seguimos só com o estado em memória */
  }
};

/** Mesma verificação de integridade do vanilla: versão antiga ou texto com mojibake volta ao banco canônico. */
export function carregarDecks(chave) {
  const salvos = leJson(chave, null);
  let integros = Boolean(salvos?.fase22 && salvos.fase22.length >= 50);
  if (integros) {
    const amostra = JSON.stringify(salvos.fase1 || []) + JSON.stringify(salvos.fase2 || []);
    if (/Ã|Ã§|Ã£|Ã©/.test(amostra)) integros = false;
  }
  return integros ? salvos : structuredClone(BANCO_DE_DADOS);
}

/** Nível enviado à API: o maior entre o que o rank salvo indica e o que o XP garante. */
export function nivelParaApi(rotuloRank, xp) {
  let nivel = 1;
  if (rotuloRank.includes('Expert')) nivel = 6;
  else if (rotuloRank.includes('Intermediário')) nivel = 3;
  if (xp >= 300) nivel = Math.max(nivel, 6);
  else if (xp >= 100) nivel = Math.max(nivel, 3);
  return nivel;
}

export function rotuloDoNivelDaApi(nivel) {
  if (nivel === 1) return 'Rank: Ingressante';
  if (nivel >= 2 && nivel <= 5) return 'Rank: Intermediário';
  if (nivel > 5) return 'Rank: Expert';
  return `Rank: Nível ${nivel}`;
}

/** Rank pelo XP; sem mudança de faixa, fica o rank atual. */
export function rankPorXp(rankAtual, xp) {
  if (xp >= 300) return 'Rank: Expert';
  if (xp >= 100) return 'Rank: Intermediário';
  return rankAtual;
}

export const som = (metodo) => {
  try {
    AudioEngine?.[metodo]?.();
  } catch {
    /* áudio é enfeite: nunca pode derrubar o estudo */
  }
};

export const confete = (metodo, ...args) => {
  try {
    ConfettiEngine?.[metodo]?.(...args);
  } catch {
    /* idem */
  }
};
