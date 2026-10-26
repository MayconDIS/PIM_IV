import { BANCO_DE_DADOS } from '@nexti/shared';
import { AudioEngine } from '@nexti/shared/audio';
import { ConfettiEngine } from '@nexti/shared/confetti';

/** Apoio ao EstudoContext e cache de conteúdo isolado por usuário. */
const cachesDeDecks = new Map();

export const leJson = (chave, padrao) => {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
};

export const gravaJson = (chave, valor) => {
  const cache = cachesDeDecks.get(chave);
  if (cache) cache.decks = valor;
  try {
    localStorage.setItem(chave, JSON.stringify(cache ?? valor));
  } catch {
    /* modo privado / cota cheia: seguimos só com o estado em memória */
  }
};

/** Migração aditiva: uma carta acadêmica já incorporada nunca volta só por estar ausente. */
export function migrarDecksAcademicos(salvos, banco, incorporadas = []) {
  const validos = salvos && typeof salvos === 'object' && !Array.isArray(salvos)
    && Object.values(salvos).every(Array.isArray);
  const decks = structuredClone(validos ? salvos : {});
  const conhecidas = new Set(incorporadas);
  for (const [faseId, cartas] of Object.entries(banco)) {
    const novaFase = !Object.hasOwn(decks, faseId);
    if (novaFase) decks[faseId] = structuredClone(cartas);
    const frentes = new Set(decks[faseId].map((carta) => carta.frente));
    for (const carta of cartas.filter((c) => c.origemAcademica)) {
      const chave = `${faseId}\u001f${carta.frente}`;
      if (!novaFase && !conhecidas.has(chave) && !frentes.has(carta.frente)) {
        decks[faseId].push(structuredClone(carta));
        frentes.add(carta.frente);
      }
      conhecidas.add(chave);
    }
  }
  return { versaoConteudo: 1, decks, incorporadas: [...conhecidas] };
}

/** Deck e registro de migração são gravados juntos; sem espaço, ficam juntos em memória. */
export function carregarDecks(chave) {
  const bruto = cachesDeDecks.get(chave) ?? leJson(chave, null);
  const envelope = bruto?.versaoConteudo === 1;
  const cache = migrarDecksAcademicos(envelope ? bruto.decks : bruto, BANCO_DE_DADOS,
    envelope && Array.isArray(bruto.incorporadas) ? bruto.incorporadas : []);
  cachesDeDecks.set(chave, cache);
  gravaJson(chave, cache.decks);
  return cache.decks;
}

/** O backup leva o registro da migração junto: uma exclusão não vira carta nova ao restaurar. */
export function exportarMetadadosDoConteudo(chave) {
  const cache = cachesDeDecks.get(chave) ?? leJson(chave, null);
  return { versaoConteudo: 1, incorporadas: [...(cache?.incorporadas ?? [])] };
}

export function restaurarDecksDoBackup(chave, decks, metadados) {
  const incorporadas = metadados?.versaoConteudo === 1 && Array.isArray(metadados.incorporadas)
    ? metadados.incorporadas : [];
  const cache = migrarDecksAcademicos(decks, BANCO_DE_DADOS, incorporadas);
  cachesDeDecks.set(chave, cache);
  gravaJson(chave, cache.decks);
}

/** A API decide quais cartas existem; o canônico só complementa a referência da fonte. */
export function cartasConfirmadasPelaApi(faseId, cartas, banco = BANCO_DE_DADOS) {
  const canonicas = new Map((banco[faseId] ?? []).map((carta) => [carta.frente, carta]));
  return cartas.map((carta) => ({
    id: carta.id, frente: carta.frente, verso: carta.verso, dica: carta.dica,
    ...(carta.opcoes ? { opcoes: Array.isArray(carta.opcoes) ? carta.opcoes : String(carta.opcoes).split(';'), correta: carta.correta } : {}),
    ...(canonicas.get(carta.frente)?.origemAcademica ? { origemAcademica: canonicas.get(carta.frente).origemAcademica } : {}),
  }));
}

/** Uma resposta vazia válida também é autoritativa: não ressuscita cartas do cache. */
export async function consultarCartasDaFase({ faseId, online, consultar, locais, salvar }) {
  if (online) {
    try {
      const resposta = await consultar(faseId);
      if (Array.isArray(resposta)) {
        const cartas = cartasConfirmadasPelaApi(faseId, resposta);
        salvar(cartas);
        return cartas;
      }
    } catch {
      /* API indisponível: o último deck conhecido continua disponível para estudar. */
    }
  }
  return [...(locais ?? [])];
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
