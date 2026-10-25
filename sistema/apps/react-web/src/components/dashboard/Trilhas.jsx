import React, { useEffect, useRef, useState } from 'react';
import { MODULOS, ORDEM_FASES } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { PainelEstudo } from './PainelEstudo';

const normalizar = (texto) => texto.toLowerCase().trim();

function Moeda({ valor, estilo }) {
  return (
    <span className="xp-badge tech-font flex-align coin-badge" style={estilo}>
      <span className="material-symbols-outlined toll-icon-small" aria-hidden="true">toll</span> {valor}
    </span>
  );
}

/**
 * `<nav class="left-panel">`: módulos, fases, testes, bônus e certificado.
 * O painel de estudo é renderizado logo depois da fase ativa, como o vanilla
 * fazia com `elementoClicado.after(rightPanel)`; o CSS esconde o que vem depois.
 */
export function Trilhas({ refBusca }) {
  const {
    faseAtiva, fasesDesbloqueadas, bonusDesbloqueados, certificadoLiberado,
    carregarAula, abrirBonus, abrirCertificado,
  } = useEstudo();
  const [filtro, setFiltro] = useState('');
  const [painelAtivo, setPainelAtivo] = useState(false);
  const [foco, setFoco] = useState(false);
  const itensRef = useRef({});

  const idAtivo = faseAtiva?.id ?? null;

  // mesma coreografia do vanilla: aparece, entra em foco e rola até a fase
  useEffect(() => {
    setPainelAtivo(false);
    setFoco(false);
    if (!idAtivo) return undefined;

    const entrada = setTimeout(() => setPainelAtivo(true), 50);
    const focar = setTimeout(() => {
      setFoco(true);
      setTimeout(() => {
        const item = itensRef.current[idAtivo];
        if (!item) return;
        const alturaTopo = document.querySelector('header')?.offsetHeight ?? 80;
        const y = window.scrollY + item.getBoundingClientRect().top - alturaTopo - 6;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }, 700);
    return () => {
      clearTimeout(entrada);
      clearTimeout(focar);
    };
  }, [idAtivo]);

  const termo = normalizar(filtro);
  const visivel = (texto) => !termo || normalizar(texto).includes(termo);
  const moduloAtivo = MODULOS.find(
    (m) => m.fases.some((f) => f.id === idAtivo) || m.teste?.id === idAtivo || m.bonus?.id === idAtivo,
  )?.id;

  const item = ({ id, titulo, classeTitulo = 'aula-title', icone, bloqueado, onClick, badges, textoBusca }) => {
    if (!visivel(textoBusca ?? titulo)) return null;
    const ativo = id === idAtivo;
    return (
      <li key={id}>
        {/* Um <button> de verdade: foco pelo Tab, Enter e Espaço sem código extra. */}
        <button
          type="button"
          ref={(el) => { itensRef.current[id] = el; }}
          className={`aula-item${bloqueado ? ' aula-locked-item' : ''}${ativo ? ' active-lesson' : ''}`}
          id={`menu-${id}`}
          aria-label={`${titulo}${bloqueado ? ' (trancada)' : ''}`}
          aria-expanded={ativo}
          onClick={onClick}
        >
          <span className="icon-status material-symbols-outlined" aria-hidden="true">{icone}</span>
          <span className={classeTitulo}>{titulo}</span>
          {badges}
        </button>
        {ativo && <PainelEstudo ativo={painelAtivo} />}
      </li>
    );
  };

  const iconeDaFase = (id) => {
    if (!fasesDesbloqueadas.includes(id)) return 'lock';
    return id === ORDEM_FASES[0] ? 'check_circle' : 'play_circle';
  };

  return (
    <nav className={`left-panel${idAtivo ? ' fade-out-others' : ''}${foco ? ' focus-mode' : ''}`} aria-label="Trilhas de Aprendizagem">
      <form className="search-panel-container" role="search" onSubmit={(e) => e.preventDefault()}>
        <span className="material-symbols-outlined search-icon" aria-hidden="true">search</span>
        <input
          ref={refBusca}
          type="text"
          id="filtro-aulas"
          aria-label="Buscar disciplina (atalho: /)"
          placeholder="Buscar disciplina..."
          autoComplete="off"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </form>

      {MODULOS.map((modulo) => (
        <section key={modulo.id} className="trilha-modulo" aria-labelledby={`titulo-${modulo.id}`}>
          <h2 id={`titulo-${modulo.id}`} className={`dia-header mod-0${modulo.numero}${moduloAtivo === modulo.id ? ' active-header' : ''}`}>
            <span className="tech-font">[ {modulo.codigo} ]</span> {modulo.titulo}
            <span className="dia-line" aria-hidden="true" />
          </h2>
          <ul className="trilha-lista">

          {modulo.fases.map((fase) =>
            item({
              id: fase.id,
              titulo: fase.titulo,
              icone: iconeDaFase(fase.id),
              bloqueado: !fasesDesbloqueadas.includes(fase.id),
              onClick: () => carregarAula(fase.id, fase.nome),
              badges: (
                <span className="menu-badges-wrapper">
                  <span className={`xp-badge tech-font${modulo.numero === 5 ? ' enade-xp-badge' : ''}`}>{fase.xp} XP</span>
                  <Moeda valor={fase.moedas} />
                </span>
              ),
            }),
          )}

          {modulo.teste &&
            item({
              id: modulo.teste.id,
              titulo: modulo.teste.titulo,
              classeTitulo: 'aula-title aula-title-cyan',
              icone: iconeDaFase(modulo.teste.id),
              bloqueado: !fasesDesbloqueadas.includes(modulo.teste.id),
              onClick: () => carregarAula(modulo.teste.id, modulo.teste.nome),
              badges: (
                <span className="menu-badges-wrapper">
                  <span className="xp-badge tech-font teste-xp-badge">{modulo.teste.xp} XP</span>
                </span>
              ),
            })}

          {modulo.bonus && (() => {
            const comprado = bonusDesbloqueados.includes(modulo.bonus.id);
            return item({
              id: modulo.bonus.id,
              titulo: modulo.bonus.titulo,
              classeTitulo: 'aula-title aula-title-gold',
              icone: comprado ? 'check_circle' : 'lock',
              onClick: () => abrirBonus(modulo.bonus),
              badges: (
                <span className="margin-left-auto">
                  {comprado ? (
                    <Moeda
                      valor="Liberado"
                      estilo={{ borderColor: 'var(--nexti-green)', background: 'rgba(0, 255, 136, 0.05)', color: 'var(--nexti-green)' }}
                    />
                  ) : (
                    <Moeda valor={modulo.bonus.custoMoedas} />
                  )}
                </span>
              ),
            });
          })()}
          </ul>
        </section>
      ))}

      <ul className="trilha-lista">
      {item({
        id: 'certificado',
        titulo: '📜 [ CERTIFICADO ] Conclusão de Curso',
        classeTitulo: 'aula-title aula-title-gold',
        icone: certificadoLiberado ? 'verified' : 'lock',
        bloqueado: !certificadoLiberado,
        onClick: abrirCertificado,
      })}
      </ul>
    </nav>
  );
}
