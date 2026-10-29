import { useEffect, useRef, useState } from 'react';
import { BONUS, FASES_INICIAIS, fasesDisponiveis, temAcessoCompleto } from '@nexti/shared';
import { carregarDecks, gravaJson, leJson } from './apoio.js';

/**
 * O que fica salvo no navegador: XP, moedas, rank, SM-2 de cada carta, decks,
 * fases e bônus liberados, o certificado e a foto do avatar. Também guarda se a API está no ar.
 */
export function useProgresso(userKey) {
  const [perfil, setPerfil] = useState(() => localStorage.getItem('quest_user_perfil') || 'Aluno');
  const perfilRef = useRef(perfil);
  const definirPerfil = (novoPerfil) => {
    perfilRef.current = novoPerfil || 'Aluno';
    setPerfil(perfilRef.current);
    localStorage.setItem('quest_user_perfil', perfilRef.current);
  };
  const [xp, setXp] = useState(() => Number.parseInt(localStorage.getItem(`${userKey}xp`), 10) || 0);
  const [moedas, setMoedas] = useState(() => Number.parseInt(localStorage.getItem(`${userKey}coins`), 10) || 0);
  const [rank, setRank] = useState(() => localStorage.getItem(`${userKey}rank`) || 'Rank: Pendente');
  const [diagnostico, setDiagnostico] = useState(() => leJson(`${userKey}diagnostico`, null));
  const [srsData, setSrsData] = useState(() => leJson(`${userKey}srs`, {}));
  const [decks, setDecks] = useState(() => carregarDecks(`${userKey}decks`));
  const [fasesDesbloqueadas, setFasesDesbloqueadas] = useState(() =>
    leJson(`${userKey}desbloqueadas`, [...FASES_INICIAIS]),
  );
  const [bonusDesbloqueados, setBonusDesbloqueados] = useState(() => leJson(`${userKey}bonus_unlocked`, []));
  const [certificadoLiberado, setCertificadoLiberado] = useState(
    () => localStorage.getItem(`${userKey}certificado_unlocked`) === 'true',
  );
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`${userKey}avatar_custom`));
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

  /** Troca a foto do avatar (data URL). Grande demais para o localStorage, vale só nesta sessão. */
  const trocarAvatar = (foto) => {
    try {
      localStorage.setItem(`${userKey}avatar_custom`, foto);
    } catch {
      /* sem espaço no localStorage */
    }
    setAvatar(foto);
  };

  // O acesso de Admin e Tutor vale na sessão: não vira progresso salvo nem compra de bônus.
  const faseLiberada = (faseId) => fasesDisponiveis(fasesDesbloqueadas, perfilRef.current).includes(faseId)
    || bonusDesbloqueados.includes(faseId)
    || (temAcessoCompleto(perfilRef.current) && BONUS.some(bonus => bonus.id === faseId));

  const liberarFase = (id) => setFasesDesbloqueadas((atual) => (atual.includes(id) ? atual : [...atual, id]));

  return {
    perfil, definirPerfil, acessoCompleto: temAcessoCompleto(perfil),
    xp, moedas, rank, diagnostico, setDiagnostico, srsData, decks, fasesDesbloqueadas, bonusDesbloqueados, certificadoLiberado, avatar, apiOnline, apiOnlineRef,
    setXp, setMoedas, definirRank, setSrsData, setDecks, setFasesDesbloqueadas, setBonusDesbloqueados,
    setCertificadoLiberado, trocarAvatar, definirApiOnline, faseLiberada, liberarFase,
  };
}
