import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Volume2, VolumeX, Award, Shield, User } from 'lucide-react';

export function Header({ onOpenMap, onOpenProgress, onOpenCreate }) {
  const { user, soundEnabled, toggleSound } = useAuth();

  return (
    <header className="glass-panel" style={{
      margin: '16px 24px 0 24px',
      padding: '14px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: 'var(--nexti-border)'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 className="display-font" style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '1px'
          }}>
            Nex_<span style={{ color: 'var(--nexti-cyan)', textShadow: '0 0 10px rgba(0,240,255,0.6)' }}>TI</span>
          </h1>
          <span className="tech-font" style={{
            fontSize: '10px',
            color: 'var(--nexti-text-muted)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            EdTech Learning Platform
          </span>
        </div>
      </div>

      {/* Gamification Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* XP Badge */}
        <div style={{
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid var(--nexti-cyan)',
          padding: '6px 14px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span className="tech-font" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--nexti-cyan)' }}>
            {user.xp} XP
          </span>
        </div>

        {/* Dev Coins Badge */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.08)',
          border: '1px solid var(--nexti-gold)',
          padding: '6px 14px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '14px' }}>🪙</span>
          <span className="tech-font" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--nexti-gold)' }}>
            {user.moedas} Dev Coins
          </span>
        </div>

        {/* Action Buttons */}
        <button
          onClick={onOpenMap}
          style={{
            background: 'rgba(138, 43, 226, 0.15)',
            border: '1px solid var(--nexti-purple)',
            color: '#c084fc',
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          title="Abrir Grafo do Mapa Neural"
        >
          🧠 Mapa Neural
        </button>

        <button
          onClick={onOpenProgress}
          style={{
            background: 'rgba(0, 255, 136, 0.12)',
            border: '1px solid var(--nexti-green)',
            color: 'var(--nexti-green)',
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          📊 Progresso & SM-2
        </button>

        <button
          onClick={onOpenCreate}
          style={{
            background: 'var(--nexti-cyan)',
            border: 'none',
            color: '#000',
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          ➕ Criar Card
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--nexti-border)',
            color: soundEnabled ? 'var(--nexti-cyan)' : 'var(--nexti-text-muted)',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Sintetizador de Áudio'}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </header>
  );
}
