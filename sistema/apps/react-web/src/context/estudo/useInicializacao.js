import { useEffect, useRef } from 'react';
import { ApiService, BONUS, ORDEM_FASES, fasesLiberadasNoServidor, temAcessoCompleto } from '@nexti/shared';
import { preservarFasesLiberadas } from '@nexti/shared/gamificacao';
import { leJson, rotuloDoNivelDaApi } from './apoio.js';
import { reenviarDiagnostico, guardarDiagnosticoLocal, lerDiagnosticoLocal } from '../../lib/diagnosticoLocal';

/**
 * Ao abrir o painel: confere se a API está no ar, traz XP, moedas, nível e o SM-2
 * do aluno, pede o nivelamento na primeira vez e restaura o modal ou a fase abertos.
 */
export function useInicializacao({ nomeUsuario, userKey, progresso, ui, sessao }) {
  const inicializado = useRef(false);
  useEffect(() => {
    if (inicializado.current) return; // StrictMode monta duas vezes em dev
    inicializado.current = true;
    progresso.setFasesDesbloqueadas((atual) => preservarFasesLiberadas(atual));

    (async () => {
      let perfil = progresso.perfil;
      let online = false;
      try {
        online = Boolean(await ApiService.checkStatus());
      } catch {
        online = false;
      }
      progresso.definirApiOnline(online);

      if (online && localStorage.getItem('quest_jwt_token')) {
        let nivelNoServidor = 1;
        let xpNoServidor = 0;
        let fasesConcluidas = [];
        let remoto = [];
        let diagnostico = progresso.diagnostico;
        try {
          const sincronizado = await reenviarDiagnostico(userKey);
          if (sincronizado) {
            diagnostico = sincronizado;
            progresso.setDiagnostico(sincronizado);
            ui.toast('success', 'Diagnóstico salvo', 'Seu resultado foi enviado para a conta.');
          }
        } catch {
          ui.toast('warning', 'Diagnóstico pendente', 'As respostas continuam neste navegador. Abra Refazer Diagnóstico para tentar salvar novamente.');
        }
        try {
          const usuario = await ApiService.getUsuario(nomeUsuario);
          if (usuario) {
            perfil = usuario.perfil ?? 'Aluno';
            progresso.definirPerfil(perfil);
            progresso.setXp(usuario.xp);
            progresso.setMoedas(usuario.moedas);
            progresso.definirRank(rotuloDoNivelDaApi(usuario.nivel));
            nivelNoServidor = usuario.nivel;
            xpNoServidor = usuario.xp;
            fasesConcluidas = usuario.fasesConcluidas ?? [];
            if (usuario.diagnostico) {
              // Um envio pendente mais recente continua visível até a sincronização terminar.
              diagnostico = usuario.diagnostico;
              if (!lerDiagnosticoLocal(userKey, 'diagnostico_pendente')) {
                const salvo = { ...diagnostico, sincronizacao: 'salvo' };
                progresso.setDiagnostico(salvo);
                guardarDiagnosticoLocal(userKey, salvo);
              }
            }
          }
        } catch {
          /* segue com o que está salvo localmente */
        }

        try {
          remoto = (await ApiService.getProgressoUsuario()) ?? [];
          if (remoto.length) {
            progresso.setSrsData((atual) => {
              const mesclado = { ...atual };
              remoto.forEach((p) => {
                if (!p.frente) return;
                mesclado[p.frente] = {
                  rep: p.repeticoes,
                  interval: p.intervaloDias,
                  ease: p.fatorFacilidade,
                  next: new Date(p.dataProximaRevisao).getTime(),
                };
              });
              return mesclado;
            });
          }
        } catch {
          /* idem */
        }

        // Continuar de outro aparelho: as fases liberadas também vêm do que está no servidor.
        const doServidor = fasesLiberadasNoServidor({ nivel: nivelNoServidor, diagnostico, progresso: remoto, fasesConcluidas });
        progresso.setFasesDesbloqueadas((atual) => preservarFasesLiberadas([...atual, ...doServidor]));
        // Quem já tem nível, XP ou progresso no servidor já fez o nivelamento (talvez em outro aparelho).
        if (diagnostico || nivelNoServidor > 1 || xpNoServidor > 0 || remoto.length) localStorage.setItem(`${userKey}nivelado`, 'true');
      }

      if (!temAcessoCompleto(perfil) && !localStorage.getItem(`${userKey}nivelado`)) {
        ui.setModal('modalNivelamento');
        return;
      }

      const ativo = leJson(`${userKey}active_state`, null);
      if (ativo?.type === 'modal' && ativo.id !== 'modalCertificado'
        && !(temAcessoCompleto(perfil) && ativo.id === 'modalNivelamento')) ui.setModal(ativo.id);
      else if (ativo?.type === 'aula' && ORDEM_FASES.concat(BONUS.map(bonus => bonus.id)).includes(ativo.id)) {
        sessao.carregarAula(ativo.id, ativo.title);
      }
    })();
    // Roda uma vez só, ao montar o painel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
