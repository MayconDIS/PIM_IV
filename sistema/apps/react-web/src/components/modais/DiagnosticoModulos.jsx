import React from 'react';
import { FASES, PERGUNTAS_POR_MODULO } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { Modal } from '../ui/Modal';
import { useDiagnostico } from './diagnostico/useDiagnostico';
import { ResultadoDiagnostico } from './diagnostico/ResultadoDiagnostico';
import './diagnostico/diagnostico.css';

export function ModalNivelamento() {
  const estudo = useEstudo();
  const aberto = estudo.modal === 'modalNivelamento';
  return <Modal aberto={aberto} escuro classeConteudo="modal-nivelamento" classeCabecalho="modal-header-cyan"
    classeTitulo="text-cyan" icone="radar" titulo="Diagnóstico dos módulos" onFechar={estudo.fecharModal}>
    {aberto && <Quiz estudo={estudo} />}
  </Modal>;
}

function Quiz({ estudo }) {
  const quiz = useDiagnostico(estudo);
  const total = PERGUNTAS_POR_MODULO * 4;
  const estudar = id => {
    estudo.fecharModal();
    const fase = FASES.find(f => f.id === id);
    if (fase) estudo.carregarAula(id, fase.nome);
  };
  if (quiz.tela === 'resultado' && quiz.resultado) return <ResultadoDiagnostico
    resultado={quiz.resultado} atualizar={quiz.setResultado} sincronizar={estudo.sincronizarDiagnostico}
    fechar={estudo.fecharModal} estudar={estudar} tituloRef={quiz.titulo} />;
  if (quiz.tela === 'intro') return (
    <div className="modal-body diagnostico-corpo">
      <h3 ref={quiz.titulo} tabIndex={-1}>Descubra por onde começar</h3>
      <p>Responda a <strong>{total} perguntas, cinco por módulo</strong>, sobre as disciplinas de Mod_01 a Mod_04. As perguntas variam a cada novo diagnóstico.</p>
      <ul><li>Veja seus acertos por módulo e o que precisa revisar.</li>
        <li>Use “Não sei ainda” quando não conhecer o assunto.</li>
        <li>As respostas ficam neste navegador para continuar depois. Avisaremos caso não seja possível salvá-las.</li>
        <li>Refazer não apaga seu progresso nem reduz seu rank.</li></ul>
      <p>O preparatório ENADE fica separado, em Mod_05. O diagnóstico recomenda um ponto de partida; não substitui os testes dos módulos.</p>
      <div className="diagnostico-acoes">
        {quiz.respostas.length > 0 && <button className="btn-action" onClick={() => quiz.iniciar(true)}>Continuar diagnóstico ({quiz.respostas.length}/{total})</button>}
        <button className="btn-action" onClick={() => quiz.iniciar(false)}>{quiz.respostas.length ? 'Descartar respostas e começar novamente' : 'Começar diagnóstico'}</button>
        {estudo.diagnostico?.versao === 2 && <button className="btn-action" onClick={() => { quiz.setResultado(estudo.diagnostico); quiz.setTela('resultado'); }}>Ver último resultado</button>}
      </div>
    </div>
  );
  const pergunta = quiz.perguntas[quiz.respostas.length];
  return (
    <div className="modal-body diagnostico-corpo" aria-busy={quiz.salvando}>
      <h3 ref={quiz.titulo} tabIndex={-1}>Pergunta {quiz.respostas.length + 1} de {total} · Mod_0{pergunta.modulo}</h3>
      <progress max={total} value={quiz.respostas.length} aria-label="Perguntas respondidas" />
      <fieldset className="diagnostico-pergunta" disabled={quiz.salvando}>
        <legend>{pergunta.p}</legend>
        {[...pergunta.r, 'Não sei ainda'].map((texto, i) => {
          const valor = i === pergunta.r.length ? null : i;
          return <label key={`${pergunta.id}-${i}`} className="diagnostico-alternativa">
            <input type="radio" name={pergunta.id} checked={quiz.selecionada === valor} onChange={() => quiz.setSelecionada(valor)} />
            <span>{texto}</span>
          </label>;
        })}
      </fieldset>
      {quiz.erro && <p role="alert">{quiz.erro}</p>}
      {!quiz.rascunhoSalvo && <p role="alert">Não foi possível guardar as respostas neste navegador. Mantenha esta janela aberta até concluir o diagnóstico.</p>}
      <button className="btn-action diagnostico-confirmar" disabled={quiz.selecionada === undefined || quiz.salvando} onClick={quiz.confirmar}>
        {quiz.salvando ? 'Preparando resultado…' : quiz.respostas.length + 1 === total ? 'Concluir diagnóstico' : 'Confirmar e continuar'}
      </button>
      <p className="diagnostico-ajuda">Selecione uma alternativa e confirme para avançar. Suas respostas não mudam o XP nem as revisões das cartas.</p>
    </div>
  );
}
