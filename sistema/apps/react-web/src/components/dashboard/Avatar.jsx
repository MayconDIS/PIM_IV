import React from 'react';
import { useEstudo } from '../../context/EstudoContext';

/**
 * Avatar do aluno: a foto escolhida por ele ou, sem foto, o ícone de terminal no gradiente.
 * Aparece no menu do cabeçalho e ao lado do "Olá" do painel.
 * Tocar nele troca a foto: é um <label> com o campo de arquivo dentro, então o próprio
 * navegador abre o seletor de imagem (no iPhone, um campo escondido aberto por código não abre).
 * O campo fica invisível mas focável: Tab chega nele e Enter ou Espaço abrem o seletor.
 */
export function AvatarEditavel({ className = '' }) {
  const { avatar, trocarAvatar, toast } = useEstudo();

  const lerFoto = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      trocarAvatar(leitor.result);
      toast('success', 'Avatar Atualizado', 'Foto de perfil atualizada com sucesso!');
    };
    leitor.readAsDataURL(arquivo);
    e.target.value = ''; // escolher a mesma foto de novo também dispara a troca
  };

  const estilo = avatar
    ? {
        backgroundImage: `url('${avatar}'), linear-gradient(135deg, var(--nexti-purple), var(--nexti-cyan))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : undefined;
  return (
    <label className={`avatar avatar-editavel tech-font flex-align cursor-pointer ${className}`.trim()} style={estilo}
      title="Toque para alterar a foto do seu avatar">
      {!avatar && <span className="material-symbols-outlined" aria-hidden="true">terminal</span>}
      <input type="file" accept="image/*" className="avatar-arquivo" aria-label="Alterar a foto do avatar" onChange={lerFoto} />
    </label>
  );
}
