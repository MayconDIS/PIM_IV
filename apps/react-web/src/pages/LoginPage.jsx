import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('aluno@nexti.edu');
  const [senha, setSenha] = useState('Senha@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await ApiService.register(nome, email, senha);
      }
      await login(email, senha);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao conectar à API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '420px',
        maxWidth: '100%',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderColor: 'var(--nexti-cyan)',
        boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center' }}>
          <h1 className="display-font" style={{ fontSize: '26px', color: '#fff' }}>
            Nex_<span style={{ color: 'var(--nexti-cyan)' }}>TI</span>
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--nexti-text-muted)', marginTop: '4px', letterSpacing: '1px' }}>
            {isRegister ? 'CRIAR NOVA CONTA ACADÊMICA' : 'ACESSO AO SISTEMA NEURAL DE APRENDIZADO'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(255, 85, 85, 0.1)',
            border: '1px solid var(--nexti-red)',
            padding: '8px 12px',
            borderRadius: '6px',
            color: 'var(--nexti-red)',
            fontSize: '12px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '11px', color: 'var(--nexti-text-muted)', display: 'block', marginBottom: '4px' }}>
                Nome Completo:
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--nexti-border)',
                borderRadius: '6px',
                padding: '8px 12px',
                gap: '8px'
              }}>
                <UserIcon size={16} color="var(--nexti-text-muted)" />
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '13px',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', color: 'var(--nexti-text-muted)', display: 'block', marginBottom: '4px' }}>
              E-mail Institucional:
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--nexti-border)',
              borderRadius: '6px',
              padding: '8px 12px',
              gap: '8px'
            }}>
              <Mail size={16} color="var(--nexti-text-muted)" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aluno@nexti.edu"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--nexti-text-muted)', display: 'block', marginBottom: '4px' }}>
              Senha de Acesso:
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--nexti-border)',
              borderRadius: '6px',
              padding: '8px 12px',
              gap: '8px'
            }}>
              <Lock size={16} color="var(--nexti-text-muted)" />
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              background: 'var(--nexti-cyan)',
              border: 'none',
              borderRadius: '6px',
              color: '#000',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Conectando...' : (isRegister ? 'Criar Cadastro' : 'Entrar no Sistema')}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--nexti-border)', paddingTop: '14px' }}>
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--nexti-cyan)',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Já possui conta? Fazer login' : 'Não tem conta? Cadastre-se aqui'}
          </button>
        </div>
      </div>
    </div>
  );
}
