/**
 * Ponto de entrada do @nexti/shared.
 *
 * Conteúdo e regras do Nex_TI em módulos ESM, para que apps/react-web e
 * apps/react-mobile mostrem exatamente o mesmo material e se comportem da
 * mesma forma. A API C# recebe o mesmo conteúdo pela semente gerada com
 * `npm run seed:api`.
 *
 * `audio.js` e `confetti.js` tocam em window/localStorage ao carregar, por isso
 * NÃO são reexportados aqui: o app web importa `@nexti/shared/audio` e
 * `@nexti/shared/confetti` diretamente, e o mobile segue sem eles.
 */

export {
  BANCO_DE_DADOS,
  MODULOS,
  FASES,
  BONUS,
  TESTES,
  FRASES_MOTIVACIONAIS,
  cardsDaFase,
  moduloDaFase,
} from './content.js';

export {
  ESTADO_INICIAL,
  RESPOSTAS,
  formatarIntervalo,
  estadoDaCarta,
  previsoes,
  aplicarResposta,
  devolveParaRevisao,
  qualidadeSm2,
  somDaResposta,
} from './sm2.js';

export { ApiService } from './api.js';

export {
  LETRAS,
  QUESTOES_POR_TESTE,
  embaralhar,
  montarDeckDaFase,
  montarTesteDoModulo,
  fasesDoModulo,
  isCartaEnade,
} from './deck.js';

export {
  ORDEM_FASES,
  FASES_INICIAIS,
  RANKS,
  isTeste,
  isBonus,
  progressoDeNivel,
  nivelPorXp,
  corteDoTeste,
  aproveitamento,
  passouNoTeste,
  recompensa,
  proximaFase,
  liberaCertificado,
  podeComprarBonus,
} from './gamificacao.js';

export { PERGUNTAS_DIAGNOSTICO, resultadoDoDiagnostico } from './diagnostico.js';
