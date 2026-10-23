/**
 * Questões oficiais do ENADE de Tecnologia em Análise e Desenvolvimento de Sistemas
 * (provas de 2017 e 2021, componente específico), com o gabarito definitivo do INEP.
 * Fonte: https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade/provas-e-gabaritos
 *
 * Ficaram de fora as questões que dependem de uma figura para serem respondidas
 * (2017: 20 e 27; 2021: 10, 15, 16 e 35), a anulada (2017: 15) e a 2017/09, cujo
 * gabarito oficial considera falsa uma afirmação que o cálculo mostra ser verdadeira.
 * Quando a questão tem um diagrama simples, ele está descrito em texto.
 *
 * Usado pelas fases 24 e 25 do site e do app (content.js) e pelo simulado da API
 * (scripts/gerar-semente-api.mjs → apps/api/Data/Seed/simulados.json).
 */

const q = (numero, area, enunciado, opcoes, correta, explicacao) => ({ numero, area, enunciado, opcoes, correta, explicacao });

const AFIRMACOES = 'É correto apenas o que se afirma em';

export const PROVAS_ENADE = Object.freeze([
  {
    ano: 2017,
    tipo: 'ENADE',
    questoes: [
      q(10, 'Matemática e Lógica',
        'A álgebra booleana possui o operador unário ~ (NÃO) e os operadores binários * (E) e + (OU). A tabela verdade da fórmula G, para as proposições p, q e r, é:\n\n'
        + 'p q r | G\nV V V | V\nV V F | F\nV F V | F\nV F F | F\nF V V | V\nF V F | V\nF F V | V\nF F F | V\n\n'
        + 'Considerando a ordem de precedência dos operadores booleanos, a fórmula G possui a mesma tabela verdade da proposição',
        ['p + ~q * r.', 'p + q * ~r.', '~p + q * r.', '~p + ~q * r.', '~p + q * ~r.'], 'C',
        'Quando p é falso, ~p já torna G verdadeira (as quatro últimas linhas). Quando p é verdadeiro, G só vale V se q e r forem verdadeiros, ou seja, q * r.'),
      q(11, 'Banco de Dados',
        'Num sistema para um clube recreativo, o diagrama de classes tem: Tipo_Associado (codigo, descricao, valorMensalidade) ligado a Associado com multiplicidade 1 para 0..*; '
        + 'e Associado (codigo, nome, endereco, telefone) ligado a Mensalidade (codigo, anomesreferencia, valormensalidade, datavencimento, valorpago, datapagamento) com multiplicidade 1 para 1..*.\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. Haverá somente 12 mensalidades para cada associado, ou seja, elas não poderão ultrapassar os 12 meses do ano.\n'
        + 'II. Não existem associados sem mensalidades, nem mensalidades sem associado a elas relacionado.\n'
        + 'III. Alterando-se o valor da mensalidade definido para cada tipo de associado, o sistema automaticamente altera os valores das mensalidades geradas anteriormente.\n'
        + 'IV. Poderão existir tipos de associados que não terão nenhum associado relacionado a eles.\n\n' + AFIRMACOES,
        ['I e II.', 'I e III.', 'II e IV.', 'I, III e IV.', 'II, III e IV.'], 'C',
        'II: 1..* obriga cada associado a ter ao menos uma mensalidade, e cada mensalidade tem exatamente um associado. IV: 0..* permite tipo sem associados. I é falsa (1..* não tem limite) e III também (cada mensalidade guarda o próprio valor).'),
      q(12, 'Engenharia de Software',
        'Considere os requisitos de um sistema acadêmico de uma universidade:\n'
        + 'R1: o sistema deve permitir que cada professor realize o lançamento de notas das turmas nas quais lecionou;\n'
        + 'R2: o sistema deverá ser desenvolvido de forma a possibilitar seu transporte para outro sistema operacional em, no máximo, sessenta dias;\n'
        + 'R3: o sistema deve permitir que um estudante realize a sua matrícula nas disciplinas oferecidas em um semestre letivo;\n'
        + 'R4: o sistema atualiza a nota do estudante, permitindo sua visualização, em até dois segundos depois do momento que o professor a registra;\n'
        + 'R5: o sistema deve permitir que o auxiliar de serviços acadêmicos realize o cadastro de um estudante em não mais do que dez minutos de orientação.\n\n'
        + 'Representam requisitos não funcionais apenas os requisitos',
        ['R1, R2 e R3.', 'R1, R2 e R5.', 'R1, R3 e R4.', 'R2, R4 e R5.', 'R3, R4 e R5.'], 'D',
        'R2 é portabilidade, R4 é desempenho e R5 é usabilidade (facilidade de aprendizado). R1 e R3 descrevem funções do sistema.'),
      q(13, 'Engenharia de Software',
        'Sobre o modelo CMMI, avalie as asserções e a relação proposta entre elas.\n\n'
        + 'I. O CMMI fornece diretrizes para a melhoria dos processos e habilidades organizacionais, incluindo o ciclo de vida de produtos e serviços, que abrange as fases de concepção, desenvolvimento, aquisição, entrega e manutenção.\n\n'
        + 'PORQUE\n\n'
        + 'II. As empresas brasileiras estão aderindo a programas de fomento à melhoria da qualidade de software, por meio da aplicação do modelo de maturidade CMMI, que é mais direcionado às pequenas e médias empresas, apesar de também ser aplicável em grandes organizações.',
        ['As asserções I e II são verdadeiras, e a II é uma justificativa correta da I.', 'As asserções I e II são verdadeiras, mas a II não é uma justificativa correta da I.', 'A asserção I é verdadeira, e a II é falsa.', 'A asserção I é falsa, e a II é verdadeira.', 'As asserções I e II são falsas.'], 'C',
        'I descreve o CMMI corretamente. II é falsa: o CMMI não é voltado principalmente a pequenas e médias empresas (no Brasil, quem tem esse foco é o MPS.BR).'),
      q(14, 'Gestão de Projetos',
        'A tabela apresenta as atividades de um projeto (predecessora; duração em dias):\n'
        + 'A (--; 3), B (A; 5), C (--; 12), D (--; 4), E (D; 2), F (D; 5), G (F; 7), H (E e G; 8), I (B; 11), J (C, H e I; 3).\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. O caminho crítico é composto pelas atividades A, B, I e J.\n'
        + 'II. O caminho crítico tem 27 dias.\n'
        + 'III. A atividade H faz parte do caminho crítico.\n'
        + 'IV. O projeto em pauta possui dois caminhos críticos.\n\n' + AFIRMACOES,
        ['I e II.', 'I e IV.', 'II e III.', 'I, III e IV.', 'II, III e IV.'], 'C',
        'D-F-G-H-J soma 4+5+7+8+3 = 27 dias, o maior caminho. A-B-I-J soma 22 e C-J soma 15, então só há um caminho crítico, e ele passa por H.'),
      q(16, 'Programação Orientada a Objetos',
        'Um diagrama de classes modela a transferência de materiais entre funcionários. RequisicaoTransferencia (dataRequisicao: date) tem duas associações navegáveis para Funcionario (nome: string), com os papéis "origem" e "destino" e multiplicidade 1. '
        + 'RequisicaoTransferencia também tem uma composição (losango cheio do seu lado) com Material (descricao: string, preco: double), navegável para Material, com papel "material" e multiplicidade 0..1 do lado da requisição e 1..* do lado de Material.\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. A classe Funcionario é abstrata.\n'
        + 'II. Uma RequisicaoTransferencia só existe se estiver vinculada a um Material.\n'
        + 'III. A classe Funcionario, em razão de sua associação, possui um atributo do tipo RequisicaoTransferencia.\n'
        + 'IV. Em uma implementação da classe RequisicaoTransferencia, é necessário adicionar um atributo simples do tipo Material.\n\n'
        + 'É correto o que se afirma em',
        ['II, apenas.', 'I e II, apenas.', 'III e IV, apenas.', 'I, III e IV, apenas.', 'I, II, III e IV.'], 'A',
        'A multiplicidade 1..* obriga a requisição a ter ao menos um material. Funcionario não é abstrata, a navegação vai da requisição para o funcionário (não o contrário) e 1..* pede uma coleção de materiais, não um atributo simples.'),
      q(17, 'Engenharia de Software',
        'Considerando a etapa de manutenção no processo de desenvolvimento de software, avalie as afirmações:\n'
        + 'I. A fase de manutenção é uma parte explícita do modelo em cascata do processo de desenvolvimento de software.\n'
        + 'II. A atualização do sistema para inserir customizações é considerada um tipo de manutenção.\n'
        + 'III. A depuração do programa é um processo específico da fase de desenvolvimento e um tipo de manutenção.\n'
        + 'IV. O acréscimo de novas funções a um sistema existente, sem perturbar sua operação, é considerado um tipo de manutenção.\n'
        + 'V. A manutenção do sistema está relacionada ao aumento do ciclo de vida do software.\n\n' + AFIRMACOES,
        ['I e III.', 'IV e V.', 'I, II e III.', 'I, II, IV e V.', 'II, III, IV e V.'], 'D',
        'A cascata termina em operação e manutenção, e customizar ou acrescentar funções são manutenções que prolongam a vida do software. A depuração faz parte do desenvolvimento, não é um tipo de manutenção.'),
      q(18, 'Redes e Sistemas Distribuídos',
        'As redes de computadores estão por toda parte e compartilham recursos por meio de sistemas distribuídos, que comunicam e coordenam vários dispositivos.\n\n'
        + 'Assinale a opção que apresenta exemplos atuais de sistemas distribuídos.',
        ['Pesquisa na web, jogos on-line, e-commerce e o banco de dados das agências bancárias.', 'Jogos on-line, e-commerce, pesquisa no Windows e e-mails.', 'E-commerce, jogos em mídia física, pesquisa no Windows e redes sociais.', 'Pesquisa na web, jogos em mídia física, e-commerce e e-mails.', 'Pesquisa no Windows, pesquisa na web, jogos on-line e o banco de dados das agências bancárias.'], 'A',
        'Todos os itens da alternativa A rodam em várias máquinas que se comunicam pela rede. Pesquisa no Windows e jogos em mídia física rodam numa máquina só.'),
      q(19, 'Sistemas Operacionais',
        'Conceitualmente, cada processo tem sua própria CPU virtual. Na realidade, a CPU troca a execução, a todo momento, de um processo para outro, mas é muito mais fácil pensar em um conjunto de processos sendo executados (pseudo) paralelamente do que tentar controlar o modo como a CPU faz esses chaveamentos. (Tanenbaum, adaptado)\n\n'
        + 'De acordo com o exposto, o conceito descrito denomina-se',
        ['thread.', 'multiprocessador.', 'multiprogramação.', 'processo monothread.', 'máquina de estados finitos.'], 'C',
        'Multiprogramação é a CPU alternando rapidamente entre vários processos, o que dá a impressão de execução paralela mesmo com um só processador.'),
      q(21, 'Engenharia de Software',
        'A respeito dos modelos de processo de software, avalie as afirmações:\n'
        + 'I. São atividades do modelo incremental: especificação, desenvolvimento e validação.\n'
        + 'II. No modelo espiral, a fase de modelagem é responsável, entre outras atividades, pela estimativa, cronograma e análise de risco.\n'
        + 'III. O modelo cascata sugere uma abordagem sequencial e sistemática para o desenvolvimento de software, iniciando na especificação de requisitos e finalizando com a entrega do software concluído.\n\n'
        + 'É correto o que se afirma em',
        ['II, apenas.', 'III, apenas.', 'I e II, apenas.', 'I e III, apenas.', 'I, II e III.'], 'D',
        'No espiral, estimativa, cronograma e análise de risco ficam na fase de planejamento, não na de modelagem. I e III descrevem corretamente o incremental e o cascata.'),
      q(22, 'Engenharia de Software',
        'Um desenvolvedor recém-formado recebeu explicações sobre como a gerência de configuração funcionava. Avalie as afirmações:\n'
        + 'I. Inicialmente, para ter acesso à base de desenvolvimento, o profissional deve realizar uma operação de checkout para baixar os arquivos do projeto que estão armazenados no servidor.\n'
        + 'II. Quando mais de um desenvolvedor estiver modificando um mesmo documento, ao se tentar realizar um commit, pode ser necessário realizar uma operação de tag (release) para resolução do conflito entre a versão local e a versão mais recente no repositório.\n'
        + 'III. No desenvolvimento de um novo caso de uso, em que diversos arquivos sejam modificados, é recomendada a criação de uma ramificação (branch).\n'
        + 'IV. A versão estável é o ramo principal de desenvolvimento, que segue do começo do desenvolvimento até o momento presente.\n\n' + AFIRMACOES,
        ['I e II.', 'I e III.', 'II e IV.', 'I, III e IV.', 'II, III e IV.'], 'B',
        'Conflito se resolve com merge, não com tag (tag só marca uma versão). O ramo principal de desenvolvimento é o trunk/main, que não é necessariamente a versão estável.'),
      q(23, 'Engenharia de Software',
        'Verificações, validações e testes são fundamentais para certificar a qualidade do software. Avalie as afirmações:\n'
        + 'I. O teste funcional certifica se o software desempenha as funções especificadas nos requisitos.\n'
        + 'II. O teste de desempenho valida a conformidade da especificação do processo de desenvolvimento de software.\n'
        + 'III. O teste de aceitação é realizado pelo cliente a fim de validar se aquilo que foi implementado é o que foi solicitado.\n'
        + 'IV. O teste de instalação, invariavelmente, é executado no local determinado pelo cliente para instalação do software.\n'
        + 'V. As técnicas de verificação e validação de software asseguram que o sistema que está sendo desenvolvido seja adequado ao seu propósito.\n\n' + AFIRMACOES,
        ['I e IV.', 'I, III e V.', 'II, III e IV.', 'II, IV e V.', 'I, II, III e V.'], 'B',
        'O teste de desempenho mede tempo de resposta e carga, não a conformidade do processo. E o teste de instalação nem sempre é feito no local do cliente.'),
      q(24, 'Engenharia de Software',
        'Muitos sistemas corporativos das décadas de 1970 e 1980 foram feitos em Cobol, com ADABAS e arquivos ISAM e VSAM, produtos que estão sendo descontinuados. A reengenharia desses sistemas com linguagens e bancos mais modernos é uma oportunidade de negócio. Avalie as afirmações:\n'
        + 'I. A dificuldade de reengenharia de sistemas antigos deve-se ao fato de que, na maioria das vezes, o desenvolvedor definia o sistema e esse já era o próprio processo da organização.\n'
        + 'II. O custo de alteração para modernização de uma linha de código em Cobol é alto; por isso, fazer a manutenção desses sistemas é menos dispendioso.\n'
        + 'III. Uma estratégia de conversão dos referidos sistemas para uma linguagem orientada a objetos é definir uma estrutura de classes e métodos e realizar o refatoramento do código.\n\n'
        + 'É correto o que se afirma em',
        ['I, apenas.', 'III, apenas.', 'I e II, apenas.', 'II e III, apenas.', 'I, II e III.'], 'E',
        'As três descrevem a realidade dos sistemas legados: a regra de negócio ficou presa no código, reescrever é caro e a migração para OO passa por definir classes e refatorar.'),
      q(25, 'Algoritmos e Estruturas de Dados',
        'O fragmento C++ a seguir insere um nó em uma árvore binária.\n\n'
        + 'struct noArvore {\n    int dado;\n    noArvore *esquerda;\n    noArvore *direita;\n};\n\n'
        + 'noArvore *insere(noArvore *arvore, int valor) {\n    if (arvore == NULL) {\n        arvore = new noArvore;\n        arvore->esquerda = NULL;\n        arvore->direita = NULL;\n        arvore->dado = valor;\n    } else if (valor < arvore->dado) {\n        arvore->esquerda = insere(arvore->esquerda, valor);\n    } else {\n        arvore->direita = insere(arvore->direita, valor);\n    }\n    return arvore;\n}\n\n'
        + 'Assinale a opção que imprime os valores dos nós percorrendo a árvore em pré-ordem.',
        [
          'if (raiz != NULL) {\n    cout << raiz->dado << " ";\n    preorder(raiz->esquerda);\n    preorder(raiz->direita);\n}',
          'if (raiz != NULL) {\n    preorder(raiz->direita);\n    preorder(raiz->esquerda);\n    cout << raiz->dado << " ";\n}',
          'if (raiz != NULL) {\n    preorder(raiz->esquerda);\n    cout << raiz->dado << " ";\n    preorder(raiz->direita);\n}',
          'if (raiz != NULL) {\n    preorder(raiz->esquerda);\n    preorder(raiz->direita);\n    cout << raiz->dado << " ";\n}',
          'if (raiz != NULL) {\n    preorder(raiz->direita);\n    cout << raiz->dado << " ";\n    preorder(raiz->esquerda);\n}',
        ], 'A',
        'Pré-ordem visita primeiro a raiz, depois a subárvore esquerda e por fim a direita. A opção C é em-ordem e a D é pós-ordem.'),
      q(26, 'Programação Orientada a Objetos',
        'Uma calculadora feita com MVC tem dois modos: comum e probabilista. A classe Calculadora guarda uma variável c do tipo CalculadoraController; o método multiplica(valores) apenas retorna c.multiplica(valores), e alteraModo() faz c = new ProbabilistaController() se modo == 1, senão c = new OrdinarioController(). '
        + 'ProbabilistaController e OrdinarioController herdam de CalculadoraController e implementam multiplica(valores: double[]): double, formando uma família de algoritmos intercambiáveis.\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. A hierarquia exibida ilustra o uso do padrão de projetos Strategy.\n'
        + 'II. O padrão composto MVC define a existência de um único controller e, portanto, a solução proposta não caracteriza o uso desse padrão.\n'
        + 'III. O método multiplica da classe Calculadora chama o método multiplica de CalculadoraController, o que caracteriza uma conversão de interfaces e, portanto, o uso do padrão de projetos Adapter.\n\n'
        + 'É correto o que se afirma em',
        ['I, apenas.', 'II, apenas.', 'I e III, apenas.', 'II e III, apenas.', 'I, II e III.'], 'A',
        'Trocar o algoritmo trocando o objeto referenciado é o Strategy. O MVC não exige um controller único, e repassar a chamada com a mesma assinatura é delegação, não Adapter.'),
      q(28, 'Engenharia de Software',
        'O processo de descobrir, analisar, documentar e verificar os serviços e restrições de um sistema é denominado engenharia de requisitos (Sommerville). Avalie as atribuições listadas, no que se refere à etapa de especificação de requisitos:\n'
        + 'I. Identificar as expectativas e necessidades dos stakeholders com relação ao software a ser desenvolvido.\n'
        + 'II. Distribuir os requisitos em categorias, explorar as relações entre eles e classificar sua importância para os stakeholders.\n'
        + 'III. Produzir um documento de especificação de requisitos, de forma que todos os stakeholders possam entendê-lo.\n'
        + 'IV. Examinar a especificação do software para assegurar que todos os requisitos foram definidos sem inconsistências.\n\n'
        + 'São atribuições na etapa de especificação de requisitos os itens',
        ['I e III, apenas.', 'I e IV, apenas.', 'II e III, apenas.', 'II e IV, apenas.', 'I, II, III e IV.'], 'E',
        'Segundo o gabarito oficial, as quatro atribuições fazem parte da especificação: entender os stakeholders, organizar e priorizar, documentar e checar a consistência.'),
      q(29, 'Matemática e Lógica',
        'Uma pesquisa usa os conjuntos A ("possui ensino superior"), B ("possui pós-graduação") e C ("possui pelo menos 5 anos de experiência"). As expressões são:\n'
        + 'Expressão 1: x ∈ A ∧ x ∉ (B ∪ C)\n'
        + 'Expressão 2: x ∈ A − (B ∪ C)\n'
        + 'Expressão 3: x ∈ A ∧ x ∈ B ∧ x ∈ C\n\n'
        + 'Um programa em C usa a função contem(conjunto, p):\n'
        + '/* condição 1 */\nif (contem(A, p) && !contem(B, p) && !contem(C, p)) { ... }\n'
        + '/* condição 2 */\nelse if (contem(A, p) || contem(B, p) || contem(C, p)) { ... }\n\n'
        + 'Assinale a opção correta.',
        ['A condição 2 do programa é equivalente à expressão 3.', 'Pessoas com pós-graduação pertencem ao conjunto definido pela expressão 2.', 'A condição 1 do programa é verdadeira para todas as pessoas com ensino superior.', 'A condição 1 do programa e as expressões 1 e 2, que representam o mesmo subconjunto, são equivalentes.', 'A condição 2 do programa define o conjunto de pessoas que tem ensino superior, pós-graduação e pelo menos cinco anos de experiência em sua área de atuação.'], 'D',
        'As três descrevem "está em A e não está em B nem em C". A condição 2 usa OU (é uma união), por isso não equivale à expressão 3, que usa E.'),
      q(30, 'Programação Orientada a Objetos',
        'Considere o código Java:\n\n'
        + 'public abstract class Impressora {\n    String nome;\n    public void imprimir() {}\n}\n'
        + 'public class Laser extends Impressora {\n    public void imprimir() { System.out.println("Imprimindo na Laser"); }\n}\n'
        + 'class Matricial extends Impressora {\n    public void imprimir() { System.out.println("Imprimindo na Matricial"); }\n}\n'
        + 'public class JatoDeTinta extends Impressora {\n    public void imprimir() { System.out.println("Imprimindo na Jato de tinta"); }\n}\n'
        + 'public class Main {\n    public static void main(String args[]) {\n        Impressora imp[] = new Impressora[3];\n        imp[0] = new Laser();\n        imp[1] = new JatoDeTinta();\n        imp[2] = new Matricial();\n        for (int i = imp.length - 1; i >= 0; i--) {\n            imp[i].imprimir();\n        }\n    }\n}\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. A execução resulta em: Imprimindo na Laser / Imprimindo na Matricial / Imprimindo na Jato de tinta.\n'
        + 'II. O código faz uso da técnica denominada polimorfismo.\n'
        + 'III. O código não será compilado, pois o vetor imp foi instanciado por meio da classe abstrata Impressora.\n\n'
        + 'É correto o que se afirma em',
        ['II, apenas.', 'III, apenas.', 'I e II, apenas.', 'I e III, apenas.', 'I, II e III.'], 'A',
        'O laço vai do fim para o começo: imprime Matricial, Jato de tinta e Laser. Criar um vetor do tipo abstrato é permitido (só não dá para instanciar a classe). Cada objeto executa o seu imprimir(): polimorfismo.'),
      q(31, 'UX/UI e Requisitos',
        'À medida que o projeto de uma interface evolui, quatro questões quase sempre aparecem: tempo de resposta, recursos de ajuda, tratamento de erros e nomes de comandos (Pressman). Avalie as afirmações:\n'
        + 'I. A análise de interfaces tem por objetivo identificar o perfil dos usuários e auxiliar na especificação do requisito não funcional de segurança pertinente ao perfil de acesso dos usuários.\n'
        + 'II. O requisito não funcional de segurança descreve as características relacionadas a inteligibilidade, modo de usar ou operar o sistema.\n'
        + 'III. O requisito não funcional de confiabilidade descreve as características relacionadas ao tempo de resposta para processamento de dados ou informações.\n'
        + 'IV. O requisito não funcional de usabilidade descreve diretrizes de acessibilidade para pessoas com deficiência.\n\n' + AFIRMACOES,
        ['I e III.', 'I e IV.', 'II e IV.', 'I, II e III.', 'II, III e IV.'], 'B',
        'II descreve usabilidade, não segurança. III descreve desempenho (eficiência), não confiabilidade.'),
      q(32, 'Banco de Dados',
        'Um banco guarda o resultado de uma eleição nas tabelas Partido (numero, nome, sigla), Candidato (numero, nome), em que o número do candidato é o número do seu partido, e Votacao (partido, votos, estado), com os votos de cada partido em cada estado.\n\n'
        + 'Qual comando SQL seleciona os nomes dos candidatos, seus partidos e o total de votos de cada partido?',
        [
          'SELECT c.nome, p.nome, SUM(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero;',
          'SELECT c.nome, p.nome, COUNT(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome;',
          'SELECT c.nome, p.nome, SUM(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome;',
          'SELECT c.nome, p.nome, v.votos FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome, SUM(v.votos);',
          'SELECT c.nome, p.nome, COUNT(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome, v.votos;',
        ], 'C',
        'Total de votos é SUM (COUNT só contaria as linhas), e uma função de agregação junto de outras colunas exige GROUP BY por essas colunas.'),
      q(33, 'Algoritmos e Estruturas de Dados',
        'Um programador implementou a ordenação por inserção para vetor[1..9], mas o algoritmo não funciona:\n\n'
        + '01 para i <- 2 até 9 faça\n02    valor <- vetor[i]\n03    j <- i - 1\n04    enquanto ((j >= 1) e (valor < vetor[j])) faça\n05       vetor[i] <- vetor[j]\n06       j <- j - 1\n07       se (j = 0) então\n08          interrompa\n09       fim se\n10    fim enquanto\n11    vetor[j + 1] <- valor\n12 fim para\n\n'
        + 'Qual linha e comando devem ser substituídos para que o algoritmo ordene o vetor de forma crescente?',
        ['Linha 01; para i <- 1 até 9 faça', 'Linha 03; j <- i', 'Linha 04; enquanto ((j >= 1) ou (valor < vetor[j])) faça', 'Linha 05; vetor[j + 1] <- vetor[j]', 'Linha 11; vetor[j] <- valor'], 'D',
        'Na inserção, cada elemento maior é empurrado uma posição para a direita: vetor[j + 1] <- vetor[j]. Escrever sempre em vetor[i] perde os valores.'),
      q(34, 'Banco de Dados',
        'Inspirado no diálogo entre Chicó e João Grilo (Auto da Compadecida), um modelo de dados tem a entidade pessoa (codigo, que é o identificador; rg; cpf; nome) ligada pelo relacionamento possui à entidade cavalo (codigo, que é o identificador; raca; eBento?). '
        + 'A cardinalidade (1,1) aparece junto de pessoa e (0,1) junto de cavalo.\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. O Chicó e a velha poderão ser cadastrados na entidade pessoa.\n'
        + 'II. O Chicó e a velha poderão ter mais que um cavalo cadastrados.\n'
        + 'III. O atributo rg da entidade pessoa pode ter a função de chave primária nessa entidade.\n'
        + 'IV. O cavalo deverá ter no mínimo uma pessoa e uma pessoa poderá ser cadastrada sem a necessidade de ter um cavalo.\n\n' + AFIRMACOES,
        ['I e III.', 'I e IV.', 'II e III.', 'I, II e IV.', 'II, III e IV.'], 'B',
        '(1,1) do lado de pessoa: todo cavalo tem exatamente um dono. (0,1) do lado de cavalo: a pessoa tem no máximo um cavalo, e pode não ter nenhum. O identificador escolhido é codigo, não rg.'),
      q(35, 'UX/UI e Requisitos',
        'Num site de venda de ingressos, os links para cada show são imagens. O web designer implementou cada link assim, para que usuários de leitores de tela recebam um texto informativo:\n\n'
        + '<a href="link-area-venda-ingresso">\n    <img src="imagem-show.jpg" alt="identificação do show" />\n</a>\n\n'
        + 'Considerando o uso do atributo alt e a interação humano-computador, o web designer atendeu o requisito de',
        ['segurança no uso, pois se uma imagem tiver baixa resolução, o texto associado possibilita identificar o conteúdo do link.', 'facilidade de aprendizado, pois imagens aliadas a textos informativos ajudam o usuário a aprender os caminhos de navegação.', 'acessibilidade, pois a possibilidade de acesso à página por pessoas com deficiência visual oferece condições de igualdade na interação com o sistema web.', 'ergonomia, pois imagens em links causam cansaço visual em smartphones e o atributo alt substitui a imagem por texto.', 'comunicabilidade, pois se uma imagem não comunica adequadamente a informação, o texto alternativo deve complementá-la.'], 'C',
        'O alt é lido pelos leitores de tela: é o recurso básico de acessibilidade para pessoas com deficiência visual.'),
    ],
  },
  {
    ano: 2021,
    tipo: 'ENADE',
    questoes: [
      q(9, 'Engenharia de Software',
        'A etapa de definição de requisitos estabelece quais funções são requeridas pelo sistema e as restrições sobre a operação e o desenvolvimento do software. Os requisitos podem ser funcionais ou não funcionais (Sommerville).\n\n'
        + 'Assinale a alternativa em que o item é um requisito funcional.',
        ['O software deve ser operacionalizado no sistema Linux.', 'O tempo de desenvolvimento não deve ultrapassar seis meses.', 'O software deve emitir relatórios de compras a cada quinze dias.', 'O tempo de resposta do sistema não deve ultrapassar 30 segundos.', 'A base de dados deve ser protegida para acesso apenas de usuários autorizados.'], 'C',
        'Emitir relatórios é uma função do sistema. As demais são restrições: plataforma, prazo, desempenho e segurança.'),
      q(11, 'Algoritmos e Estruturas de Dados',
        'O código Java a seguir implementa uma Pilha encadeada.\n\n'
        + 'public class No {\n    public int dado;\n    public No prox;\n    public No(int dado) { this.dado = dado; }\n}\n'
        + 'public class PilhaEncadeada {\n    private No topo;\n    public int pop() {\n        if (topo == null) return -1;\n        No lixo = topo;\n        topo = topo.prox;\n        lixo.prox = null;\n        return lixo.dado;\n    }\n    public int top() {\n        if (topo == null) return -1;\n        return topo.dado;\n    }\n}\n\n'
        + 'Assinale a opção com a implementação correta do método push.',
        [
          'No novo = new No(elemento);\nif (topo == null) topo = novo;\nelse topo.prox = novo;',
          'No novo = new No(elemento);\ntopo = novo;',
          'topo.dado = elemento;',
          'No novo = new No(elemento);\nwhile (topo != null) topo = topo.prox;\ntopo.prox = novo;',
          'No novo = new No(elemento);\nnovo.prox = topo;\ntopo = novo;',
        ], 'E',
        'O novo nó aponta para o topo atual e passa a ser o topo. Assim o pop(), que lê topo.prox, encontra o elemento de baixo.'),
      q(12, 'Engenharia de Software',
        'Uma fábrica de software usa Scrum, eXtreme Programming (XP) e quadro Kanban. Avalie as afirmações:\n'
        + 'I. Métodos ágeis são baseados em ciclos iterativos e incrementais que se concentram no desenvolvimento rápido e na flexibilidade às mudanças, com a participação do cliente no processo de software.\n'
        + 'II. Uma forte característica da XP é a garantia da qualidade do código produzido e, para isso, os desenvolvedores produzem testes automatizados antes mesmo de codificar uma funcionalidade.\n'
        + 'III. O planejamento no Scrum é baseado na elaboração dos itens do product backlog, que é uma lista de funcionalidades desejadas pelo cliente, sendo o Scrum Master o responsável por gerenciá-lo.\n'
        + 'IV. O quadro Kanban permite monitorar a evolução das tarefas necessárias durante o processo ágil, possibilitando um acompanhamento visual das atividades em construção.\n\n' + AFIRMACOES,
        ['II.', 'I e III.', 'I, II e IV.', 'I, III e IV.', 'II, III e IV.'], 'C',
        'Quem gerencia o product backlog é o Product Owner, não o Scrum Master. As outras afirmações estão certas (o teste antes do código da II é o TDD).'),
      q(13, 'Algoritmos e Estruturas de Dados',
        'As variáveis pilha e fila são uma Pilha e uma Fila. Um programador executou:\n\n'
        + "pilha.push('A'); pilha.push('B'); pilha.push('C');\nfila.enqueue(pilha.top());\nfila.enqueue(pilha.top());\nfila.enqueue('D');\npilha.push(fila.dequeue());\nfila.enqueue(fila.dequeue());\nfila.enqueue(pilha.pop());\npilha.push('E');\nfila.enqueue('E');\npilha.pop();\n\n"
        + 'Ao imprimir o conteúdo de pilha e fila, respectivamente, seria exibido:',
        ['pilha: topo → C → A → E; fila: início → D → A → A → E', 'pilha: topo → A; fila: início → D → B → C → E', 'pilha: topo → C → B → A; fila: início → D → C → C → E', 'pilha: topo → B → A; fila: início → D → B → C → E', 'pilha: topo → C → B → A; fila: início → D → B → C → E'], 'C',
        'top() só lê, então a fila recebe C, C e D. O primeiro C volta para a pilha, o segundo vai para o fim da fila, e o pop() devolve esse C para a fila. O E entra e sai da pilha: pilha C, B, A e fila D, C, C, E.'),
      q(14, 'Gestão de Projetos',
        'Um projeto de integração de um ERP com um CRM não implementou todos os serviços esperados e há falhas nos já implementados. Uma auditoria identificou desentendimentos entre os membros da equipe; os membros da qualidade não compreendem o que deve ser avaliado; demandas de novos solicitantes aparecem constantemente; e o patrocinador demora muito a responder às solicitações. Tudo isso atrasou o projeto e estourou o orçamento.\n\n'
        + 'O gerente de projeto deve priorizar o gerenciamento de',
        ['custo.', 'tempo.', 'escopo.', 'qualidade.', 'partes interessadas.'], 'E',
        'Todos os problemas citados vêm das pessoas envolvidas: equipe, qualidade, solicitantes e patrocinador. Atraso e custo são consequências.'),
      q(17, 'Banco de Dados',
        'Um banco de dados bancário tem, entre outras, as tabelas CLIENTE (COD_CLIENTE, NOM_CLIENTE, ...), CONTA (NUM_CONTA, COD_CLIENTE, ...) e HISTORICO_MOVIMENTACAO (COD_HISTORICO_MOVIMENTACAO, NUM_CONTA, VAL_MOVIMENTACAO, DTA_MOVIMENTACAO, ...).\n\n'
        + 'Indique a consulta SQL que recupera o nome dos clientes e o valor médio movimentado por eles em sua conta até o momento, exibindo primeiro os clientes com maior média.',
        [
          'SELECT CL.NOME, HM.VAL_MOVIMENTADO FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA ORDER BY HM.VAL_MOVIMENTADO',
          'SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA ORDER BY HM.VAL_MOVIMENTADO DESC',
          'SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA GROUP BY CL.COD_CLIENTE, CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC',
          'SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL LEFT OUTER JOIN CONTA CO ON CL.COD_CLIENTE = CO.NUM_CONTA LEFT OUTER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.COD_HISTORICO_MOVIMENTACAO GROUP BY CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC',
          'SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL LEFT OUTER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE LEFT OUTER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA GROUP BY CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC',
        ], 'C',
        'Média por cliente pede AVG com GROUP BY pelo cliente (o código evita juntar homônimos) e ORDER BY ... DESC. A opção D liga as chaves erradas e a E agrupa só pelo nome.'),
      q(18, 'Engenharia de Software',
        'A engenharia de requisitos tem quatro subprocessos: estudo de viabilidade, elicitação, especificação e validação (Sommerville). Uma equipe vai desenvolver um software de Suporte Técnico; o estudo de viabilidade já foi aprovado e ela seguirá os outros três subprocessos.\n\n'
        + 'Quais artefatos podem ser usados nesses três subprocessos?',
        ['Documento de entrevista com usuários; modelo de caso de uso para os requisitos funcionais; prototipação de telas.', 'Documento de estudo de viabilidade; modelo de caso de uso para os requisitos funcionais; prototipação de telas.', 'Matriz de rastreabilidade; modelo de caso de uso para os requisitos não-funcionais; prototipação de telas.', 'Documento de entrevista com usuários; modelo de caso de uso para os requisitos não-funcionais; matriz de rastreabilidade.', 'Documento de estudo de viabilidade; modelo de caso de uso para os requisitos funcionais; matriz de rastreabilidade.'], 'A',
        'Entrevista serve à elicitação, caso de uso à especificação dos requisitos funcionais e protótipo à validação. Viabilidade já foi feita, e caso de uso não modela requisito não funcional.'),
      q(19, 'Engenharia de Software',
        'A respeito dos estilos e padrões arquiteturais, avalie as afirmações:\n'
        + 'I. Em arquiteturas orientadas a objetos, a comunicação entre os componentes do software é realizada por intermédio da troca de mensagens.\n'
        + 'II. As arquiteturas monolíticas consistem de um sistema dividido em pequenas partes, possibilitando que estas tenham sua manutenção, execução e evolução individual.\n'
        + 'III. No padrão MVC, a camada de Modelo armazena as interações realizadas no Controle, podendo ser apresentadas/manipuladas posteriormente na Visão.\n'
        + 'IV. Nas arquiteturas de microsserviços, o software possui componentes altamente acoplados, dificultando a manutenção.\n\n' + AFIRMACOES,
        ['I e III.', 'II e III.', 'II e IV.', 'I, II e IV.', 'I, III e IV.'], 'A',
        'II descreve microsserviços, não monólito. E microsserviços buscam baixo acoplamento, o contrário do que diz a IV.'),
      q(20, 'UX/UI e Requisitos',
        'Uma secretaria municipal vai criar um site para pessoas da terceira idade, com orientações de saúde, eventos esportivos e publicação de fotos que podem ser curtidas e comentadas. A maioria desse público acessa a internet pelo celular ou tablet, e uma parte prefere computadores.\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. A segurança no uso é um fator crítico de usabilidade a ser considerado no projeto, tendo em vista que pessoas da terceira idade são temerosas quanto ao registro de dados pessoais e confidenciais em sites e aplicativos.\n'
        + 'II. A responsividade, que pressupõe o uso de valores relativos para definir as dimensões de elementos na estilização de páginas HTML, deve ser considerada, tendo em vista o acesso por dispositivos com diferentes tamanhos de tela.\n'
        + 'III. A construção de protótipos pode antecipar problemas de design de interação e minimizar custos, e é viável para uma comunicação mais objetiva com o público-alvo, possibilitando validar a usabilidade e a experiência do usuário.\n'
        + 'IV. O design participativo é um processo de design de IHC viável para direcionar o projeto, pois o público-alvo tende a apresentar dificuldades no manuseio de tecnologias da informação e da comunicação.\n\n' + AFIRMACOES,
        ['I e II.', 'I e III.', 'II e IV.', 'I, III e IV.', 'II, III e IV.'], 'E',
        'Responsividade, protótipos e design participativo se encaixam no cenário. A I parte de uma generalização sobre o público que o texto não sustenta.'),
      q(21, 'Engenharia de Software',
        'A Gestão de Configuração de Software estabelece um conjunto de atividades para gerenciar alterações durante todo o ciclo de vida de um software (Pressman).\n\n'
        + 'Assinale a opção correta acerca das atividades de gestão de configuração de software.',
        ['Identificação de itens na configuração de software, gerenciamento de alterações, validação de versões e controle de qualidade.', 'Identificação de objetos na configuração de software, controle de versão, controle de alterações, auditoria de configuração e relatório de status.', 'Gerência de projeto, gerência de configuração de software, ciclo de vida do projeto, processo de software e evolução das configurações.', 'Construção de modelo de requisitos, métricas para modelo de projeto, métricas de controle de versão e relatório de manutenção.', 'Identificação de alterações, controle de versão, mapeamento de alteração e notificação da alteração aos envolvidos.'], 'B',
        'São as cinco tarefas clássicas da gestão de configuração em Pressman: identificação, controle de versão, controle de alterações, auditoria e relatório de status.'),
      q(22, 'Engenharia de Software',
        'Sobre o processo de Gerência de Configuração de Software (GCS), avalie as afirmações:\n'
        + 'I. O controle de versão possibilita o compartilhamento de dados e a edição colaborativa, permitindo a gestão de diferentes ramos de desenvolvimento e a existência de diferentes versões de forma simultânea.\n'
        + 'II. A auditoria de configuração é uma atividade de garantia de qualidade que tem por objetivo assegurar que a qualidade do software seja mantida quando feitas alterações requisitadas.\n'
        + 'III. O relatório de status de configuração tem por objetivo manter o cliente informado sobre as alterações, e deve ser gerado ao final do processo.\n'
        + 'IV. A GCS proporciona atividades de acompanhamento e controle de mudanças que se iniciam logo depois que o software for fornecido ao cliente e colocado em operação.\n\n' + AFIRMACOES,
        ['I e II.', 'II e III.', 'III e IV.', 'I, II e IV.', 'I, III e IV.'], 'A',
        'O relatório de status informa a equipe ao longo de todo o processo, não só no final. E a GCS começa junto com o projeto, não depois da entrega.'),
      q(23, 'Engenharia de Software',
        'A evolução de sistemas legados se divide em manutenção, modernização e substituição. Um ERP já implantado integra todos os departamentos de uma empresa, e surgiu a necessidade de criar um relatório gerencial de comissão da equipe de vendas.\n\n'
        + 'Nesse contexto, a manutenção a ser realizada é',
        ['corretiva.', 'evolutiva.', 'funcional.', 'preventiva.', 'adaptativa.'], 'B',
        'Acrescentar uma funcionalidade nova (o relatório) é manutenção evolutiva. Corretiva conserta defeito e adaptativa ajusta o sistema a um ambiente novo.'),
      q(24, 'Engenharia de Software',
        'Num sistema web de delivery, o analista de teste descreveu:\n'
        + '01 – Verificar se o método "Finalizar Pedido" da classe "Pedido" está funcionando corretamente.\n'
        + '02 – Garantir que o sistema funcione corretamente em diferentes navegadores.\n'
        + '03 – O sistema deve passar por testes rigorosos na estrutura lógica interna do software.\n'
        + '04 – O sistema deve garantir, no mínimo, o registro de 100 pedidos simultâneos.\n'
        + '05 – O usuário deve testar o sistema em um ambiente controlado sob a supervisão dos desenvolvedores.\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. A descrição 01 deve ser verificada com teste unitário.\n'
        + 'II. A descrição 02 deve ser executada com a abordagem caixa-branca.\n'
        + 'III. A descrição 03 deve ser executada com a abordagem caixa-preta.\n'
        + 'IV. A descrição 04 deve ser verificada com teste de carga.\n'
        + 'V. A descrição 05 deve ser classificada como teste alfa.\n\n' + AFIRMACOES,
        ['II e III.', 'I, II e IV.', 'I, III e V.', 'I, IV e V.', 'II, III, IV e V.'], 'D',
        'II e III estão trocadas: testar navegadores é caixa-preta (olha só o comportamento) e testar a lógica interna é caixa-branca.'),
      q(25, 'Engenharia de Software',
        'Uma empresa de piscicultura pediu com extrema urgência um sistema para gerenciar a criação dos peixes, das fases de alevino e engorda até a venda, registrando mortandade e rações.\n\n'
        + 'Avalie as afirmações sobre o processo de desenvolvimento a usar:\n'
        + 'I. Deve ser adotado um processo baseado no modelo cascata, pois ele se adapta melhor a cenários com muitas mudanças.\n'
        + 'II. Por se tratar de uma aplicação com escopo pequeno, o modelo espiral deverá ser utilizado, já que reduzirá riscos por meio da prototipação de cada fase dos peixes e diminuirá o tempo de entrega.\n'
        + 'III. O modelo incremental deve ser utilizado, já que partes do sistema referentes à fase inicial dos peixes poderiam ser disponibilizadas, enquanto as demais estão nas etapas de concepção e desenvolvimento.\n'
        + 'IV. Em razão da extrema urgência, a empresa deve elaborar seu processo utilizando o modelo RAD (Rapid Application Development).\n\n' + AFIRMACOES,
        ['I.', 'IV.', 'I e II.', 'II e III.', 'III e IV.'], 'E',
        'Entregar por partes (incremental) e com rapidez (RAD) atende a urgência. O cascata é o modelo que pior lida com mudanças, e o espiral é indicado para projetos grandes e arriscados.'),
      q(26, 'Cibersegurança e LGPD',
        'Empreender em computação exige observar a legislação, como a Lei Geral de Proteção de Dados Pessoais (LGPD, Lei n. 13.709/2018).\n\n'
        + 'Assinale os fundamentos da disciplina da proteção de dados pessoais, previstos no art. 2º da LGPD.',
        ['O direito ao usuário; as obrigações das organizações nacionais ou estrangeiras; obrigatoriedade do consentimento; a livre iniciativa, a livre concorrência e a defesa do consumidor; os direitos humanos e a cidadania; e a regulação da ANPD.', 'O direito à revogação de um consentimento; a transferência de dados para outro fornecedor; a solicitação de remoção de dados pessoais; a inviolabilidade da intimidade, da honra e da imagem; o desenvolvimento econômico e tecnológico e a inovação; a preservação da vida e da integridade física.', 'O respeito à privacidade; obrigatoriedade do consentimento; os deveres dos usuários finais; os deveres das organizações nacionais ou estrangeiras; o código de defesa do consumidor; e a obrigatoriedade do respeito à honra e à imagem.', 'O direito ao anonimato; a liberdade de expressão; a inviolabilidade da intimidade; medidas preventivas de segurança; o direito ao recurso e revisão; a administração de riscos e falhas; os agentes de tratamento; e a regulação da ANPD.', 'O respeito à privacidade; a autodeterminação informativa; a liberdade de expressão, de informação, de comunicação e de opinião; a inviolabilidade da intimidade, da honra e da imagem; o desenvolvimento econômico e tecnológico e a inovação; a livre iniciativa, a livre concorrência e a defesa do consumidor; e os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania.'], 'E',
        'A alternativa E reproduz os sete incisos do art. 2º. As outras misturam fundamentos com direitos do titular, bases legais e obrigações.'),
      q(27, 'Matemática e Lógica',
        'Os profissionais de TI precisam converter números entre as bases binária (2), octal (8), decimal (10) e hexadecimal (16).\n\n'
        + 'Fazendo a conversão da soma (1001)₂ + (15)₈ + (FF)₁₆, qual é o número equivalente na base decimal?',
        ['(188)₁₀', '(215)₁₀', '(277)₁₀', '(316)₁₀', '(345)₁₀'], 'C',
        '(1001)₂ = 9, (15)₈ = 1×8 + 5 = 13 e (FF)₁₆ = 15×16 + 15 = 255. Soma: 9 + 13 + 255 = 277.'),
      q(28, 'Sistemas Operacionais',
        'O sistema operacional é um gerenciador de recursos. É uma péssima ideia permitir que os programas tenham acesso sem restrição à memória uns dos outros: um programa com defeito ou malicioso pode travar outro, produzir resultados incorretos ou afetar todo o sistema (Stuart, adaptado).\n\n'
        + 'A atividade com que o sistema operacional garante essa proteção é',
        ['o programa antivírus.', 'o gerenciamento de memória.', 'o gerenciamento de arquivos.', 'o gerenciamento de processos.', 'o gerenciamento de entrada e saída.'], 'B',
        'É o gerenciamento de memória que dá a cada processo o seu espaço de endereços e impede que um escreva na área do outro.'),
      q(29, 'Algoritmos e Estruturas de Dados',
        'Considere o algoritmo:\n\n'
        + 'mat[1..3][1..5] = {{1, 2, -1, 2, 3}, {1, -3, 4, 2, 0}, {-3, 5, 2, 3, 4}}\nsl[1..3] = {0, 0, 0}\nx <- 0\npara i <- 1 até 3 faça\n    para j <- 1 até 5 faça\n        sl[i] <- sl[i] + mat[i][j]\n    fimpara\n    x <- x + sl[i]\nfimpara\nimprima x\n\n'
        + 'No fim da execução, será exibido o valor',
        ['4.', '7.', '11.', '22.', '30.'], 'D',
        'As somas das linhas são 7, 4 e 11. x acumula essas somas: 7 + 4 + 11 = 22.'),
      q(30, 'Redes e Sistemas Distribuídos',
        'Na sala dos professores há 3 máquinas na rede:\n'
        + 'PROFESSORES01: IP 175.16.10.200, máscara 255.255.255.0, gateway 175.16.1.1\n'
        + 'PROFESSORES02: IP 175.16.20.200, máscara 255.255.0.0, gateway 175.16.1.1\n'
        + 'PROFESSORES03: IP 175.16.30.200, máscara 255.255.0.0, gateway 175.16.1.1\n\n'
        + 'A estação PROFESSORES01 não consegue imprimir na impressora compartilhada pela PROFESSORES03. Que alteração resolve o problema?',
        ['Alterar o gateway da estação PROFESSORES03 para 175.16.10.200.', 'Alterar o endereço de IP da estação PROFESSORES01 para 175.16.30.200.', 'Alterar a máscara de sub-rede da estação PROFESSORES01 para 255.255.0.0.', 'Alterar a máscara de sub-rede da estação PROFESSORES03 para 255.255.255.0.', 'Alterar o gateway da estação PROFESSORES01 para o endereço de IP 175.16.30.200.'], 'C',
        'Com máscara 255.255.255.0, a PROFESSORES01 se vê na rede 175.16.10.0 e acha que a 03 está em outra rede. Com 255.255.0.0, todas ficam na 175.16.0.0.'),
      q(31, 'Engenharia de Software',
        'Um software de matrículas tem este diagrama de casos de uso: o ator Aluno se liga a "Realizar Matrícula"; "Realizar Matrícula Fora do Prazo" estende (<<extend>>) "Realizar Matrícula"; '
        + '"Realizar Matrícula Fora do Prazo" inclui (<<include>>) "Validar Aluno"; e "Validar via Retina" e "Validar via Digital" são especializações de "Validar Aluno".\n\n'
        + 'Avalie as afirmações:\n'
        + 'I. O aluno poderá realizar a matrícula fora do prazo e as tratativas são as mesmas da matrícula feita dentro do prazo.\n'
        + 'II. O aluno poderá, opcionalmente, realizar a matrícula fora do prazo.\n'
        + 'III. O sistema, obrigatoriamente, deverá validar o aluno que realizar a matrícula fora do prazo.\n'
        + 'IV. A validação do aluno deverá ser feita a partir da sua matrícula informada no sistema.\n'
        + 'V. A validação do aluno, a ser feita por retina, é diferente da validação feita pela digital.\n\n' + AFIRMACOES,
        ['I e IV.', 'I, II e IV.', 'I, III e V.', 'II, III e V.', 'II, III, IV e V.'], 'D',
        '<<extend>> é opcional (II), <<include>> é obrigatório (III) e as especializações são formas diferentes de validar (V). A validação é por retina ou digital, não pela matrícula.'),
      q(32, 'Gestão e Empreendedorismo',
        'O Canvas de Osterwalder divide o modelo de negócio em nove componentes: segmentos de clientes, proposta de valor, canais, relacionamento com cliente, fontes de receita, recursos principais, atividades-chave, parcerias principais e estrutura de custo. É muito usado por startups.\n\n'
        + 'Diante deste contexto, conclui-se que as startups',
        ['financeiras desenvolvem primeiro o plano de negócios, para em seguida partir para o Canvas.', 'de big data utilizam o Canvas para a modelagem da validação da ideia de negócio, ou seja, do problema a ser resolvido.', 'de educação dispensam a utilização do Canvas, ou seja, os modelos de negócios deste segmento já nascem validados.', 'de logística utilizam o plano de negócios ao invés do Canvas, ou seja, elas nascem a partir de um produto mínimo viável (MVP).', 'de impacto social podem desconsiderar o componente 1 (segmentos de clientes), pois possuem somente um segmento.'], 'B',
        'O Canvas serve justamente para modelar e validar a ideia antes de investir, em qualquer segmento. Nenhum tipo de startup nasce validado ou pode ignorar um componente.'),
      q(33, 'Engenharia de Software',
        'O CMMI descreve práticas, processos e atividades de gestão que guiam a melhoria do processo de software até o nível mais alto de maturidade. Avalie as afirmações:\n'
        + 'I. A maturidade implica no crescimento da capacidade e indica tanto a efetividade do processo de software quanto o grau de consistência com que este é aplicado nos diferentes projetos da organização.\n'
        + 'II. A maturidade do processo de software implica melhorias contínuas com base em etapas evolutivas que se caracterizam pela capacidade de inovação e absorção de novas tecnologias.\n'
        + 'III. A maturidade do processo de software implica na sua institucionalização por meio de políticas e padrões organizacionais, levando a uma cultura corporativa de métodos, práticas e procedimentos com efetividade plenamente reconhecida.\n'
        + 'IV. Cada nível do CMMI implica na satisfação de um conjunto de metas de processo que estabilizam um componente importante do processo de software e representa o seu estágio de maturidade.\n\n' + AFIRMACOES,
        ['III.', 'I e II.', 'II e IV.', 'I, III e IV.', 'I, II, III e IV.'], 'D',
        'Pelo gabarito, a II é a falsa: as etapas evolutivas do CMMI são níveis de controle do processo, não de capacidade de inovação ou absorção de tecnologias.'),
      q(34, 'Inteligência Artificial',
        'Um sistema especialista para diagnóstico de dengue usa a regra de produção:\n\n'
        + 'Se ((temperatura > 38º) e (dores musculares intensas))\nentão (quadro de dengue, com 70% de chance);\nsenão (quadro de resfriado comum com 30% de chance);\n\n'
        + 'Levando em conta essa regra, é correto afirmar que',
        ['cada pessoa que procura atendimento apresentando ambos os sintomas possui a probabilidade 0,7 de estar contaminada pela dengue.', 'se 50 pessoas procurarem o atendimento apresentando um dos dois sintomas, provavelmente 15 pessoas estarão com resfriado comum.', 'se 100 pessoas procurarem o atendimento apresentando ambos os sintomas, a quantidade de pessoas com dengue será igual a 70.', 'cada pessoa que chega apresentando um dos dois sintomas estará com resfriado comum.', 'a cada 100 pessoas que procuram atendimento, no máximo 30 estarão doentes.'], 'A',
        'A regra dá uma probabilidade para cada pessoa com os dois sintomas: 0,7. Ela não garante uma contagem exata (C) nem diz nada certo sobre quem tem só um sintoma.'),
    ],
  },
]);

/** Letra da alternativa (A–E) → posição no vetor. */
export const indiceDaLetra = (letra) => 'ABCDE'.indexOf(letra);

/** As questões de uma prova no formato de carta do Nex_TI (frente, opções, correta, verso, dica). */
export function cartasDaProva(ano) {
  const prova = PROVAS_ENADE.find((p) => p.ano === ano);
  if (!prova) return [];
  return prova.questoes.map((questao) => {
    const correta = indiceDaLetra(questao.correta);
    return {
      frente: `(ENADE ${ano} · Questão ${questao.numero} · ${questao.area}) ${questao.enunciado}`,
      opcoes: questao.opcoes.map((texto, i) => `${'ABCDE'[i]}) ${texto}`),
      correta,
      verso: `Alternativa ${questao.correta}.\n\nJustificativa: ${questao.explicacao}\n\nFonte: INEP, ENADE ${ano}, Tecnologia em Análise e Desenvolvimento de Sistemas, questão ${questao.numero} (gabarito definitivo).`,
      dica: `Questão oficial do ENADE ${ano}: ${questao.area}.`,
    };
  });
}

const c = (frente, verso, dica) => ({ frente, verso, dica });

/**
 * Guia de estudos para o ENADE de ADS: como a prova funciona, como atacar cada tipo de
 * questão e os conceitos que caíram nas provas de 2017 e 2021. Vem antes das provas
 * oficiais na trilha, para o aluno revisar a teoria e depois praticar.
 */
export const GUIA_DE_ESTUDOS = Object.freeze([
  // Como a prova funciona (instruções do caderno de 2021)
  c('O que é o ENADE?',
    'O Exame Nacional de Desempenho dos Estudantes, aplicado pelo INEP. Ele avalia os cursos de graduação e, para o estudante convocado, é obrigatório: quem não faz fica com pendência para receber o diploma.',
    'Quem aplica é o INEP.'),
  c('Como a prova do ENADE é dividida?',
    '40 questões em 4 horas:\n• Formação Geral: 2 discursivas + 8 objetivas.\n• Componente Específico (ADS): 3 discursivas + 27 objetivas.\nNo fim há ainda um questionário de percepção da prova, que não vale nota.',
    '10 de Formação Geral + 30 específicas.'),
  c('Quanto vale cada parte do ENADE?',
    'Formação Geral vale 25% da nota e Componente Específico, 75%.\nDentro da Formação Geral: discursivas 40% e objetivas 60%.\nDentro do Específico: discursivas 15% e objetivas 85%.',
    'As objetivas específicas são a maior parte da nota.'),
  c('Como são as questões discursivas do ENADE?',
    'Cada resposta tem no máximo 15 linhas. Na Formação Geral, pedem um texto argumentativo com proposta (2021: arte, cultura e censura; cidades inteligentes). No Específico de ADS caíram código em pseudocódigo (fila, lista encadeada, média de valores) e diagrama de classes.',
    '15 linhas, sem passar do espaço.'),
  c('Como resolver uma questão do tipo "avalie as afirmações"?',
    'Julgue cada afirmação sozinha (V ou F) e anote. Depois procure a alternativa com exatamente as verdadeiras. Achou uma falsa com certeza? Elimine todas as alternativas que a incluem.',
    'Eliminar alternativas economiza tempo.'),
  c('Como resolver uma questão de asserção-razão ("I PORQUE II")?',
    '1º veja se I é verdadeira. 2º veja se II é verdadeira. 3º só se as duas forem, pergunte se II explica I. Se uma for falsa, a relação nem importa.',
    'Julgue as duas antes da relação.'),
  // Engenharia de software
  c('Qual a diferença entre requisito funcional e não funcional?',
    'Funcional diz O QUE o sistema faz ("emitir relatório de compras"). Não funcional diz COMO ou com que restrição ("responder em até 2 segundos", "rodar no Linux", "ficar pronto em 6 meses").',
    'Caiu em 2017 (Q12) e 2021 (Q09).'),
  c('Quais são os tipos de requisito não funcional?',
    'Desempenho (tempo de resposta), usabilidade (facilidade de aprender e usar, acessibilidade), portabilidade (trocar de sistema operacional), segurança (controle de acesso) e confiabilidade (funcionar sem falhas).',
    'Confiabilidade não é tempo de resposta.'),
  c('Quais são os subprocessos da engenharia de requisitos?',
    'Estudo de viabilidade, elicitação (ex.: entrevista com usuários), especificação (ex.: casos de uso dos requisitos funcionais) e validação (ex.: protótipo de telas).',
    'Caso de uso modela requisito funcional.'),
  c('O que é o caminho crítico de um projeto?',
    'A sequência de atividades com a maior duração total. Se qualquer atividade dele atrasar, o projeto inteiro atrasa. Para achar: some as durações de cada caminho e pegue o maior.',
    'Some todos os caminhos.'),
  c('Quais são os tipos de manutenção de software?',
    'Corretiva: conserta defeito.\nAdaptativa: ajusta a um ambiente novo (outro SO, nova lei).\nEvolutiva/perfectiva: acrescenta ou melhora funções (ex.: um relatório novo).\nPreventiva: evita problemas futuros.',
    'Relatório novo = evolutiva.'),
  c('Quando usar cascata, incremental, espiral e RAD?',
    'Cascata: requisitos estáveis, fases em sequência (lida mal com mudanças).\nIncremental: entrega o sistema em partes.\nEspiral: projetos grandes e arriscados, com análise de risco no planejamento.\nRAD: prazo muito curto.',
    'Urgência pede incremental ou RAD.'),
  c('No Scrum, quem gerencia o Product Backlog?',
    'O Product Owner. O Scrum Master cuida do processo e remove impedimentos; os desenvolvedores constroem o incremento.',
    'Pegadinha clássica: não é o Scrum Master.'),
  c('O que caracteriza a XP (eXtreme Programming)?',
    'Foco na qualidade do código: testes automatizados escritos antes do código (TDD), programação em par, integração contínua e entregas pequenas e frequentes.',
    'Teste antes do código = TDD.'),
  c('Quais são as tarefas da gerência de configuração de software?',
    'Identificação dos itens de configuração, controle de versão, controle de alterações, auditoria de configuração e relatório de status. Ela começa junto com o projeto, não depois da entrega.',
    'São cinco tarefas.'),
  c('No controle de versão, para que servem checkout, branch, merge e tag?',
    'Checkout: baixa os arquivos do repositório.\nBranch: ramo separado para uma mudança grande.\nMerge: junta versões e resolve conflitos.\nTag: marca uma versão (release); não resolve conflito.',
    'Conflito se resolve com merge.'),
  c('Qual a diferença entre teste caixa-branca e caixa-preta?',
    'Caixa-branca olha a estrutura interna do código (caminhos, condições). Caixa-preta olha só entradas e saídas, sem ver o código (ex.: testar em vários navegadores).',
    'Branca = vê o código.'),
  c('O que são teste unitário, de carga, alfa e de aceitação?',
    'Unitário: testa um método ou classe isolado.\nCarga: vê se aguenta o volume (ex.: 100 pedidos simultâneos).\nAlfa: o usuário testa no ambiente do desenvolvedor, supervisionado (o beta é no ambiente do usuário).\nAceitação: o cliente confirma que é o que pediu.',
    'Alfa = com os desenvolvedores por perto.'),
  c('O que é o CMMI?',
    'Um modelo de maturidade de processos: a empresa sobe de nível cumprindo metas de processo, até chegar à melhoria contínua. É pesado e voltado a organizações maiores; no Brasil, o MPS.BR foi pensado para pequenas e médias.',
    'Maturidade = processo estável e institucionalizado.'),
  // Modelagem e programação
  c('Em casos de uso, qual a diferença entre <<include>> e <<extend>>?',
    '<<include>>: o comportamento incluído SEMPRE acontece (obrigatório).\n<<extend>>: acontece só em certa condição (opcional), como "matrícula fora do prazo".\nGeneralização: formas diferentes de fazer a mesma coisa (validar por retina ou por digital).',
    'Include obrigatório, extend opcional.'),
  c('Como ler as multiplicidades 1, 0..1, 0..* e 1..* na UML?',
    '1: exatamente um. 0..1: no máximo um, pode não ter. 0..*: zero ou muitos. 1..*: pelo menos um, sem limite. Um lado 1..* pede uma coleção (lista) no código, não um atributo simples.',
    '1..* não tem limite superior.'),
  c('O que indica o losango cheio num diagrama de classes?',
    'Composição: a parte depende do todo e não existe sem ele. O losango vazio é agregação, um vínculo mais fraco.',
    'Cheio = composição.'),
  c('O que é o padrão de projeto Strategy?',
    'Uma família de algoritmos com a mesma interface, que podem ser trocados em tempo de execução trocando o objeto usado (ex.: modo comum e modo probabilista de uma calculadora). Princípio: programar para uma interface.',
    'Não confunda com Adapter, que converte interfaces.'),
  c('Pode criar um vetor de uma classe abstrata em Java?',
    'Pode: Impressora imp[] = new Impressora[3] cria só o vetor. O que não pode é new Impressora(). Cada posição recebe um objeto concreto, e imp[i].imprimir() chama a versão de cada classe: polimorfismo.',
    'Vetor do tipo abstrato compila.'),
  c('Como funcionam a pilha e a fila?',
    'Pilha é LIFO: push empilha, pop tira o topo, top só lê.\nFila é FIFO: enqueue entra no fim, dequeue sai do início.\nNo push de uma pilha encadeada: novo.prox = topo; topo = novo.',
    'top() não remove nada.'),
  c('Quais são os percursos de uma árvore binária?',
    'Pré-ordem: raiz, esquerda, direita.\nEm-ordem: esquerda, raiz, direita (numa árvore de busca, sai ordenado).\nPós-ordem: esquerda, direita, raiz.',
    'O nome diz quando a raiz é visitada.'),
  c('Como funciona a ordenação por inserção?',
    'Pega cada elemento e o encaixa na parte já ordenada, empurrando os maiores uma casa para a direita (vetor[j + 1] <- vetor[j]) até achar a posição.',
    'Como ordenar cartas na mão.'),
  // Banco de dados, redes, sistemas operacionais e outros temas
  c('Quando usar GROUP BY numa consulta SQL?',
    'Sempre que usar função de agregação (SUM, AVG, COUNT, MAX, MIN) junto de outras colunas: agrupe por essas colunas. SUM soma valores, COUNT conta linhas, AVG tira média. Para mostrar do maior para o menor: ORDER BY ... DESC.',
    'Total de votos é SUM, não COUNT.'),
  c('Como ler a cardinalidade (mínimo, máximo) no modelo entidade-relacionamento?',
    'O par (mín, máx) junto de uma entidade diz quantas vezes ela participa. Ex.: pessoa (1,1) — possui — (0,1) cavalo: cada cavalo tem exatamente um dono, e cada pessoa tem no máximo um cavalo (pode não ter).',
    'Mínimo 0 = participação opcional.'),
  c('Como converter números de outras bases para decimal?',
    'Multiplique cada dígito pela potência da base. (1001)₂ = 8 + 1 = 9; (15)₈ = 1×8 + 5 = 13; (FF)₁₆ = 15×16 + 15 = 255.',
    'Em hexadecimal, A = 10 ... F = 15.'),
  c('Para que serve a máscara de sub-rede?',
    'Ela diz que parte do IP é a rede. Máquinas só se falam direto se estiverem na mesma rede: 175.16.10.200 com máscara 255.255.255.0 fica na rede 175.16.10.0 e não alcança 175.16.30.200 sem roteador. Com 255.255.0.0, as duas ficam na 175.16.0.0.',
    'Mesma rede = comunicação direta.'),
  c('O que é multiprogramação, e quem protege a memória dos processos?',
    'Multiprogramação: a CPU alterna rapidamente entre processos, dando a impressão de paralelismo. A gerência de memória do sistema operacional dá a cada processo o seu espaço e impede que um escreva na área do outro.',
    'Proteção de memória = gerência de memória.'),
  c('Quais são os fundamentos da LGPD (art. 2º)?',
    'Respeito à privacidade; autodeterminação informativa; liberdade de expressão, informação, comunicação e opinião; inviolabilidade da intimidade, da honra e da imagem; desenvolvimento econômico e tecnológico e inovação; livre iniciativa, livre concorrência e defesa do consumidor; direitos humanos, dignidade e cidadania.',
    'Lei 13.709/2018.'),
  c('Qual recurso do HTML atende a acessibilidade em imagens?',
    'O atributo alt: os leitores de tela leem esse texto para pessoas com deficiência visual. Outras boas práticas (WCAG): bom contraste, navegação pelo teclado e não depender só da cor.',
    'Acessibilidade = igualdade de acesso.'),
  c('Quais são os 9 blocos do Business Model Canvas?',
    'Segmentos de clientes, proposta de valor, canais, relacionamento com clientes, fontes de receita, recursos principais, atividades-chave, parcerias principais e estrutura de custo. Serve para modelar e validar a ideia de negócio.',
    'Nenhum bloco pode ser ignorado.'),
  c('Como funciona um sistema especialista com regras de produção?',
    'Usa regras "se condição então conclusão" sobre os fatos da memória de trabalho. Uma regra como "se febre e dores, então dengue com 70% de chance" dá uma probabilidade para cada caso, não uma contagem exata de pessoas.',
    'Probabilidade não é garantia.'),
]);
