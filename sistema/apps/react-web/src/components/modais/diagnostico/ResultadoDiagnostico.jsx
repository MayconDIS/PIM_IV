import React, { useState } from 'react';
import { MODULOS, PERGUNTAS_DIAGNOSTICO } from '@nexti/shared';

export function ResultadoDiagnostico({ resultado, atualizar, sincronizar, fechar, estudar, tituloRef }) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const modulo = MODULOS.find(m => m.numero === resultado.moduloRecomendado);
  const tentarSalvar = async () => {
    setSalvando(true); setErro('');
    try { const novo = await sincronizar(resultado); if (novo) atualizar(novo); }
    catch (e) { setErro(e.message); }
    finally { setSalvando(false); }
  };
  return (
    <div className="modal-body diagnostico-corpo">
      <h3 ref={tituloRef} tabIndex={-1}>Seu caminho de estudo</h3>
      <p>Você acertou <strong>{resultado.acertos} de {resultado.total}</strong> perguntas. Este resultado é uma amostra dos conteúdos, não uma conclusão das disciplinas.</p>
      <div className="diagnostico-recomendacao">
        <strong>Comece por {modulo?.codigo}: {modulo?.titulo}</strong>
        <p>{resultado.moduloRecomendado === 5 ? 'Você mostrou uma boa base nos quatro módulos. Avance para o preparatório ENADE e continue revisando.' : 'Este é o primeiro módulo que precisa de revisão. Os acertos nos módulos seguintes não escondem as dúvidas da base.'}</p>
      </div>
      <div className="diagnostico-modulos">
        {resultado.modulos.map(m => (
          <section key={m.numero} aria-label={`Resultado ${m.codigo}`}>
            <h4>{m.codigo} · {m.titulo}</h4>
            <p><strong>{m.acertos}/{m.total}</strong> acertos · {m.dominio ? 'Boa base nesta amostra' : 'Revisão recomendada'}</p>
            <progress max={m.total} value={m.acertos} aria-label={`Acertos em ${m.codigo}`} />
          </section>
        ))}
      </div>
      <p>Quatro acertos em cinco indicam uma boa base no módulo. Seu XP, moedas, rank, revisões e acessos anteriores foram preservados. O diagnóstico não concede certificado nem aprova testes de módulo.</p>
      <p className="diagnostico-salvamento" role="status">
        {resultado.sincronizacao === 'salvo' ? 'Resultado salvo na sua conta.' : resultado.sincronizacao === 'pendente' ? 'Resultado salvo neste navegador. O envio à conta está pendente; tentaremos novamente ao abrir o site com conexão.' : resultado.sincronizacao === 'sessao' ? 'Resultado disponível apenas nesta sessão: não foi possível salvar. Não feche a página antes de tentar novamente.' : 'Resultado salvo neste navegador.'}
      </p>
      {['pendente', 'sessao'].includes(resultado.sincronizacao) && <button className="btn-action" disabled={salvando} onClick={tentarSalvar}>{salvando ? 'Salvando…' : 'Tentar salvar novamente'}</button>}
      {erro && <p role="alert">{erro}</p>}
      <details className="diagnostico-revisao">
        <summary>Conferir respostas e explicações</summary>
        <ol>{resultado.revisoes.map(item => {
          const pergunta = PERGUNTAS_DIAGNOSTICO.find(p => p.id === item.perguntaId);
          return <li key={item.perguntaId}>
            <h4>{pergunta?.p}</h4>
            <p>{item.acertou ? 'Correta' : 'Revisar'} · Sua resposta: {item.respondida === null ? 'Não sei ainda' : pergunta?.r[item.respondida]}</p>
            <p><strong>Resposta correta:</strong> {pergunta?.r[item.correta]}</p>
            <p>{item.explicacao}</p>
          </li>;
        })}</ol>
      </details>
      <div className="diagnostico-acoes">
        <button className="btn-action" onClick={() => estudar(resultado.faseRecomendada)}>Estudar módulo recomendado</button>
        <button className="btn-action" onClick={fechar}>Voltar ao painel</button>
      </div>
    </div>
  );
}
