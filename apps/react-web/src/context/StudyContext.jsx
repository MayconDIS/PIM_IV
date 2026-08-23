import React, { createContext, useContext, useState, useEffect } from 'react';
import { MODULOS, FLASHCARDS_DECK } from '../services/data';
import { calculateSM2 } from '../services/sm2';
import { AudioService } from '../services/audio';
import { ConfettiService } from '../services/confetti';
import { useAuth } from './AuthContext';

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  const { addXp, addCoins } = useAuth();

  const [activeFase, setActiveFase] = useState('mod1-aula1');
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'simulado'
  const [customCards, setCustomCards] = useState(() => {
    const saved = localStorage.getItem('nexti_custom_cards');
    return saved ? JSON.parse(saved) : [];
  });

  const [srsState, setSrsState] = useState(() => {
    const saved = localStorage.getItem('nexti_srs_state');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('nexti_custom_cards', JSON.stringify(customCards));
  }, [customCards]);

  useEffect(() => {
    localStorage.setItem('nexti_srs_state', JSON.stringify(srsState));
  }, [srsState]);

  // Combina baralho padrão com customizados
  const allCards = [...FLASHCARDS_DECK, ...customCards];

  // Filtra pelo módulo/fase ativa
  const currentDeck = allCards.filter((card) => card.fase === activeFase);
  const activeCard = currentDeck.length > 0 
    ? currentDeck[currentCardIndex % currentDeck.length] 
    : { frente: 'Nenhum flashcard disponível nesta fase.', verso: 'Crie seu primeiro flashcard para começar.', dica: '' };

  const currentModulo = MODULOS.find((m) => m.aulas.some((a) => a.id === activeFase)) || MODULOS[0];

  const addToast = (tipo, titulo, mensagem) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tipo, titulo, mensagem }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const flipCard = () => {
    AudioService.playFlip();
    setIsFlipped(!isFlipped);
  };

  const submitSm2Answer = (quality) => {
    if (!activeCard || !activeCard.frente) return;

    const prevCardState = srsState[activeCard.frente] || {};
    const nextCardState = calculateSM2(prevCardState, quality);

    setSrsState((prev) => ({
      ...prev,
      [activeCard.frente]: nextCardState
    }));

    if (quality >= 3) {
      AudioService.playCorrect();
      addXp(15);
      addCoins(5);
      addToast('success', 'SM-2 Atualizado', `Intervalo estendido para ${nextCardState.interval} dia(s)! (+15 XP)`);
    } else {
      AudioService.playError();
      addXp(5);
      addToast('warning', 'Revisão Necessária', 'Intervalo resetado para 1 dia. Pratique mais!');
    }

    setIsFlipped(false);
    if (currentDeck.length > 0) {
      setCurrentCardIndex((prev) => (prev + 1) % currentDeck.length);
    }
  };

  const createCustomCard = (frente, verso, dica) => {
    const newCard = {
      id: Date.now(),
      fase: activeFase,
      frente,
      verso,
      dica: dica || 'Dica criada pelo estudante.'
    };
    setCustomCards((prev) => [...prev, newCard]);
    AudioService.playLevelUp();
    ConfettiService.celebrate(1500);
    addToast('success', 'Flashcard Criado', 'Novo card adicionado ao seu baralho!');
  };

  const exportBackup = () => {
    const backupData = {
      versao: '2.0.0',
      dataExportacao: new Date().toISOString(),
      srsState,
      customCards
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexTI_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('info', 'Backup Concluído', 'Arquivo JSON de progresso exportado!');
  };

  const exportExcelCSV = () => {
    let csv = '\uFEFFMódulo;Fase;Frente;Verso;Dica;Repetições;Intervalo (Dias);Facilidade\n';
    allCards.forEach((c) => {
      const s = srsState[c.frente] || { rep: 0, interval: 0, ease: 2.5 };
      const limpa = (txt) => `"${(txt || '').replace(/"/g, '""')}"`;
      csv += `${limpa(c.fase)};${limpa(c.fase)};${limpa(c.frente)};${limpa(c.verso)};${limpa(c.dica)};${s.rep};${s.interval};${s.ease}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexTI_Relatorio_Flashcards_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('info', 'Excel / CSV Gerado', 'Relatório tabular exportado com sucesso!');
  };

  return (
    <StudyContext.Provider value={{
      MODULOS,
      activeFase,
      setActiveFase,
      activeTab,
      setActiveTab,
      currentDeck,
      activeCard,
      currentCardIndex,
      currentModulo,
      isFlipped,
      flipCard,
      submitSm2Answer,
      createCustomCard,
      srsState,
      toasts,
      addToast,
      exportBackup,
      exportExcelCSV
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy deve ser usado dentro de um StudyProvider');
  }
  return context;
}
