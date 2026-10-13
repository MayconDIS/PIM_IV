/**
 * Montagem dos decks de estudo.
 *
 * Porte fiel da função `carregarAula` do dashboard vanilla original:
 * fases ordenam cartas novas/devidas antes das já revisadas, e testes de módulo
 * sorteiam 20 questões de múltipla escolha com distratores tirados do próprio
 * módulo. `aleatorio` é injetável para que os testes sejam determinísticos.
 */

import { BANCO_DE_DADOS, MODULOS } from './content.js';

export const LETRAS = Object.freeze(['A', 'B', 'C', 'D']);
export const QUESTOES_POR_TESTE = 20;

/** Embaralhamento Fisher-Yates, sobre uma cópia da lista. */
export function embaralhar(lista, aleatorio = Math.random) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Deck de uma fase: cartas nunca vistas ou com revisão vencida primeiro,
 * cada grupo embaralhado à parte.
 */
export function montarDeckDaFase(cards, srsData = {}, agora = Date.now(), aleatorio = Math.random) {
  const novasOuDevidas = [];
  const revisadas = [];

  for (const carta of cards) {
    const progresso = srsData[carta.frente];
    if (!progresso || progresso.next <= agora) novasOuDevidas.push(carta);
    else revisadas.push(carta);
  }

  return [...embaralhar(novasOuDevidas, aleatorio), ...embaralhar(revisadas, aleatorio)];
}

/** Fases que compõem o teste de um módulo. */
export function fasesDoModulo(testeId, modulos = MODULOS) {
  const numero = Number(String(testeId).replace('teste-mod', ''));
  const modulo = modulos.find((m) => m.numero === numero);
  return modulo ? modulo.fases.map((f) => f.id) : [];
}

/**
 * Deck de um teste de módulo: até 20 cartas sorteadas entre as fases do módulo,
 * cada uma virando múltipla escolha com até 3 distratores de outras cartas.
 */
export function montarTesteDoModulo(testeId, { banco = BANCO_DE_DADOS, modulos = MODULOS, aleatorio = Math.random } = {}) {
  const todosCards = fasesDoModulo(testeId, modulos).flatMap((faseId) => banco[faseId] ?? []);
  if (!todosCards.length) return [];

  const restantes = [...todosCards];
  const sorteadas = [];
  const total = Math.min(QUESTOES_POR_TESTE, todosCards.length);
  for (let i = 0; i < total; i += 1) {
    const indice = Math.floor(aleatorio() * restantes.length);
    sorteadas.push(restantes.splice(indice, 1)[0]);
  }

  const questoes = sorteadas.map((card) => {
    const correta = card.verso;
    const outros = [...new Set(todosCards.filter((c) => c.verso !== correta).map((c) => c.verso))];

    const distratores = [];
    for (let i = 0; i < 3 && outros.length; i += 1) {
      distratores.push(outros.splice(Math.floor(aleatorio() * outros.length), 1)[0]);
    }

    const alternativas = embaralhar([correta, ...distratores], aleatorio);

    return {
      id: card.id ?? null,
      frente: card.frente,
      verso: card.verso,
      dica: card.dica,
      opcoes: alternativas.map((alt, i) => `${LETRAS[i]}) ${alt}`),
      correta: alternativas.indexOf(correta),
    };
  });

  return embaralhar(questoes, aleatorio);
}

/** Uma carta é de múltipla escolha (estilo ENADE) quando tem alternativas. */
export const isCartaEnade = (carta) => Boolean(carta?.opcoes?.length);
