import React from 'react';
import { useAuth } from '../context/AuthContext';

export function LevelBar() {
  const { user } = useAuth();
  const currentLvl = user.nivel || 1;
  const currentXp = user.xp || 0;
  const nextLvlXp = currentLvl * 250;
  const progressPercent = Math.min(100, Math.round((currentXp / nextLvlXp) * 100));

  const rankNames = ['Ingressante', 'Desenvolvedor Júnior', 'Pleno', 'Sênior', 'Tech Lead', 'Arquiteto de Sistemas'];
  const rank = rankNames[Math.min(currentLvl - 1, rankNames.length - 1)];

  return (
    <div className="glass-panel" style={{
      margin: '16px 24px 0 24px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ minWidth: '160px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Nível {currentLvl}</span>
          <span className="tech-font" style={{ fontSize: '11px', color: 'var(--nexti-cyan)' }}>({rank})</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--nexti-text-muted)' }}>
          {currentXp} / {nextLvlXp} XP para subir
        </span>
      </div>

      <div style={{
        flex: 1,
        height: '10px',
        background: 'rgba(255, 255, 255, 0.06)',
        borderRadius: '5px',
        overflow: 'hidden',
        border: '1px solid var(--nexti-border)',
        position: 'relative'
      }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--nexti-cyan), var(--nexti-green))',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
          transition: 'width 0.4s ease'
        }} />
      </div>

      <span className="tech-font" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nexti-green)' }}>
        {progressPercent}%
      </span>
    </div>
  );
}
