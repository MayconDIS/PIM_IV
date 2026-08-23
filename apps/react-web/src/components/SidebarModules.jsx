import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Search, ChevronRight, BookOpen, Layers } from 'lucide-react';

export function SidebarModules() {
  const { MODULOS, activeFase, setActiveFase } = useStudy();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModulos = MODULOS.map((mod) => {
    const matchingAulas = mod.aulas.filter(
      (a) => a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || mod.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      ...mod,
      aulas: matchingAulas
    };
  }).filter((mod) => mod.aulas.length > 0);

  return (
    <aside className="glass-panel" style={{
      width: '320px',
      minWidth: '300px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      height: 'calc(100vh - 180px)',
      overflowY: 'auto'
    }}>
      {/* Busca de Disciplinas */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--nexti-border)',
        borderRadius: '8px',
        padding: '6px 12px',
        gap: '8px'
      }}>
        <Search size={16} color="var(--nexti-text-muted)" />
        <input
          type="text"
          placeholder="Buscar disciplinas ( / )..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '12px',
            width: '100%'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredModulos.map((modulo) => (
          <div key={modulo.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 8px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <span style={{ fontSize: '16px' }}>{modulo.icone}</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: modulo.cor,
                letterSpacing: '0.5px'
              }}>
                {modulo.nome}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '12px' }}>
              {modulo.aulas.map((aula) => {
                const isActive = activeFase === aula.id;
                return (
                  <button
                    key={aula.id}
                    onClick={() => setActiveFase(aula.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                      border: isActive ? '1px solid var(--nexti-cyan)' : '1px solid transparent',
                      color: isActive ? 'var(--nexti-cyan)' : 'var(--nexti-text-sec)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '11px',
                      lineHeight: '15px',
                      fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{aula.titulo}</span>
                    <span className="tech-font" style={{
                      fontSize: '9px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: 'var(--nexti-text-muted)'
                    }}>
                      {aula.totalCards} cards
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
