import React from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { X, Download, FileSpreadsheet, HardDriveDownload, Brain, TrendingUp } from 'lucide-react';

export function ProgressModal({ isOpen, onClose }) {
  const { srsState, exportBackup, exportExcelCSV } = useStudy();
  const { user } = useAuth();

  if (!isOpen) return null;

  const totalReviews = Object.keys(srsState).length;
  const matureCards = Object.values(srsState).filter((s) => s.rep >= 3).length;
  const learningCards = Object.values(srsState).filter((s) => s.rep < 3).length;

  const easeValues = Object.values(srsState).map((s) => s.ease || 2.5);
  const avgEase = easeValues.length > 0 
    ? (easeValues.reduce((a, b) => a + b, 0) / easeValues.length).toFixed(2)
    : '2.50';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 7, 10, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div className="glass-panel" style={{
        width: '680px',
        maxWidth: '95vw',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderColor: 'var(--nexti-green)',
        boxShadow: '0 0 35px rgba(0, 255, 136, 0.3)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="display-font" style={{ fontSize: '18px', color: '#fff' }}>
              📊 Analytics & Retenção SM-2
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--nexti-text-muted)' }}>
              Curva de Esquecimento de Ebbinghaus e Desempenho
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--nexti-border)',
              borderRadius: '6px',
              color: '#fff',
              padding: '6px',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Métricas Principais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid var(--nexti-cyan)',
            padding: '14px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '11px', color: 'var(--nexti-text-muted)' }}>Cards em Memória Longa</span>
            <div className="tech-font" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--nexti-cyan)', marginTop: '4px' }}>
              {matureCards}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--nexti-text-muted)' }}>Repetições ≥ 3</span>
          </div>

          <div style={{
            background: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid var(--nexti-green)',
            padding: '14px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '11px', color: 'var(--nexti-text-muted)' }}>Cards em Aprendizado</span>
            <div className="tech-font" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--nexti-green)', marginTop: '4px' }}>
              {learningCards}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--nexti-text-muted)' }}>Intervalo curto</span>
          </div>

          <div style={{
            background: 'rgba(255, 215, 0, 0.05)',
            border: '1px solid var(--nexti-gold)',
            padding: '14px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '11px', color: 'var(--nexti-text-muted)' }}>Fator Médio (Ease)</span>
            <div className="tech-font" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--nexti-gold)', marginTop: '4px' }}>
              {avgEase}x
            </div>
            <span style={{ fontSize: '10px', color: 'var(--nexti-text-muted)' }}>Padrão inicial: 2.5x</span>
          </div>
        </div>

        {/* Central de Backup & Exportação */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--nexti-border)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HardDriveDownload size={16} color="var(--nexti-cyan)" /> Central de Backup & Exportação
          </span>
          <p style={{ fontSize: '11px', color: 'var(--nexti-text-muted)', lineHeight: '16px' }}>
            Exporte seus dados para garantir portabilidade completa em conformidade com as boas práticas do PIM IV.
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={exportBackup}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid var(--nexti-cyan)',
                color: 'var(--nexti-cyan)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Download size={15} /> Exportar JSON
            </button>

            <button
              onClick={exportExcelCSV}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid var(--nexti-green)',
                color: 'var(--nexti-green)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FileSpreadsheet size={15} /> Exportar Excel / CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
