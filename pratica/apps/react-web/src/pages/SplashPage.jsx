import React, { useEffect, useState } from 'react';
import '@nexti/shared/css/splash.css';
import { ApiService } from '@nexti/shared';
import { CHAVE_SPLASH_EXIBIDO } from '../lib/sessao';

/** Porte de apps/web/index.html + splash.js: tela de inicialização do sistema. */
const LOGS = [
  '> Estabelecendo conexão...',
  '> Carregando módulos de segurança...',
  '> Montando banco de dados (SQL)...',
  '> Injetando dependências POO...',
  '> Verificando heurísticas de UI...',
  '> Autenticação pronta. Redirecionando...',
];

const DURACAO_MS = 4000;
const INTERVALO_LOG_MS = 600;

export default function SplashPage() {
  const [passo, setPasso] = useState(0);

  useEffect(() => {
    document.title = 'Nex_TI - Iniciando Sistema...';

    // Acorda a API (App Service + Azure SQL gratuitos dormem quando ociosos)
    // enquanto a animação roda; o resultado não importa aqui.
    ApiService.checkStatus().catch(() => {});

    const log = setInterval(() => setPasso((p) => Math.min(p + 1, LOGS.length - 1)), INTERVALO_LOG_MS);
    const fim = setTimeout(() => {
      try {
        sessionStorage.setItem(CHAVE_SPLASH_EXIBIDO, 'true');
      } catch {
        /* sem sessionStorage o splash aparece de novo no próximo carregamento */
      }
      // recarrega para que só o CSS da próxima página fique ativo (splash.css redefine <body>)
      window.location.reload();
    }, DURACAO_MS);

    return () => {
      clearInterval(log);
      clearTimeout(fim);
    };
  }, []);

  return (
    <main role="main" aria-label="Ecrã de inicialização do sistema">
      <section className="splash-container" aria-live="polite" aria-atomic="true">
        <h1 className="splash-text glitch">
          [ SISTEMA ] Inicializando Nex_TI<span className="cursor" aria-hidden="true">_</span>
        </h1>

        <div className="progress-bar-container" aria-hidden="true">
          <div className="progress-bar" />
        </div>

        <div className="status-text" aria-hidden="true">{LOGS[passo]}</div>

        <p className="sr-only">
          Aguarde. O sistema está a carregar módulos e irá redirecionar para o ecrã de autenticação em instantes.
        </p>
      </section>
    </main>
  );
}
