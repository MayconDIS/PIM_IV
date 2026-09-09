import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { LevelBar } from '../components/LevelBar';
import { SidebarModules } from '../components/SidebarModules';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { EnadeQuiz } from '../components/EnadeQuiz';
import { NeuralMapModal } from '../components/NeuralMapModal';
import { ProgressModal } from '../components/ProgressModal';
import { CreateCardModal } from '../components/CreateCardModal';
import { ToastContainer } from '../components/ToastContainer';
import { useStudy } from '../context/StudyContext';

export function DashboardPage({ onNavigateLogin }) {
  const { activeTab, flipCard, submitSm2Answer, isFlipped } = useStudy();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Atalhos de Teclado Globais (Espaço para virar, 1-4 para responder, Esc para fechar modais)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        setIsMapOpen(false);
        setIsProgressOpen(false);
        setIsCreateOpen(false);
      } else if (e.code === 'Space') {
        e.preventDefault();
        flipCard();
      } else if (isFlipped) {
        if (e.key === '1') submitSm2Answer(1);
        if (e.key === '2') submitSm2Answer(3);
        if (e.key === '3') submitSm2Answer(4);
        if (e.key === '4') submitSm2Answer(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
      <Header
        onOpenMap={() => setIsMapOpen(true)}
        onOpenProgress={() => setIsProgressOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      <LevelBar />

      <main style={{
        flex: 1,
        display: 'flex',
        gap: '20px',
        margin: '16px 24px 0 24px'
      }}>
        <SidebarModules />

        <section style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'flashcards' ? <FlashcardDeck /> : <EnadeQuiz />}
        </section>
      </main>

      {/* Modais */}
      <NeuralMapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
      <ProgressModal isOpen={isProgressOpen} onClose={() => setIsProgressOpen(false)} />
      <CreateCardModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <ToastContainer />
    </div>
  );
}
