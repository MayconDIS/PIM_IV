/**
 * Diagnóstico de nivelamento — porte do "SISTEMA DE NIVELAMENTO ENADE"
 * do dashboard vanilla original.
 *
 * São as 10 perguntas do primeiro acesso e a regra que, conforme os acertos,
 * define o rank inicial e quais fases já começam liberadas.
 */

import { ORDEM_FASES, isTeste } from './gamificacao.js';

export const PERGUNTAS_DIAGNOSTICO = Object.freeze([
  { p: '1. Python: O que é um Dicionário?', r: ['Uma lista de palavras.', "Estrutura baseada em 'Chave: Valor'.", 'Um laço de repetição.'], certa: 1 },
  { p: '2. Segurança: O que é Phishing?', r: ['Ataque via e-mail falso.', 'Firewall físico.', 'Um tipo de vírus de pendrive.'], certa: 0 },
  { p: '3. Dados: Qual a principal diferença de uma Fila para uma Pilha?', r: ['Fila é LIFO, Pilha é FIFO.', 'Fila é FIFO (Primeiro a entrar, primeiro a sair).', 'Pilhas são maiores.'], certa: 1 },
  { p: '4. Redes: Para que serve o HTTPS?', r: ['Limpar o cache.', 'Conectar o banco de dados.', 'Navegação web segura com criptografia.'], certa: 2 },
  { p: '5. Banco de Dados: O que é a Chave Estrangeira (FK)?', r: ['Senha do admin.', 'Vínculo de referência com a Chave Primária de outra tabela.', 'Arquivo JSON.'], certa: 1 },
  { p: '6. POO (C#): O que é Polimorfismo?', r: ['Múltiplas formas de um método.', 'Esconder código.', 'Limpar memória.'], certa: 0 },
  { p: "7. UX/UI: O que significa 'Mobile First'?", r: ['Criar o app apenas para Android.', 'Desenhar focando primeiro na tela do celular.', 'Obrigar login.'], certa: 1 },
  { p: '8. Frameworks: O que é um ORM (ex: Entity Framework)?', r: ['Mapeia dados relacionais para objetos da programação.', 'Deleta vírus.', 'Uma linguagem front-end.'], certa: 0 },
  { p: '9. Nuvem: O que faz o Docker?', r: ['Acelerar o WiFi.', 'Empacotar sistemas em contêineres isolados.', 'Conecta impressoras.'], certa: 1 },
  { p: '10. Mobile: O que é o SDK?', r: ['Software Development Kit (Kit de ferramentas para criar apps).', 'Um banco de dados.', 'Cabo USB.'], certa: 0 },
]);

/**
 * Converte os acertos do diagnóstico em ponto de partida da trilha.
 * 0–3: só a Fase 01; 4–7: Módulos 01 e 02; 8–10: todas as fases regulares.
 */
export function resultadoDoDiagnostico(acertos) {
  if (acertos <= 3) {
    return {
      status: 'Ingressante',
      rotuloRank: 'Rank: Ingressante',
      nivel: 1,
      fases: ['fase1'],
      mensagem: 'Vamos focar na base do Módulo 01!',
    };
  }
  if (acertos <= 7) {
    return {
      status: 'Intermediário',
      rotuloRank: 'Rank: Intermediário',
      nivel: 3,
      fases: ORDEM_FASES.slice(0, ORDEM_FASES.indexOf('teste-mod2') + 1),
      mensagem: 'Os Módulos 01 e 02 estão abertos!',
    };
  }
  return {
    status: 'Expert Universitário',
    rotuloRank: 'Rank: Expert',
    nivel: 6,
    fases: [...ORDEM_FASES],
    mensagem: `Todas as ${ORDEM_FASES.filter((f) => !isTeste(f)).length} fases regulares estão abertas!`,
  };
}
