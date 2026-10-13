import React, { Suspense, lazy } from 'react';

/*
 * login.css e dashboard.css redefinem <body> de jeitos incompatíveis. Cada
 * página é carregada sob demanda e a troca entre elas recarrega a aba (como o
 * vanilla navegava entre login.html e dashboard), então só uma folha fica ativa.
 */
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

export default function App() {
  const logado = Boolean(localStorage.getItem('quest_user_name'));
  return <Suspense fallback={null}>{logado ? <DashboardPage /> : <LoginPage />}</Suspense>;
}
