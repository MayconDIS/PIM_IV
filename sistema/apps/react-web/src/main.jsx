import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { instalarVLibras } from './lib/vlibras';

// O painel sempre reabre no topo. Desliga a posição salva antes de carregar sua página.
// As páginas institucionais mantêm a navegação normal, inclusive seus links com #seção.
try {
  if (localStorage.getItem('quest_user_name') && new URLSearchParams(location.search).get('pagina') !== 'sobre') {
    history.scrollRestoration = 'manual';
  }
} catch {
  // Navegadores que bloqueiam o armazenamento ainda podem abrir a tela de entrada.
}

// URL da API C# em produção (Azure App Service). Sem ela, o ApiService procura a API em localhost.
if (import.meta.env.VITE_API_URL) globalThis.NEXTI_API_URL = import.meta.env.VITE_API_URL;

instalarVLibras();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
