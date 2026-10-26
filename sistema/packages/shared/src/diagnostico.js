import { MODULOS } from './content.js';
import { ORDEM_FASES } from './gamificacao.js';

/** Avaliação de estudo, separada de XP, rank, conclusão de fases e certificado. */
export const VERSAO_DIAGNOSTICO = 2;
export const PERGUNTAS_POR_MODULO = 5;
export const MINIMO_ACERTOS_POR_MODULO = 4;
const MODULOS_AVALIADOS = MODULOS.filter(modulo => modulo.numero <= 4);

function pergunta(faseId, p, r, certa, explicacao) {
  const modulo = MODULOS_AVALIADOS.find(item => item.fases.some(fase => fase.id === faseId));
  if (!modulo) throw new Error(`Disciplina fora do diagnóstico: ${faseId}`);
  return Object.freeze({ id: `diag-${faseId}`, modulo: modulo.numero, faseId, p, r: Object.freeze(r), certa, explicacao });
}

/** Uma pergunta autoral por disciplina dos quatro módulos; cinco são sorteadas por módulo. */
export const PERGUNTAS_DIAGNOSTICO = Object.freeze([
  pergunta('fase1', 'Antes de escrever um programa em Python, para que serve organizar um algoritmo?',
    ['Escolher automaticamente a melhor biblioteca.', 'Descrever os passos e as decisões da solução.', 'Garantir que nunca haverá erros de execução.', 'Substituir a necessidade de testar o programa.'], 1,
    'O algoritmo organiza a lógica da solução antes dos detalhes da linguagem. Ajuda a analisar os passos, mas não elimina os testes.'),
  pergunta('fase2', 'Se duas grandezas são diretamente proporcionais, o que ocorre com a segunda quando a primeira dobra?',
    ['Ela cai pela metade.', 'Ela aumenta sempre uma unidade.', 'Ela permanece igual.', 'Ela também dobra.'], 3,
    'Na proporcionalidade direta, a razão entre as grandezas permanece constante. Multiplicar uma por dois também multiplica a outra por dois.'),
  pergunta('fase3', 'Qual característica pertence à arquitetura de computadores, apresentada ao programador?',
    ['O conjunto de instruções executadas pelo processador.', 'A forma física de interligar os componentes na placa.', 'A implementação dos sinais de controle do processador.', 'A tecnologia usada na construção dos circuitos de memória.'], 0,
    'A arquitetura apresenta características que afetam a execução lógica, como instruções e endereçamento. A organização trata da implementação dessas características.'),
  pergunta('fase4', 'Uma pessoa altera notas de alunos sem autorização. Qual princípio de segurança foi diretamente comprometido?',
    ['Disponibilidade.', 'Portabilidade.', 'Integridade.', 'Escalabilidade.'], 2,
    'Integridade trata da correção e da proteção dos dados contra alterações indevidas. Confidencialidade trata do acesso; disponibilidade, do acesso quando necessário.'),
  pergunta('fase5', 'Uma equipe precisa escolher uma solução tecnológica. Qual atitude representa uma análise ética e sustentável?',
    ['Comparar custos, impactos sociais e ambientais e respeito aos direitos.', 'Considerar somente a velocidade de implantação.', 'Escolher sempre a opção mais recente, sem avaliar efeitos.', 'Tratar consequências sociais como responsabilidade exclusiva do usuário.'], 0,
    'A decisão ética considera interesses, direitos e consequências. Ganhos técnicos ou econômicos não dispensam a avaliação de impactos sociais e ambientais.'),
  pergunta('fase26', 'O que expressa a universalidade dos direitos humanos?',
    ['Os direitos dependem da renda de cada pessoa.', 'A proteção deve alcançar todas as pessoas.', 'Cada profissão define quem pode ter direitos.', 'Somente cidadãos com formação superior têm proteção.'], 1,
    'A universalidade exige proteção de todas as pessoas. A dignidade humana não depende de renda, profissão ou escolaridade.'),
  pergunta('fase27', 'Um cadastro de estudos pede dados sem relação com o serviço. Qual mudança aplica o princípio da necessidade?',
    ['Manter todos os campos desde que o banco esteja criptografado.', 'Coletar dados extras para possíveis usos futuros ainda indefinidos.', 'Manter a coleta irrestrita após um consentimento genérico.', 'Solicitar somente dados pertinentes e proporcionais à finalidade.'], 3,
    'O princípio da necessidade orienta limitar a coleta ao que é pertinente e proporcional ao propósito informado. Mais dados não significam um cadastro melhor.'),
  pergunta('fase28', 'Quais estruturas básicas organizam um algoritmo estruturado?',
    ['Entrada, arquivo e internet.', 'Classe, herança e polimorfismo.', 'Sequência, decisão e repetição.', 'Tabela, linha e coluna.'], 2,
    'Sequência ordena ações, decisão escolhe caminhos e repetição executa tarefas mais de uma vez. As três podem ser combinadas em algoritmos estruturados.'),
  pergunta('fase29', 'Qual conjunto representa recursos de TIC usados por uma organização?',
    ['Somente computadores e impressoras.', 'Hardware, software, redes, bancos de dados e serviços.', 'Somente aplicativos usados no celular.', 'Somente mensagens e chamadas telefônicas.'], 1,
    'TIC reúne recursos para processar, armazenar e transmitir informações. Hardware, software, redes, bancos de dados e serviços atuam de forma integrada.'),

  pergunta('fase6', 'Em uma fila de atendimento com regra FIFO, qual elemento deve sair primeiro?',
    ['O último que entrou.', 'O que tiver o maior valor.', 'Um elemento escolhido ao acaso.', 'O primeiro que entrou.'], 3,
    'FIFO significa primeiro a entrar, primeiro a sair. A pilha usa a regra LIFO, na qual o último elemento inserido é o primeiro a sair.'),
  pergunta('fase7', 'Para que serve uma struct em C?',
    ['Agrupar variáveis, inclusive de tipos diferentes, em uma estrutura.', 'Repetir um bloco enquanto uma condição for verdadeira.', 'Reservar exclusivamente um vetor de caracteres.', 'Garantir que todas as variáveis sejam constantes.'], 0,
    'Uma struct reúne campos sob um mesmo tipo estruturado. Os campos podem ter tipos diferentes, como nome, idade e nota de um aluno.'),
  pergunta('fase8', 'Por que os requisitos são uma referência importante ao validar um sistema?',
    ['Porque substituem todos os testes de software.', 'Porque determinam obrigatoriamente a linguagem de programação.', 'Porque registram expectativas para comparar com o que foi entregue.', 'Porque tornam desnecessária a participação dos usuários.'], 2,
    'Os requisitos descrevem expectativas e necessidades aceitas. A validação compara a solução entregue com essas expectativas e envolve os interessados.'),
  pergunta('fase9', 'Uma videoconferência tem largura de banda suficiente, mas apresenta interrupções. O que também deve ser investigado?',
    ['Somente a velocidade nominal contratada com o provedor.', 'A latência e a variação do atraso, chamada jitter.', 'Somente a quantidade de endereços disponíveis na rede.', 'Apenas a taxa máxima suportada pelo cabo de rede.'], 1,
    'Comunicações em tempo real dependem de mais que capacidade de transmissão. Atraso e jitter afetam a continuidade do áudio e do vídeo.'),
  pergunta('fase10', 'O que caracteriza o aprendizado de máquina?',
    ['Uma sequência fixa de regras escritas manualmente para todos os casos.', 'A execução repetida de um algoritmo sem alterar seu comportamento.', 'O armazenamento de exemplos sem extrair relações entre eles.', 'O aprendizado de padrões a partir de dados para realizar uma tarefa.'], 3,
    'No aprendizado de máquina, modelos identificam padrões em dados. A qualidade dos dados e a forma de avaliação influenciam os resultados.'),
  pergunta('fase30', 'Qual abordagem é mais adequada para um projeto de educação ambiental?',
    ['Investigar o contexto, envolver a comunidade e acompanhar os resultados.', 'Distribuir uma mensagem única sem conhecer o público.', 'Considerar apenas a aparência dos materiais de divulgação.', 'Tratar problemas ambientais como assuntos sem relação com hábitos locais.'], 0,
    'A educação ambiental relaciona conhecimentos, participação e decisões. Projetos precisam considerar o contexto e avaliar seus resultados para melhorar as ações.'),
  pergunta('fase31', 'Por que uma explicação científica pode ser revisada?',
    ['Porque qualquer opinião tem o mesmo valor que uma investigação.', 'Porque resultados científicos devem ser mantidos sem questionamento.', 'Porque novas evidências e análises podem alterar a explicação.', 'Porque um resultado só é científico se nunca for testado.'], 2,
    'O conhecimento científico é verificável e falível. Novas evidências podem apoiar, limitar ou levar à revisão de uma explicação.'),
  pergunta('fase32', 'Qual exemplo descreve um requisito não funcional?',
    ['O aluno pode cadastrar um flashcard.', 'O sistema deve responder à consulta em até dois segundos nas condições definidas.', 'O tutor pode editar uma pergunta.', 'O usuário pode solicitar a exportação de seus dados.'], 1,
    'Requisitos não funcionais descrevem qualidades e restrições, como desempenho. Cadastrar, editar e exportar são comportamentos funcionais.'),

  pergunta('fase11', 'Ao começar a modelagem de dados de uma biblioteca, qual é o foco do modelo conceitual?',
    ['Definir os tipos físicos e o tamanho exato de cada coluna.', 'Definir primeiro os índices específicos de um banco.', 'Escrever as consultas SQL que serão usadas em cada tela.', 'Representar entidades, atributos e relações relevantes do domínio.'], 3,
    'O modelo conceitual representa o domínio antes dos detalhes de implementação. Livros, leitores e empréstimos são exemplos de conceitos e relações a analisar.'),
  pergunta('fase12', 'Qual é a função de um construtor em uma classe C#?',
    ['Inicializar o estado necessário de uma nova instância.', 'Excluir automaticamente todos os objetos antigos.', 'Converter qualquer classe em interface.', 'Impedir que a classe possua métodos.'], 0,
    'O construtor participa da criação do objeto e inicializa seu estado. Pode receber parâmetros necessários para que a instância comece em uma condição válida.'),
  pergunta('fase13', 'Em HTML, quando a região main é adequada?',
    ['Para identificar uma região de navegação complementar.', 'Para identificar o conteúdo principal do documento.', 'Para reunir os metadados e o título da aba.', 'Para identificar o cabeçalho de cada seção do documento.'], 1,
    'O elemento main identifica o conteúdo principal. A estrutura semântica ajuda pessoas e tecnologias assistivas a compreender a organização da página.'),
  pergunta('fase14', 'Um modelo supervisionado foi treinado com rótulos incorretos. Qual consequência é plausível?',
    ['O modelo corrige todos os rótulos automaticamente.', 'A qualidade dos rótulos não afeta o aprendizado.', 'O modelo pode aprender os erros e vieses desses rótulos.', 'Os dados deixam de ser necessários na avaliação.'], 2,
    'O modelo aprende relações a partir dos exemplos fornecidos. Rótulos inadequados ou pouco representativos podem introduzir erros e vieses nos resultados.'),
  pergunta('fase15', 'Quem participa da construção da qualidade de software?',
    ['Somente a equipe de testes depois da implementação.', 'Somente quem aprova a compra do sistema.', 'Somente a pessoa que escreve a documentação final.', 'Todos os envolvidos nas decisões e atividades do desenvolvimento.'], 3,
    'Qualidade é construída ao longo do processo. Requisitos, projeto, implementação, testes e colaboração com usuários influenciam a adequação do produto.'),
  pergunta('fase33', 'Em uma negociação, qual ação demonstra escuta ativa?',
    ['Ouvir, fazer perguntas e confirmar se a mensagem foi compreendida.', 'Preparar a resposta sem acompanhar o que a outra pessoa diz.', 'Interpretar silêncio sempre como concordância.', 'Evitar perguntas para encerrar a conversa rapidamente.'], 0,
    'A escuta ativa busca compreender o sentido da mensagem. Perguntar e confirmar o entendimento reduz ruídos e interpretações precipitadas.'),
  pergunta('fase34', 'Por que a língua de sinais é importante para a comunicação de pessoas surdas?',
    ['Porque depende de ouvir corretamente todos os sons.', 'Porque oferece uma língua visual para comunicação e expressão.', 'Porque dispensa qualquer aprendizagem de linguagem.', 'Porque é apenas um conjunto universal de gestos sem estrutura.'], 1,
    'As línguas de sinais têm estrutura linguística e utilizam recursos visuais. Favorecem comunicação, expressão e desenvolvimento da linguagem.'),
  pergunta('fase35', 'Por que incluir stdio.h em um programa C que usa printf e scanf?',
    ['Para disponibilizar as declarações de todas as funções matemáticas.', 'Para alocar automaticamente os buffers de todas as variáveis.', 'Para disponibilizar as declarações dos recursos de entrada e saída utilizados.', 'Para validar automaticamente todos os dados digitados pelo usuário.'], 2,
    'O cabeçalho stdio.h declara recursos de entrada e saída, incluindo printf e scanf. Sua inclusão não substitui a validação das entradas.'),
  pergunta('fase36', 'Uma tela é visualmente agradável, mas o usuário não consegue concluir sua tarefa. O que isso mostra?',
    ['Que aparência e experiência de uso são sempre equivalentes.', 'Que testar a navegação é desnecessário quando a tela é bonita.', 'Que somente a quantidade de cores determina a qualidade.', 'Que avaliar a experiência exige considerar fluxos, mensagens e objetivos.'], 3,
    'UX envolve a experiência de realizar tarefas. UI reúne elementos da interface; uma boa aparência não garante que o fluxo permita atingir o objetivo.'),

  pergunta('fase16', 'Por que a ordem dos middlewares importa em uma aplicação ASP.NET Core?',
    ['Porque cada etapa pode preparar dados usados pelas etapas seguintes.', 'Porque ela ordena os componentes apenas pela velocidade de execução.', 'Porque todos os componentes são executados em paralelo, sem dependências.', 'Porque ela define apenas a ordem de criação das tabelas do banco.'], 0,
    'A requisição percorre uma sequência de componentes. Etapas podem preparar informações, encaminhar a requisição ou encerrar o processamento, criando dependências de ordem.'),
  pergunta('fase17', 'Um app precisa continuar útil quando a conexão cai. Qual decisão deve ser considerada desde o projeto?',
    ['Descartar os dados locais sempre que a conexão for interrompida.', 'Planejar armazenamento local e sincronização quando a conexão voltar.', 'Depender somente da memória temporária, mesmo após fechar o aplicativo.', 'Repetir requisições continuamente sem controlar tentativas ou duplicações.'], 1,
    'Aplicativos móveis lidam com conectividade variável e recursos limitados. Armazenamento local e sincronização ajudam a manter a continuidade das tarefas.'),
  pergunta('fase18', 'Qual é a diferença entre UPDATE e ALTER em SQL?',
    ['Ambos servem apenas para consultar registros.', 'UPDATE muda estruturas e ALTER sempre remove registros.', 'UPDATE altera dados; ALTER modifica a estrutura de um objeto do banco.', 'UPDATE cria tabelas e ALTER ordena consultas.'], 2,
    'UPDATE é usado para alterar registros existentes. ALTER modifica estruturas e objetos do banco, como a definição de uma tabela.'),
  pergunta('fase19', 'Uma equipe usa uma plataforma gerenciada para publicar sua aplicação sem administrar o sistema operacional do servidor. Qual modelo isso caracteriza?',
    ['IaaS, com máquinas virtuais e sistema operacional administrados pela equipe.', 'SaaS, com consumo de um aplicativo pronto do provedor.', 'Hospedagem física própria, com gestão local do servidor.', 'PaaS, que oferece uma plataforma para executar aplicações.'], 3,
    'Em PaaS, o provedor gerencia a plataforma e parte da infraestrutura. A equipe concentra-se na aplicação e nos dados dentro das responsabilidades do serviço.'),
  pergunta('fase20', 'Antes de transformar uma ideia de TI em negócio, o que precisa ser validado?',
    ['O problema do público, as alternativas existentes e a viabilidade da proposta.', 'Somente a originalidade técnica, mesmo sem demanda identificada.', 'A preferência da equipe por uma tecnologia, antes de investigar o mercado.', 'A quantidade de funcionalidades, independentemente dos custos e do público.'], 0,
    'Uma ideia técnica precisa atender a uma necessidade real e ter condições de operação. Público, alternativas, recursos e viabilidade ajudam a avaliar a proposta.'),
  pergunta('fase37', 'Um app JavaScript compartilha código entre Android e iOS. Por que ainda testar nas duas plataformas?',
    ['Porque todo código compartilhado precisa ser reescrito em linguagem nativa.', 'Porque aparência, permissões e recursos podem ter comportamentos diferentes.', 'Porque testes em uma plataforma garantem a mesma experiência na outra.', 'Porque o uso de JavaScript elimina a necessidade de testar recursos nativos.'], 1,
    'Compartilhar código não elimina diferenças de plataforma. Permissões e recursos como câmera e localização precisam ser verificados no contexto de cada sistema.'),
  pergunta('fase38', 'Nos estudos de relações étnico-raciais, o que significa tratar raça como construção social?',
    ['Aceitar hierarquias biológicas entre grupos humanos.', 'Negar que o racismo produza consequências concretas.', 'Analisar os significados e efeitos sociais atribuídos às diferenças em contextos históricos.', 'Considerar que todas as culturas têm exatamente a mesma história.'], 2,
    'A abordagem analisa como diferenças recebem significados e consequências sociais. Permite compreender o racismo sem aceitar hierarquias biológicas entre pessoas.'),
  pergunta('fase39', 'Por que um planejamento ágil deve ser revisado ao longo do projeto?',
    ['Porque objetivos e prioridades nunca precisam ser definidos.', 'Porque revisar o plano significa abandonar qualquer compromisso.', 'Porque a equipe deve evitar o retorno dos usuários.', 'Porque o trabalho e o uso do produto revelam necessidades e riscos novos.'], 3,
    'O planejamento ágil incorpora aprendizado durante a execução. Revisões ajudam a ajustar prioridades e decisões para produzir resultados úteis.'),
]);

/** Sorteio sem reposição; a função aleatória pode ser fornecida pelos testes. */
export function selecionarPerguntasDiagnostico(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('Fonte de sorteio inválida.');
  return MODULOS_AVALIADOS.flatMap(modulo => {
    const perguntas = PERGUNTAS_DIAGNOSTICO.filter(item => item.modulo === modulo.numero);
    for (let i = perguntas.length - 1; i > 0; i -= 1) {
      const valor = random();
      if (!Number.isFinite(valor) || valor < 0 || valor >= 1) throw new RangeError('Valor de sorteio inválido.');
      const j = Math.floor(valor * (i + 1));
      [perguntas[i], perguntas[j]] = [perguntas[j], perguntas[i]];
    }
    return perguntas.slice(0, PERGUNTAS_POR_MODULO);
  });
}

function validarRespostas(respostas) {
  const total = MODULOS_AVALIADOS.length * PERGUNTAS_POR_MODULO;
  if (!Array.isArray(respostas) || respostas.length !== total) throw new TypeError(`Responda às ${total} perguntas do diagnóstico.`);
  const ids = new Set();
  const perguntas = new Map(PERGUNTAS_DIAGNOSTICO.map(item => [item.id, item]));
  const revisoes = respostas.map(resposta => {
    const pergunta = perguntas.get(resposta?.perguntaId);
    if (!pergunta || ids.has(pergunta.id)) throw new TypeError('Pergunta desconhecida ou repetida.');
    const alternativa = resposta.alternativa;
    if (alternativa !== null && (!Number.isInteger(alternativa) || alternativa < 0 || alternativa >= pergunta.r.length)) {
      throw new TypeError('Alternativa inválida. Use uma opção ou Não sei.');
    }
    ids.add(pergunta.id);
    return { perguntaId: pergunta.id, faseId: pergunta.faseId, modulo: pergunta.modulo, respondida: alternativa,
      correta: pergunta.certa, acertou: alternativa === pergunta.certa, explicacao: pergunta.explicacao };
  });
  for (const modulo of MODULOS_AVALIADOS) {
    if (revisoes.filter(item => item.modulo === modulo.numero).length !== PERGUNTAS_POR_MODULO) {
      throw new TypeError(`Cada módulo precisa de ${PERGUNTAS_POR_MODULO} respostas.`);
    }
  }
  return revisoes;
}

/** A primeira base ainda não consolidada orienta o início; acertos avançados não a compensam. */
export function resultadoDoDiagnostico(respostas) {
  const revisoes = validarRespostas(respostas);
  const modulos = MODULOS_AVALIADOS.map(({ numero, codigo, titulo }) => {
    const acertos = revisoes.filter(item => item.modulo === numero && item.acertou).length;
    return { numero, codigo, titulo, total: PERGUNTAS_POR_MODULO, acertos, dominio: acertos >= MINIMO_ACERTOS_POR_MODULO };
  });
  const moduloRecomendado = modulos.find(modulo => !modulo.dominio)?.numero ?? 5;
  const faseRecomendada = MODULOS.find(modulo => modulo.numero === moduloRecomendado).fases[0].id;
  return {
    versao: VERSAO_DIAGNOSTICO,
    total: revisoes.length,
    acertos: revisoes.filter(item => item.acertou).length,
    moduloRecomendado,
    faseRecomendada,
    modulos,
    revisoes,
    fases: ORDEM_FASES.slice(0, ORDEM_FASES.indexOf(faseRecomendada) + 1),
  };
}
