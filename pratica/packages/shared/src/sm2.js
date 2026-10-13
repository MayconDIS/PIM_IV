/**
 * Motor de repetição espaçada (SM-2, no estilo Anki) do Nex_TI.
 *
 * Porte fiel das funções `formatarIntervalo`, `gerarBotoesRepeticao` e
 * `processarResposta` de apps/web/pages/dashboard/js/app.js. As fórmulas e os
 * limites são os mesmos; aqui elas viram funções puras para que o web vanilla,
 * o react-web e o react-mobile cheguem sempre ao mesmo resultado.
 */

/** Estado inicial de uma carta nunca estudada. */
export const ESTADO_INICIAL = Object.freeze({ rep: 0, interval: 0, ease: 2.5, next: 0 });

/** As quatro respostas possíveis, na ordem em que aparecem na tela. */
export const RESPOSTAS = Object.freeze(['again', 'hard', 'good', 'easy']);

const DIA_EM_MS = 86400000;

/** Rótulo curto de um intervalo em dias: "<10m", "1d", "12d", "3m", "2a". */
export function formatarIntervalo(dias) {
  const d = Math.round(dias);
  if (d < 1) return '<10m';
  if (d === 1) return '1d';
  if (d < 30) return `${d}d`;
  if (d < 365) return `${Math.round(d / 30)}m`;
  return `${Math.round(d / 365)}a`;
}

/** Estado salvo de uma carta, com os padrões preenchidos. */
export function estadoDaCarta(srsData, idCarta) {
  return { ...ESTADO_INICIAL, ...(srsData?.[idCarta] ?? {}) };
}

/**
 * Previsões mostradas em cada botão antes de responder.
 * Cartas novas (rep 0) usam os rótulos fixos do vanilla.
 */
export function previsoes(estado = ESTADO_INICIAL) {
  if (!estado.rep) return { again: '<1m', hard: '<6m', good: '<10m', easy: '3d' };
  return {
    again: '<1m',
    hard: formatarIntervalo(Math.max(1, estado.interval * 1.2)),
    good: formatarIntervalo(Math.max(1, estado.interval * estado.ease)),
    easy: formatarIntervalo(Math.max(1, estado.interval * estado.ease * 1.3)),
  };
}

/**
 * Aplica uma resposta e devolve o novo estado, sem alterar o recebido.
 * `errei` e `acertei` são os apelidos usados pelas cartas de simulado ENADE.
 */
export function aplicarResposta(estado = ESTADO_INICIAL, resultado, agora = Date.now()) {
  const novo = { ...ESTADO_INICIAL, ...estado };

  switch (resultado) {
    case 'again':
    case 'errei':
      novo.rep = 0;
      novo.interval = 1;
      novo.ease = Math.max(1.3, novo.ease - 0.2);
      break;
    case 'hard':
      novo.interval = Math.max(1, Math.round(novo.interval * 1.2));
      novo.ease = Math.max(1.3, novo.ease - 0.15);
      novo.rep += 1;
      break;
    case 'good':
    case 'acertei':
      novo.interval = novo.rep === 0 ? 1 : Math.max(1, Math.round(novo.interval * novo.ease));
      novo.rep += 1;
      break;
    case 'easy':
      novo.interval = novo.rep === 0 ? 3 : Math.max(1, Math.round(novo.interval * novo.ease * 1.3));
      novo.ease += 0.15;
      novo.rep += 1;
      break;
    default:
      // 'proxima-teste' e qualquer outro valor não alteram o agendamento.
      return novo;
  }

  novo.next = agora + novo.interval * DIA_EM_MS;
  return novo;
}

/** true quando a resposta conta como erro e a carta volta para a fila do dia. */
export function devolveParaRevisao(resultado) {
  return resultado === 'again' || resultado === 'errei';
}

/** Tradução da resposta para a escala 0-5 que a API C# espera. */
export function qualidadeSm2(resultado) {
  if (resultado === 'again' || resultado === 'errei') return 1;
  if (resultado === 'hard') return 3;
  if (resultado === 'easy') return 5;
  return 4;
}

/** Som que cada resposta dispara, no mesmo mapeamento do vanilla. */
export function somDaResposta(resultado) {
  if (resultado === 'again' || resultado === 'errei') return 'playError';
  if (resultado === 'good' || resultado === 'acertei') return 'playCorrect';
  if (resultado === 'easy') return 'playUnlock';
  return 'playClick';
}
