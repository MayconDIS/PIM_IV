import React, { useEffect, useRef, useState } from 'react';
import '@nexti/shared/css/global.css';
import '@nexti/shared/css/login.css';
import { ApiService } from '@nexti/shared';
import { AudioEngine } from '@nexti/shared/audio';

/** Porte de pages/login (login.html + auth.js). */
const som = (metodo) => {
  try {
    AudioEngine?.[metodo]?.();
  } catch {
    /* áudio é opcional */
  }
};

function salvarSessao({ token, user }) {
  localStorage.setItem('quest_jwt_token', token);
  localStorage.setItem('quest_user_id', user.id);
  localStorage.setItem('quest_user_name', user.username);
  localStorage.setItem('quest_user_nivel', user.nivel);
}

export default function LoginPage() {
  const [modoLogin, setModoLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [credencial, setCredencial] = useState('');
  const [senha, setSenha] = useState('');
  const [botao, setBotao] = useState({ texto: null, estado: 'normal', ocupado: false });
  const timerErro = useRef(null);

  useEffect(() => {
    document.title = 'Login - Nex_TI';
    return () => clearTimeout(timerErro.current);
  }, []);

  const textoPadrao = modoLogin ? '> INITIALIZE_LOGIN()' : 'Criar Conta';

  const alternarModo = (e) => {
    e.preventDefault();
    som('playClick');
    setModoLogin((v) => !v);
    setBotao({ texto: null, estado: 'normal', ocupado: false });
  };

  const mostrarErro = (mensagem) => {
    setBotao({ texto: `⚠ ${mensagem}`, estado: 'erro', ocupado: false });
    clearTimeout(timerErro.current);
    timerErro.current = setTimeout(() => setBotao({ texto: null, estado: 'normal', ocupado: false }), 3000);
  };

  const entrar = (textoSucesso, atraso) => {
    setBotao({ texto: textoSucesso, estado: 'ok', ocupado: true });
    // recarrega como o vanilla trocava de página: assim só o CSS do dashboard fica ativo
    setTimeout(() => window.location.reload(), atraso);
  };

  const autenticar = async (e) => {
    e.preventDefault();
    som('playClick');

    if (modoLogin) {
      setBotao({ texto: 'Autenticando...', estado: 'normal', ocupado: true });
      try {
        salvarSessao(await ApiService.login(credencial.trim(), senha));
        som('playCorrect');
        entrar('✓ Acesso Autorizado!', 600);
      } catch (erro) {
        som('playError');
        mostrarErro(erro.message || 'Acesso Bloqueado!');
      }
      return;
    }

    setBotao({ texto: 'Criando Conta...', estado: 'normal', ocupado: true });
    try {
      await ApiService.register(nome.trim(), credencial.trim(), senha);
      salvarSessao(await ApiService.login(nome.trim(), senha));
      som('playUnlock');
      entrar('✓ Conta Criada!', 800);
    } catch (erro) {
      som('playError');
      mostrarErro(erro.message || 'Erro no Cadastro');
    }
  };

  const corBotao = { erro: '#ff5555', ok: 'var(--nexti-green)' }[botao.estado];

  return (
    <main className="login-container" aria-labelledby="form-title">
      <header className="login-header">
        <h1 id="form-title" className="logo-title">
          {modoLogin ? 'Nex_' : 'New_'}
          <span className="tech-text">{modoLogin ? 'TI' : 'Access'}</span>
        </h1>
        <p className="subtitle">{modoLogin ? 'Welcome back, developer.' : 'Join the Quest.'}</p>
      </header>

      <form className="login-form" onSubmit={autenticar} aria-label="Formulário de Autenticação">
        <div className="form-group" style={{ display: modoLogin ? 'none' : 'block' }}>
          <label htmlFor="nome" className="tech-font">Nickname</label>
          <div className="input-with-icon">
            <input type="text" id="nome" placeholder="Ex: Maycon" aria-label="Seu nickname" required={!modoLogin} value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="tech-font">{modoLogin ? 'E-mail ou Nickname' : 'E-mail'}</label>
          <div className="input-with-icon">
            <input
              type="text"
              id="email"
              placeholder={modoLogin ? 'dev@quest.com ou Nickname' : 'dev@quest.com'}
              required
              aria-required="true"
              value={credencial}
              onChange={(e) => setCredencial(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="tech-font">Password</label>
          <div className="input-with-icon">
            <input type="password" id="password" placeholder="••••••••" required aria-required="true" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
        </div>

        <button
          type="submit"
          className="btn-login tech-font"
          aria-live="assertive"
          disabled={botao.ocupado}
          style={corBotao ? { color: corBotao, borderColor: corBotao } : undefined}
        >
          {botao.texto ?? textoPadrao}
        </button>
      </form>

      <footer className="extra-links">
        <p>
          {modoLogin ? 'Ainda não tem acesso? ' : 'Já tem acesso? '}
          <a href="#" onClick={alternarModo}>{modoLogin ? 'Cadastre-se' : 'Faça Login'}</a>
        </p>
      </footer>
    </main>
  );
}
