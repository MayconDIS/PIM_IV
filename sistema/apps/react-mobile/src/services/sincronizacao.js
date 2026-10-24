/**
 * Progresso do aluno no app e sincronização com a API.
 *
 * Tudo é salvo primeiro no aparelho; depois o app tenta enviar para a API.
 * Sem internet, o envio entra numa fila e sai na próxima sincronização.
 * Regras de SM-2, prêmio e nível vêm do @nexti/shared, as mesmas do site.
 */
import { aplicarResposta, estadoDaCarta, qualidadeSm2 } from '@nexti/shared/sm2';
import { FASES_INICIAIS, isTeste, nivelPorXp, proximaFase, recompensa } from '@nexti/shared/gamificacao';
import { ErroDaApi, ErroDeRede } from './api.js';

// Função, não constante: cada usuário precisa de listas próprias (um objeto
// compartilhado faria a fila de um usuário aparecer para o outro).
const estadoVazio = () => ({ srs: {}, liberadas: [...FASES_INICIAIS], xp: 0, moedas: 0, nivel: 1, fila: [] });

const DIA_EM_MS = 86400000;

export function criarSincronizador({ api, armazenamento, username, agora = () => Date.now() }) {
  const chave = `nexti_estado_${username}`;
  let estado = estadoVazio();

  const salvar = () => armazenamento.gravar(chave, estado);

  /**
   * Envia agora e devolve a resposta da API; se não houver internet, guarda na fila
   * e devolve null. Sessão expirada sobe como erro.
   */
  async function enviarOuEnfileirar(item) {
    let resposta = null;
    try {
      resposta = await enviar(item);
    } catch (erro) {
      if (erro instanceof ErroDeRede) {
        if (item.tipo === 'stats') estado.fila = estado.fila.filter((i) => i.tipo !== 'stats');
        estado.fila.push(item);
      } else if (erro instanceof ErroDaApi && erro.status === 401) {
        estado.fila.push(item);
        await salvar();
        throw erro;
      }
      // Outros erros da API (ex.: 400) não adiantam repetir: o item é descartado.
    }
    await salvar();
    return resposta;
  }

  function enviar(item) {
    if (item.tipo === 'resposta') return api.registrarResposta(item.flashcardId, item.qualidade);
    if (item.tipo === 'fase') return api.concluirFase(item.faseId);
    // 'stats': itens antigos que ainda estejam na fila de algum aparelho.
    return api.atualizarStats(item.xp, item.moedas, item.nivel);
  }

  return {
    get estado() {
      return estado;
    },

    /** Carrega o que está salvo no aparelho. */
    async carregar() {
      estado = { ...estadoVazio(), ...((await armazenamento.ler(chave)) ?? {}) };
      return estado;
    },

    /**
     * Sincroniza nos dois sentidos: envia a fila pendente e depois traz da API
     * XP, moedas, nível e o progresso SM-2 de cada carta.
     */
    async sincronizar() {
      const pendentes = estado.fila;
      estado.fila = [];
      for (let i = 0; i < pendentes.length; i += 1) {
        try {
          await enviar(pendentes[i]);
        } catch (erro) {
          if (erro instanceof ErroDeRede || (erro instanceof ErroDaApi && erro.status === 401)) {
            estado.fila = [...pendentes.slice(i), ...estado.fila];
            await salvar();
            throw erro;
          }
        }
      }

      const perfil = await api.perfil(username);
      estado.xp = Math.max(estado.xp, perfil.xp);
      estado.moedas = perfil.moedas;
      estado.nivel = Math.max(estado.nivel, perfil.nivel);

      for (const p of await api.progresso()) {
        estado.srs[p.flashcardId] = {
          rep: p.repeticoes,
          interval: p.intervaloDias,
          ease: p.fatorFacilidade,
          next: new Date(p.dataProximaRevisao).getTime(),
        };
      }
      await salvar();
      return estado;
    },

    /** Cartas da fase, as vencidas ou nunca vistas primeiro. */
    ordenarCartas(cartas) {
      const momento = agora();
      const devida = (c) => (estado.srs[c.id]?.next ?? 0) <= momento;
      return [...cartas.filter(devida), ...cartas.filter((c) => !devida(c))];
    },

    /** Registra a resposta a uma carta: atualiza o SM-2 local e envia para a API. */
    async responder(carta, resultado) {
      estado.srs[carta.id] = aplicarResposta(estadoDaCarta(estado.srs, carta.id), resultado, agora());
      await enviarOuEnfileirar({ tipo: 'resposta', flashcardId: carta.id, qualidade: qualidadeSm2(resultado) });
      return estado.srs[carta.id];
    },

    /**
     * Fecha a fase: mostra o prêmio na hora (mesma tabela da API), libera a próxima e
     * avisa a API, que calcula o prêmio e devolve os totais. Sem internet, o aviso vai
     * para a fila e o servidor paga quando ele chegar.
     */
    async concluirFase(faseId) {
      const premio = recompensa(faseId);
      estado.xp += premio.xp;
      estado.moedas += premio.moedas;
      estado.nivel = Math.max(estado.nivel, nivelPorXp(estado.xp));
      // O app não tem os testes de módulo (ficam no site): pula direto para a fase seguinte.
      let seguinte = proximaFase(faseId);
      if (seguinte && isTeste(seguinte)) seguinte = proximaFase(seguinte);
      if (seguinte && !estado.liberadas.includes(seguinte)) estado.liberadas.push(seguinte);
      const doServidor = await enviarOuEnfileirar({ tipo: 'fase', faseId });
      if (doServidor) {
        estado.xp = doServidor.xp;
        estado.moedas = doServidor.moedas;
        estado.nivel = Math.max(estado.nivel, doServidor.nivel);
        await salvar();
      }
      return { premio, seguinte };
    },

    /** Quantas cartas o aluno tem para revisar hoje. */
    cartasParaHoje() {
      const fimDoDia = agora() + DIA_EM_MS;
      return Object.values(estado.srs).filter((s) => s.next < fimDoDia).length;
    },
  };
}
