import React, { useMemo } from 'react';
import { formatarDica, FASES, corteDoTeste, estadoDaCarta, isTeste, previsoes } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { ativarComTeclado } from '../../lib/acessibilidade';
import { ResumoDisciplina } from './ResumoDisciplina';

const BOTOES_ANKI = [
  { resultado: 'again', rotulo: 'De novo', cor: '#ff5555' },
  { resultado: 'hard', rotulo: 'Difícil', cor: '#ffaa00' },
  { resultado: 'good', rotulo: 'Bom', cor: '#00ff88' },
  { resultado: 'easy', rotulo: 'Fácil', cor: '#00e6e6' },
];

/** Estrelinhas que sobem do botão da alternativa certa (porte de `soltarEstrelas`). */
function Estrelas() {
  const estrelas = useMemo(
    () => Array.from({ length: 8 }, () => ({ left: `${Math.random() * 80 + 10}%`, animationDelay: `${Math.random() * 0.3}s` })),
    [],
  );
  return estrelas.map((estilo, i) => (
    <div key={i} className="star-anim" style={estilo}>⭐</div>
  ));
}

function BotoesAnki({ previsto, responder }) {
  return (
    <div className="anki-container">
      {BOTOES_ANKI.map(({ resultado, rotulo, cor }) => (
        <button key={resultado} className="anki-btn" onClick={() => responder(resultado)}>
          <span className="anki-time">{previsto[resultado]}</span>
          <span className="anki-label" style={{ color: cor }}>{rotulo}</span>
        </button>
      ))}
    </div>
  );
}

/** Mensagem final do deck ou do teste (porte de `finalizarDeck` / `finalizarTesteModulo`). */
function textoDoFim(fim, faseId) {
  if (fim.tipo === 'fase') {
    return { titulo: 'Fase concluída! 🎉', texto: 'Você estudou todas as cartas desta fase.', dica: 'Clique abaixo para receber seu XP e suas moedas.', contador: 'Fase finalizada' };
  }
  const resumo = `Aproveitamento: ${fim.percentual}% (${fim.acertos}/${fim.total} acertos).`;
  const contador = `Resultado: ${fim.percentual}%`;
  if (!fim.passou) {
    return {
      titulo: 'Teste Reprovado ❌',
      texto: `${resumo}\n\nVocê precisa de pelo menos ${corteDoTeste(faseId)}% de acertos para passar.`,
      dica: 'Estude mais o módulo e tente novamente.',
      contador,
    };
  }
  if (faseId === 'teste-mod5') {
    return {
      titulo: 'Curso Concluído! 📜🎉',
      texto: `${resumo}\n\nVocê desbloqueou o Certificado de Conclusão Oficial!`,
      dica: 'Parabéns! Clique abaixo para receber seu XP e veja o certificado no menu lateral.',
      contador,
    };
  }
  return { titulo: 'Teste Aprovado! 🎉', texto: `${resumo}\n\nVocê passou no teste do módulo!`, dica: 'Clique abaixo para receber seu XP.', contador };
}

/** `<article id="right-panel">`: a carta 3D, as alternativas ENADE e os controles SM-2. */
export function PainelEstudo({ ativo }) {
  const {
    faseAtiva, deck, indice, cartaAtual, enade, virada, fim, respostaEnade, avisoRevisao, srsData,
    virarCarta, responder, responderEnade, concluirRotina,
  } = useEstudo();

  if (!faseAtiva) return null;
  const emTeste = isTeste(faseAtiva.id);
  const final = fim ? textoDoFim(fim, faseAtiva.id) : null;

  let controles = null;
  if (cartaAtual && !enade) {
    controles = virada ? (
      <BotoesAnki previsto={previsoes(estadoDaCarta(srsData, cartaAtual.frente))} responder={responder} />
    ) : (
      <button className="btn-mostrar tech-font" onClick={virarCarta}>MOSTRAR RESPOSTA</button>
    );
  } else if (cartaAtual && respostaEnade?.revelada) {
    if (emTeste) {
      controles = (
        <div className="anki-container">
          <button className="anki-btn" onClick={() => responder('proxima-teste')}>
            <span className="anki-label" style={{ color: respostaEnade.acertou ? '#00ff88' : '#ffaa00' }}>Continuar Teste</span>
          </button>
        </div>
      );
    } else if (respostaEnade.acertou) {
      controles = <BotoesAnki previsto={previsoes(estadoDaCarta(srsData, cartaAtual.frente))} responder={responder} />;
    } else {
      controles = (
        <div className="anki-container">
          <button className="anki-btn" style={{ borderColor: '#ff5555' }} onClick={() => responder('again')}>
            <span className="anki-time">&lt;1m</span>
            <span className="anki-label" style={{ color: '#ff5555' }}>Errou (Repetir Hoje)</span>
          </button>
        </div>
      );
    }
  }

  const classeOpcao = (i) => {
    if (!respostaEnade) return 'btn-opcao';
    if (i === respostaEnade.correta) return 'btn-opcao opcao-correta';
    if (i === respostaEnade.escolhida) return 'btn-opcao opcao-errada';
    return 'btn-opcao';
  };

  let frente;
  let verso;
  let dicaFrente;
  if (final) {
    frente = (
      <>
        <div>{final.titulo}</div>
        <div style={{ fontSize: '1rem', color: '#c5c6c7', marginTop: 15, whiteSpace: 'pre-line' }}>{final.texto}</div>
      </>
    );
    dicaFrente = final.dica;
  } else if (cartaAtual && enade) {
    frente = (
      <>
        <div style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 20, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{cartaAtual.frente}</div>
        <div className="opcoes-container">
          {cartaAtual.opcoes.map((opcao, i) => (
            <button
              key={i}
              className={classeOpcao(i)}
              disabled={Boolean(respostaEnade)}
              onClick={(e) => {
                e.stopPropagation();
                responderEnade(i);
              }}
            >
              {opcao}
              {respostaEnade?.acertou && i === respostaEnade.correta && <Estrelas />}
            </button>
          ))}
        </div>
      </>
    );
    verso = (
      <>
        <div style={{ fontSize: '0.95rem', color: '#8b92a5', marginBottom: 15, paddingBottom: 15, borderBottom: '1px dashed #30363d', width: '100%', textAlign: 'left', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
          <strong style={{ color: 'var(--nexti-cyan)' }}>Relembrando a Questão:</strong>
          <br />
          <br />
          {cartaAtual.frente}
        </div>
        <div style={{ fontSize: '1.1rem', textAlign: 'left', lineHeight: 1.6, color: '#fff', whiteSpace: 'pre-line' }}>{cartaAtual.verso}</div>
      </>
    );
    dicaFrente = 'Selecione a alternativa correta abaixo';
  } else if (cartaAtual) {
    frente = cartaAtual.frente;
    verso = (
      <>
        <div style={{ fontSize: '0.95rem', color: '#8b92a5', marginBottom: 20, paddingBottom: 15, borderBottom: '1px dashed #30363d', width: '100%', textAlign: 'center' }}>
          <strong style={{ color: 'var(--nexti-cyan)' }}>Pergunta Original:</strong>
          <br />
          <br />
          {cartaAtual.frente}
        </div>
        <div style={{ fontSize: '1.3rem', textAlign: 'center', color: '#fff', fontWeight: 500, whiteSpace: 'pre-line' }}>{cartaAtual.verso}</div>
      </>
    );
    dicaFrente = 'Aperte espaço para ver a resposta';
  }
  if (avisoRevisao && !final) dicaFrente = '🔄 Reprocessando os erros de hoje...';

  const estiloFrente = enade && !final ? { textAlign: 'left' } : { fontSize: '1.5rem', textAlign: 'center' };

  return (
    <article id="right-panel" className={ativo ? 'active' : ''} style={{ display: 'block' }} aria-live="polite" aria-atomic="true">
      <div className="painel-header">
        <div id="titulo-aula">
          Estudando: <span style={{ color: 'var(--nexti-cyan)' }}>{faseAtiva.nome}</span>
        </div>
        <div id="contador-cartas" className="tech-font">
          {final ? final.contador : `Item ${Math.min(indice + 1, deck.length)}/${deck.length}`}
        </div>
      </div>

      {/* Com o foco na carta (Tab), Enter e Espaço viram; sem foco, o Espaço vira pelo atalho global do painel. */}
      <ResumoDisciplina disciplina={FASES.find(fase => fase.id === faseAtiva.id)?.academico} />
      <div className="card-container" role="button" tabIndex={0} aria-label={virada ? "Mostrar a pergunta" : "Mostrar a resposta"}
        onClick={virarCarta} onKeyDown={ativarComTeclado(virarCarta)}>
        <div className={`card-inner${virada && !final ? ' flipped' : ''}`}>
          <div className="carta-frente">
            <div className="carta-texto" style={estiloFrente}>{frente}</div>
            <div className="carta-dica tech-font">{dicaFrente}</div>
          </div>
          <div className="carta-verso">
            <div className="carta-texto" style={enade ? { textAlign: 'left' } : undefined}>{verso}</div>
            <div className="carta-dica tech-font">{formatarDica(cartaAtual?.dica)}</div>
          </div>
        </div>
      </div>

      {controles && <div className="game-controls" style={{ display: 'flex' }}>{controles}</div>}

      {final && (
        <button className="btn-action btn-proxima tech-font flex-align-center" style={{ display: 'flex' }} onClick={concluirRotina}>
          <span className="material-symbols-outlined control-icon-spacing" aria-hidden="true">keyboard_double_arrow_right</span> Concluir fase
        </button>
      )}
    </article>
  );
}
