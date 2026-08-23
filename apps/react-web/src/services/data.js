/**
 * Banco Canônico de Conteúdo e Flashcards do Nex_TI
 */
export const MODULOS = [
  {
    id: 'mod1',
    nome: 'Módulo 1: Fundamentos da Computação & Lógica',
    icone: '💻',
    cor: '#00f0ff',
    aulas: [
      { id: 'mod1-aula1', titulo: 'Lógica Booleana e Circuitos Digitais', totalCards: 4 },
      { id: 'mod1-aula2', titulo: 'Algoritmos, Complexidade e Notação Big-O', totalCards: 4 },
      { id: 'mod1-aula3', titulo: 'Arquitetura Von Neumann e Assembly', totalCards: 4 }
    ],
    simulado: {
      pergunta: 'Em relação à complexidade temporal assintótica de algoritmos, qual é a complexidade do algoritmo Merge Sort no pior caso?',
      alternativas: [
        { id: 'A', texto: 'O(n²)', correta: false },
        { id: 'B', texto: 'O(n log n)', correta: true },
        { id: 'C', texto: 'O(log n)', correta: false },
        { id: 'D', texto: 'O(n)', correta: false }
      ],
      explicacao: 'O Merge Sort divide recursivamente a lista em metades (log n níveis) e intercala em tempo linear O(n), garantindo O(n log n) em todos os casos.'
    }
  },
  {
    id: 'mod2',
    nome: 'Módulo 2: Engenharia de Software & Arquitetura',
    icone: '🏗️',
    cor: '#00ff88',
    aulas: [
      { id: 'mod2-aula1', titulo: 'Princípios SOLID & Clean Architecture', totalCards: 4 },
      { id: 'mod2-aula2', titulo: 'Design Patterns GoF (Criacionais e Estruturais)', totalCards: 4 },
      { id: 'mod2-aula3', titulo: 'Metodologias Ágeis e DevOps CI/CD', totalCards: 4 }
    ],
    simulado: {
      pergunta: 'O princípio da Inversão de Dependência (DIP) do SOLID estabelece que:',
      alternativas: [
        { id: 'A', texto: 'Módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações.', correta: true },
        { id: 'B', texto: 'Uma classe deve ter apenas uma razão para mudar.', correta: false },
        { id: 'C', texto: 'Classes derivadas devem ser substituíveis por suas classes base.', correta: false },
        { id: 'D', texto: 'Entidades de software devem estar abertas para extensão, mas fechadas para modificação.', correta: false }
      ],
      explicacao: 'DIP afirma que módulos de alto nível dependem de abstrações (interfaces) e abstrações não devem depender de detalhes.'
    }
  },
  {
    id: 'mod3',
    nome: 'Módulo 3: Banco de Dados & Armazenamento',
    icone: '🗄️',
    cor: '#ffd700',
    aulas: [
      { id: 'mod3-aula1', titulo: 'Modelagem Relacional e Formas Normais (1FN a BCNF)', totalCards: 4 },
      { id: 'mod3-aula2', titulo: 'Transações ACID, Índices B-Tree e Tuning', totalCards: 4 },
      { id: 'mod3-aula3', titulo: 'Bancos NoSQL (Document, Key-Value e Graph)', totalCards: 4 }
    ],
    simulado: {
      pergunta: 'Qual propriedade ACID garante que as modificações de uma transação confirmada persistam mesmo em caso de falha de energia?',
      alternativas: [
        { id: 'A', texto: 'Atomicidade', correta: false },
        { id: 'B', texto: 'Consistência', correta: false },
        { id: 'C', texto: 'Isolamento', correta: false },
        { id: 'D', texto: 'Durabilidade', correta: true }
      ],
      explicacao: 'Durabilidade (D) garante que os dados confirmados foram gravados em armazenamento não volátil (WAL / Disco).'
    }
  },
  {
    id: 'mod4',
    nome: 'Módulo 4: Redes de Computadores & Segurança',
    icone: '🌐',
    cor: '#8a2be2',
    aulas: [
      { id: 'mod4-aula1', titulo: 'Modelo OSI vs. Pilha TCP/IP', totalCards: 4 },
      { id: 'mod4-aula2', titulo: 'Criptografia Simétrica, Assimétrica e TLS', totalCards: 4 },
      { id: 'mod4-aula3', titulo: 'Segurança Web (OWASP Top 10 e Zero Trust)', totalCards: 4 }
    ],
    simulado: {
      pergunta: 'No protocolo HTTPS, como é estabelecida a chave de sessão simétrica durante o handshake TLS?',
      alternativas: [
        { id: 'A', texto: 'A chave é enviada em texto claro na camada TCP.', correta: false },
        { id: 'B', texto: 'Por meio do algoritmo Diffie-Hellman ou criptografia da chave pré-mestre com a chave pública do certificado.', correta: true },
        { id: 'C', texto: 'A chave é gerada pelo servidor DNS autoritativo.', correta: false },
        { id: 'D', texto: 'Através de um hash MD5 compartilhado no cabeçalho HTTP.', correta: false }
      ],
      explicacao: 'O handshake TLS utiliza criptografia assimétrica / Diffie-Hellman para negociar de forma segura uma chave simétrica efêmera de alta performance.'
    }
  },
  {
    id: 'mod5',
    nome: 'Módulo 5: Inteligência Artificial & Computação Avançada',
    icone: '🧠',
    cor: '#ff5555',
    aulas: [
      { id: 'mod5-aula1', titulo: 'Redes Neurais Artificiais e Backpropagation', totalCards: 4 },
      { id: 'mod5-aula2', titulo: 'Large Language Models e Transformers', totalCards: 4 },
      { id: 'mod5-aula3', titulo: 'Computação em Nuvem e Microsserviços', totalCards: 4 }
    ],
    simulado: {
      pergunta: 'O mecanismo de Auto-Atenção (Self-Attention) introduzido na arquitetura Transformer permite:',
      alternativas: [
        { id: 'A', texto: 'Calcular a correlação e dependência entre todas as palavras de uma sequência em paralelo.', correta: true },
        { id: 'B', texto: 'Processar sequências estritamente de forma serial como em uma RNN.', correta: false },
        { id: 'C', texto: 'Eliminar completamente o cálculo de matrizes no modelo.', correta: false },
        { id: 'D', texto: 'Substituir neurônios artificiais por circuitos eletromecânicos.', correta: false }
      ],
      explicacao: 'Self-Attention calcula matrizes Q, K, V permitindo que cada token pondere o contexto de todos os outros tokens simultaneamente.'
    }
  }
];

export const FLASHCARDS_DECK = [
  // Módulo 1
  {
    id: 1,
    fase: 'mod1-aula1',
    frente: 'O que define a Primeira Lei de De Morgan na lógica booleana?',
    verso: 'A negação da conjunção é equivalente à disjunção das negações: ~(A ∧ B) ≡ ~A ∨ ~B.',
    dica: 'Inverte o operador AND para OR negando as partes.'
  },
  {
    id: 2,
    fase: 'mod1-aula1',
    frente: 'Qual é a função de uma porta lógica XOR (Exclusive OR)?',
    verso: 'Retorna verdadeiro (1) se e somente se as entradas forem diferentes entre si. Se ambas forem 0 ou 1, retorna 0.',
    dica: 'Muito usada em somadores binários e criptografia.'
  },
  {
    id: 3,
    fase: 'mod1-aula2',
    frente: 'O que significa um algoritmo ter complexidade de tempo O(1)?',
    verso: 'Significa complexidade de tempo constante: o tempo de execução independe do tamanho dos dados de entrada (n).',
    dica: 'Exemplo: Acesso direto a um elemento de um array pelo índice.'
  },
  {
    id: 4,
    fase: 'mod1-aula2',
    frente: 'Como a busca binária atinge a complexidade O(log n)?',
    verso: 'A cada iteração em um array previamente ordenado, a busca binária descarta metade do espaço de busca.',
    dica: 'Requer que os elementos estejam ordenados.'
  },
  // Módulo 2
  {
    id: 5,
    fase: 'mod2-aula1',
    frente: 'O que o princípio SRP (Single Responsibility Principle) preconiza?',
    verso: 'Uma classe deve ter apenas um, e somente um, motivo para mudar, possuindo responsabilidade única bem delimitada.',
    dica: 'Primeiro princípio do SOLID.'
  },
  {
    id: 6,
    fase: 'mod2-aula1',
    frente: 'Qual a diferença entre o Princípio Aberto/Fechado (OCP) e herança pura?',
    verso: 'OCP dita que o código deve estar aberto a extensões mas fechado para modificações diretas, preferindo abstrações e interfaces.',
    dica: 'Permite adicionar novas funcionalidades sem quebrar o código existente.'
  },
  {
    id: 7,
    fase: 'mod2-aula2',
    frente: 'Qual é o objetivo do padrão de projeto Factory Method?',
    verso: 'Definir uma interface para criar um objeto, permitindo às subclasses decidirem qual classe instanciar.',
    dica: 'Padrão criacional do GoF.'
  },
  {
    id: 8,
    fase: 'mod2-aula2',
    frente: 'Para que serve o padrão Singleton e quais seus riscos?',
    verso: 'Garante uma única instância global de uma classe. Riscos: alto acoplamento, dificuldade de testes unitários e estado compartilhado.',
    dica: 'Usado comumente em pools de conexão ou loggers.'
  },
  // Módulo 3
  {
    id: 9,
    fase: 'mod3-aula1',
    frente: 'O que caracteriza a Terceira Forma Normal (3FN)?',
    verso: 'Estar na 2FN e não possuir dependências funcionais transitivas (atributos não chave dependendo de outros atributos não chave).',
    dica: 'Cada atributo não chave deve depender exclusivamente da chave primária.'
  },
  {
    id: 10,
    fase: 'mod3-aula2',
    frente: 'Como os índices B-Tree aceleram consultas SQL?',
    verso: 'Organizam as chaves em árvores balanceadas de busca, reduzindo a busca de O(n) para O(log n) acessos de leitura.',
    dica: 'Evita operações caras de Table Scan.'
  },
  // Módulo 4
  {
    id: 11,
    fase: 'mod4-aula1',
    frente: 'Qual a diferença crucial entre os protocolos TCP e UDP na camada de transporte?',
    verso: 'TCP é orientado à conexão, confiável e com controle de fluxo (Three-way handshake); UDP é não orientado à conexão e prioriza baixa latência.',
    dica: 'TCP para web/transações; UDP para streaming e jogos.'
  },
  {
    id: 12,
    fase: 'mod4-aula2',
    frente: 'Como funciona a assinatura digital com criptografia assimétrica?',
    verso: 'O emissor gera um hash da mensagem e o encripta com sua chave PRIVADA. Qualquer um valida usando a chave PÚBLICA do emissor.',
    dica: 'Garante autenticidade, integridade e não repúdio.'
  }
];
