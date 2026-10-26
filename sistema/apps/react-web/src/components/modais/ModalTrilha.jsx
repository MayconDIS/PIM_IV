import React, { useState } from 'react';
import { MODULOS, fasesConcluidas } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { Modal } from '../ui/Modal';
import { ResumoDisciplina } from '../dashboard/ResumoDisciplina';
import './trilha.css';

const MODULOS_CURSO = MODULOS.filter(modulo => modulo.numero <= 4);

function Disciplina({ fase, concluida, liberada, estudar }) {
  return (
    <li className={`trilha-disciplina${liberada ? '' : ' trilha-disciplina-bloqueada'}`}>
      <div className="trilha-disciplina-titulo">
        <h4>{fase.nome}</h4>
        <span>{concluida ? 'Revisão disponível' : liberada ? 'Disponível' : 'Bloqueada'}</span>
      </div>
      <p>{fase.totalCards} flashcards{!fase.academico && ' · Complementar'}</p>
      <ResumoDisciplina disciplina={fase.academico} />
      <button className="btn-action" type="button" disabled={!liberada} onClick={() => estudar(fase)}>
        {liberada ? `Estudar ${fase.nome}` : 'Conclua as etapas anteriores'}
      </button>
    </li>
  );
}

function Percurso() {
  const { decks, srsData, fasesDesbloqueadas, perfil, acessoCompleto, faseAtiva, carregarAula, fecharModal } = useEstudo();
  const concluidas = new Set(fasesConcluidas(decks, srsData));
  const [selecionado, setSelecionado] = useState(() =>
    MODULOS_CURSO.find(modulo => modulo.fases.some(fase => fasesDesbloqueadas.includes(fase.id) && !concluidas.has(fase.id)))?.numero ?? 1);
  const modulo = MODULOS_CURSO.find(item => item.numero === selecionado);
  const feitas = modulo.fases.filter(fase => concluidas.has(fase.id)).length;
  const estudar = fase => {
    fecharModal();
    if (faseAtiva?.id !== fase.id) carregarAula(fase.id, fase.nome);
    else document.getElementById('right-panel')?.scrollIntoView({ block: 'center' });
  };
  return (
    <div className="modal-body trilha-corpo">
      <p className="trilha-introducao">{acessoCompleto
        ? `Como ${perfil}, você tem acesso a todos os módulos e disciplinas, sem diagnóstico ou desbloqueio. As estatísticas mostram somente o que você estudou.`
        : 'Seu caminho pelos quatro módulos de ADS. Revise os resumos e estude as disciplinas para avançar. As fases e os testes liberam as próximas etapas.'}</p>
      <div className="trilha-modulos" role="group" aria-label="Escolher módulo">
        {MODULOS_CURSO.map(item => (
          <button key={item.id} type="button" aria-pressed={item.numero === selecionado} onClick={() => setSelecionado(item.numero)}>
            <strong>Módulo {item.numero}</strong>
            <span>{item.fases.filter(fase => concluidas.has(fase.id)).length}/{item.fases.length} disciplinas revisadas</span>
          </button>
        ))}
      </div>
      <section aria-labelledby="trilha-modulo-titulo">
        <h3 id="trilha-modulo-titulo">Módulo {modulo.numero} · {modulo.titulo}</h3>
        <label className="trilha-progresso">{feitas} de {modulo.fases.length} disciplinas com todas as cartas estudadas
          <progress max={modulo.fases.length} value={feitas} />
        </label>
        <ul className="trilha-disciplinas">{modulo.fases.map(fase => (
          <Disciplina key={fase.id} fase={fase} concluida={concluidas.has(fase.id)} liberada={fasesDesbloqueadas.includes(fase.id)} estudar={estudar} />
        ))}</ul>
        <p className="trilha-teste">{acessoCompleto ? 'O teste também está disponível para você praticar quando quiser.' : 'Ao terminar, faça o teste do módulo para seguir ao próximo módulo.'}</p>
        <button className="btn-action" type="button" disabled={!fasesDesbloqueadas.includes(modulo.teste.id)} onClick={() => estudar(modulo.teste)}>{modulo.teste.nome}</button>
      </section>
      <p className="trilha-introducao">O preparatório ENADE permanece no módulo próprio, após os quatro módulos. As disciplinas complementares da trilha original continuam disponíveis.</p>
    </div>
  );
}

export function ModalTrilha() {
  const { modal, fecharModal } = useEstudo();
  const aberto = modal === 'modalTrilha';
  return (
    <Modal aberto={aberto} escuro classeConteudo="modal-trilha" icone="route" titulo="Trilha de estudos" onFechar={fecharModal}>
      {aberto && <Percurso />}
    </Modal>
  );
}
