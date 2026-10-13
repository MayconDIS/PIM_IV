import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// URL da API C# em produção (Azure App Service). Sem ela, o ApiService procura a API em localhost.
if (import.meta.env.VITE_API_URL) globalThis.NEXTI_API_URL = import.meta.env.VITE_API_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
