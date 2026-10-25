import React from 'react';
import { progressoDeNivel } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { nivelParaApi } from '../../context/estudo/apoio.js';

/** Seção `.dashboard-header`: usuário, XP, moedas e barra de rank (porte de `atualizarBarraNivel`). */
export function PainelUsuario() {
  const { nomeUsuario, xp, moedas, rank } = useEstudo();
  const nivel = progressoDeNivel(xp, nivelParaApi(rank, xp));

  return (
    <section className="dashboard-header" aria-labelledby="header-user-name">
      <div className="dashboard-header-main">
        <div className="welcome-text">
          <h1>
            Olá, <span className="tech-text" id="header-user-name">{nomeUsuario}</span>
          </h1>
          <p>
            Servidor: <span className="status-online">conectado</span>
          </p>
        </div>
        <div className="xp-wrapper xp-wrapper-flex">
          <div className="xp-badge-col">
            <span className="xp-badge tech-font flex-align xp-display-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>military_tech</span> {xp} XP
            </span>
            <span className="badge-title-sub">XP</span>
          </div>
          <div className="xp-badge-col">
            <span className="xp-badge tech-font flex-align coin-display-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }} aria-hidden="true">toll</span> {moedas}
            </span>
            <span className="badge-title-sub">Moedas</span>
          </div>
        </div>
      </div>
      <div className="xp-level-progress-container">
        <div className="xp-level-progress-labels">
          <span className="tech-font">{nivel.rotuloRank}</span>
          <span className="tech-font text-cyan">{nivel.rotuloProgresso}</span>
          <span className="tech-font">{nivel.rotuloProximo}</span>
        </div>
        <div
          className="xp-level-progress-bar-bg"
          role="progressbar"
          aria-label="Progresso até o próximo rank"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(nivel.percentual)}
          aria-valuetext={nivel.rotuloProgresso}
        >
          <div className="xp-level-progress-bar-fill" style={{ width: `${nivel.percentual}%` }} />
        </div>
      </div>
    </section>
  );
}
