import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { AudioService } from '../services/audio';
import { ConfettiService } from '../services/confetti';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

export function EnadeQuiz() {
  const { currentModulo, addToast } = useStudy();
  const { addXp, addCoins } = useAuth();

  const [selectedAlt, setSelectedAlt] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const simulado = currentModulo.simulado;

  if (!simulado) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--nexti-text-muted)' }}>Nenhum simulado cadastrado para este módulo.</p>
      </div>
    );
  }

  const handleSelect = (altId) => {
    if (submitted) return;
    AudioService.playClick();
    setSelectedAlt(altId);
  };

  const handleSubmit = () => {
    if (!selectedAlt) {
      addToast('warning', 'Atenção', 'Selecione uma alternativa antes de confirmar!');
      return;
    }
    setSubmitted(true);
    const isCorrect = simulado.alternativas.find((a) => a.id === selectedAlt)?.correta;

    if (isCorrect) {
      AudioService.playCorrect();
      ConfettiService.celebrate(2000);
      addXp(30);
      addCoins(10);
      addToast('success', 'Resposta Correta!', 'Excelente domínio acadêmico! (+30 XP e +10 Coins)');
    } else {
      AudioService.playError();
      addToast('error', 'Resposta Incorreta', 'Revise o conceito no feedback abaixo.');
    }
  };

  const handleReset = () => {
    setSelectedAlt(null);
    setSubmitted(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid var(--nexti-gold)',
          borderRadius: '4px',
          padding: '4px 10px',
          color: 'var(--nexti-gold)',
          fontSize: '11px',
          fontWeight: 700
        }}>
          <Award size={14} /> QUESTÃO ENADE / POSCOMP
        </div>
        <span style={{ fontSize: '12px', color: 'var(--nexti-text-muted)' }}>
          {currentModulo.nome}
        </span>
      </div>

      <p style={{ fontSize: '15px', lineHeight: '24px', color: '#fff', fontWeight: 500 }}>
        {simulado.pergunta}
      </p>

      {/* Alternativas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {simulado.alternativas.map((alt) => {
          const isSelected = selectedAlt === alt.id;
          let borderColor = 'var(--nexti-border)';
          let bgColor = 'rgba(255, 255, 255, 0.02)';

          if (submitted) {
            if (alt.correta) {
              borderColor = 'var(--nexti-green)';
              bgColor = 'rgba(0, 255, 136, 0.15)';
            } else if (isSelected && !alt.correta) {
              borderColor = 'var(--nexti-red)';
              bgColor = 'rgba(255, 85, 85, 0.15)';
            }
          } else if (isSelected) {
            borderColor = 'var(--nexti-cyan)';
            bgColor = 'rgba(0, 240, 255, 0.1)';
          }

          return (
            <button
              key={alt.id}
              onClick={() => handleSelect(alt.id)}
              disabled={submitted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                background: bgColor,
                color: '#fff',
                cursor: submitted ? 'default' : 'pointer',
                textAlign: 'left',
                fontSize: '13px',
                lineHeight: '18px',
                transition: 'all 0.15s'
              }}
            >
              <span style={{
                fontWeight: 700,
                color: alt.correta && submitted ? 'var(--nexti-green)' : 'var(--nexti-cyan)',
                width: '20px'
              }}>
                {alt.id})
              </span>
              <span style={{ flex: 1 }}>{alt.texto}</span>
              {submitted && alt.correta && <CheckCircle2 size={18} color="var(--nexti-green)" />}
              {submitted && isSelected && !alt.correta && <XCircle size={18} color="var(--nexti-red)" />}
            </button>
          );
        })}
      </div>

      {/* Explicação da Questão */}
      {submitted && (
        <div style={{
          background: 'rgba(0, 240, 255, 0.05)',
          borderLeft: '3px solid var(--nexti-cyan)',
          padding: '12px 16px',
          borderRadius: '4px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--nexti-cyan)', textTransform: 'uppercase' }}>
            Fundamentação Técnica:
          </span>
          <p style={{ fontSize: '12px', color: 'var(--nexti-text-sec)', marginTop: '4px', lineHeight: '18px' }}>
            {simulado.explicacao}
          </p>
        </div>
      )}

      {/* Ações */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        {submitted ? (
          <button
            onClick={handleReset}
            style={{
              padding: '10px 18px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--nexti-border)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Refazer Questão
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              background: 'var(--nexti-cyan)',
              border: 'none',
              color: '#000',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(0, 240, 255, 0.3)'
            }}
          >
            Confirmar Resposta
          </button>
        )}
      </div>
    </div>
  );
}
