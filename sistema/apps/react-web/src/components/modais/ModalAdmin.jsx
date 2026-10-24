import React, { useEffect, useState } from 'react';
import { ApiService, MODULOS } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { Modal } from '../ui/Modal';

const PERFIS = ['Aluno', 'Tutor', 'Admin'];
const FASES = MODULOS.flatMap((m) => [...m.fases, ...(m.bonus ? [{ id: m.bonus.id, titulo: `Bônus ${m.numero}: ${m.bonus.nome}` }] : [])]);

/** Perfil salvo no login: decide se o menu mostra o painel. A API confere de novo em cada rota. */
export const perfilAtual = () => localStorage.getItem('quest_user_perfil') || 'Aluno';
export const podeAdministrar = () => ['Tutor', 'Admin'].includes(perfilAtual());

/**
 * Estrutura administrativa do Nex_TI.
 * Tutor: acompanha os alunos e modera as cartas. Admin: também define o perfil de cada usuário.
 */
export function ModalAdmin() {
  const { modal, fecharModal, toast, confirmar } = useEstudo();
  const [aba, setAba] = useState('alunos');
  if (modal !== 'modalAdmin') return null;

  const admin = perfilAtual() === 'Admin';
  const abas = [['alunos', 'groups', 'Alunos'], ['cartas', 'style', 'Cartas'], ...(admin ? [['usuarios', 'manage_accounts', 'Usuários']] : [])];

  return (
    <Modal aberto classeConteudo="modal-progresso" icone="admin_panel_settings" titulo={admin ? 'Painel do Admin' : 'Painel do Tutor'} onFechar={fecharModal}>
      <div className="modal-body">
        <div className="admin-abas" role="tablist">
          {abas.map(([id, icone, rotulo]) => (
            <button key={id} role="tab" aria-selected={aba === id} className={`btn-backup-action${aba === id ? ' admin-aba-ativa' : ''}`} onClick={() => setAba(id)}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>{icone}</span> {rotulo}
            </button>
          ))}
        </div>
        {aba === 'alunos' && <Alunos toast={toast} />}
        {aba === 'cartas' && <Cartas toast={toast} confirmar={confirmar} />}
        {aba === 'usuarios' && admin && <Usuarios toast={toast} />}
      </div>
    </Modal>
  );
}

/** Carrega dados da API; erro vira aviso e lista vazia. */
function useDados(buscar, toast, dependencias = []) {
  const [dados, setDados] = useState(null);
  const recarregar = () =>
    buscar().then(setDados).catch((e) => { toast('error', 'Painel', e.message); setDados([]); });
  useEffect(() => { recarregar(); }, dependencias);
  return [dados, recarregar];
}

function Alunos({ toast }) {
  const [alunos] = useDados(ApiService.getPainelAlunos, toast);
  if (!alunos) return <p className="admin-vazio">Carregando...</p>;
  if (!alunos.length) return <p className="admin-vazio">Nenhum aluno cadastrado ainda.</p>;

  return (
    <table className="admin-tabela">
      <caption className="tech-font">Como cada aluno está no SM-2</caption>
      <thead>
        <tr><th>Aluno</th><th>XP</th><th>Nível</th><th>Estudadas</th><th>Para revisar hoje</th><th>Maduras</th></tr>
      </thead>
      <tbody>
        {alunos.map((a) => (
          <tr key={a.username}>
            <td>{a.username}</td><td>{a.xp}</td><td>{a.nivel}</td><td>{a.cartasEstudadas}</td><td>{a.cartasDevidasHoje}</td><td>{a.cartasMaduras}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Cartas({ toast, confirmar }) {
  const [faseId, setFaseId] = useState('fase1');
  const [cartas, recarregar] = useDados(() => ApiService.getFlashcardsPorFase(faseId), toast, [faseId]);
  const [editando, setEditando] = useState(null);

  const salvar = async () => {
    try {
      await ApiService.editarFlashcard(editando.id, editando.frente, editando.verso, editando.dica);
      toast('success', 'Carta atualizada', 'As alterações já valem para todos os alunos.');
      setEditando(null);
      recarregar();
    } catch (e) {
      toast('error', 'Não foi possível salvar', e.message);
    }
  };

  const excluir = async (carta) => {
    if (!(await confirmar('Excluir carta', `Excluir "${carta.frente}"? O progresso dos alunos nesta carta também será apagado.`))) return;
    try {
      await ApiService.excluirFlashcard(carta.id);
      toast('success', 'Carta excluída', carta.frente);
      recarregar();
    } catch (e) {
      toast('error', 'Não foi possível excluir', e.message);
    }
  };

  return (
    <>
      <div className="input-group">
        <label htmlFor="admin-fase">Fase</label>
        <select id="admin-fase" value={faseId} onChange={(e) => { setFaseId(e.target.value); setEditando(null); }}>
          {FASES.map((f) => <option key={f.id} value={f.id}>{f.titulo}</option>)}
        </select>
      </div>

      {editando && (
        <div className="admin-edicao">
          <div className="input-group"><label htmlFor="admin-frente">Frente</label><textarea id="admin-frente" rows={2} value={editando.frente} onChange={(e) => setEditando({ ...editando, frente: e.target.value })} /></div>
          <div className="input-group"><label htmlFor="admin-verso">Verso</label><textarea id="admin-verso" rows={3} value={editando.verso} onChange={(e) => setEditando({ ...editando, verso: e.target.value })} /></div>
          <div className="input-group"><label htmlFor="admin-dica">Dica</label><input id="admin-dica" value={editando.dica ?? ''} onChange={(e) => setEditando({ ...editando, dica: e.target.value })} /></div>
          <div className="admin-acoes">
            <button className="btn-backup-action" onClick={salvar}><span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>save</span> Salvar</button>
            <button className="btn-backup-action" onClick={() => setEditando(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {!cartas ? <p className="admin-vazio">Carregando...</p> : (
        <table className="admin-tabela">
          <caption className="tech-font">{cartas.length} carta(s) nesta fase</caption>
          <thead><tr><th>Frente</th><th>Verso</th><th aria-label="Ações" /></tr></thead>
          <tbody>
            {cartas.map((c) => (
              <tr key={c.id}>
                <td>{c.frente}</td>
                <td>{c.verso}</td>
                <td><div className="admin-acoes">
                  <button className="btn-backup-action" title="Editar" aria-label={`Editar: ${c.frente}`} onClick={() => setEditando({ id: c.id, frente: c.frente, verso: c.verso, dica: c.dica })}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>edit</span>
                  </button>
                  <button className="btn-backup-action admin-perigo" title="Excluir" aria-label={`Excluir: ${c.frente}`} onClick={() => excluir(c)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
                  </button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function Usuarios({ toast }) {
  const [usuarios, recarregar] = useDados(ApiService.getUsuariosAdmin, toast);
  const meuId = Number(localStorage.getItem('quest_user_id'));

  const mudarPerfil = async (usuario, perfil) => {
    try {
      await ApiService.definirPerfil(usuario.id, perfil);
      toast('success', 'Perfil alterado', `${usuario.username} agora é ${perfil}.`);
    } catch (e) {
      toast('error', 'Não foi possível alterar', e.message);
    }
    recarregar();
  };

  if (!usuarios) return <p className="admin-vazio">Carregando...</p>;
  return (
    <table className="admin-tabela">
      <caption className="tech-font">{usuarios.length} usuário(s)</caption>
      <thead><tr><th>Usuário</th><th>E-mail</th><th>XP</th><th>Perfil</th></tr></thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id}>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.xp}</td>
            <td>
              <select aria-label={`Perfil de ${u.username}`} value={u.perfil} disabled={u.id === meuId} title={u.id === meuId ? 'Você não pode mudar o próprio perfil' : undefined} onChange={(e) => mudarPerfil(u, e.target.value)}>
                {PERFIS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
