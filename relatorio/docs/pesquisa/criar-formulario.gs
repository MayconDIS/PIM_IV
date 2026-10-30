/**
 * Cria no Google Forms a pesquisa do Nex_TI (PIM IV), com as seções, a navegação entre
 * elas e uma planilha de respostas ligada ao formulário.
 *
 * Como usar (uma vez só):
 *   1. Abra https://script.google.com com a conta da equipe e clique em "Novo projeto".
 *   2. Apague o que vier no editor, cole este arquivo inteiro e salve.
 *   3. Escolha a função criarFormulario e clique em "Executar"; autorize o acesso pedido.
 *   4. Em "Registro de execução" aparecem os links: o de responder (para divulgar),
 *      o de editar e o da planilha de respostas.
 *
 * Tem perguntas quantitativas (escolhas, escalas, nota SUS e recomendação de 0 a 10) e
 * qualitativas (respostas abertas, várias delas pedindo o "por quê" de uma nota).
 * As perguntas são as mesmas de QUESTIONARIO.md. Os títulos das perguntas são lidos pelo
 * analisar-respostas.mjs: mudou um título aqui, mude lá também.
 */
function criarFormulario() {
  const form = FormApp.create('Pesquisa Nex_TI — PIM IV');
  form.setDescription(
    'Somos alunos de Análise e Desenvolvimento de Sistemas (UNIP) e criamos o Nex_TI, uma plataforma ' +
    'para estudar TI com flashcards, revisão espaçada e provas do ENADE: https://nexti-pim-iv.vercel.app\n\n' +
    'Suas respostas ajudam a melhorar o sistema, o relatório e a apresentação do nosso Projeto Integrado ' +
    'Multidisciplinar (PIM IV). Leva cerca de 5 minutos.');
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setConfirmationMessage('Obrigado por responder! Sua opinião vai direto para o projeto.');

  // ---- Consentimento (LGPD) ----
  form.addSectionHeaderItem()
    .setTitle('Antes de começar')
    .setHelpText('A pesquisa é anônima e voluntária: não pedimos nome, e-mail nem RA. As respostas são usadas ' +
      'só no PIM IV, em números somados, e você pode parar a qualquer momento.');
  const consentimento = form.addMultipleChoiceItem()
    .setTitle('Você concorda em participar da pesquisa?')
    .setRequired(true);

  // ---- Perfil ----
  const paginaPerfil = form.addPageBreakItem().setTitle('Sobre você');
  form.addMultipleChoiceItem().setTitle('Qual é o seu curso?')
    .setChoiceValues(['Análise e Desenvolvimento de Sistemas', 'Outro curso de TI', 'Curso fora da TI', 'Não estou estudando'])
    .setRequired(true);
  form.addMultipleChoiceItem().setTitle('Em que semestre você está?')
    .setChoiceValues(['1º ou 2º', '3º ou 4º', '5º ou mais', 'Já me formei', 'Não se aplica'])
    .setRequired(true);
  form.addCheckboxItem().setTitle('Como você costuma estudar para as provas?')
    .setChoiceValues(['Relendo o material', 'Resumos', 'Flashcards', 'Exercícios e provas antigas', 'Vídeos', 'Em grupo', 'Quase não estudo'])
    .showOtherOption(true);
  form.addCheckboxItem().setTitle('O que mais atrapalha seus estudos?')
    .setChoiceValues(['Muitos termos técnicos', 'Falta de tempo', 'Esquecer o que estudei', 'Não saber por onde começar', 'Falta de motivação', 'Falta de acompanhamento'])
    .showOtherOption(true);
  form.addParagraphTextItem().setTitle('Conte com suas palavras como é estudar TI para você hoje.')
    .setHelpText('Pode ser uma dificuldade, um costume ou algo que funciona bem.');
  const usou = form.addMultipleChoiceItem()
    .setTitle('Você já usou o Nex_TI?')
    .setHelpText('Se ainda não usou, dá para abrir agora em https://nexti-pim-iv.vercel.app, criar uma conta e estudar uma fase.')
    .setRequired(true);

  // ---- Uso do Nex_TI ----
  const paginaUso = form.addPageBreakItem().setTitle('Usando o Nex_TI');
  form.addCheckboxItem().setTitle('Onde você usou o Nex_TI?')
    .setChoiceValues(['Site no computador', 'Site no celular', 'App de celular (Expo)'])
    .setRequired(true);
  form.addCheckboxItem().setTitle('O que você fez no Nex_TI?')
    .setChoiceValues(['Criei uma conta', 'Fiz o diagnóstico', 'Estudei uma fase', 'Fiz um teste de módulo ou simulado do ENADE',
      'Usei o Nexor (assistente)', 'Abri o Mapa Neural', 'Criei uma carta', 'Usei os recursos de acessibilidade']);
  form.addParagraphTextItem().setTitle('Qual foi sua primeira impressão ao usar o Nex_TI?');
  const sus = [
    'S1. Eu acho que gostaria de usar este sistema com frequência.',
    'S2. Eu achei o sistema desnecessariamente complexo.',
    'S3. Eu achei o sistema fácil de usar.',
    'S4. Eu acho que precisaria da ajuda de uma pessoa com conhecimentos técnicos para usar o sistema.',
    'S5. Eu achei que as várias funções do sistema estão bem integradas.',
    'S6. Eu achei que o sistema apresenta muita inconsistência.',
    'S7. Eu imagino que a maioria das pessoas aprenderia a usar este sistema rapidamente.',
    'S8. Eu achei o sistema muito complicado de usar.',
    'S9. Eu me senti muito confiante ao usar o sistema.',
    'S10. Eu precisei aprender várias coisas antes de conseguir usar o sistema.',
  ];
  form.addSectionHeaderItem().setTitle('Facilidade de uso')
    .setHelpText('Dez frases curtas (escala SUS). Marque de 1 (discordo totalmente) a 5 (concordo totalmente).');
  sus.forEach((frase) => form.addScaleItem().setTitle(frase).setBounds(1, 5)
    .setLabels('Discordo totalmente', 'Concordo totalmente').setRequired(true));

  // ---- Opinião e plano de negócios ----
  form.addPageBreakItem().setTitle('Sua opinião sobre o Nex_TI');
  form.addCheckboxItem().setTitle('Quais partes foram mais úteis para você?')
    .setChoiceValues(['Revisão espaçada das cartas', 'Trilha por disciplina', 'Simulados do ENADE', 'XP e moedas',
      'Diagnóstico', 'Nexor (assistente)', 'Mapa Neural', 'Estudar pelo celular']);
  form.addScaleItem().setTitle('O XP, as moedas e os níveis deixaram você com mais vontade de estudar?')
    .setBounds(1, 5).setLabels('Nada', 'Muito');
  form.addParagraphTextItem().setTitle('Conte uma situação em que o Nex_TI ajudou, ou não ajudou, nos seus estudos.');
  form.addParagraphTextItem().setTitle('O que faltou ou atrapalhou no Nex_TI?');
  form.addParagraphTextItem().setTitle('Se pudesse mudar uma coisa no Nex_TI, o que seria?');
  form.addMultipleChoiceItem().setTitle('Você pagaria por um plano individual do Nex_TI?')
    .setHelpText('O estudo básico continua gratuito. A pergunta ajuda a conferir o preço do nosso plano de negócios.')
    .setChoiceValues(['Não pagaria', 'Até R$ 4,90 por mês', 'R$ 9,90 por mês', 'Mais de R$ 9,90 por mês', 'Só se a faculdade pagasse']);
  form.addParagraphTextItem().setTitle('Por que você pagaria ou não pagaria?');
  form.addMultipleChoiceItem().setTitle('Como você prefere pagar uma assinatura?')
    .setChoiceValues(['Pix', 'Cartão de crédito', 'Cartão de débito', 'Boleto', 'Não pagaria']);
  form.addCheckboxItem().setTitle('Que tipo de oferta faria você assinar?')
    .setChoiceValues(['Teste grátis de 7 dias', 'Desconto no plano anual', 'Preço menor para a turma da faculdade',
      'Desconto por indicar um colega', 'Conteúdo extra para o ENADE', 'Nenhuma'])
    .showOtherOption(true);
  form.addCheckboxItem().setTitle('Onde você gostaria de ficar sabendo do Nex_TI?')
    .setChoiceValues(['Indicação de professor', 'Grupo da turma', 'Instagram', 'TikTok', 'YouTube', 'Site ou AVA da faculdade'])
    .showOtherOption(true);
  form.addScaleItem().setTitle('De 0 a 10, quanto você recomendaria o Nex_TI a um colega?')
    .setBounds(0, 10).setLabels('Não recomendaria', 'Recomendaria muito');
  form.addParagraphTextItem().setTitle('Por que você deu essa nota de recomendação?');

  // ---- Apresentação e relatório ----
  const paginaGate = form.addPageBreakItem().setTitle('Apresentação e relatório');
  const viu = form.addMultipleChoiceItem()
    .setTitle('Você assistiu à apresentação ou leu o relatório do Nex_TI?')
    .setRequired(true);
  const paginaApresentacao = form.addPageBreakItem().setTitle('Sobre a apresentação e o relatório');
  form.addScaleItem().setTitle('O projeto foi explicado de forma clara?')
    .setBounds(1, 5).setLabels('Nada claro', 'Muito claro');
  form.addMultipleChoiceItem().setTitle('O que achou do tempo da apresentação?')
    .setChoiceValues(['Curto demais', 'Adequado', 'Longo demais', 'Não assisti']);
  form.addCheckboxItem().setTitle('Que partes você gostaria de ver com mais detalhe?')
    .setChoiceValues(['O problema e os requisitos', 'Como cada disciplina foi usada', 'O sistema funcionando',
      'O plano de negócios', 'Os testes', 'A experiência da equipe']);
  form.addParagraphTextItem().setTitle('O que mais chamou sua atenção na apresentação ou no relatório?');
  form.addParagraphTextItem().setTitle('O que ficou confuso ou poderia melhorar na apresentação ou no relatório?');

  // ---- Final ----
  const paginaFinal = form.addPageBreakItem().setTitle('Para terminar');
  form.addParagraphTextItem().setTitle('Quer deixar mais algum comentário para a equipe?');

  // Navegação: quem não concorda termina; quem não usou o sistema pula para a apresentação;
  // quem não viu a apresentação nem o relatório vai para o final.
  consentimento.setChoices([
    consentimento.createChoice('Sim, concordo', paginaPerfil),
    consentimento.createChoice('Não', FormApp.PageNavigationType.SUBMIT),
  ]);
  usou.setChoices([
    usou.createChoice('Sim', paginaUso),
    usou.createChoice('Ainda não', paginaGate),
  ]);
  viu.setChoices([
    viu.createChoice('Sim', paginaApresentacao),
    viu.createChoice('Não', paginaFinal),
  ]);

  const planilha = SpreadsheetApp.create('Respostas — Pesquisa Nex_TI (PIM IV)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, planilha.getId());

  Logger.log('Link para responder (divulgar): ' + form.getPublishedUrl());
  Logger.log('Link para editar o formulário: ' + form.getEditUrl());
  Logger.log('Planilha de respostas: ' + planilha.getUrl());
}
