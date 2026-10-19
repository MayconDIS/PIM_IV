import React, { useMemo, useState } from 'react';
import { MODULOS } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { Modal } from '../ui/Modal';

/** Destinos na mesma ordem do <select> do vanilla: fases do módulo seguidas do bônus. */
const DESTINOS = MODULOS.flatMap((m) => [
  ...m.fases.map((f) => ({ id: f.id, rotulo: f.titulo })),
  ...(m.bonus ? [{ id: m.bonus.id, rotulo: `BÔNUS ${m.numero}: ${m.bonus.nome}` }] : []),
]);

export function ModalCriacao() {
  const { modal, fecharModal, criarCarta, faseAtiva, fasesDesbloqueadas, bonusDesbloqueados } = useEstudo();
  const aberto = modal === 'modalCriacao';

  const opcoes = useMemo(
    () => DESTINOS.filter((d) => fasesDesbloqueadas.includes(d.id) || bonusDesbloqueados.includes(d.id)),
    [fasesDesbloqueadas, bonusDesbloqueados],
  );

  return (
    <Modal aberto={aberto} icone="add_box" titulo="Criar Flashcard" onFechar={fecharModal}>
      {aberto && <Formulario opcoes={opcoes} faseAtiva={faseAtiva} criarCarta={criarCarta} fecharModal={fecharModal} />}
    </Modal>
  );
}

function Formulario({ opcoes, faseAtiva, criarCarta, fecharModal }) {
  const padrao = opcoes.some((o) => o.id === faseAtiva?.id) ? faseAtiva.id : opcoes.at(-1)?.id ?? '';
  const [faseId, setFaseId] = useState(padrao);
  const [frente, setFrente] = useState('');
  const [verso, setVerso] = useState('');
  const [dica, setDica] = useState('');
  const [selectAberto, setSelectAberto] = useState(false);

  const salvar = () => {
    if (criarCarta({ faseId, frente, verso, dica })) fecharModal();
  };

  return (
    <div className="modal-body">
      <div className="input-group">
        <label htmlFor="nova-fase">Disciplina de Destino</label>
        {/* imita o dropdown "flutuante" limitado a 10 opções do vanilla */}
        <select
          id="nova-fase"
          className={`cursor-pointer${selectAberto ? ' select-aberto' : ''}`}
          title="Disciplina de destino para o novo flashcard"
          size={selectAberto ? Math.min(10, opcoes.length) : 1}
          value={faseId}
          onFocus={() => setSelectAberto(opcoes.length > 10)}
          onBlur={() => setSelectAberto(false)}
          onChange={(e) => {
            setFaseId(e.target.value);
            e.target.blur();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        >
          {opcoes.map((o) => (
            <option key={o.id} value={o.id}>{o.rotulo}</option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="nova-frente">Frente da Carta (Pergunta/Termo)</label>
        <textarea id="nova-frente" rows={2} placeholder="Ex: O que é..." value={frente} onChange={(e) => setFrente(e.target.value)} />
      </div>
      <div className="input-group">
        <label htmlFor="nova-verso">Verso da Carta (Resposta/Explicação)</label>
        <textarea id="nova-verso" rows={3} placeholder="Ex: É um sistema..." value={verso} onChange={(e) => setVerso(e.target.value)} />
      </div>
      <div className="input-group">
        <label htmlFor="nova-dica">Dica (Opcional)</label>
        <input type="text" id="nova-dica" placeholder="Ex: Lembre-se da regra X" value={dica} onChange={(e) => setDica(e.target.value)} />
      </div>
      <button className="btn-action btn-right tech-font flex-align" onClick={salvar}>
        <span className="material-symbols-outlined control-icon-spacing">save</span> Salvar_Dado()
      </button>
    </div>
  );
}
