import React, { Suspense, lazy } from 'react';
import { CHAVE_SPLASH_EXIBIDO } from './lib/sessao';

/*
 * splash.css, login.css, dashboard.css e sobre.css redefinem <body> de jeitos
 * incompatíveis. Cada página é carregada sob demanda e a troca entre elas recarrega
 * a aba (como o vanilla navegava entre index.html, login.html, o dashboard e
 * sobre/index.html), então só uma folha fica ativa por vez.
 */
const SplashPage = lazy(() => import('./pages/SplashPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SobrePage = lazy(() => import('./pages/SobrePage'));

function splashJaExibido() {
  try {
    return sessionStorage.getItem(CHAVE_SPLASH_EXIBIDO) === 'true';
  } catch {
    return true;
  }
}

function escolherPagina() {
  // ?pagina=sobre#secao — páginas institucionais, abertas com ou sem login
  if (new URLSearchParams(window.location.search).get('pagina') === 'sobre') return <SobrePage />;
  // tela de inicialização uma vez por sessão do navegador (aba nova = splash de novo)
  if (!splashJaExibido()) return <SplashPage />;
  return localStorage.getItem('quest_user_name') ? <DashboardPage /> : <LoginPage />;
}

export default function App() {
  return <Suspense fallback={null}>{escolherPagina()}</Suspense>;
}
