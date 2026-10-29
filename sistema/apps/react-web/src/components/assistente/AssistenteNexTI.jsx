import React, { useEffect, useId, useRef, useState } from 'react';
import { responderPergunta } from '@nexti/shared';
import { useEstudo } from '../../context/EstudoContext';
import { useEvitarControles, useJanelaAssistente } from './useJanelaAssistente';
import { IconeNexor } from './IconeNexor';
import './assistente.css';

const SUGESTOES = ['Como funciona o SM-2?', 'Como ganhar XP?', 'O que é uma variável?', 'Como usar o ENADE?'];

function Resposta({ resposta }) {
  return (
    <>
      <p>{resposta.texto}</p>
      {resposta.fontes?.length > 0 && (
        <div className="assistente-fontes">
          <strong>Materiais consultados</strong>
          {resposta.fontes.map((fonte, indice) => (
            <details key={`${fonte.titulo}-${indice}`} open={indice === 0}>
              <summary>{fonte.titulo}</summary>
              <p>{fonte.texto}</p>
            </details>
          ))}
        </div>
      )}
    </>
  );
}

/** Conversa local: mensagens ficam apenas na memória desta tela. */
export function AssistenteNexTI() {
  const { modal, dialogo, faseAtiva, userKey } = useEstudo();
  const [aberto, setAberto] = useState(false);
  const [pergunta, setPergunta] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [aviso, setAviso] = useState('');
  const entrada = useRef(null);
  const botao = useRef(null);
  const historico = useRef(null);
  const devolverFoco = useRef(false);
  const id = useId();
  const bloqueado = Boolean(modal || dialogo);
  const visivel = aberto && !bloqueado;
  const janela = useJanelaAssistente(visivel);
  const sobreControles = useEvitarControles(visivel, faseAtiva);

  useEffect(() => {
    if (bloqueado) setAberto(false);
  }, [bloqueado]);
  useEffect(() => {
    setMensagens([]);
    setPergunta('');
    setAberto(false);
  }, [userKey]);
  useEffect(() => {
    if (visivel) entrada.current?.focus({ preventScroll: true });
    else if (devolverFoco.current && !bloqueado) {
      botao.current?.focus({ preventScroll: true });
      devolverFoco.current = false;
    }
  }, [visivel, bloqueado]);
  useEffect(() => {
    const lista = historico.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  }, [mensagens, visivel]);

  const fechar = () => { devolverFoco.current = true; setAberto(false); };
  const enviar = (texto = pergunta) => {
    const limpa = texto.trim().slice(0, 400);
    if (!limpa) return;
    const resposta = responderPergunta(limpa);
    setMensagens(anteriores => [...anteriores.slice(-19), { pergunta: limpa, resposta }]);
    setPergunta('');
    setAviso('');
    entrada.current?.focus({ preventScroll: true });
  };
  const limpar = () => {
    setMensagens([]);
    setPergunta('');
    setAviso('Conversa limpa. Você pode fazer uma nova pergunta.');
    entrada.current?.focus({ preventScroll: true });
  };
  const aoTeclar = (evento) => {
    evento.stopPropagation();
    if (evento.key === 'Escape') { evento.preventDefault(); fechar(); }
  };
  const sugestoes = mensagens.at(-1)?.resposta.sugestoes?.length ? mensagens.at(-1).resposta.sugestoes : SUGESTOES;

  if (bloqueado) return null;
  return (
    <aside className={`assistente-nexti${janela.teclado > 120 ? ' assistente-com-teclado' : ''}${janela.altura < 480 ? ' assistente-compacto' : ''}`}
      data-assistente-nexti onKeyDown={aoTeclar}
      style={{ '--assistente-altura': `${janela.altura}px`, '--assistente-teclado': `${janela.teclado}px` }}>
      {!visivel && <button ref={botao} type="button" className="assistente-abrir" aria-label="Abrir Nexor"
        aria-expanded={false} aria-controls={id} title="Nexor — assistente do Nex_TI" style={{ visibility: sobreControles ? 'hidden' : 'visible' }} onClick={() => setAberto(true)}>
        <IconeNexor />
      </button>}
      {visivel && <section className="assistente-janela" id={id} role="dialog" aria-modal="false" aria-labelledby={`${id}-titulo`}>
        <div className="assistente-cabecalho">
          <div><h2 id={`${id}-titulo`}><IconeNexor /> Nexor</h2><p>Assistente de estudos do Nex_TI</p></div>
          <button type="button" className="assistente-icone" aria-label="Fechar assistente" title="Fechar assistente" onClick={fechar}>
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <div className="assistente-historico" ref={historico} role="log" aria-label="Conversa com o Nexor" aria-live="polite" aria-relevant="additions">
          <div className="assistente-mensagem assistente-resposta"><p>Olá! Eu sou o Nexor, seu assistente de estudos. Busco respostas nos materiais do Nex_TI. Qual é sua dúvida?</p></div>
          {mensagens.map((mensagem, indice) => <React.Fragment key={indice}>
            <div className="assistente-mensagem assistente-pergunta"><strong>Você</strong><p>{mensagem.pergunta}</p></div>
            <div className="assistente-mensagem assistente-resposta"><strong>Nexor</strong><Resposta resposta={mensagem.resposta} /></div>
          </React.Fragment>)}
        </div>
        <div className="assistente-sugestoes" aria-label="Sugestões de perguntas">
          {sugestoes.slice(0, 4).map(texto => <button key={texto} type="button" onClick={() => enviar(texto)}>{texto}</button>)}
        </div>
        <form className="assistente-formulario" onSubmit={evento => { evento.preventDefault(); enviar(); }}>
          <label className="assistente-rotulo" htmlFor={`${id}-pergunta`}>Sua pergunta</label>
          <div className="assistente-entrada">
            <textarea ref={entrada} id={`${id}-pergunta`} rows={janela.altura < 480 ? 1 : 2} maxLength={400} value={pergunta} placeholder={janela.altura < 480 ? 'Sua dúvida…' : 'Pergunte sobre TI ou sobre o Nex_TI…'}
              onChange={evento => setPergunta(evento.target.value)} onKeyDown={evento => {
                if (evento.key === 'Enter' && !evento.shiftKey && !evento.nativeEvent.isComposing) { evento.preventDefault(); enviar(); }
              }} />
            <button type="submit" className="assistente-enviar" disabled={!pergunta.trim()} aria-label="Enviar pergunta" title="Enviar pergunta">
              <span className="material-symbols-outlined" aria-hidden="true">send</span>
            </button>
          </div>
          <div className="assistente-rodape"><span>{pergunta.length}/400 · Só nesta conversa</span><button type="button" onClick={limpar}>Limpar conversa</button></div>
          <span className="assistente-aviso" role="status">{aviso}</span>
        </form>
      </section>}
    </aside>
  );
}
