import React from 'react';
import { useEstudo } from '../../context/EstudoContext';

/** Lado da foto guardada, em pixels: o avatar aparece com 45 px, e 256 dá folga para telas de alta densidade. */
const LADO_DA_FOTO = 256;

/**
 * Recorta o quadrado do meio da foto e reduz para 256 × 256 px em JPEG (85%), como no CasalFlow.
 * Foto de celular tem vários MB e não cabe no localStorage (cerca de 5 MB por site): guardada
 * inteira, ela não aparecia e sumia ao recarregar. Reduzida, fica com uns 20 KB.
 */
async function reduzirFoto(arquivo) {
  const endereco = URL.createObjectURL(arquivo);
  try {
    const img = await new Promise((resolver, falhar) => {
      const imagem = new Image();
      imagem.onload = () => resolver(imagem);
      imagem.onerror = falhar;
      imagem.src = endereco;
    });
    const lado = Math.min(img.naturalWidth, img.naturalHeight);
    const tela = document.createElement('canvas');
    tela.width = tela.height = Math.min(LADO_DA_FOTO, lado);
    tela.getContext('2d').drawImage(img, (img.naturalWidth - lado) / 2, (img.naturalHeight - lado) / 2, lado, lado,
      0, 0, tela.width, tela.height);
    return tela.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(endereco);
  }
}

/**
 * Avatar do aluno: a foto escolhida por ele ou, sem foto, o ícone de terminal no gradiente.
 * Aparece no menu do cabeçalho e ao lado do "Olá" do painel.
 * Tocar nele troca a foto: é um <label> com o campo de arquivo dentro, então o próprio
 * navegador abre o seletor de imagem (no iPhone, um campo escondido aberto por código não abre).
 * O campo fica invisível mas focável: Tab chega nele e Enter ou Espaço abrem o seletor.
 */
export function AvatarEditavel({ className = '' }) {
  const { avatar, trocarAvatar, toast } = useEstudo();

  const lerFoto = async (e) => {
    const arquivo = e.target.files?.[0];
    e.target.value = ''; // escolher a mesma foto de novo também dispara a troca
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/')) {
      toast('error', 'Arquivo inválido', 'Escolha uma imagem (JPG ou PNG).');
      return;
    }
    try {
      trocarAvatar(await reduzirFoto(arquivo));
      toast('success', 'Avatar Atualizado', 'Foto de perfil atualizada com sucesso!');
    } catch {
      toast('error', 'Foto não carregada', 'Não deu para abrir essa imagem. Tente uma foto em JPG ou PNG.');
    }
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
