import React from 'react';
import { useStudy } from '../context/StudyContext';
import { Lightbulb, RotateCw, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export function FlashcardDeck() {
  const {
    activeCard,
    currentDeck,
    currentCardIndex,
    isFlipped,
    flipCard,
    submitSm2Answer,
    srsState,
    activeTab,
    setActiveTab
  } = useStudy();

  const cardSrs = srsState[activeCard.frente] || { rep: 0, interval: 0, ease: 2.5 };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Abas de Modo: Flashcards vs. Simulado ENADE */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('flashcards')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'flashcards' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(18, 22, 31, 0.6)',
            border: activeTab === 'flashcards' ? '1px solid var(--nexti-cyan)' : '1px solid var(--nexti-border)',
            color: activeTab === 'flashcards' ? 'var(--nexti-cyan)' : 'var(--nexti-text-muted)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📚 Flashcards SM-2 ({currentDeck.length})
        </button>

        <button
          onClick={() => setActiveTab('simulado')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'simulado' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(18, 22, 31, 0.6)',
            border: activeTab === 'simulado' ? '1px solid var(--nexti-gold)' : '1px solid var(--nexti-border)',
            color: activeTab === 'simulado' ? 'var(--nexti-gold)' : 'var(--nexti-text-muted)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📝 Simulado ENADE
        </button>
      </div>

      {/* Meta Info do Card */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 4px'
      }}>
        <span className="tech-font" style={{ fontSize: '12px', color: 'var(--nexti-cyan)', fontWeight: 600 }}>
          Card {currentDeck.length > 0 ? (currentCardIndex % currentDeck.length) + 1 : 0} de {currentDeck.length}
        </span>
        <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--nexti-text-muted)' }}>
          <span>Repetições: <strong>{cardSrs.rep}</strong></span>
          <span>Fator de Facilidade: <strong>{cardSrs.ease}x</strong></span>
          <span>Próximo Intervalo: <strong>{cardSrs.interval} dia(s)</strong></span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="flip-card-container" onClick={flipCard} style={{ cursor: 'pointer' }}>
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* FRENTE (PERGUNTA) */}
          <div className="flip-card-front glass-panel" style={{
            borderColor: 'var(--nexti-border)',
            background: 'linear-gradient(145deg, rgba(18, 22, 31, 0.95), rgba(12, 16, 24, 0.95))'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid var(--nexti-cyan)',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--nexti-cyan)'
              }}>
                ? PERGUNTA DE ESTUDO ATIVO
              </div>
              <p style={{
                fontSize: '18px',
                lineHeight: '28px',
                color: '#fff',
                fontWeight: 500,
                marginTop: '20px'
              }}>
                {activeCard.frente}
              </p>
            </div>

            <div>
              {activeCard.dica && (
                <div style={{
                  background: 'rgba(0, 240, 255, 0.04)',
                  borderLeft: '3px solid var(--nexti-cyan)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Lightbulb size={16} color="var(--nexti-cyan)" />
                  <span style={{ fontSize: '12px', color: 'var(--nexti-text-sec)', fontStyle: 'italic' }}>
                    Dica: {activeCard.dica}
                  </span>
                </div>
              )}
              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: 'var(--nexti-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <RotateCw size={13} /> Clique no card ou aperte Espaço para revelar a resposta
              </div>
            </div>
          </div>

          {/* VERSO (RESPOSTA) */}
          <div className="flip-card-back glass-panel" style={{
            borderColor: 'var(--nexti-green)',
            background: 'linear-gradient(145deg, rgba(14, 26, 24, 0.95), rgba(10, 18, 16, 0.95))'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid var(--nexti-green)',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--nexti-green)'
              }}>
                ✓ RESPOSTA CANÔNICA
              </div>
              <p style={{
                fontSize: '16px',
                lineHeight: '26px',
                color: '#fff',
                fontWeight: 400,
                marginTop: '18px'
              }}>
                {activeCard.verso}
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              fontSize: '11px',
              color: 'var(--nexti-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              Avalie abaixo sua lembrança com o Algoritmo SM-2
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Resposta SM-2 Anki */}
      {isFlipped ? (
        <div className="glass-panel" style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--nexti-text-muted)', fontWeight: 600 }}>
            COMO FOI O SEU GRAU DE RETENÇÃO (SUPERMEMO SM-2)?
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%' }}>
            {/* De novo (1) */}
            <button
              onClick={() => submitSm2Answer(1)}
              style={{
                background: 'rgba(255, 85, 85, 0.1)',
                border: '1px solid #ff5555',
                color: '#ff5555',
                borderRadius: '8px',
                padding: '12px 6px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>De novo</div>
              <div className="tech-font" style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>1 dia</div>
            </button>

            {/* Difícil (3) */}
            <button
              onClick={() => submitSm2Answer(3)}
              style={{
                background: 'rgba(255, 170, 0, 0.1)',
                border: '1px solid #ffaa00',
                color: '#ffaa00',
                borderRadius: '8px',
                padding: '12px 6px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Difícil</div>
              <div className="tech-font" style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>2 dias</div>
            </button>

            {/* Bom (4) */}
            <button
              onClick={() => submitSm2Answer(4)}
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid #00ff88',
                color: '#00ff88',
                borderRadius: '8px',
                padding: '12px 6px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Bom</div>
              <div className="tech-font" style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>6 dias</div>
            </button>

            {/* Fácil (5) */}
            <button
              onClick={() => submitSm2Answer(5)}
              style={{
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                borderRadius: '8px',
                padding: '12px 6px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Fácil</div>
              <div className="tech-font" style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>15 dias</div>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={flipCard}
          style={{
            background: 'var(--nexti-cyan)',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontWeight: 800,
            fontSize: '14px',
            padding: '14px',
            cursor: 'pointer',
            letterSpacing: '1px',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
            transition: 'all 0.2s'
          }}
        >
          MOSTRAR RESPOSTA (ESPAÇO)
        </button>
      )}
    </div>
  );
}
