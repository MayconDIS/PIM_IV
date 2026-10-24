import { useEffect, useRef, useState } from 'react';
import { FASES_INICIAIS } from '@nexti/shared';
import { carregarDecks, gravaJson, leJson } from './apoio.js';

/**
 * O que fica salvo no navegador: XP, moedas, rank, SM-2 de cada carta, decks,
 * fases e bônus liberados e o certificado. Também guarda se a API está no ar.
 */
export function useProgresso(userKey) {
  const [xp, setXp] = useState(() => Number.parseInt(localStorage.getItem(`${userKey}xp`), 10) || 0);
  const [moedas, setMoedas] = useState(() => Number.parseInt(localStorage.getItem(`${userKey}coins`), 10) || 0);
  const [rank, setRank] = useState(() => localStorage.getItem(`${userKey}rank`) || 'Rank: Pendente');
  const [srsData, setSrsData] = useState(() => leJson(`${userKey}srs`, {}));
  const [decks, setDecks] = useState(() => carregarDecks(`${userKey}decks`));
  const [fasesDesbloqueadas, setFasesDesbloqueadas] = useState(() =>
    leJson(`${userKey}desbloqueadas`, [...FASES_INICIAIS]),
  );
  const [bonusDesbloqueados, setBonusDesbloqueados] = useState(() => leJson(`${userKey}bonus_unlocked`, []));
  const [certificadoLiberado, setCertificadoLiberado] = useState(
    () => localStorage.getItem(`${userKey}certificado_unlocked`) === 'true',
  );
  const [apiOnline, setApiOnline] = useState(false);
  const apiOnlineRef = useRef(false);

  useEffect(() => localStorage.setItem(`${userKey}xp`, String(xp)), [userKey, xp]);
  useEffect(() => localStorage.setItem(`${userKey}coins`, String(moedas)), [userKey, moedas]);
  useEffect(() => gravaJson(`${userKey}srs`, srsData), [userKey, srsData]);
  useEffect(() => gravaJson(`${userKey}decks`, decks), [userKey, decks]);
  useEffect(() => gravaJson(`${userKey}desbloqueadas`, fasesDesbloqueadas), [userKey, fasesDesbloqueadas]);
  useEffect(() => gravaJson(`${userKey}bonus_unlocked`, bonusDesbloqueados), [userKey, bonusDesbloqueados]);

  /** O rank também vai para o localStorage na hora: a tela de login lê de lá. */
  const definirRank = (rotulo) => {
    setRank(rotulo);
    localStorage.setItem(`${userKey}rank`, rotulo);
  };

  const definirApiOnline = (online) => {
    apiOnlineRef.current = online;
    setApiOnline(online);
  };

  const faseLiberada = (faseId) => fasesDesbloqueadas.includes(faseId) || bonusDesbloqueados.includes(faseId);

  const liberarFase = (id) => setFasesDesbloqueadas((atual) => (atual.includes(id) ? atual : [...atual, id]));

  return {
    xp, moedas, rank, srsData, decks, fasesDesbloqueadas, bonusDesbloqueados, certificadoLiberado, apiOnline, apiOnlineRef,
    setXp, setMoedas, definirRank, setSrsData, setDecks, setFasesDesbloqueadas, setBonusDesbloqueados,
    setCertificadoLiberado, definirApiOnline, faseLiberada, liberarFase,
  };
}
