import React from 'react';

/** Síntese autoral; os arquivos de referência permanecem no acervo do aluno. */
export function ResumoDisciplina({ disciplina }) {
  if (!disciplina) return null;
  return (
    <details className="resumo-disciplina">
      <summary>Resumo e materiais</summary>
      <div>
        {disciplina.resumo.map((texto, indice) => <p key={indice}>{texto}</p>)}
        <h4>O que revisar</h4>
        <ul>{disciplina.topicos.map(topico => <li key={topico}>{topico}</li>)}</ul>
        <details className="fontes-disciplina">
          <summary>Materiais de referência</summary>
          <p>Resumo e flashcards elaborados a partir dos materiais de estudo do módulo {disciplina.semestre}.</p>
          <ul>{disciplina.fontes.map(fonte => (
            <li key={fonte.id}>{fonte.titulo} · {fonte.formato === 'pptx' ? 'slides' : 'páginas'} {fonte.paginas.join(', ')}</li>
          ))}</ul>
        </details>
      </div>
    </details>
  );
}
