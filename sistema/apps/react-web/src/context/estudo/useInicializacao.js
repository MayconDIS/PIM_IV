import { useEffect, useRef } from 'react';
import { ApiService, ORDEM_FASES } from '@nexti/shared';
import { leJson, rotuloDoNivelDaApi } from './apoio.js';

/**
 * Ao abrir o painel: confere se a API está no ar, traz XP, moedas, nível e o SM-2
 * do aluno, pede o nivelamento na primeira vez e restaura o modal ou a fase abertos.
 */
export function useInicializacao({ nomeUsuario, userKey, progresso, ui, sessao }) {
  const inicializado = useRef(false);
  useEffect(() => {
    if (inicializado.current) return; // StrictMode monta duas vezes em dev
    inicializado.current = true;

    (async () => {
      let online = false;
      try {
        online = Boolean(await ApiService.checkStatus());
      } catch {
        online = false;
      }
      progresso.definirApiOnline(online);

      if (online && nomeUsuario !== 'Desenvolvedor' && nomeUsuario !== 'Admin') {
        try {
          const usuario = await ApiService.getUsuario(nomeUsuario);
          if (usuario) {
            progresso.setXp(usuario.xp);
            progresso.setMoedas(usuario.moedas);
            progresso.definirRank(rotuloDoNivelDaApi(usuario.nivel));
          }
        } catch {
          /* segue com o que está salvo localmente */
        }

        try {
          const remoto = await ApiService.getProgressoUsuario();
          if (remoto?.length) {
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
      }

      if (!localStorage.getItem(`${userKey}nivelado`)) {
        ui.setModal('modalNivelamento');
        return;
      }

      const ativo = leJson(`${userKey}active_state`, null);
      if (ativo?.type === 'modal' && ativo.id !== 'modalCertificado') ui.setModal(ativo.id);
      else if (ativo?.type === 'aula' && ORDEM_FASES.concat(progresso.bonusDesbloqueados).includes(ativo.id)) {
        sessao.carregarAula(ativo.id, ativo.title);
      }
    })();
    // Roda uma vez só, ao montar o painel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
