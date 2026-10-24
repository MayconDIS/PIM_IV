import React, { useEffect, useRef, useState } from 'react';
import { ApiService } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { Modal } from '../ui/Modal';
import { baixarDadosDaConta, encerrarSessaoDaConta } from '../../lib/conta';
import './conta.css';

export function ModalConta() {
  const { modal, fecharModal, nomeUsuario } = useEstudo();
  if (modal !== 'modalConta') return null;
  return <ConteudoConta nomeUsuario={nomeUsuario} fecharModal={fecharModal} />;
}

function ConteudoConta({ nomeUsuario, fecharModal }) {
  const [conta, setConta] = useState(null);
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const emCurso = useRef(false);
  const corpo = useRef(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const anterior = document.activeElement;
    corpo.current?.focus();
    return () => { anterior?.focus(); };
  }, []);

  useEffect(() => {
    const teclado = (e) => {
      if (e.key === 'Escape' && (emCurso.current || finalizado)) {
        e.preventDefault(); e.stopImmediatePropagation();
        if (finalizado) window.location.reload();
      }
      if (e.key === 'Tab') {
        const itens = [...corpo.current.closest('.modal-content').querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex="0"]')];
        const primeiro = itens[0], ultimo = itens.at(-1);
        if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === corpo.current)) {
          e.preventDefault(); ultimo?.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault(); primeiro?.focus();
        }
      }
    };
    document.addEventListener('keydown', teclado, true);
    return () => document.removeEventListener('keydown', teclado, true);
  }, [finalizado]);

  useEffect(() => {
    let ativo = true;
    setErro('');
    ApiService.getMinhaConta().then((dados) => {
      if (ativo) { setConta(dados); setEmail(dados.email); }
    }).catch((e) => { if (ativo) setErro(e.message); });
    return () => { ativo = false; };
  }, [tentativa]);

  const executar = async (acao) => {
    if (emCurso.current) return;
    emCurso.current = true;
    setOcupado(true); setErro(''); setMensagem('');
    try { await acao(); } catch (e) { setErro(e.message); }
    finally { emCurso.current = false; setOcupado(false); }
  };
  const submeter = (acao) => (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const dados = new FormData(form);
    executar(async () => { await acao(dados); form.reset(); });
  };
  const finalizar = (excluir) => {
    encerrarSessaoDaConta(nomeUsuario, excluir);
    setFinalizado(true);
    setMensagem(excluir ? 'Conta excluída. Os dados locais desta conta também foram removidos deste navegador.'
      : 'Senha alterada. As sessões anteriores foram revogadas. Entre novamente com a nova senha.');
  };

  return (
    <Modal aberto icone="manage_accounts" titulo="Minha conta" onFechar={ocupado ? undefined : finalizado ? () => window.location.reload() : fecharModal}>
      <div ref={corpo} tabIndex={-1} className="modal-body conta-body" role="dialog" aria-modal="true" aria-label="Minha conta" aria-busy={ocupado}>
        {erro && <p role="alert" className="conta-erro">{erro}</p>}
        {mensagem && <p role="status">{mensagem}</p>}
        {finalizado ? <button className="btn-action" onClick={() => window.location.reload()}>Ir para o login</button>
          : !conta ? <p>{erro ? <button className="btn-action" onClick={() => setTentativa((n) => n + 1)}>Tentar novamente</button> : 'Carregando sua conta…'}</p>
            : <>
              <p><strong>{conta.username}</strong> · {conta.perfil}</p>
              <form onSubmit={submeter(async (dados) => {
                const atualizada = await ApiService.alterarMeuEmail(email, dados.get('senhaAtual'));
                setConta(atualizada); setEmail(atualizada.email); setMensagem('E-mail atualizado.');
              })}>
                <fieldset disabled={ocupado}>
                  <legend>Alterar e-mail</legend>
                  <div className="input-group"><label htmlFor="conta-email">Novo e-mail</label>
                    <input id="conta-email" type="email" autoComplete="email" maxLength={100} required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <Senha id="conta-email-senha" />
                  <button className="btn-action" type="submit">Salvar e-mail</button>
                </fieldset>
              </form>
              <form onSubmit={submeter(async (dados) => {
                if (dados.get('novaSenha') !== dados.get('confirmacao')) throw new Error('A confirmação da nova senha não confere.');
                await ApiService.alterarMinhaSenha(dados.get('senhaAtual'), dados.get('novaSenha'));
                finalizar(false);
              })}>
                <fieldset disabled={ocupado}>
                  <legend>Alterar senha</legend>
                  <p>Use ao menos 8 caracteres, maiúscula, minúscula, número e símbolo. Não inclua seu nickname ou e-mail. As outras sessões serão encerradas.</p>
                  <Senha id="conta-senha-atual" />
                  <Senha id="conta-senha-nova" nome="novaSenha" rotulo="Nova senha" nova />
                  <Senha id="conta-senha-confirmacao" nome="confirmacao" rotulo="Confirmar nova senha" nova />
                  <button className="btn-action" type="submit">Salvar senha</button>
                </fieldset>
              </form>
              <section aria-label="Exportar dados">
                <h3>Seus dados</h3>
                <p>Baixe cadastro, progresso e histórico do servidor, além dos dados desta conta salvos neste navegador. Senhas e tokens não são incluídos.</p>
                <button className="btn-action" disabled={ocupado} onClick={() => executar(async () => {
                  baixarDadosDaConta(await ApiService.exportarMinhaConta(), nomeUsuario);
                  setMensagem('Download dos seus dados iniciado.');
                })}>Baixar meus dados (JSON)</button>
              </section>
              <form onSubmit={submeter(async (dados) => {
                if (!confirmado) throw new Error('Confirme que deseja excluir a conta.');
                await ApiService.excluirMinhaConta(dados.get('senhaAtual'));
                finalizar(true);
              })}>
                <fieldset disabled={ocupado} className="conta-excluir">
                  <legend>Excluir conta</legend>
                  <p>A exclusão é permanente e remove seu cadastro, progresso e histórico do servidor. Cartas compartilhadas permanecem. Cópias em outros dispositivos não são apagadas remotamente. O único Admin precisa definir outro administrador antes de excluir a conta.</p>
                  <Senha id="conta-excluir-senha" />
                  <label className="conta-confirmar"><input type="checkbox" required checked={confirmado} onChange={(e) => setConfirmado(e.target.checked)} /> Entendo que a exclusão é permanente.</label>
                  <button className="btn-action" disabled={!confirmado} type="submit">Excluir minha conta</button>
                </fieldset>
              </form>
              {ocupado && <p role="status">Processando…</p>}
            </>}
      </div>
    </Modal>
  );
}

function Senha({ id, nome = 'senhaAtual', rotulo = 'Senha atual', nova = false }) {
  return <div className="input-group"><label htmlFor={id}>{rotulo}</label>
    <input id={id} name={nome} type="password" autoComplete={nova ? 'new-password' : 'current-password'} required maxLength={72} /></div>;
}
