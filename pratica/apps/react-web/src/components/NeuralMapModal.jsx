import React, { useEffect, useRef, useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function NeuralMapModal({ isOpen, onClose }) {
  const { setActiveFase, addToast } = useStudy();
  const canvasRef = useRef(null);

  const NODES = [
    { id: 'mod1-aula1', label: 'Lógica Booleana', x: 200, y: 150, color: '#00f0ff', group: 1 },
    { id: 'mod1-aula2', label: 'Algoritmos & Big-O', x: 380, y: 120, color: '#00f0ff', group: 1 },
    { id: 'mod1-aula3', label: 'Von Neumann / Assembly', x: 560, y: 150, color: '#00f0ff', group: 1 },
    
    { id: 'mod2-aula1', label: 'SOLID & Clean Arch', x: 260, y: 280, color: '#00ff88', group: 2 },
    { id: 'mod2-aula2', label: 'Design Patterns GoF', x: 480, y: 280, color: '#00ff88', group: 2 },
    
    { id: 'mod3-aula1', label: 'Modelagem Relacional', x: 180, y: 420, color: '#ffd700', group: 3 },
    { id: 'mod3-aula2', label: 'ACID & B-Tree', x: 380, y: 410, color: '#ffd700', group: 3 },
    
    { id: 'mod4-aula1', label: 'TCP/IP & Redes', x: 580, y: 400, color: '#8a2be2', group: 4 },
    { id: 'mod4-aula2', label: 'Criptografia & TLS', x: 740, y: 380, color: '#8a2be2', group: 4 },
    
    { id: 'mod5-aula1', label: 'Redes Neurais & IA', x: 420, y: 530, color: '#ff5555', group: 5 }
  ];

  const EDGES = [
    ['mod1-aula1', 'mod1-aula2'],
    ['mod1-aula2', 'mod1-aula3'],
    ['mod1-aula2', 'mod2-aula1'],
    ['mod2-aula1', 'mod2-aula2'],
    ['mod2-aula1', 'mod3-aula1'],
    ['mod3-aula1', 'mod3-aula2'],
    ['mod1-aula3', 'mod4-aula1'],
    ['mod4-aula1', 'mod4-aula2'],
    ['mod3-aula2', 'mod5-aula1'],
    ['mod2-aula2', 'mod5-aula1']
  ];

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrame;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.03;

      // Desenha as Arestas (Conexões Sinápticas)
      EDGES.forEach(([fromId, toId]) => {
        const fromNode = NODES.find((n) => n.id === fromId);
        const toNode = NODES.find((n) => n.id === toId);
        if (!fromNode || !toNode) return;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pulso Sináptico viajando pela linha
        const progress = (Math.sin(time + fromNode.x) + 1) / 2;
        const px = fromNode.x + (toNode.x - fromNode.x) * progress;
        const py = fromNode.y + (toNode.y - fromNode.y) * progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Desenha os Nós Neurais
      NODES.forEach((node) => {
        const pulse = Math.sin(time * 2 + node.group) * 2;
        
        // Halo de brilho
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}22`;
        ctx.fill();

        // Corpo do Nó
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label do Nó
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 24);
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      NODES.forEach((node) => {
        const dist = Math.hypot(clickX - node.x, clickY - node.y);
        if (dist <= 20) {
          setActiveFase(node.id);
          addToast('info', 'Disciplina Selecionada', `Navegando para ${node.label}`);
          onClose();
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
        width: '900px',
        maxWidth: '95vw',
        height: '680px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        borderColor: 'var(--nexti-purple)',
        boxShadow: '0 0 40px rgba(138, 43, 226, 0.4)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 className="display-font" style={{ fontSize: '18px', color: '#fff', letterSpacing: '1px' }}>
              🧠 Grafo do Mapa Neural de Conhecimento
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--nexti-text-muted)' }}>
              Clique em qualquer nó da rede sináptica para carregar seus flashcards
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

        {/* Canvas do Grafo */}
        <div style={{
          flex: 1,
          background: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '8px',
          border: '1px solid var(--nexti-border)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <canvas ref={canvasRef} width={860} height={560} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
