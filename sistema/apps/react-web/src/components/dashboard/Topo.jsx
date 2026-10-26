import React, { useEffect, useRef, useState } from 'react';
import { FRASES_MOTIVACIONAIS } from '@nexti/shared';
import logo from '@nexti/shared/img/logo.png';
import iconeTerminal from '@nexti/shared/img/terminal-icon.png';
import { useEstudo } from '../../context/EstudoContext';
import { alternarAltoContraste, ativarComTeclado, mudarZoom } from '../../lib/acessibilidade';
import { abrirVLibras } from '../../lib/vlibras';
import { perfilAtual, podeAdministrar } from '../modais/ModalAdmin';

// Janela aberta pelo menu: no celular, a barra do rodapé some até ela fechar.
const PELO_MENU = { peloMenu: true };

/** <header> do dashboard: frase motivacional, áudio, criação de carta e menu do usuário. */
export function Topo() {
  const {
    nomeUsuario, userKey, rank, audioMudo, alternarAudio, abrirModal,
    resetarProgresso, deslogar, toast,
  } = useEstudo();
  const [menuAberto, setMenuAberto] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`${userKey}avatar_custom`));
  const menuRef = useRef(null);
  const botaoMenu = useRef(null);
  const inputAvatar = useRef(null);

  const [frase] = useState(() => {
    const modelo = FRASES_MOTIVACIONAIS[Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length)];
    const [antes, depois] = modelo.split('{name}');
    return { antes, depois: depois ?? '' };
  });
  const nomeExibido = nomeUsuario === 'Desenvolvedor' ? 'Dev' : nomeUsuario;

  useEffect(() => {
    const fecharFora = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAberto(false);
    };
    document.addEventListener('click', fecharFora);
    return () => document.removeEventListener('click', fecharFora);
  }, []);

  const voltarAoTopo = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const escolherFoto = () => inputAvatar.current?.click();

  const acao = (fn) => () => {
    setMenuAberto(false);
    // O item some com o menu: o foco volta ao botão do menu, e é para ele que a janela aberta devolve o foco.
    botaoMenu.current?.focus();
    fn();
  };

  const trocarAvatar = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        localStorage.setItem(`${userKey}avatar_custom`, leitor.result);
      } catch {
        /* imagem grande demais para o localStorage: vale só nesta sessão */
      }
      setAvatar(leitor.result);
      toast('success', 'Avatar Atualizado', 'Foto de perfil atualizada com sucesso!');
    };
    leitor.readAsDataURL(arquivo);
  };

  const estiloAvatar = avatar
    ? {
        backgroundImage: `url('${avatar}'), linear-gradient(135deg, var(--nexti-purple), var(--nexti-cyan))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
      }
    : { cursor: 'pointer' };

  return (
    <header role="banner">
      <div className="logo logo-header-box cursor-pointer" role="button" tabIndex={0} aria-label="Nex_TI: voltar ao topo"
        onClick={voltarAoTopo} onKeyDown={ativarComTeclado(voltarAoTopo)}>
        <img src={logo} alt="Nex_TI" className="logo-image-header" />
      </div>

      <div className="header-center" aria-live="polite">
        <img src={iconeTerminal} className="motivation-icon" alt="Terminal" />{' '}
        <span>
          {frase.antes}
          <span className="username-highlight">{nomeExibido}</span>
          {frase.depois}
        </span>
      </div>

      <div className="header-right">
        <button
          className={`btn-action tech-font flex-align-center btn-audio-toggle${audioMudo ? ' muted' : ''}`}
          onClick={alternarAudio}
          title="Alternar Efeitos Sonoros"
        >
          <span className="material-symbols-outlined" aria-hidden="true">{audioMudo ? 'volume_off' : 'volume_up'}</span>
        </button>
        <button className="btn-action tech-font flex-align btn-criar-carta" onClick={() => abrirModal('modalCriacao')}>
          <span className="material-symbols-outlined" aria-hidden="true">add_box</span> Criar Carta
        </button>

        <div className="hamburger-menu" ref={menuRef}>
          <button ref={botaoMenu} type="button" className="hamburger-btn flex-align" aria-label="Abrir menu" aria-haspopup="menu" aria-expanded={menuAberto} onClick={() => setMenuAberto((v) => !v)}>
            <span className="material-symbols-outlined hamburger-icon" aria-hidden="true">menu</span>
          </button>
          <div className={`dropdown-content${menuAberto ? ' show' : ''}`}>
            <div className="dropdown-header">
              <div
                className="avatar tech-font flex-align"
                style={estiloAvatar}
                title="Clique para alterar a foto do seu avatar"
                role="button"
                tabIndex={0}
                aria-label="Alterar a foto do avatar"
                onClick={escolherFoto}
                onKeyDown={ativarComTeclado(escolherFoto)}
              >
                {!avatar && <span className="material-symbols-outlined" aria-hidden="true">terminal</span>}
              </div>
              <input ref={inputAvatar} type="file" accept="image/*" style={{ display: 'none' }} onChange={trocarAvatar} />
              <div>
                <div className="menu-user-name">{nomeUsuario}</div>
                <div className="tech-font menu-user-level">{rank}</div>
              </div>
            </div>
            <button type="button" className="dropdown-item flex-align" onClick={acao(() => abrirModal('modalNivelamento', PELO_MENU))}>
              <span className="material-symbols-outlined target-icon" aria-hidden="true">radar</span> Refazer Diagnóstico
            </button>
            <button type="button" className="dropdown-item flex-align" onClick={acao(() => abrirModal('modalProgresso', PELO_MENU))}>
              <span className="material-symbols-outlined stats-icon" aria-hidden="true">monitoring</span> Minhas Estatísticas
            </button>
            <button type="button" className="dropdown-item flex-align" onClick={acao(() => abrirModal('modalMapaMental', PELO_MENU))}>
              <span className="material-symbols-outlined" aria-hidden="true">hub</span> Mapa Neural
            </button>
            <button type="button" className="dropdown-item flex-align" onClick={acao(() => abrirModal('modalConta', PELO_MENU))}>
              <span className="material-symbols-outlined" aria-hidden="true">manage_accounts</span> Minha conta
            </button>
            {podeAdministrar() && (
              <button type="button" className="dropdown-item flex-align" onClick={acao(() => abrirModal('modalAdmin', PELO_MENU))}>
                <span className="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span> Painel do {perfilAtual() === 'Admin' ? 'Admin' : 'Tutor'}
              </button>
            )}
            <button type="button" className="dropdown-item danger flex-align" onClick={acao(resetarProgresso)}>
              <span className="material-symbols-outlined" aria-hidden="true">warning</span> Limpar dados do navegador
            </button>
            <div className="dropdown-item mobile-a11y mobile-a11y-container">
              <span className="flex-align a11y-title-text">
                <span className="material-symbols-outlined" aria-hidden="true">accessibility_new</span> Acessibilidade
              </span>
              <div className="a11y-buttons-container">
                <button className="btn-action tech-font flex-align-center a11y-btn" onClick={() => mudarZoom(-1)}>A-</button>
                <button className="btn-action tech-font flex-align-center a11y-btn" onClick={() => mudarZoom(1)}>A+</button>
                <button className="btn-action tech-font flex-align-center a11y-btn" onClick={alternarAltoContraste} title="Alto Contraste">
                  <span className="material-symbols-outlined contrast-icon" aria-hidden="true">contrast</span>
                </button>
                <button className="btn-action tech-font flex-align-center a11y-btn" onClick={acao(abrirVLibras)} title="Tradutor de Libras (VLibras)">
                  Libras
                </button>
              </div>
            </div>
            <button type="button" className="dropdown-item flex-align" onClick={acao(deslogar)}>
              <span className="material-symbols-outlined" aria-hidden="true">logout</span> Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
