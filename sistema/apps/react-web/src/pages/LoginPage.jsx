import React, { useEffect, useId, useRef, useState } from 'react';
import '@nexti/shared/css/global.css';
import '@nexti/shared/css/login.css';
import {
  ApiService,
  avaliarSenha,
  mensagemDeSenhaFraca,
  mensagemDeSenhaVazada,
  senhaEhForte,
  sha1HexWeb,
  verificarSenhaVazada,
} from '@nexti/shared';
import { AudioEngine } from '@nexti/shared/audio';

/**
 * Login e cadastro do Nex_TI.
 *
 * Mantém o visual "terminal" do app original e traz do CasalFlow: regras de
 * senha listadas enquanto se digita, checagem de senha vazada (HaveIBeenPwned
 * por k-anonymity) antes de criar a conta, confirmação de senha, mostrar/ocultar,
 * aviso de Caps Lock e mensagens num alerta acessível em vez de só no botão.
 */
const som = (metodo) => {
  try {
    AudioEngine?.[metodo]?.();
  } catch (erro) {
    console.warn('[login] efeito sonoro falhou', { metodo, motivo: erro?.message });
  }
};

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NICKNAME_VALIDO = /^[\p{L}\p{N}_.-]{3,30}$/u;
const ICONES_ALERTA = { erro: 'error', sucesso: 'check_circle', info: 'terminal' };

function salvarSessao({ token, user }) {
  localStorage.setItem('quest_jwt_token', token);
  localStorage.setItem('quest_user_id', user.id);
  localStorage.setItem('quest_user_name', user.username);
  localStorage.setItem('quest_user_nivel', user.nivel);
  localStorage.setItem('quest_user_perfil', user.perfil ?? 'Aluno');
}

/** A lista de regras: aparece só depois da primeira tecla, pendentes primeiro. */
function RegrasDeSenha({ senha, contexto, id }) {
  const { regras, vazia, cumpridas, total } = avaliarSenha(senha, contexto);
  if (vazia) return null;
  const ordenadas = [...regras].sort((a, b) => Number(a.cumprida) - Number(b.cumprida));

  return (
    <ul className="regras-senha" id={id} aria-live="polite" aria-label={`Requisitos da senha: ${cumpridas} de ${total} cumpridos`}>
      {ordenadas.map((r) => (
        <li key={r.id} className={r.cumprida ? 'cumprida' : ''}>
          {r.cumprida ? (
            <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
          ) : (
            <span className="marcador-pendente" aria-hidden="true" />
          )}
          {r.rotulo}
          <span className="sr-only">{r.cumprida ? ' (cumprido)' : ' (pendente)'}</span>
        </li>
      ))}
    </ul>
  );
}

function CampoSenha({ id, rotulo, valor, onChange, autoComplete, descritoPor, onCapsLock }) {
  const [visivel, setVisivel] = useState(false);
  const verificarCaps = (e) => onCapsLock?.(Boolean(e.getModifierState?.('CapsLock')));

  return (
    <div className="input-with-icon com-acao">
      <input
        type={visivel ? 'text' : 'password'}
        id={id}
        placeholder="••••••••"
        required
        aria-required="true"
        autoComplete={autoComplete}
        aria-describedby={descritoPor}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={verificarCaps}
        onKeyDown={verificarCaps}
        onBlur={() => onCapsLock?.(false)}
      />
      <button
        type="button"
        className="btn-ver-senha"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? `Ocultar ${rotulo.toLowerCase()}` : `Mostrar ${rotulo.toLowerCase()}`}
        aria-pressed={visivel}
        title={visivel ? 'Ocultar' : 'Mostrar'}
      >
        <span className="material-symbols-outlined" aria-hidden="true">{visivel ? 'visibility_off' : 'visibility'}</span>
      </button>
    </div>
  );
}

export default function LoginPage() {
  const [modoLogin, setModoLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [credencial, setCredencial] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [capsLigado, setCapsLigado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [alerta, setAlerta] = useState(null); // { tipo: 'erro'|'sucesso'|'info', texto }
  const [concluido, setConcluido] = useState(null); // texto do botão após sucesso
  const primeiroCampo = useRef(null);
  const idBase = useId();
  const idRegras = `${idBase}-regras`;
  const idCaps = `${idBase}-caps`;

  useEffect(() => {
    document.title = modoLogin ? 'Login - Nex_TI' : 'Cadastro - Nex_TI';
  }, [modoLogin]);

  const contextoDaSenha = { nickname: nome.trim(), email: credencial.trim() };

  const alternarModo = (e) => {
    e.preventDefault();
    som('playClick');
    setModoLogin((v) => !v);
    setAlerta(null);
    setSenha('');
    setConfirmacao('');
    // devolve o foco ao topo do formulário, que mudou de forma
    requestAnimationFrame(() => primeiroCampo.current?.focus());
  };

  const falhar = (texto) => {
    som('playError');
    setAlerta({ tipo: 'erro', texto });
    setEnviando(false);
  };

  const entrar = (textoBotao, atraso) => {
    setConcluido(textoBotao);
    setAlerta({ tipo: 'sucesso', texto: modoLogin ? 'Acesso autorizado. Carregando o terminal...' : 'Conta criada. Carregando o terminal...' });
    // recarrega como o vanilla trocava de página: só o CSS do dashboard fica ativo
    setTimeout(() => window.location.reload(), atraso);
  };

  const autenticar = async (e) => {
    e.preventDefault();
    if (enviando) return;
    som('playClick');

    const login = credencial.trim();
    if (!login || !senha) {
      falhar(modoLogin ? 'Informe seu e-mail ou nickname e a senha.' : 'Preencha todos os campos.');
      return;
    }

    if (modoLogin) {
      setEnviando(true);
      setAlerta({ tipo: 'info', texto: 'Autenticando...' });
      try {
        salvarSessao(await ApiService.login(login, senha));
        som('playCorrect');
        entrar('✓ Acesso Autorizado!', 600);
      } catch (erro) {
        falhar(erro.message || 'Acesso bloqueado.');
      }
      return;
    }

    // --- cadastro: valida tudo antes de chamar a API ---
    const nickname = nome.trim();
    if (!NICKNAME_VALIDO.test(nickname)) {
      falhar('O nickname deve ter de 3 a 30 caracteres: letras, números, ponto, hífen ou sublinhado.');
      return;
    }
    if (!EMAIL_VALIDO.test(login)) {
      falhar('Informe um e-mail válido.');
      return;
    }
    if (!senhaEhForte(senha, contextoDaSenha)) {
      falhar(mensagemDeSenhaFraca(senha, contextoDaSenha));
      return;
    }
    if (senha !== confirmacao) {
      falhar('As senhas digitadas não coincidem.');
      return;
    }

    setEnviando(true);
    // No envio, e não a cada tecla: é uma chamada de rede. E antes do cadastro,
    // para não criar conta com uma senha que já circula em vazamentos.
    setAlerta({ tipo: 'info', texto: 'Conferindo se esta senha já apareceu em vazamentos...' });
    const vazamento = await verificarSenhaVazada(senha, { sha1: sha1HexWeb });
    if (vazamento.vazada) {
      falhar(mensagemDeSenhaVazada(vazamento.vezes));
      return;
    }

    setAlerta({ tipo: 'info', texto: 'Criando conta...' });
    try {
      await ApiService.register(nickname, login, senha);
      salvarSessao(await ApiService.login(nickname, senha));
      som('playUnlock');
      entrar('✓ Conta Criada!', 800);
    } catch (erro) {
      falhar(erro.message || 'Erro no cadastro.');
    }
  };

  const textoBotao = concluido ?? (enviando
    ? (modoLogin ? 'Autenticando...' : 'Criando Conta...')
    : (modoLogin ? 'Entrar' : 'Criar conta'));
  const corBotao = concluido ? 'var(--nexti-green)' : undefined;
  const descricaoSenha = [!modoLogin && senha ? idRegras : null, capsLigado ? idCaps : null].filter(Boolean).join(' ') || undefined;

  return (
    <main className="login-container" aria-labelledby="form-title">
      <header className="login-header">
        <h1 id="form-title" className="logo-title">
          Nex_
          <span className="tech-text">TI</span>
        </h1>
        <p className="subtitle">{modoLogin ? 'Que bom ver você de novo!' : 'Crie sua conta para começar a estudar.'}</p>
      </header>

      <form className="login-form" onSubmit={autenticar} aria-label={modoLogin ? 'Entrar no Nex_TI' : 'Criar conta no Nex_TI'} noValidate>
        {alerta && (
          <div className={`alerta-login ${alerta.tipo}`} role={alerta.tipo === 'erro' ? 'alert' : 'status'}>
            <span className="material-symbols-outlined" aria-hidden="true">{ICONES_ALERTA[alerta.tipo]}</span>
            <span>{alerta.texto}</span>
          </div>
        )}

        {!modoLogin && (
          <div className="form-group">
            <label htmlFor="nome" className="tech-font">Nickname</label>
            <div className="input-with-icon">
              <input
                ref={primeiroCampo}
                type="text"
                id="nome"
                placeholder="Ex: Maycon"
                required
                aria-required="true"
                autoComplete="username"
                maxLength={30}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="tech-font">{modoLogin ? 'E-mail ou Nickname' : 'E-mail'}</label>
          <div className="input-with-icon">
            <input
              ref={modoLogin ? primeiroCampo : undefined}
              type={modoLogin ? 'text' : 'email'}
              id="email"
              placeholder={modoLogin ? 'seu@email.com ou nickname' : 'seu@email.com'}
              required
              aria-required="true"
              autoComplete={modoLogin ? 'username' : 'email'}
              inputMode={modoLogin ? 'text' : 'email'}
              autoCapitalize="none"
              spellCheck={false}
              value={credencial}
              onChange={(e) => setCredencial(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="tech-font">Senha</label>
          <CampoSenha
            id="password"
            rotulo="Senha"
            valor={senha}
            onChange={setSenha}
            autoComplete={modoLogin ? 'current-password' : 'new-password'}
            descritoPor={descricaoSenha}
            onCapsLock={setCapsLigado}
          />
          {capsLigado && (
            <p className="aviso-caps" id={idCaps}>
              <span className="material-symbols-outlined" aria-hidden="true">keyboard_capslock</span> Caps Lock ligado
            </p>
          )}
          {!modoLogin && <RegrasDeSenha senha={senha} contexto={contextoDaSenha} id={idRegras} />}
        </div>

        {!modoLogin && (
          <div className="form-group">
            <label htmlFor="confirmacao" className="tech-font">Confirme a senha</label>
            <CampoSenha
              id="confirmacao"
              rotulo="Confirmação da senha"
              valor={confirmacao}
              onChange={setConfirmacao}
              autoComplete="new-password"
              onCapsLock={setCapsLigado}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn-login tech-font"
          disabled={enviando || Boolean(concluido)}
          aria-busy={enviando}
          style={corBotao ? { color: corBotao, borderColor: corBotao } : undefined}
        >
          {textoBotao}
        </button>
      </form>

      <footer className="extra-links">
        <p>
          {modoLogin ? 'Ainda não tem acesso? ' : 'Já tem acesso? '}
          <a href="#" onClick={alternarModo}>{modoLogin ? 'Cadastre-se' : 'Faça Login'}</a>
        </p>
        <p style={{ marginTop: 10 }}>
          <a href="?pagina=sobre#privacidade">Privacidade (LGPD)</a> · <a href="?pagina=sobre#termos">Termos de Uso</a>
        </p>
      </footer>
    </main>
  );
}
