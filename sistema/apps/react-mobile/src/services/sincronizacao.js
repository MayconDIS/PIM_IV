/**
 * Progresso do aluno no app e sincronização com a API.
 *
 * Tudo é salvo primeiro no aparelho; depois o app tenta enviar para a API.
 * Sem internet, o envio entra numa fila e sai na próxima sincronização.
 * Regras de SM-2, prêmio e nível vêm do @nexti/shared, as mesmas do site.
 */
import { aplicarResposta, estadoDaCarta, qualidadeSm2 } from '@nexti/shared/sm2';
import { FASES_INICIAIS, fasesDisponiveis, fasesLiberadasNoServidor, isTeste, nivelPorXp, preservarFasesLiberadas, proximaFase, recompensa } from '@nexti/shared/gamificacao';
import { ErroDaApi, ErroDeRede } from './api.js';

// Função, não constante: cada usuário precisa de listas próprias (um objeto
// compartilhado faria a fila de um usuário aparecer para o outro).
const estadoVazio = () => ({ srs: {}, liberadas: [...FASES_INICIAIS], xp: 0, moedas: 0, nivel: 1, fila: [], perfil: 'Aluno' });

const DIA_EM_MS = 86400000;

export function criarSincronizador({ api, armazenamento, username, perfil, novoLogin = false, agora = () => Date.now() }) {
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

    // Acesso de Admin/Tutor não entra em estado.liberadas: voltar a Aluno restaura os bloqueios.
    get fasesDisponiveis() {
      return fasesDisponiveis(estado.liberadas, estado.perfil);
    },

    /** Carrega o que está salvo no aparelho. */
    async carregar() {
      const salvo = (await armazenamento.ler(chave)) ?? {};
      estado = { ...estadoVazio(), ...salvo };
      // Uma sessão restaurada pode ter um perfil anterior ao último sincronismo.
      // Só um login novo ou a ausência de perfil salvo dá prioridade à sessão.
      if (perfil !== undefined && (novoLogin || salvo.perfil === undefined)) estado.perfil = perfil;
      estado.liberadas = preservarFasesLiberadas(estado.liberadas);
      if (novoLogin) await salvar();
      return estado;
    },

    /**
     * Sincroniza nos dois sentidos: envia a fila pendente e depois traz da API
     * XP, moedas, nível, o progresso SM-2 de cada carta e as fases liberadas.
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

      // A fila já foi enviada: o servidor tem a palavra final sobre XP e moedas (uma revisão feita
      // sem internet mostra o prêmio no aparelho, mas a API não paga de novo).
      const perfil = await api.perfil(username);
      estado.xp = perfil.xp;
      estado.moedas = perfil.moedas;
      estado.nivel = Math.max(estado.nivel, perfil.nivel);
      estado.diagnostico = perfil.diagnostico ?? null;
      estado.perfil = perfil.perfil ?? 'Aluno';

      const progresso = await api.progresso();
      for (const p of progresso) {
        estado.srs[p.flashcardId] = {
          rep: p.repeticoes,
          interval: p.intervaloDias,
          ease: p.fatorFacilidade,
          next: new Date(p.dataProximaRevisao).getTime(),
        };
      }
      // Continuar de outro aparelho: as fases liberadas também vêm do servidor (o app não tem os testes).
      const doServidor = fasesLiberadasNoServidor({ nivel: estado.nivel, progresso,
        diagnostico: estado.diagnostico, fasesConcluidas: perfil.fasesConcluidas ?? [], pularTestes: true });
      estado.liberadas = preservarFasesLiberadas([...estado.liberadas, ...doServidor]);
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
     * Fecha a fase: libera a próxima e avisa a API, que paga o prêmio só na primeira vez e
     * devolve o que pagou e os totais. Sem internet, mostra o prêmio pela mesma tabela da API,
     * o aviso vai para a fila e o servidor paga (ou não, se for revisão) quando ele chegar.
     */
    async concluirFase(faseId) {
      let premio = recompensa(faseId);
      estado.xp += premio.xp;
      estado.moedas += premio.moedas;
      estado.nivel = Math.max(estado.nivel, nivelPorXp(estado.xp));
      // O app não tem os testes de módulo (ficam no site): pula direto para a fase seguinte.
      let seguinte = proximaFase(faseId);
      if (seguinte && isTeste(seguinte)) seguinte = proximaFase(seguinte);
      if (seguinte && !estado.liberadas.includes(seguinte)) estado.liberadas.push(seguinte);
      const doServidor = await enviarOuEnfileirar({ tipo: 'fase', faseId });
      if (doServidor) {
        // A API paga só na primeira conclusão: numa revisão o prêmio vem zerado.
        if (doServidor.premio) premio = doServidor.premio;
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
