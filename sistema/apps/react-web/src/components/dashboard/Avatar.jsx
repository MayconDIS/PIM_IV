import React from 'react';

/**
 * Avatar do aluno: a foto escolhida por ele ou, sem foto, o ícone de terminal no gradiente.
 * Aparece no menu do cabeçalho e, no celular, ao lado do "Olá" do painel.
 */
export function Avatar({ foto, className = '', ...props }) {
  const estilo = foto
    ? {
        backgroundImage: `url('${foto}'), linear-gradient(135deg, var(--nexti-purple), var(--nexti-cyan))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : undefined;
  return (
    <div className={`avatar tech-font flex-align ${className}`.trim()} style={estilo} {...props}>
      {!foto && <span className="material-symbols-outlined" aria-hidden="true">terminal</span>}
    </div>
  );
}
