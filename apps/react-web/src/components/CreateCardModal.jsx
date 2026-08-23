import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { X, PlusCircle } from 'lucide-react';

export function CreateCardModal({ isOpen, onClose }) {
  const { createCustomCard, activeFase, addToast } = useStudy();

  const [frente, setFrente] = useState('');
  const [verso, setVerso] = useState('');
  const [dica, setDica] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!frente.trim() || !verso.trim()) {
      addToast('warning', 'Campos Obrigatórios', 'Preencha a pergunta e a resposta do card.');
      return;
    }
    createCustomCard(frente.trim(), verso.trim(), dica.trim());
    setFrente('');
    setVerso('');
    setDica('');
    onClose();
  };

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
        width: '540px',
        maxWidth: '95vw',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderColor: 'var(--nexti-cyan)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="display-font" style={{ fontSize: '16px', color: '#fff' }}>
              ➕ Criar Novo Flashcard
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--nexti-text-muted)' }}>
              Fase: {activeFase}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--nexti-text-sec)', display: 'block', marginBottom: '4px' }}>
              Pergunta / Desafio da Frente:
            </label>
            <textarea
              value={frente}
              onChange={(e) => setFrente(e.target.value)}
              placeholder="Ex: O que é o algoritmo de Dijkstra e qual sua aplicação?"
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--nexti-border)',
                borderRadius: '6px',
                padding: '8px 10px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--nexti-text-sec)', display: 'block', marginBottom: '4px' }}>
              Resposta do Verso:
            </label>
            <textarea
              value={verso}
              onChange={(e) => setVerso(e.target.value)}
              placeholder="Ex: Algoritmo guloso para encontrar o caminho mais curto entre nós em um grafo com pesos não negativos."
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--nexti-border)',
                borderRadius: '6px',
                padding: '8px 10px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--nexti-text-sec)', display: 'block', marginBottom: '4px' }}>
              Dica (Opcional):
            </label>
            <input
              type="text"
              value={dica}
              onChange={(e) => setDica(e.target.value)}
              placeholder="Ex: Utiliza fila de prioridade (Min-Heap)."
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--nexti-border)',
                borderRadius: '6px',
                padding: '8px 10px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid var(--nexti-border)',
                color: 'var(--nexti-text-muted)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                background: 'var(--nexti-cyan)',
                border: 'none',
                color: '#000',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Salvar Flashcard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
