import React, { Suspense, lazy } from 'react';
import { CHAVE_SPLASH_EXIBIDO } from './lib/sessao';

/*
 * splash.css, login.css e dashboard.css redefinem <body> de jeitos incompatíveis.
 * Cada página é carregada sob demanda e a troca entre elas recarrega a aba (como o
 * vanilla navegava entre index.html, login.html e o dashboard), então só uma folha
 * fica ativa por vez.
 */
const SplashPage = lazy(() => import('./pages/SplashPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function splashJaExibido() {
  try {
    return sessionStorage.getItem(CHAVE_SPLASH_EXIBIDO) === 'true';
  } catch {
    return true;
  }
}

export default function App() {
  // Tela de inicialização uma vez por sessão do navegador (aba nova = splash de novo).
  if (!splashJaExibido()) {
    return (
      <Suspense fallback={null}>
        <SplashPage />
      </Suspense>
    );
  }

  const logado = Boolean(localStorage.getItem('quest_user_name'));
  return <Suspense fallback={null}>{logado ? <DashboardPage /> : <LoginPage />}</Suspense>;
}
