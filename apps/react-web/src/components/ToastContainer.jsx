import React from 'react';
import { useStudy } from '../context/StudyContext';
import { CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = useStudy();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 99999
    }}>
      {toasts.map((t) => {
        let borderColor = 'var(--nexti-cyan)';
        let Icon = Info;
        let iconColor = 'var(--nexti-cyan)';

        if (t.tipo === 'success') {
          borderColor = 'var(--nexti-green)';
          Icon = CheckCircle2;
          iconColor = 'var(--nexti-green)';
        } else if (t.tipo === 'warning') {
          borderColor = 'var(--nexti-gold)';
          Icon = AlertTriangle;
          iconColor = 'var(--nexti-gold)';
        } else if (t.tipo === 'error') {
          borderColor = 'var(--nexti-red)';
          Icon = AlertCircle;
          iconColor = 'var(--nexti-red)';
        }

        return (
          <div
            key={t.id}
            className="glass-panel"
            style={{
              minWidth: '280px',
              maxWidth: '360px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              borderLeft: `4px solid ${borderColor}`,
              boxShadow: `0 8px 24px rgba(0, 0, 0, 0.6)`
            }}
          >
            <Icon size={18} color={iconColor} style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{t.titulo}</div>
              <div style={{ fontSize: '11px', color: 'var(--nexti-text-sec)', marginTop: '2px', lineHeight: '15px' }}>
                {t.mensagem}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
