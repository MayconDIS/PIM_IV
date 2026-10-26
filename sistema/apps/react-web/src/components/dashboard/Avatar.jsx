import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEstudo } from '../../context/EstudoContext';
import { Modal } from '../ui/Modal';

/** Lado da foto guardada, em pixels: o avatar aparece com 45 px, e 256 dá folga para telas de alta densidade. */
const LADO_DA_FOTO = 256;
/** Lado da prévia redonda da janela de enquadrar. */
const PREVIA = 190;
/** Quanto as setas do teclado movem a foto na prévia. */
const PASSO_DA_SETA = 10;

/** Abre o arquivo escolhido como imagem; falha se o navegador não conseguir ler (arquivo quebrado). */
function carregarImagem(arquivo) {
  const endereco = URL.createObjectURL(arquivo);
  return new Promise((resolver, falhar) => {
    const imagem = new Image();
    imagem.onload = () => resolver(imagem);
    imagem.onerror = falhar;
    imagem.src = endereco;
  }).finally(() => URL.revokeObjectURL(endereco));
}

/**
 * Janela de enquadrar, como no CasalFlow (AvatarPickerModal): o aluno arrasta a foto (ou usa as setas)
 * e dá zoom numa prévia redonda. Só o recorte é guardado, em 256 × 256 px, JPEG 85% (uns 20 KB):
 * a foto inteira de um celular tem vários MB e não cabe no localStorage (cerca de 5 MB por site).
 */
function EnquadrarFoto({ imagem, onCancelar, onUsar }) {
  const tela = useRef(null);
  const arrasto = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [desvio, setDesvio] = useState({ x: 0, y: 0 });

  // Com zoom 1, o lado menor da foto preenche a prévia; o desvio não deixa sobrar borda vazia.
  const base = PREVIA / Math.min(imagem.naturalWidth, imagem.naturalHeight);
  const tamanho = (z) => ({ largura: imagem.naturalWidth * base * z, altura: imagem.naturalHeight * base * z });
  const limitar = (d, z = zoom) => {
    const { largura, altura } = tamanho(z);
    const mx = (largura - PREVIA) / 2;
    const my = (altura - PREVIA) / 2;
    return { x: Math.min(mx, Math.max(-mx, d.x)), y: Math.min(my, Math.max(-my, d.y)) };
  };
  const desenhar = (contexto, escala) => {
    const { largura, altura } = tamanho(zoom);
    contexto.drawImage(imagem, (PREVIA / 2 + desvio.x - largura / 2) * escala, (PREVIA / 2 + desvio.y - altura / 2) * escala,
      largura * escala, altura * escala);
  };

  useEffect(() => {
    const contexto = tela.current.getContext('2d');
    contexto.clearRect(0, 0, PREVIA, PREVIA);
    desenhar(contexto, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagem, zoom, desvio]);

  // Esc fecha sem trocar a foto (o Esc do painel só fecha as janelas abertas pelo contexto)
  useEffect(() => {
    const aoEsc = (e) => { if (e.key === 'Escape') onCancelar(); };
    document.addEventListener('keydown', aoEsc);
    return () => document.removeEventListener('keydown', aoEsc);
  }, [onCancelar]);

  const mover = (dx, dy) => setDesvio((d) => limitar({ x: d.x + dx, y: d.y + dy }));
  const aoTeclar = (e) => {
    const setas = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (!setas[e.key]) return;
    e.preventDefault();
    mover(setas[e.key][0] * PASSO_DA_SETA, setas[e.key][1] * PASSO_DA_SETA);
  };
  const mudarZoom = (valor) => {
    const z = Number(valor);
    setZoom(z);
    setDesvio((d) => limitar(d, z));
  };
  const usar = () => {
    const saida = document.createElement('canvas');
    saida.width = saida.height = LADO_DA_FOTO;
    desenhar(saida.getContext('2d'), LADO_DA_FOTO / PREVIA);
    onUsar(saida.toDataURL('image/jpeg', 0.85));
  };

  // Vai para o <body>: dentro do menu do cabeçalho (que tem animação com transform) a janela ficaria
  // presa ao menu em vez de cobrir a tela, o mesmo motivo do portal no CasalFlow.
  return createPortal(
    <Modal aberto classeConteudo="modal-enquadrar" icone="crop" titulo="Enquadrar foto" onFechar={onCancelar}>
      <div className="modal-body enquadrar-foto">
        <canvas
          ref={tela}
          width={PREVIA}
          height={PREVIA}
          className="enquadrar-previa"
          tabIndex={0}
          role="img"
          aria-label="Prévia da foto. Arraste para posicionar; as setas do teclado também movem."
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); arrasto.current = { x: e.clientX, y: e.clientY }; }}
          onPointerMove={(e) => {
            if (!arrasto.current) return;
            mover(e.clientX - arrasto.current.x, e.clientY - arrasto.current.y);
            arrasto.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={() => { arrasto.current = null; }}
          onKeyDown={aoTeclar}
        />
        <label className="enquadrar-zoom">
          Zoom
          <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => mudarZoom(e.target.value)} />
        </label>
        <div className="enquadrar-acoes">
          <button type="button" className="btn-action" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="btn-action" onClick={usar}>Usar foto</button>
        </div>
      </div>
    </Modal>,
    document.body,
  );
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
  const [pendente, setPendente] = useState(null);

  const lerFoto = async (e) => {
    const arquivo = e.target.files?.[0];
    e.target.value = ''; // escolher a mesma foto de novo também dispara a troca
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/')) {
      toast('error', 'Arquivo inválido', 'Escolha uma imagem (JPG ou PNG).');
      return;
    }
    try {
      setPendente(await carregarImagem(arquivo));
    } catch {
      toast('error', 'Foto não carregada', 'Não deu para abrir essa imagem. Tente uma foto em JPG ou PNG.');
    }
  };

  const usarFoto = (foto) => {
    trocarAvatar(foto);
    setPendente(null);
    toast('success', 'Avatar Atualizado', 'Foto de perfil atualizada com sucesso!');
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
    <>
      <label className={`avatar avatar-editavel tech-font flex-align cursor-pointer ${className}`.trim()} style={estilo}
        title="Toque para alterar a foto do seu avatar">
        {!avatar && <span className="material-symbols-outlined" aria-hidden="true">terminal</span>}
        <input type="file" accept="image/*" className="avatar-arquivo" aria-label="Alterar a foto do avatar" onChange={lerFoto} />
      </label>
      {pendente && <EnquadrarFoto imagem={pendente} onCancelar={() => setPendente(null)} onUsar={usarFoto} />}
    </>
  );
}
