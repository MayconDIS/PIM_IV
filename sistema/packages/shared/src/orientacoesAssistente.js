/** Orientações locais conferidas com os fluxos e regras do Nex_TI. */
export const ORIENTACOES_ASSISTENTE = [
  {
    titulo: 'Trilha por módulos',
    perguntas: ['Onde fica a trilha?', 'Como estudar as disciplinas?', 'Onde encontro os resumos?', 'Como passar de módulo?', 'Como estudar as disciplinas dos quatro módulos?'],
    texto: 'Abra o menu e escolha Trilha, abaixo de Mapa Neural. Os quatro módulos mostram as disciplinas, seus resumos, materiais de referência e flashcards. As fases e os testes liberam as próximas etapas; resumos podem ser consultados antes. As disciplinas complementares anteriores foram mantidas. O preparatório ENADE tem um módulo próprio após os quatro módulos. O progresso indica as disciplinas com todas as cartas estudadas, não a aprovação acadêmica da faculdade.',
  },
  {
    titulo: 'Revisão espaçada (SM-2)',
    perguntas: ['Como funciona o SM-2?', 'Como revisar os flashcards?', 'O que significam De novo Difícil Bom Fácil?'],
    texto: 'Depois de revelar a resposta da carta, escolha De novo, Difícil, Bom ou Fácil conforme sua lembrança. O SM-2 usa essa resposta para agendar a próxima revisão. A trilha prioriza cartas novas ou com revisão vencida. Revisar uma fase já concluída atualiza as revisões, sem repetir o prêmio de XP e moedas.',
  },
  {
    titulo: 'XP e moedas',
    perguntas: ['Como ganhar XP?', 'Como ganhar moedas?', 'Por que não ganhei XP ao revisar?', 'Como subir de nível?', 'Pontos de experiência'],
    texto: 'Conclua as fases e os testes da trilha. A API calcula XP e moedas conforme a recompensa de cada etapa e paga só na primeira conclusão. Revisões posteriores contam para o SM-2, sem prêmio repetido. As moedas compram fases bônus; o XP contribui para o seu rank. Consulte a recompensa indicada na fase.',
  },
  {
    titulo: 'Preparação para o ENADE',
    perguntas: ['Como usar o ENADE?', 'Onde estão as provas oficiais?', 'Como estudar para o ENADE?', 'Guia de estudos ENADE'],
    texto: 'O módulo 5 reúne o preparatório ENADE. A fase 23 traz o guia de estudos; as fases 24 e 25 usam questões das provas oficiais de ADS de 2017 e 2021. Leia o enunciado, escolha uma alternativa e confira a explicação. O teste do módulo 5 exige 80% de acertos; os demais testes exigem 70%.',
  },
  {
    titulo: 'Minha Conta',
    perguntas: ['Como trocar minha senha?', 'Como mudar meu email?', 'Onde fica Minha Conta?', 'Como baixar meus dados?', 'Como excluir minha conta?'],
    texto: 'Abra o menu de hambúrguer e escolha Minha Conta. Com a API disponível, você pode alterar e-mail ou senha, baixar seus dados e excluir a conta. Alterações e exclusão pedem a senha atual. Ao trocar a senha, entre novamente. O último Administrador precisa definir outro Admin antes de excluir a própria conta. Não informe senhas neste chat.',
  },
  {
    titulo: 'Limpar Dados',
    perguntas: ['O que Limpar Dados faz?', 'Como limpar dados do navegador?', 'Limpar dados apaga minha conta?'],
    texto: 'Limpar Dados remove as informações locais desta conta neste navegador, como preferências de estudo, avatar e desenho do mapa. Os dados salvos no servidor voltam ao recarregar. Essa opção não exclui a conta. Para isso, use Minha Conta e a opção Excluir minha conta.',
  },
  {
    titulo: 'Trilha e diagnóstico',
    perguntas: ['Como desbloquear fases?', 'Como refazer diagnóstico?', 'Como funciona o nivelamento?', 'Por onde começar?', 'Como liberar módulos?'],
    texto: 'O diagnóstico inicial tem 10 perguntas e define o ponto de partida. Depois, concluir etapas libera a próxima na trilha. Para repetir o diagnóstico, abra o menu e escolha Refazer Diagnóstico. Uma fase liberada ainda não significa que todas as suas cartas foram estudadas. Fases bônus são compradas com moedas.',
  },
  {
    titulo: 'Minhas Estatísticas',
    perguntas: ['Como ver meu progresso?', 'Onde vejo minhas estatísticas?', 'Quantas cartas eu estudei?', 'Qual meu XP?'],
    texto: 'Abra Minhas Estatísticas no menu ou Estatísticas na barra do celular. Ali você vê XP, moedas, cartas estudadas, revisões e o progresso dos módulos. Este assistente consulta materiais de estudo e orientações; ele não lê os dados da sua conta.',
  },
  {
    titulo: 'Mapa Neural',
    perguntas: ['Como usar o Mapa Neural?', 'Como centralizar o mapa?', 'Onde fica a câmera do mapa?'],
    texto: 'Abra Mapa Neural pelo menu ou Mapa na barra do celular. Use os controles da câmera para aproximar, afastar e centralizar o desenho. Eles ficam no canto superior esquerdo no celular e no inferior esquerdo no computador.',
  },
  {
    titulo: 'Acessibilidade',
    perguntas: ['Como aumentar o texto?', 'Como diminuir o texto?', 'Como ativar alto contraste?', 'Onde está o VLibras?', 'Recursos de acessibilidade'],
    texto: 'No menu, abra Acessibilidade: A- diminui o texto, A+ aumenta e o botão de contraste alterna o alto contraste. No computador, o VLibras fica disponível pelo botão azul flutuante. No celular, esse botão fica oculto para deixar espaço para o estudo.',
  },
  {
    titulo: 'Estudo sem conexão',
    perguntas: ['Posso estudar sem internet?', 'Como funciona o modo offline?', 'API indisponível'],
    texto: 'No site já carregado, o assistente consulta os materiais locais sem enviar perguntas. O estudo pode usar cartas locais quando a API está indisponível e a sessão já está salva, mas o site não reenvia automaticamente respostas que falharam. O app Expo tem uma fila própria para sincronizar respostas depois. Cadastro e login precisam da API.',
  },
  {
    titulo: 'Criar Carta',
    perguntas: ['Como criar um flashcard?', 'Como criar carta?', 'Como editar ou excluir cartas?'],
    texto: 'Use Criar Carta no cabeçalho do computador ou na barra do celular. Escolha a fase e preencha pergunta, resposta e dica. O Aluno pode criar cartas; Tutor e Admin podem editar ou excluir conteúdo pelo painel de gerenciamento. O assistente pesquisa o material incluído no site, não as cartas criadas depois na API.',
  },
  {
    titulo: 'Foto do perfil',
    perguntas: ['Como mudar meu avatar?', 'Como trocar foto de perfil?'],
    texto: 'Toque no avatar do painel ou do menu e escolha uma imagem. Em Enquadrar foto, posicione a imagem, ajuste o zoom e escolha Usar foto. Ela fica guardada somente neste navegador para esta conta.',
  },
  {
    titulo: 'Sobre o Nexor',
    perguntas: ['Qual é seu nome?', 'Quem é o Nexor?', 'O que você faz?', 'Como funciona este assistente?', 'Como usar o chatbot?', 'Você usa inteligência artificial?', 'As conversas ficam salvas?', 'Preciso de ajuda'],
    texto: 'Sou o Nexor, assistente de estudos do Nex_TI. Meu nome une Nex_TI e Tutor. Busco trechos das cartas incluídas no projeto e orientações sobre a plataforma. Não uso IA generativa nem um serviço externo. Cada resposta mostra sua fonte. Não consulto sua conta nem executo ações. A conversa fica apenas na memória desta tela: você pode limpá-la, e ela desaparece ao recarregar ou sair. Faça uma pergunta por vez, citando o assunto.',
  },
];
