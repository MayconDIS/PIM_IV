import React, { useState } from 'react';
import { PERGUNTAS_DIAGNOSTICO } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { Modal } from '../ui/Modal';

/** Diagnóstico de nivelamento: intro → 10 perguntas → resultado. */
export function ModalNivelamento() {
  const { modal, fecharModal, concluirDiagnostico, som } = useEstudo();
  const aberto = modal === 'modalNivelamento';

  return (
    <Modal
      aberto={aberto}
      escuro
      classeConteudo="modal-nivelamento"
      classeCabecalho="modal-header-cyan"
      classeTitulo="text-cyan"
      icone="radar"
      titulo="Teste de nivelamento"
    >
      {aberto && <Quiz concluirDiagnostico={concluirDiagnostico} fecharModal={fecharModal} som={som} />}
    </Modal>
  );
}

function Quiz({ concluirDiagnostico, fecharModal, som }) {
  const [etapa, setEtapa] = useState(-1); // -1 = introdução
  const [acertos, setAcertos] = useState(0);
  const [resultado, setResultado] = useState(null);

  const responder = (indice) => {
    som('playClick');
    const total = acertos + (indice === PERGUNTAS_DIAGNOSTICO[etapa].certa ? 1 : 0);
    setAcertos(total);
    if (etapa + 1 < PERGUNTAS_DIAGNOSTICO.length) setEtapa(etapa + 1);
    else setResultado({ ...concluirDiagnostico(total), acertos: total });
  };

  if (resultado) {
    return (
      <div className="modal-body">
        <h3 style={{ color: 'var(--nexti-green)', marginBottom: 15 }}>Avaliação Concluída!</h3>
        <p style={{ color: '#c5c6c7', marginBottom: 25 }}>
          Você pontuou {resultado.acertos}/10.
          <br />
          <br />
          <b>Seu nível: {resultado.status}.</b> {resultado.mensagem}
        </p>
        <button className="btn-action btn-right tech-font flex-align-center" style={{ width: '100%', justifyContent: 'center' }} onClick={fecharModal}>
          Ir para o painel
        </button>
      </div>
    );
  }

  if (etapa < 0) {
    return (
      <div className="modal-body">
        <p className="modal-desc-text">
          Antes de começar, responda a 10 perguntas rápidas. Assim descobrimos por qual fase você deve começar.
        </p>
        <button className="btn-action btn-right tech-font flex-align-center btn-full-width" onClick={() => setEtapa(0)}>
          <span className="material-symbols-outlined control-icon-spacing">play_arrow</span> Começar teste
        </button>
      </div>
    );
  }

  const pergunta = PERGUNTAS_DIAGNOSTICO[etapa];
  return (
    <div className="modal-body">
      <h3 style={{ color: 'var(--nexti-cyan)', marginBottom: 15 }}>Avaliação Acadêmica {etapa + 1}/10</h3>
      <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: 25 }}>{pergunta.p}</p>
      {pergunta.r.map((resposta, i) => (
        <button
          key={`${etapa}-${i}`}
          className="btn-action tech-font"
          style={{ width: '100%', marginBottom: 10, textAlign: 'left' }}
          onClick={() => responder(i)}
        >
          {resposta}
        </button>
      ))}
    </div>
  );
}
