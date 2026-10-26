// Resumos e cartas autorais a partir dos materiais locais de AVA e ED.
// pagina corresponde à página física do PDF ou ao slide do PPTX (início em 1).
export const DISCIPLINAS_SEMESTRES_12 = [
  {
    "id": "s1-ava-ciberseguranca",
    "semestre": 1,
    "origem": "AVA",
    "nome": "Cibersegurança",
    "resumo": [
      "Cibersegurança reúne pessoas, processos e tecnologias para proteger sistemas e informações. A confidencialidade limita o acesso a quem tem autorização, a integridade protege contra alterações indevidas e a disponibilidade permite usar os serviços quando necessário. Esses objetivos ajudam a avaliar os efeitos de um incidente. Uma fraude por engenharia social, por exemplo, pode começar pela manipulação de uma pessoa, mesmo quando os equipamentos possuem ferramentas de proteção.",
      "A defesa combina controles de rede, criptografia e monitoramento. Firewalls aplicam regras de tráfego; IDS identificam atividades suspeitas; a análise de eventos ajuda a investigar o que aconteceu. A resposta precisa priorizar impactos, conter a propagação e recuperar as operações. No desenvolvimento, proteger entradas e reduzir superfícies de ataque deve começar no projeto. Políticas, capacitação e auditorias complementam as ferramentas, deixando claras as responsabilidades e permitindo revisar as medidas conforme os riscos mudam."
    ],
    "topicos": [
      "Princípios de segurança",
      "Engenharia social",
      "Defesa de redes",
      "Criptografia",
      "Resposta a incidentes",
      "Desenvolvimento seguro",
      "Políticas e auditoria"
    ],
    "fontes": [
      {
        "id": "s1-ava-ciberseguranca-f00",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Cibersegurança/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "Cibersegurança — Livro-Texto - Unidade I",
        "paginas": [
          13,
          57
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-ciberseguranca-f01",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Cibersegurança/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "Cibersegurança — Livro-Texto - Unidade II",
        "paginas": [
          1,
          17,
          41
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-ciberseguranca-f02",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Cibersegurança/UNIDADE 3/Livro-Texto - Unidade III.pdf",
        "titulo": "Cibersegurança — Livro-Texto - Unidade III",
        "paginas": [
          4,
          5,
          10,
          22
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-ciberseguranca-f03",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Cibersegurança/UNIDADE 4/Livro-Texto - Unidade IV.pdf",
        "titulo": "Cibersegurança — Livro-Texto - Unidade IV",
        "paginas": [
          1,
          2,
          9,
          62
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Qual princípio é afetado quando alguém lê um arquivo sem autorização?",
        "verso": "A confidencialidade, pois ela exige restringir o acesso à informação às pessoas e aos sistemas autorizados.",
        "dica": "Associe leitura indevida à exposição de informação.",
        "fonteId": "s1-ava-ciberseguranca-f00",
        "pagina": 13
      },
      {
        "frente": "Qual princípio é afetado por uma alteração não autorizada nas notas de alunos?",
        "verso": "A integridade, que busca preservar a correção dos dados e impedir modificações indevidas.",
        "dica": "Pense na confiabilidade do conteúdo.",
        "fonteId": "s1-ava-ciberseguranca-f00",
        "pagina": 13
      },
      {
        "frente": "Qual princípio é afetado quando um serviço fica inacessível aos usuários legítimos?",
        "verso": "A disponibilidade, pois os recursos precisam estar acessíveis para uso autorizado quando necessário.",
        "dica": "Relacione a falha à continuidade de acesso.",
        "fonteId": "s1-ava-ciberseguranca-f00",
        "pagina": 13
      },
      {
        "frente": "Por que a engenharia social também exige treinamento de pessoas?",
        "verso": "Porque explora confiança, medo ou distração para induzir alguém a revelar informações ou realizar ações inseguras.",
        "dica": "A vulnerabilidade explorada pode estar na interação humana.",
        "fonteId": "s1-ava-ciberseguranca-f00",
        "pagina": 57
      },
      {
        "frente": "Por que instalar um firewall sem revisar suas regras é insuficiente?",
        "verso": "O firewall decide com base nas regras configuradas; regras incorretas podem permitir tráfego indevido ou bloquear serviços necessários.",
        "dica": "Ferramentas dependem de configuração e acompanhamento.",
        "fonteId": "s1-ava-ciberseguranca-f01",
        "pagina": 17
      },
      {
        "frente": "Qual cuidado central acompanha o uso de uma chave criptográfica simétrica?",
        "verso": "A mesma chave permite cifrar e decifrar, por isso seu compartilhamento e armazenamento precisam ser protegidos.",
        "dica": "A proteção da chave faz parte da proteção dos dados.",
        "fonteId": "s1-ava-ciberseguranca-f01",
        "pagina": 41
      },
      {
        "frente": "Como a criptografia assimétrica organiza suas chaves?",
        "verso": "Ela utiliza um par relacionado de chaves, uma pública e outra privada, com papéis complementares nas operações criptográficas.",
        "dica": "A chave privada deve permanecer protegida.",
        "fonteId": "s1-ava-ciberseguranca-f01",
        "pagina": 41
      },
      {
        "frente": "Como IDS e IPS diferem na reação a atividades suspeitas?",
        "verso": "O IDS se concentra em detectar e alertar; o IPS também pode interromper ou bloquear atividades identificadas como maliciosas.",
        "dica": "Detecção e prevenção são funções relacionadas, mas distintas.",
        "fonteId": "s1-ava-ciberseguranca-f01",
        "pagina": 1
      },
      {
        "frente": "Por que correlacionar eventos em um SIEM ajuda a investigar incidentes?",
        "verso": "Eventos de fontes diferentes podem revelar um padrão de ataque que passaria despercebido quando cada registro é examinado isoladamente.",
        "dica": "Procure relações entre registros e horários.",
        "fonteId": "s1-ava-ciberseguranca-f02",
        "pagina": 4
      },
      {
        "frente": "Por que isolar uma máquina comprometida pode fazer parte da resposta a incidentes?",
        "verso": "O isolamento busca conter a propagação do ataque e reduzir novos danos enquanto a equipe investiga e recupera o ambiente.",
        "dica": "Contenção limita o alcance do incidente.",
        "fonteId": "s1-ava-ciberseguranca-f02",
        "pagina": 5
      },
      {
        "frente": "Qual é o papel de um plano de recuperação de desastres?",
        "verso": "Definir como restaurar serviços e dados após uma interrupção, com ações e responsabilidades previamente organizadas.",
        "dica": "Planejar antes reduz improvisação durante a crise.",
        "fonteId": "s1-ava-ciberseguranca-f02",
        "pagina": 10
      },
      {
        "frente": "Por que segurança por design começa antes de o programa ficar pronto?",
        "verso": "Decisões de arquitetura e validação tomadas desde o início reduzem vulnerabilidades e evitam tratar segurança apenas como correção final.",
        "dica": "Segurança acompanha o ciclo de desenvolvimento.",
        "fonteId": "s1-ava-ciberseguranca-f02",
        "pagina": 22
      },
      {
        "frente": "O que uma política de segurança comunica aos colaboradores?",
        "verso": "Diretrizes formais para proteger informações e ativos, incluindo responsabilidades e regras de uso e acesso.",
        "dica": "A política orienta comportamentos e decisões.",
        "fonteId": "s1-ava-ciberseguranca-f03",
        "pagina": 2
      },
      {
        "frente": "Como normas de segurança ajudam a organizar a proteção de informações?",
        "verso": "Elas oferecem referências e requisitos para estruturar práticas, avaliar riscos e verificar controles de forma consistente.",
        "dica": "Normas apoiam a gestão, além das ferramentas.",
        "fonteId": "s1-ava-ciberseguranca-f03",
        "pagina": 9
      },
      {
        "frente": "Para que serve uma auditoria de segurança da informação?",
        "verso": "Avaliar a eficácia das medidas de proteção e identificar falhas, riscos ou desvios que precisam de correção.",
        "dica": "Auditoria compara práticas e evidências.",
        "fonteId": "s1-ava-ciberseguranca-f03",
        "pagina": 62
      },
      {
        "frente": "Por que conscientização deve acompanhar as políticas de segurança?",
        "verso": "As pessoas precisam compreender as regras e sua finalidade para aplicá-las no trabalho e reconhecer situações de risco.",
        "dica": "Uma política sem compreensão dificilmente orienta a prática.",
        "fonteId": "s1-ava-ciberseguranca-f03",
        "pagina": 1
      }
    ]
  },
  {
    "id": "s1-ava-direitos-humanos",
    "semestre": 1,
    "origem": "AVA",
    "nome": "Direitos Humanos",
    "resumo": [
      "Os direitos humanos partem do reconhecimento da dignidade de cada pessoa. Sua proteção depende de instrumentos nacionais e internacionais, mas também de atitudes cotidianas de respeito. Universalidade significa que todas as pessoas devem ser protegidas. Indivisibilidade e interdependência mostram que liberdade, condições materiais de vida e participação social se relacionam: garantir um grupo de direitos não justifica abandonar os demais. A ideia de dimensões ajuda a compreender sua construção histórica sem supor que direitos novos apagam os anteriores.",
      "A disciplina relaciona essa trajetória aos direitos civis e políticos, aos direitos sociais e à proteção de interesses coletivos. No Brasil, a Constituição reúne garantias fundamentais que orientam a convivência e limitam abusos. Igualdade, liberdade de expressão, respeito às convicções e proteção da intimidade também importam no ambiente digital. Para quem desenvolve sistemas, estudar esses fundamentos ajuda a reconhecer exclusões, respeitar diferenças e pensar em serviços acessíveis, sem transformar pessoas em simples registros ou perfis de consumo."
    ],
    "topicos": [
      "Dignidade humana",
      "Universalidade",
      "Dimensões dos direitos",
      "Proteção internacional",
      "Igualdade",
      "Liberdades fundamentais",
      "Inclusão"
    ],
    "fontes": [
      {
        "id": "s1-ava-direitos-humanos-f04",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Direitos Humanos/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "Direitos Humanos — Livro-Texto - Unidade I",
        "paginas": [
          14,
          15,
          20,
          21,
          27,
          28
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-direitos-humanos-f05",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Direitos Humanos/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "Direitos Humanos — Livro-Texto - Unidade II",
        "paginas": [
          5,
          7,
          8,
          9,
          22,
          26
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Por que a dignidade humana não depende da profissão ou da renda de alguém?",
        "verso": "Ela decorre do valor da pessoa como ser humano, e não de sua posição econômica, social ou profissional.",
        "dica": "A dignidade é inerente à pessoa.",
        "fonteId": "s1-ava-direitos-humanos-f04",
        "pagina": 14
      },
      {
        "frente": "O que a universalidade dos direitos humanos exige?",
        "verso": "Que a proteção alcance todas as pessoas, sem reservar direitos apenas a um grupo considerado mais importante.",
        "dica": "Considere quem pode usufruir dos direitos.",
        "fonteId": "s1-ava-direitos-humanos-f04",
        "pagina": 15
      },
      {
        "frente": "Por que os direitos humanos são chamados de indivisíveis?",
        "verso": "Porque formam um conjunto: não é adequado escolher alguns para proteger e abandonar os demais.",
        "dica": "Liberdade e condições dignas de vida se complementam.",
        "fonteId": "s1-ava-direitos-humanos-f04",
        "pagina": 15
      },
      {
        "frente": "O que significa interdependência entre direitos humanos?",
        "verso": "A realização de um direito se relaciona com outros; educação, saúde e participação social, por exemplo, influenciam-se mutuamente.",
        "dica": "Direitos não funcionam como compartimentos isolados.",
        "fonteId": "s1-ava-direitos-humanos-f04",
        "pagina": 15
      },
      {
        "frente": "Por que se usa a expressão dimensões de direitos humanos?",
        "verso": "Ela destaca que os direitos se acumulam e se complementam, em vez de uma geração substituir e encerrar a anterior.",
        "dica": "Pense em construção histórica cumulativa.",
        "fonteId": "s1-ava-direitos-humanos-f04",
        "pagina": 20
      },
      {
        "frente": "Que tipo de proteção caracteriza os direitos civis e políticos?",
        "verso": "A proteção de liberdades e da participação política, limitando arbitrariedades do poder e reconhecendo direitos dos indivíduos.",
        "dica": "Relacione liberdade com limites ao poder.",
        "fonteId": "s1-ava-direitos-humanos-f04",
        "pagina": 21
      },
      {
        "frente": "Como os direitos sociais se relacionam com uma vida digna?",
        "verso": "Eles abrangem condições como trabalho, saúde, moradia, educação e proteção social, necessárias ao exercício concreto da dignidade.",
        "dica": "Não basta reconhecer direitos apenas no papel.",
        "fonteId": "s1-ava-direitos-humanos-f04",
        "pagina": 27
      },
      {
        "frente": "Por que a proteção do meio ambiente envolve direitos coletivos?",
        "verso": "Porque a qualidade ambiental afeta a vida de muitas pessoas e depende de responsabilidades que ultrapassam interesses individuais.",
        "dica": "Considere a dimensão compartilhada dos impactos.",
        "fonteId": "s1-ava-direitos-humanos-f04",
        "pagina": 28
      },
      {
        "frente": "Como a Constituição contribui para a proteção dos direitos fundamentais?",
        "verso": "Ela reconhece garantias de dignidade, igualdade e liberdade e orienta a atuação do Estado e a aplicação das demais normas.",
        "dica": "A Constituição organiza limites e garantias.",
        "fonteId": "s1-ava-direitos-humanos-f05",
        "pagina": 5
      },
      {
        "frente": "O que a igualdade perante a lei busca impedir?",
        "verso": "Tratamentos arbitrariamente discriminatórios baseados em características pessoais ou sociais, preservando a proteção jurídica de todos.",
        "dica": "Diferenças pessoais não retiram dignidade.",
        "fonteId": "s1-ava-direitos-humanos-f05",
        "pagina": 7
      },
      {
        "frente": "Por que a proibição da tortura protege também pessoas acusadas de crimes?",
        "verso": "A dignidade e a proteção contra tratamento desumano não desaparecem diante de uma acusação ou condenação.",
        "dica": "Direitos fundamentais não dependem de aprovação social.",
        "fonteId": "s1-ava-direitos-humanos-f05",
        "pagina": 8
      },
      {
        "frente": "Por que liberdade de expressão envolve responsabilidade?",
        "verso": "A liberdade de manifestar ideias não elimina a responsabilidade por danos ou violações de direitos decorrentes dessa manifestação.",
        "dica": "Expressar-se também exige respeito aos outros.",
        "fonteId": "s1-ava-direitos-humanos-f05",
        "pagina": 8
      },
      {
        "frente": "Como o respeito às convicções contribui para a convivência democrática?",
        "verso": "Permite que pessoas com crenças e posições diferentes convivam sem perder direitos por essas diferenças.",
        "dica": "Pluralidade exige respeito recíproco.",
        "fonteId": "s1-ava-direitos-humanos-f05",
        "pagina": 9
      },
      {
        "frente": "Por que proteger a intimidade é relevante em serviços digitais?",
        "verso": "Informações sobre a vida privada podem expor a pessoa; proteger a intimidade limita intromissões e usos que desrespeitem sua dignidade.",
        "dica": "Relacione vida privada e tratamento de informações.",
        "fonteId": "s1-ava-direitos-humanos-f05",
        "pagina": 9
      },
      {
        "frente": "Por que a proteção das pessoas com deficiência integra os direitos humanos?",
        "verso": "Porque a dignidade e a igualdade precisam alcançar essas pessoas, incluindo condições para exercer seus direitos e participar da sociedade.",
        "dica": "Inclusão torna direitos efetivamente acessíveis.",
        "fonteId": "s1-ava-direitos-humanos-f05",
        "pagina": 22
      },
      {
        "frente": "Qual é a importância da participação social na construção de políticas de direitos humanos?",
        "verso": "Ela permite incorporar necessidades e propostas de diferentes grupos, fortalecendo políticas voltadas à dignidade e à inclusão.",
        "dica": "Diálogo aproxima políticas das experiências vividas.",
        "fonteId": "s1-ava-direitos-humanos-f05",
        "pagina": 26
      }
    ]
  },
  {
    "id": "s1-ava-lgpd",
    "semestre": 1,
    "origem": "AVA",
    "nome": "LGPD (Lei Geral de Proteção de Dados)",
    "resumo": [
      "A disciplina apresenta a proteção de dados pessoais como parte da organização de processos e sistemas. O estudo começa pelos princípios: uma coleta precisa ter finalidade definida, ser compatível com essa finalidade e limitar-se aos dados necessários. A transparência permite compreender o tratamento realizado. Também é importante distinguir as responsabilidades de quem decide sobre o tratamento, de quem o executa e de quem atua como canal de comunicação com titulares e autoridade de proteção de dados.",
      "Na construção de software, privacidade precisa ser considerada desde o projeto e nas configurações iniciais. Controle de acesso, proteção de dados armazenados e transmitidos, registros e acompanhamento de riscos fazem parte desse trabalho. A disciplina também aborda o cuidado com transferências internacionais, fiscalização e responsabilização. Os conceitos aqui servem à revisão acadêmica dos materiais: a análise de um caso concreto exige considerar sua finalidade, contexto e regras aplicáveis, sem reduzir toda proteção de dados a obter uma autorização genérica."
    ],
    "topicos": [
      "Princípios do tratamento",
      "Controlador e operador",
      "Encarregado",
      "Bases legais",
      "Privacidade no projeto",
      "Segurança dos dados",
      "Transferência internacional"
    ],
    "fontes": [
      {
        "id": "s1-ava-lgpd-f06",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/LGPD/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "LGPD — Livro-Texto - Unidade I",
        "paginas": [
          10
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-lgpd-f07",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/LGPD/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "LGPD — Livro-Texto - Unidade II",
        "paginas": [
          1,
          6,
          10,
          31
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-lgpd-f08",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/LGPD/UNIDADE 3/Livro-Texto - Unidade III.pdf",
        "titulo": "LGPD — Livro-Texto - Unidade III",
        "paginas": [
          2,
          36,
          37
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-lgpd-f09",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/LGPD/UNIDADE 4/Livro-Texto - Unidade IV.pdf",
        "titulo": "LGPD — Livro-Texto - Unidade IV",
        "paginas": [
          1,
          19
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Como o princípio da finalidade orienta a coleta de dados em um cadastro?",
        "verso": "A coleta deve ter um propósito específico, explícito e legítimo, que oriente os usos posteriores dos dados.",
        "dica": "Pergunte para que cada dado será utilizado.",
        "fonteId": "s1-ava-lgpd-f06",
        "pagina": 10
      },
      {
        "frente": "Como aplicar o princípio da necessidade em um formulário?",
        "verso": "Solicitar apenas os dados pertinentes e proporcionais ao objetivo, evitando campos sem utilidade para a finalidade informada.",
        "dica": "Menos coleta desnecessária reduz exposição.",
        "fonteId": "s1-ava-lgpd-f06",
        "pagina": 10
      },
      {
        "frente": "O que a adequação exige do uso dos dados pessoais?",
        "verso": "Que o tratamento seja compatível com a finalidade informada e com o contexto em que os dados foram coletados.",
        "dica": "Compare o uso realizado com o propósito declarado.",
        "fonteId": "s1-ava-lgpd-f06",
        "pagina": 10
      },
      {
        "frente": "Por que transparência importa no tratamento de dados pessoais?",
        "verso": "Ela permite que os titulares compreendam como seus dados são utilizados e quais práticas estão envolvidas no tratamento.",
        "dica": "Informação clara favorece o exercício de direitos.",
        "fonteId": "s1-ava-lgpd-f06",
        "pagina": 10
      },
      {
        "frente": "Qual decisão caracteriza o papel do controlador de dados?",
        "verso": "Decidir sobre o tratamento de dados pessoais, incluindo suas finalidades e os meios relevantes para realizá-lo.",
        "dica": "Identifique quem define o tratamento.",
        "fonteId": "s1-ava-lgpd-f07",
        "pagina": 1
      },
      {
        "frente": "Como o operador se relaciona com o controlador no tratamento de dados?",
        "verso": "O operador realiza o tratamento em nome do controlador, seguindo as instruções pertinentes e as responsabilidades de proteção.",
        "dica": "Execução e decisão podem caber a agentes diferentes.",
        "fonteId": "s1-ava-lgpd-f07",
        "pagina": 6
      },
      {
        "frente": "Que função de comunicação é associada ao encarregado de dados?",
        "verso": "Atuar como canal entre a organização, os titulares e a autoridade de proteção de dados, apoiando a cultura de privacidade.",
        "dica": "O encarregado aproxima os envolvidos no tratamento.",
        "fonteId": "s1-ava-lgpd-f07",
        "pagina": 10
      },
      {
        "frente": "Por que não se deve tratar consentimento como a única base legal possível?",
        "verso": "A legislação prevê diferentes hipóteses de tratamento, como execução de contrato e obrigação legal, cuja aplicação depende do contexto.",
        "dica": "A escolha da base exige analisar a atividade.",
        "fonteId": "s1-ava-lgpd-f07",
        "pagina": 31
      },
      {
        "frente": "Por que proteger dados em trânsito e em repouso?",
        "verso": "Eles podem ser expostos tanto durante a transmissão quanto quando armazenados; os controles precisam considerar os dois momentos.",
        "dica": "O ciclo dos dados vai além do banco de dados.",
        "fonteId": "s1-ava-lgpd-f08",
        "pagina": 2
      },
      {
        "frente": "Como a privacidade por design influencia o desenvolvimento de sistemas?",
        "verso": "Ela incorpora proteção de dados desde a concepção e ao longo do desenvolvimento, em vez de acrescentá-la somente ao final.",
        "dica": "Pense nas primeiras decisões de requisitos e arquitetura.",
        "fonteId": "s1-ava-lgpd-f08",
        "pagina": 36
      },
      {
        "frente": "O que significa adotar privacidade como configuração padrão?",
        "verso": "O sistema começa com configurações voltadas à proteção dos dados, sem depender de o usuário descobrir e ativar essas proteções.",
        "dica": "A configuração inicial também comunica uma escolha de projeto.",
        "fonteId": "s1-ava-lgpd-f08",
        "pagina": 37
      },
      {
        "frente": "Por que o descarte de dados também precisa ser previsto no projeto?",
        "verso": "A proteção deve acompanhar todo o ciclo de vida, incluindo quando e como informações deixam de ser necessárias e são descartadas.",
        "dica": "Guardar indefinidamente também é uma decisão de tratamento.",
        "fonteId": "s1-ava-lgpd-f08",
        "pagina": 37
      },
      {
        "frente": "Por que usar um serviço de nuvem estrangeiro exige avaliar a transferência de dados?",
        "verso": "Porque o tratamento pode envolver outro país, exigindo atenção às condições e garantias de proteção dos titulares.",
        "dica": "Localização e fluxo dos dados fazem parte da análise.",
        "fonteId": "s1-ava-lgpd-f09",
        "pagina": 1
      },
      {
        "frente": "Qual é a finalidade das salvaguardas em transferências internacionais?",
        "verso": "Preservar a proteção dos dados e os direitos dos titulares quando as informações são tratadas fora do país de origem.",
        "dica": "A proteção deve acompanhar os dados.",
        "fonteId": "s1-ava-lgpd-f09",
        "pagina": 1
      },
      {
        "frente": "Como registros e documentos podem ajudar em uma fiscalização de dados?",
        "verso": "Eles permitem esclarecer práticas de tratamento e apresentar evidências sobre as medidas adotadas e os problemas identificados.",
        "dica": "Responsabilização exige informações verificáveis.",
        "fonteId": "s1-ava-lgpd-f09",
        "pagina": 19
      },
      {
        "frente": "Por que a fiscalização pode envolver correção de irregularidades?",
        "verso": "Porque identificar falhas e exigir sua correção contribui para adequar o tratamento e proteger os direitos dos titulares.",
        "dica": "A avaliação deve resultar em providências concretas.",
        "fonteId": "s1-ava-lgpd-f09",
        "pagina": 19
      }
    ]
  },
  {
    "id": "s1-ava-etica-cidadania-sustentabilidade",
    "semestre": 1,
    "origem": "AVA",
    "nome": "Ética, Cidadania e Sustentabilidade",
    "resumo": [
      "Ética, cidadania e sustentabilidade permitem avaliar decisões pelo efeito que produzem sobre pessoas, organizações e ambiente. A disciplina relaciona a evolução do pensamento ético à vida social e ao trabalho. Uma decisão profissional envolve valores, interesses e consequências, não apenas cumprir uma tarefa. Nas organizações, códigos de ética orientam condutas, mas precisam aparecer nas relações com colegas, clientes, fornecedores e comunidade. A cidadania reúne direitos, deveres e participação nas questões coletivas.",
      "A sustentabilidade amplia essa análise para dimensões sociais, ambientais e econômicas. Avaliar somente o lucro pode esconder impactos sobre recursos naturais, condições de trabalho ou desigualdades. Indicadores ajudam a acompanhar resultados e orientar melhorias, enquanto objetivos de desenvolvimento sustentável oferecem referências para ações conjuntas. A tecnologia participa desse processo: pode melhorar serviços e produtividade, mas seus benefícios dependem de acesso, capacitação e distribuição. Para o estudante de TI, isso significa considerar as consequências das soluções durante seu planejamento, uso e descarte."
    ],
    "topicos": [
      "Ética profissional",
      "Valores organizacionais",
      "Cidadania",
      "Direitos e deveres",
      "Tripé da sustentabilidade",
      "Indicadores",
      "Objetivos de desenvolvimento sustentável"
    ],
    "fontes": [
      {
        "id": "s1-ava-etica-cidadania-sustentabilidade-f10",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Ética, Cidadania e Sustentabilidade/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "Ética, Cidadania e Sustentabilidade — Livro-Texto - Unidade I",
        "paginas": [
          13,
          22,
          30
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-etica-cidadania-sustentabilidade-f11",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Ética, Cidadania e Sustentabilidade/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "Ética, Cidadania e Sustentabilidade — Livro-Texto - Unidade II",
        "paginas": [
          3,
          4
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-etica-cidadania-sustentabilidade-f12",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Ética, Cidadania e Sustentabilidade/UNIDADE 3/Livro-Texto - Unidade III.pdf",
        "titulo": "Ética, Cidadania e Sustentabilidade — Livro-Texto - Unidade III",
        "paginas": [
          4,
          27,
          37
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ava-etica-cidadania-sustentabilidade-f13",
        "arquivo": "1° Semestre/Disciplinas On-line/AVA/Ética, Cidadania e Sustentabilidade/UNIDADE 4/Livro-Texto - Unidade IV.pdf",
        "titulo": "Ética, Cidadania e Sustentabilidade — Livro-Texto - Unidade IV",
        "paginas": [
          1,
          4,
          13
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Por que progresso tecnológico deve ser analisado junto com seus impactos sociais?",
        "verso": "Avanços técnicos podem coexistir com desigualdade e degradação; avaliar seus efeitos ajuda a orientar decisões voltadas ao bem coletivo.",
        "dica": "Tecnologia e qualidade de vida não avançam automaticamente juntas.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f10",
        "pagina": 13
      },
      {
        "frente": "Como refletir sobre valores ajuda a tomar decisões éticas?",
        "verso": "Permite examinar quais interesses orientam a escolha e se seus efeitos respeitam direitos, deveres e princípios de convivência.",
        "dica": "Considere razões e consequências da decisão.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f10",
        "pagina": 22
      },
      {
        "frente": "Por que a ética empresarial envolve diferentes públicos?",
        "verso": "As ações da organização afetam funcionários, clientes, fornecedores, concorrentes e comunidade, exigindo coerência nessas relações.",
        "dica": "A responsabilidade ultrapassa uma relação comercial isolada.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f10",
        "pagina": 30
      },
      {
        "frente": "Como uma visão ética de interesse coletivo amplia a análise do lucro?",
        "verso": "Ela considera o benefício comum e as relações de solidariedade, reconhecendo que resultados econômicos devem coexistir com responsabilidade.",
        "dica": "O resultado da empresa afeta outras pessoas.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f10",
        "pagina": 30
      },
      {
        "frente": "Como direitos e deveres se relacionam no exercício da cidadania?",
        "verso": "O cidadão deve ter direitos reconhecidos e respeitar os direitos das demais pessoas, participando da vida comunitária.",
        "dica": "Cidadania combina proteção e responsabilidade.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f11",
        "pagina": 4
      },
      {
        "frente": "Como a educação contribui para o exercício da cidadania?",
        "verso": "Favorece o desenvolvimento da pessoa, a compreensão de direitos e deveres e a participação crítica na sociedade.",
        "dica": "Aprender também prepara para a convivência.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f11",
        "pagina": 3
      },
      {
        "frente": "Por que acompanhar decisões públicas é uma prática de cidadania?",
        "verso": "Permite participar, fiscalizar e propor melhorias em assuntos que afetam a comunidade.",
        "dica": "Cidadania não se limita ao voto.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f11",
        "pagina": 4
      },
      {
        "frente": "Como o respeito às diferenças aparece nos deveres do cidadão?",
        "verso": "Na preservação da vida, da liberdade e da intimidade das pessoas e na recusa de práticas discriminatórias.",
        "dica": "Convivência exige reconhecer o outro como sujeito de direitos.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f11",
        "pagina": 4
      },
      {
        "frente": "Quais dimensões devem ser consideradas no tripé da sustentabilidade?",
        "verso": "As dimensões social, ambiental e econômica, avaliadas de forma conjunta nas decisões e nos resultados da organização.",
        "dica": "Lucro é apenas uma parte da análise.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f12",
        "pagina": 4
      },
      {
        "frente": "O que caracteriza a dimensão social da sustentabilidade?",
        "verso": "A preocupação com equidade, dignidade, direitos e fortalecimento das relações sociais e da comunidade.",
        "dica": "Pense em pessoas e condições de vida.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f12",
        "pagina": 4
      },
      {
        "frente": "Por que indicadores são úteis na gestão da sustentabilidade?",
        "verso": "Eles permitem acompanhar processos, comparar resultados e fornecer informações para decisões e ações de melhoria.",
        "dica": "Medir deve ajudar a agir.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f12",
        "pagina": 27
      },
      {
        "frente": "Como a melhoria contínua se relaciona com a gestão ambiental?",
        "verso": "Ela exige revisar atividades e buscar formas de reduzir impactos, consumo de recursos e geração de resíduos ao longo do tempo.",
        "dica": "Gestão ambiental é um processo permanente.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f12",
        "pagina": 37
      },
      {
        "frente": "Para que servem os Objetivos de Desenvolvimento Sustentável?",
        "verso": "Oferecem objetivos comuns para enfrentar desafios sociais, ambientais e econômicos, orientando ações e cooperação.",
        "dica": "Os objetivos conectam problemas que se influenciam.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f13",
        "pagina": 1
      },
      {
        "frente": "Qual compromisso entre presente e futuro orienta o desenvolvimento sustentável?",
        "verso": "Atender às necessidades atuais sem comprometer a possibilidade de as próximas gerações atenderem às próprias necessidades.",
        "dica": "Considere os efeitos duradouros das escolhas.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f13",
        "pagina": 4
      },
      {
        "frente": "Por que digitalização não garante, sozinha, redução das desigualdades?",
        "verso": "Se acesso, infraestrutura e capacitação forem desiguais, os benefícios podem se concentrar em poucos grupos.",
        "dica": "Distribuir oportunidades também exige políticas e formação.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f13",
        "pagina": 13
      },
      {
        "frente": "Como consumo e produção responsáveis se relacionam com a sustentabilidade?",
        "verso": "Buscam reduzir desperdícios e impactos nos padrões de produção e uso de recursos, considerando seus efeitos sociais e ambientais.",
        "dica": "Observe o ciclo completo de produtos e serviços.",
        "fonteId": "s1-ava-etica-cidadania-sustentabilidade-f13",
        "pagina": 1
      }
    ]
  },
  {
    "id": "s1-ed-infraestrutura-computacional",
    "semestre": 1,
    "origem": "ED",
    "nome": "Infraestrutura Computacional",
    "resumo": [
      "A infraestrutura computacional pode ser compreendida pela relação entre processamento, memória e entrada e saída. O processador executa instruções sobre dados disponibilizados na memória, e os dispositivos permitem receber entradas e apresentar resultados. Arquitetura descreve características relevantes para a execução dos programas, enquanto organização trata de como as unidades e suas conexões implementam essas características. Essa distinção ajuda a analisar computadores sem confundir funções com detalhes de implementação.",
      "O gerenciamento de memória procura acomodar programas e aproveitar o espaço disponível. Partições fixas, dinâmicas e técnicas de relocação apresentam diferentes limitações, como desperdício e fragmentação. A representação de dados é outro fundamento: números, caracteres e imagens são codificados em bits. Sistemas binário, octal, decimal e hexadecimal representam valores usando bases diferentes. Entender posições, códigos de caracteres e pixels permite interpretar desde uma cor em uma página até a quantidade de informação necessária para armazenar uma imagem, distinguindo representação e significado."
    ],
    "topicos": [
      "Arquitetura e organização",
      "Processamento e memória",
      "Particionamento",
      "Sistemas de numeração",
      "Codificação de caracteres",
      "Representação de imagens"
    ],
    "fontes": [
      {
        "id": "s1-ed-infraestrutura-computacional-f15",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Infraestrutura Computacional/Slides/INFRA COMPUTACIONAL(GERAL)-fb.pdf",
        "titulo": "Infraestrutura Computacional — INFRA COMPUTACIONAL(GERAL)-fb",
        "paginas": [
          10,
          11,
          14,
          17,
          19,
          20,
          21,
          23,
          29,
          30,
          31,
          62,
          93,
          96,
          104,
          130
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "O que a organização de computadores descreve sobre um sistema?",
        "verso": "As unidades operacionais e suas interconexões que implementam a arquitetura, como sinais de controle e interfaces com periféricos.",
        "dica": "Observe como os componentes trabalham em conjunto.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 10
      },
      {
        "frente": "O que a arquitetura de computadores apresenta ao programador?",
        "verso": "Características que afetam a execução lógica, como conjunto de instruções, representação de dados e endereçamento de memória.",
        "dica": "Considere os recursos visíveis à programação.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 11
      },
      {
        "frente": "Como entrada, processamento, memória e saída se relacionam?",
        "verso": "As entradas fornecem dados, o processador executa instruções armazenadas na memória e as saídas apresentam os resultados.",
        "dica": "Siga o caminho dos dados pelo sistema.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 14
      },
      {
        "frente": "Por que a memória principal é necessária durante a execução de programas?",
        "verso": "Ela disponibiliza programas e dados para o processamento, apoiando a execução das instruções pela CPU.",
        "dica": "Processar exige acesso às instruções e aos dados.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 17
      },
      {
        "frente": "Qual desperdício pode ocorrer com partições fixas de memória?",
        "verso": "Um programa menor que sua partição pode deixar espaço reservado sem uso, e um maior pode não caber nela.",
        "dica": "Compare o tamanho do processo com o espaço reservado.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 19
      },
      {
        "frente": "Como as partições dinâmicas diferem das partições fixas?",
        "verso": "As áreas são alocadas conforme o tamanho dos processos, exigindo gerenciamento das regiões livres e ocupadas.",
        "dica": "O tamanho da área acompanha a necessidade do processo.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 20
      },
      {
        "frente": "Como a fragmentação pode impedir uma alocação mesmo havendo memória livre?",
        "verso": "O espaço livre pode estar dividido em regiões pequenas que, isoladamente, não comportam o processo solicitado.",
        "dica": "Quantidade total livre não significa área contínua suficiente.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 21
      },
      {
        "frente": "Por que mover um processo na memória exige cuidado com os endereços?",
        "verso": "O programa precisa continuar acessando corretamente suas instruções e dados na nova localização, o que exige suporte à relocação.",
        "dica": "Mudança de posição não pode invalidar referências.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 23
      },
      {
        "frente": "O que torna o sistema decimal uma numeração posicional?",
        "verso": "O valor de cada algarismo depende da posição que ocupa e da potência de dez associada a ela.",
        "dica": "A mesma cifra pode representar unidades ou centenas.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 29
      },
      {
        "frente": "Como calcular o valor de um número em uma base posicional?",
        "verso": "Multiplique cada algarismo pela potência da base correspondente à sua posição e some os resultados.",
        "dica": "A posição mais à direita começa na potência zero.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 30
      },
      {
        "frente": "Quais símbolos aparecem nos sistemas binário, octal e hexadecimal?",
        "verso": "Binário usa 0 e 1; octal usa 0 a 7; hexadecimal usa 0 a 9 e A a F.",
        "dica": "A quantidade de símbolos acompanha a base.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 31
      },
      {
        "frente": "Por que cada posição binária corresponde a uma potência de dois?",
        "verso": "Porque o sistema usa base dois; os pesos das posições são 1, 2, 4, 8 e assim por diante.",
        "dica": "O valor total resulta da soma dos pesos com bit igual a um.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 62
      },
      {
        "frente": "Como uma cor pode ser indicada em uma folha de estilos usando hexadecimal?",
        "verso": "Por um código numérico precedido de #, como #ff0000 para vermelho na representação RGB de seis dígitos.",
        "dica": "Hexadecimal também representa componentes de cor.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 93
      },
      {
        "frente": "Por que caracteres precisam de códigos numéricos no computador?",
        "verso": "A memória guarda representações digitais; uma codificação associa símbolos textuais a valores que podem ser armazenados em bits.",
        "dica": "O caractere visível e sua codificação são coisas diferentes.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 96
      },
      {
        "frente": "Quantos estados um pixel de uma imagem binária pode representar?",
        "verso": "Dois estados, pois cada pixel é representado por um bit, frequentemente interpretado como preto ou branco.",
        "dica": "Um bit permite duas possibilidades.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 104
      },
      {
        "frente": "Por que compilar com sucesso não prova que o programa está correto?",
        "verso": "A compilação verifica condições necessárias para gerar o programa, mas erros de lógica ou falhas podem aparecer durante a execução.",
        "dica": "Compilação e teste avaliam aspectos diferentes.",
        "fonteId": "s1-ed-infraestrutura-computacional-f15",
        "pagina": 130
      }
    ]
  },
  {
    "id": "s1-ed-logica-com-c",
    "semestre": 1,
    "origem": "ED",
    "nome": "Lógica com C",
    "resumo": [
      "A lógica com C trabalha a decomposição de problemas em entrada, processamento e saída. O algoritmo organiza essas etapas por sequência, decisões e repetições. Na linguagem, tipos e operadores definem como os valores são manipulados, e a precedência determina a ordem de avaliação das expressões. Distinguir atribuição de comparação é importante para que uma condição realmente teste o que foi planejado. A leitura cuidadosa do fluxo também ajuda a evitar repetição indevida ou resultados inesperados.",
      "Funções dividem um programa em tarefas menores, permitindo organizar e testar suas partes. Seus parâmetros recebem dados e o retorno comunica resultados. O escopo determina onde uma variável pode ser utilizada, e a passagem por valor trabalha com uma cópia do argumento. Vetores agrupam elementos do mesmo tipo e exigem atenção aos índices, enquanto strings acrescentam um marcador de término. O estudo de arquivos introduz a persistência de dados, diferenciando leitura e escrita em armazenamento das operações realizadas no teclado e na tela."
    ],
    "topicos": [
      "Entrada e saída",
      "Estruturas de controle",
      "Operadores",
      "Modularização",
      "Escopo e parâmetros",
      "Vetores e strings",
      "Arquivos"
    ],
    "fontes": [
      {
        "id": "s1-ed-logica-com-c-f45",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com C/Slides/Unidade_1_ProgEstrutC.pptx",
        "titulo": "Lógica com C — Unidade_1_ProgEstrutC",
        "paginas": [
          11,
          12,
          13,
          14
        ],
        "formato": "pptx"
      },
      {
        "id": "s1-ed-logica-com-c-f46",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com C/Slides/Unidade_2_ProgEstrutC.pptx",
        "titulo": "Lógica com C — Unidade_2_ProgEstrutC",
        "paginas": [
          5,
          6,
          9
        ],
        "formato": "pptx"
      },
      {
        "id": "s1-ed-logica-com-c-f47",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com C/Slides/Unidade_3_ProgEstrutC.pptx",
        "titulo": "Lógica com C — Unidade_3_ProgEstrutC",
        "paginas": [
          9
        ],
        "formato": "pptx"
      },
      {
        "id": "s1-ed-logica-com-c-f49",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com C/Slides/Unidade_4__ProgEstrutC_Leit_Arq.pptx",
        "titulo": "Lógica com C — Unidade_4__ProgEstrutC_Leit_Arq",
        "paginas": [
          4,
          5
        ],
        "formato": "pptx"
      },
      {
        "id": "s1-ed-logica-com-c-f50",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com C/Slides/Unidade_5_ProgEstrutCFuncoes.pptx",
        "titulo": "Lógica com C — Unidade_5_ProgEstrutCFuncoes",
        "paginas": [
          3,
          7,
          21,
          28
        ],
        "formato": "pptx"
      },
      {
        "id": "s1-ed-logica-com-c-f51",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com C/Slides/Unidade_6_ProgEstrutC_Vetores.pptx",
        "titulo": "Lógica com C — Unidade_6_ProgEstrutC_Vetores",
        "paginas": [
          13,
          19
        ],
        "formato": "pptx"
      }
    ],
    "cartas": [
      {
        "frente": "Que perguntas ajudam a separar entrada, processamento e saída de um algoritmo?",
        "verso": "Quais dados são necessários, quais operações levam ao resultado e qual resultado deve ser apresentado.",
        "dica": "Planeje antes de escrever os comandos.",
        "fonteId": "s1-ed-logica-com-c-f45",
        "pagina": 11
      },
      {
        "frente": "Quais três estruturas básicas organizam um algoritmo estruturado?",
        "verso": "Sequência, decisão e repetição, usadas para ordenar ações, escolher caminhos e repetir tarefas.",
        "dica": "Uma solução combina essas estruturas.",
        "fonteId": "s1-ed-logica-com-c-f45",
        "pagina": 12
      },
      {
        "frente": "O que caracteriza um trecho sequencial de programa em C?",
        "verso": "As instruções são executadas na ordem definida, sem uma escolha de caminho ou repetição naquele trecho.",
        "dica": "A posição dos comandos influencia o resultado.",
        "fonteId": "s1-ed-logica-com-c-f45",
        "pagina": 13
      },
      {
        "frente": "Quando uma estrutura de decisão é necessária em um algoritmo?",
        "verso": "Quando a execução deve escolher uma ação conforme uma condição, como tratar situações diferentes de uma entrada.",
        "dica": "Decidir significa selecionar um caminho.",
        "fonteId": "s1-ed-logica-com-c-f45",
        "pagina": 14
      },
      {
        "frente": "Em C, que tipo de operandos o operador de resto % aceita?",
        "verso": "Operandos inteiros; ele produz o resto da divisão inteira.",
        "dica": "Resto e divisão de ponto flutuante são operações diferentes.",
        "fonteId": "s1-ed-logica-com-c-f46",
        "pagina": 5
      },
      {
        "frente": "Como a precedência influencia uma expressão com soma e multiplicação em C?",
        "verso": "A multiplicação é avaliada antes da soma, salvo quando parênteses determinam outro agrupamento.",
        "dica": "Parênteses tornam a intenção explícita.",
        "fonteId": "s1-ed-logica-com-c-f46",
        "pagina": 6
      },
      {
        "frente": "Por que usar = no lugar de == pode mudar o sentido de uma condição em C?",
        "verso": "Porque = atribui um valor, enquanto == compara igualdade; trocar os operadores altera a operação realizada.",
        "dica": "Atribuir não é perguntar se dois valores são iguais.",
        "fonteId": "s1-ed-logica-com-c-f46",
        "pagina": 9
      },
      {
        "frente": "Como pré-incremento e pós-incremento diferem dentro de uma expressão simples?",
        "verso": "No pré-incremento, o novo valor é usado na expressão; no pós-incremento, usa-se o valor anterior e depois ocorre o incremento.",
        "dica": "Considere quando o valor participa da expressão.",
        "fonteId": "s1-ed-logica-com-c-f47",
        "pagina": 9
      },
      {
        "frente": "O que distingue fprintf de printf no destino da saída?",
        "verso": "fprintf escreve em um fluxo indicado, como um arquivo; printf escreve na saída padrão, normalmente exibida no terminal.",
        "dica": "A operação também precisa indicar seu destino.",
        "fonteId": "s1-ed-logica-com-c-f49",
        "pagina": 4
      },
      {
        "frente": "O que distingue fscanf de scanf na origem da leitura?",
        "verso": "fscanf lê dados de um fluxo de arquivo indicado; scanf lê da entrada padrão, normalmente associada ao teclado.",
        "dica": "Identifique de onde vêm os dados.",
        "fonteId": "s1-ed-logica-com-c-f49",
        "pagina": 5
      },
      {
        "frente": "Por que dividir um programa C em funções facilita sua manutenção?",
        "verso": "Cada função pode concentrar uma tarefa, permitindo compreender, testar e alterar partes menores do programa.",
        "dica": "Modularizar reduz a quantidade de responsabilidades por trecho.",
        "fonteId": "s1-ed-logica-com-c-f50",
        "pagina": 3
      },
      {
        "frente": "Que informações aparecem no cabeçalho de uma função em C?",
        "verso": "O tipo de retorno, o nome e a lista de parâmetros, que descrevem como a função recebe e devolve valores.",
        "dica": "O cabeçalho apresenta a interface da função.",
        "fonteId": "s1-ed-logica-com-c-f50",
        "pagina": 7
      },
      {
        "frente": "O que acontece com um argumento escalar passado por valor em C?",
        "verso": "Seu valor é copiado para o parâmetro; alterar esse parâmetro não altera diretamente a variável original do chamador.",
        "dica": "A função trabalha com uma cópia do valor recebido.",
        "fonteId": "s1-ed-logica-com-c-f50",
        "pagina": 28
      },
      {
        "frente": "Como o escopo limita o uso de uma variável local em C?",
        "verso": "Ela só pode ser referenciada dentro do escopo em que foi declarada, respeitando os blocos envolvidos.",
        "dica": "O nome não fica disponível em todo o programa.",
        "fonteId": "s1-ed-logica-com-c-f50",
        "pagina": 21
      },
      {
        "frente": "Quais são os índices válidos de um vetor C com tamanho n?",
        "verso": "De 0 até n menos 1; acessar fora desse intervalo ultrapassa os elementos reservados para o vetor.",
        "dica": "O primeiro elemento usa índice zero.",
        "fonteId": "s1-ed-logica-com-c-f51",
        "pagina": 13
      },
      {
        "frente": "Por que uma string C precisa reservar espaço além dos caracteres visíveis?",
        "verso": "Porque o caractere nulo de término, '\\0', também ocupa uma posição no vetor de caracteres.",
        "dica": "O terminador informa onde o texto termina.",
        "fonteId": "s1-ed-logica-com-c-f51",
        "pagina": 19
      }
    ]
  },
  {
    "id": "s1-ed-logica-com-python",
    "semestre": 1,
    "origem": "ED",
    "nome": "Lógica com Python",
    "resumo": [
      "O pensamento lógico com Python começa na descrição do problema e na organização da solução. Algoritmos, pseudocódigos e fluxogramas ajudam a representar passos, condições e repetições antes da implementação. Em Python, a indentação faz parte da estrutura do programa, por isso a organização visual também tem significado. A escolha de tipos de dados, operações e funções deve acompanhar o que o problema pede, evitando tratar números, textos e resultados como se fossem intercambiáveis.",
      "Listas permitem trabalhar com sequências, enquanto dicionários organizam associações por chave. A entrada pode vir do teclado, de arquivos ou de serviços, e sua interpretação precisa ser coerente com o processamento. Funções favorecem reaproveitamento e clareza. A depuração acompanha o estado do programa para localizar causas de erro; os testes verificam comportamentos esperados em situações escolhidas. A introdução à orientação a objetos reúne dados e comportamentos em entidades, oferecendo outra forma de estruturar soluções sem dispensar o raciocínio algorítmico."
    ],
    "topicos": [
      "Planejamento de algoritmos",
      "Indentação",
      "Tipos e funções",
      "Listas e dicionários",
      "Entrada e arquivos",
      "Depuração e testes",
      "Classes e objetos"
    ],
    "fontes": [
      {
        "id": "s1-ed-logica-com-python-f16",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com Python/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "Lógica com Python — Livro-Texto - Unidade I",
        "paginas": [
          1,
          21
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-logica-com-python-f17",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com Python/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "Lógica com Python — Livro-Texto - Unidade II",
        "paginas": [
          1,
          8,
          40
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-logica-com-python-f18",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com Python/UNIDADE 3/Livro-Texto - Unidade III.pdf",
        "titulo": "Lógica com Python — Livro-Texto - Unidade III",
        "paginas": [
          1,
          43,
          45
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-logica-com-python-f19",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Lógica com Python/UNIDADE 4/Livro-Texto - Unidade IV.pdf",
        "titulo": "Lógica com Python — Livro-Texto - Unidade IV",
        "paginas": [
          1,
          8,
          9,
          19
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Por que escrever um algoritmo antes do código Python pode ajudar?",
        "verso": "Permite organizar os passos da solução e examinar a lógica antes de lidar com os detalhes da linguagem.",
        "dica": "Planejamento separa o problema da sintaxe.",
        "fonteId": "s1-ed-logica-com-python-f16",
        "pagina": 1
      },
      {
        "frente": "Como um fluxograma auxilia a discussão de uma solução?",
        "verso": "Ele representa visualmente o fluxo de ações e decisões, facilitando acompanhar caminhos possíveis do algoritmo.",
        "dica": "Observe a sequência e os desvios do fluxo.",
        "fonteId": "s1-ed-logica-com-python-f16",
        "pagina": 1
      },
      {
        "frente": "Qual é a utilidade do pseudocódigo no planejamento de programas?",
        "verso": "Descrever a solução de forma estruturada e próxima da linguagem humana, sem depender de uma sintaxe executável específica.",
        "dica": "Pseudocódigo ajuda a comunicar a lógica.",
        "fonteId": "s1-ed-logica-com-python-f16",
        "pagina": 1
      },
      {
        "frente": "Por que alterar a indentação pode mudar um programa Python?",
        "verso": "A indentação delimita blocos, indicando quais instruções pertencem a uma condição, repetição ou função.",
        "dica": "Espaços também expressam estrutura.",
        "fonteId": "s1-ed-logica-com-python-f16",
        "pagina": 21
      },
      {
        "frente": "Quando o tipo inteiro é mais adequado que um número de ponto flutuante?",
        "verso": "Quando o dado representa uma quantidade sem parte fracionária, como uma contagem de elementos.",
        "dica": "Relacione o tipo ao significado do dado.",
        "fonteId": "s1-ed-logica-com-python-f17",
        "pagina": 1
      },
      {
        "frente": "Por que números de ponto flutuante podem apresentar pequenas diferenças de precisão?",
        "verso": "Sua representação binária tem limitações; certos valores decimais não são representados exatamente.",
        "dica": "Representação aproximada exige cuidado nas comparações.",
        "fonteId": "s1-ed-logica-com-python-f17",
        "pagina": 8
      },
      {
        "frente": "Como funções ajudam a evitar repetição em programas Python?",
        "verso": "Elas agrupam uma tarefa em um bloco reutilizável, que pode ser chamado em diferentes pontos com dados apropriados.",
        "dica": "Uma responsabilidade bem definida favorece reutilização.",
        "fonteId": "s1-ed-logica-com-python-f17",
        "pagina": 40
      },
      {
        "frente": "Por que o nome de uma função deve indicar a tarefa que ela realiza?",
        "verso": "Porque ajuda a compreender sua finalidade ao ler uma chamada, tornando o código mais claro e fácil de manter.",
        "dica": "Um nome útil explica a intenção.",
        "fonteId": "s1-ed-logica-com-python-f17",
        "pagina": 40
      },
      {
        "frente": "Como escolher entre lista e dicionário para organizar dados em Python?",
        "verso": "Use lista para uma sequência acessada por posições e dicionário para associações consultadas por chaves.",
        "dica": "O modo de acesso ajuda a escolher a estrutura.",
        "fonteId": "s1-ed-logica-com-python-f18",
        "pagina": 1
      },
      {
        "frente": "Por que uma chave de dicionário funciona como identificador de um valor?",
        "verso": "Cada chave identifica uma associação no dicionário, permitindo localizar seu valor sem depender de uma posição numérica.",
        "dica": "Pense em uma palavra associada à sua tradução.",
        "fonteId": "s1-ed-logica-com-python-f18",
        "pagina": 1
      },
      {
        "frente": "Que possibilidade de entrada a leitura de arquivos acrescenta a um programa?",
        "verso": "Permite processar dados já armazenados em documentos, sem exigir que todos sejam digitados novamente.",
        "dica": "Arquivos ampliam as origens dos dados.",
        "fonteId": "s1-ed-logica-com-python-f18",
        "pagina": 43
      },
      {
        "frente": "Como arquivos de texto e binários diferem na representação dos dados?",
        "verso": "Arquivos de texto usam uma codificação textual; arquivos binários armazenam sequências de bytes interpretadas segundo um formato próprio.",
        "dica": "A extensão sozinha não explica toda a estrutura.",
        "fonteId": "s1-ed-logica-com-python-f18",
        "pagina": 45
      },
      {
        "frente": "Como depuração e testes se complementam no desenvolvimento Python?",
        "verso": "Testes evidenciam comportamentos diferentes do esperado; a depuração ajuda a investigar suas causas e acompanhar o estado da execução.",
        "dica": "Detectar uma falha e explicar sua causa são etapas relacionadas.",
        "fonteId": "s1-ed-logica-com-python-f19",
        "pagina": 1
      },
      {
        "frente": "Para que serve executar um programa passo a passo no depurador?",
        "verso": "Observar a sequência de instruções e os valores das variáveis para localizar onde o comportamento se desvia do esperado.",
        "dica": "Acompanhe o estado antes e depois de cada passo.",
        "fonteId": "s1-ed-logica-com-python-f19",
        "pagina": 8
      },
      {
        "frente": "Qual é a função de uma asserção em um teste automatizado?",
        "verso": "Comparar um resultado ou condição observada com o comportamento esperado, sinalizando quando a verificação falha.",
        "dica": "Um teste precisa de um critério de sucesso.",
        "fonteId": "s1-ed-logica-com-python-f19",
        "pagina": 9
      },
      {
        "frente": "Como objetos organizam dados e comportamentos em Python?",
        "verso": "Objetos reúnem estado e operações relacionadas, e são instâncias de classes que definem essa estrutura.",
        "dica": "Classe descreve; objeto concretiza uma instância.",
        "fonteId": "s1-ed-logica-com-python-f19",
        "pagina": 19
      }
    ]
  },
  {
    "id": "s1-ed-matematica-estatistica",
    "semestre": 1,
    "origem": "ED",
    "nome": "Matemática e Estatística",
    "resumo": [
      "Matemática e estatística fornecem formas de representar relações e interpretar dados. Expressões e equações ajudam a descrever um problema e descobrir valores desconhecidos. Proporcionalidade permite comparar grandezas, e conjuntos organizam elementos e suas relações. Funções associam entradas a saídas segundo uma regra: domínio, coeficientes, raízes e gráficos ajudam a compreender essa relação. Ao modelar uma situação, é necessário verificar o significado das variáveis e das unidades, além de realizar as operações corretamente.",
      "Exponenciais e logaritmos permitem trabalhar com crescimento e escalas, enquanto matrizes organizam informações em linhas e colunas e apoiam sistemas de equações. Na estatística, população e amostra delimitam o que se deseja investigar e quais dados serão observados. Medidas de tendência central resumem posições típicas, e medidas de dispersão mostram a variabilidade. Uma média isolada pode esconder conjuntos muito diferentes. Interpretar resultados exige considerar como os dados foram coletados, sua representatividade e o contexto da pergunta original."
    ],
    "topicos": [
      "Equações e proporções",
      "Conjuntos",
      "Funções",
      "Exponenciais e logaritmos",
      "Matrizes",
      "Amostragem",
      "Tendência central e dispersão"
    ],
    "fontes": [
      {
        "id": "s1-ed-matematica-estatistica-f20",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Matemática e Estatística/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "Matemática e Estatística — Livro-Texto - Unidade I",
        "paginas": [
          3,
          11,
          27,
          28
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-matematica-estatistica-f21",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Matemática e Estatística/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "Matemática e Estatística — Livro-Texto - Unidade II",
        "paginas": [
          1,
          10,
          19,
          21
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-matematica-estatistica-f22",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Matemática e Estatística/UNIDADE 3/Livro-Texto - Unidade III.pdf",
        "titulo": "Matemática e Estatística — Livro-Texto - Unidade III",
        "paginas": [
          29,
          34,
          45,
          50
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-matematica-estatistica-f23",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/Matemática e Estatística/UNIDADE 4/Livro-Texto - Unidade IV.pdf",
        "titulo": "Matemática e Estatística — Livro-Texto - Unidade IV",
        "paginas": [
          3,
          32,
          39,
          48
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Qual é o papel da incógnita em uma equação que modela um problema?",
        "verso": "Representar um valor desconhecido que deve satisfazer a relação expressa pela equação.",
        "dica": "A igualdade impõe uma condição ao valor procurado.",
        "fonteId": "s1-ed-matematica-estatistica-f20",
        "pagina": 3
      },
      {
        "frente": "Como reconhecer duas grandezas diretamente proporcionais?",
        "verso": "Quando variam mantendo uma razão constante: multiplicar uma delas por um fator multiplica a outra pelo mesmo fator.",
        "dica": "Verifique a razão, não apenas se ambas aumentam.",
        "fonteId": "s1-ed-matematica-estatistica-f20",
        "pagina": 11
      },
      {
        "frente": "Que elementos pertencem à união de dois conjuntos?",
        "verso": "Todos os elementos que pertencem a pelo menos um dos conjuntos, sem contar repetidos como novos elementos.",
        "dica": "União reúne as possibilidades.",
        "fonteId": "s1-ed-matematica-estatistica-f20",
        "pagina": 27
      },
      {
        "frente": "Que elementos pertencem à interseção de dois conjuntos?",
        "verso": "Somente os elementos que pertencem simultaneamente aos dois conjuntos.",
        "dica": "Procure o que é comum.",
        "fonteId": "s1-ed-matematica-estatistica-f20",
        "pagina": 28
      },
      {
        "frente": "O que o domínio de uma função indica?",
        "verso": "O conjunto de valores de entrada para os quais a função está definida.",
        "dica": "O domínio delimita quais entradas são admitidas.",
        "fonteId": "s1-ed-matematica-estatistica-f21",
        "pagina": 1
      },
      {
        "frente": "Como o coeficiente angular influencia o gráfico de uma função afim?",
        "verso": "Ele determina a inclinação da reta e indica como a saída varia quando a entrada aumenta.",
        "dica": "Observe a taxa de variação.",
        "fonteId": "s1-ed-matematica-estatistica-f21",
        "pagina": 10
      },
      {
        "frente": "Como encontrar a raiz de uma função afim?",
        "verso": "Iguale a expressão da função a zero e resolva a equação para descobrir a entrada que produz saída nula.",
        "dica": "No gráfico, procure o encontro com o eixo horizontal.",
        "fonteId": "s1-ed-matematica-estatistica-f21",
        "pagina": 19
      },
      {
        "frente": "Que característica distingue uma função quadrática de uma função afim?",
        "verso": "A função quadrática tem termo de grau dois com coeficiente não nulo e seu gráfico é uma parábola.",
        "dica": "O maior grau determina uma mudança no formato do gráfico.",
        "fonteId": "s1-ed-matematica-estatistica-f21",
        "pagina": 21
      },
      {
        "frente": "Como a forma logarítmica se relaciona com a exponencial?",
        "verso": "O logaritmo indica o expoente ao qual a base deve ser elevada para produzir um valor positivo, respeitadas as condições da base.",
        "dica": "Logaritmo responde a uma pergunta sobre o expoente.",
        "fonteId": "s1-ed-matematica-estatistica-f22",
        "pagina": 29
      },
      {
        "frente": "Como o logaritmo de um produto pode ser reescrito?",
        "verso": "Como a soma dos logaritmos dos fatores na mesma base, quando os fatores são positivos e a base é válida.",
        "dica": "A propriedade transforma multiplicação em soma.",
        "fonteId": "s1-ed-matematica-estatistica-f22",
        "pagina": 34
      },
      {
        "frente": "O que significam os dois índices de um elemento de matriz?",
        "verso": "O primeiro indica a linha e o segundo a coluna em que o elemento se encontra.",
        "dica": "A posição organiza a leitura da tabela.",
        "fonteId": "s1-ed-matematica-estatistica-f22",
        "pagina": 45
      },
      {
        "frente": "Qual condição permite multiplicar uma matriz por outra?",
        "verso": "O número de colunas da primeira deve ser igual ao número de linhas da segunda.",
        "dica": "Compare as dimensões internas.",
        "fonteId": "s1-ed-matematica-estatistica-f22",
        "pagina": 50
      },
      {
        "frente": "Por que uma amostra grande não é automaticamente representativa?",
        "verso": "Porque sua seleção pode deixar características importantes da população de fora, mesmo com muitos participantes.",
        "dica": "Quantidade e qualidade da seleção são diferentes.",
        "fonteId": "s1-ed-matematica-estatistica-f23",
        "pagina": 3
      },
      {
        "frente": "Como se obtém a média aritmética de valores com o mesmo peso?",
        "verso": "Somando todos os valores e dividindo pela quantidade de observações.",
        "dica": "A soma é distribuída igualmente entre as observações.",
        "fonteId": "s1-ed-matematica-estatistica-f23",
        "pagina": 32
      },
      {
        "frente": "Como localizar a mediana quando há uma quantidade ímpar de observações?",
        "verso": "Ordene os valores e identifique o elemento que ocupa a posição central.",
        "dica": "Ordenar os dados é indispensável.",
        "fonteId": "s1-ed-matematica-estatistica-f23",
        "pagina": 39
      },
      {
        "frente": "Por que comparar dispersão além da média pode ser necessário?",
        "verso": "Conjuntos com a mesma média podem ter valores muito próximos ou muito afastados, revelando variabilidades diferentes.",
        "dica": "O desvio-padrão ajuda a descrever essa diferença.",
        "fonteId": "s1-ed-matematica-estatistica-f23",
        "pagina": 48
      }
    ]
  },
  {
    "id": "s1-ed-tic",
    "semestre": 1,
    "origem": "ED",
    "nome": "TIC (Tecnologia da Informação e Comunicação)",
    "resumo": [
      "Tecnologia da Informação e da Comunicação reúne recursos para processar, armazenar e transmitir informações. Hardware, software, redes, bancos de dados e serviços precisam atuar em conjunto para atender às necessidades das pessoas e das organizações. A disciplina acompanha a evolução desses recursos e discute sua importância estratégica. Nem toda organização utiliza a tecnologia da mesma forma: ela pode apoiar operações básicas ou participar diretamente da criação de produtos e da transformação do negócio.",
      "Sistemas de informação organizam atividades e fornecem apoio às decisões. Relatórios gerenciais, integração de processos e ferramentas de análise atendem necessidades diferentes. Tecnologias emergentes também trazem possibilidades e desafios, como a gestão do conhecimento, a experiência do usuário e a conexão entre ambientes físicos e digitais. O estudo inclui ferramentas de produtividade: planilhas organizam dados, fórmulas calculam resultados e filtros facilitam consultas. Usar essas ferramentas de maneira consciente exige compreender o objetivo da tarefa e conferir a qualidade das informações, em vez de apenas executar comandos."
    ],
    "topicos": [
      "Componentes de TIC",
      "Estratégia organizacional",
      "Sistemas de informação",
      "Apoio à decisão",
      "Tecnologias emergentes",
      "Gestão do conhecimento",
      "Produtividade"
    ],
    "fontes": [
      {
        "id": "s1-ed-tic-f24",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/TIC/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "TIC — Livro-Texto - Unidade I",
        "paginas": [
          15,
          20,
          25,
          34
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-tic-f25",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/TIC/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "TIC — Livro-Texto - Unidade II",
        "paginas": [
          1,
          2,
          31,
          42
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-tic-f26",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/TIC/UNIDADE 3/Livro-Texto - Unidade III.pdf",
        "titulo": "TIC — Livro-Texto - Unidade III",
        "paginas": [
          6,
          11,
          16,
          21
        ],
        "formato": "pdf"
      },
      {
        "id": "s1-ed-tic-f27",
        "arquivo": "1° Semestre/Disciplinas Presenciais/ED/TIC/UNIDADE 4/Livro-Texto - Unidade IV.pdf",
        "titulo": "TIC — Livro-Texto - Unidade IV",
        "paginas": [
          1,
          4,
          15,
          18
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Quais recursos compõem o campo da TIC nas organizações?",
        "verso": "Hardware, software, redes, bancos de dados e serviços associados, usados para apoiar processamento e comunicação de informações.",
        "dica": "A TIC vai além dos computadores isolados.",
        "fonteId": "s1-ed-tic-f24",
        "pagina": 15
      },
      {
        "frente": "Por que acesso à internet e dispositivos é uma questão de inclusão digital?",
        "verso": "Sem esses recursos, parte da população encontra barreiras para participar de serviços e atividades digitais.",
        "dica": "Acesso desigual limita oportunidades.",
        "fonteId": "s1-ed-tic-f24",
        "pagina": 20
      },
      {
        "frente": "Para que serve analisar o impacto presente e futuro da TI em uma organização?",
        "verso": "Para compreender se a tecnologia atua como suporte, sustenta operações críticas ou pode transformar sua posição estratégica.",
        "dica": "Considere necessidades atuais e possibilidades futuras.",
        "fonteId": "s1-ed-tic-f24",
        "pagina": 25
      },
      {
        "frente": "Que responsabilidades da CPU sustentam o funcionamento de um computador?",
        "verso": "Executar instruções, processar dados e coordenar operações dos demais componentes.",
        "dica": "A CPU participa do processamento e do controle.",
        "fonteId": "s1-ed-tic-f24",
        "pagina": 34
      },
      {
        "frente": "O que faz um conjunto de elementos constituir um sistema?",
        "verso": "A interação organizada entre suas partes em busca de um ou mais objetivos.",
        "dica": "Partes sem relação não bastam para explicar um sistema.",
        "fonteId": "s1-ed-tic-f25",
        "pagina": 2
      },
      {
        "frente": "Como sistemas de informação apoiam as organizações?",
        "verso": "Integram processos, organizam operações e oferecem informações úteis para decisões.",
        "dica": "Relacione dados, processos e objetivos.",
        "fonteId": "s1-ed-tic-f25",
        "pagina": 1
      },
      {
        "frente": "Que tipo de contribuição um sistema de informações gerenciais oferece aos gestores?",
        "verso": "Relatórios e informações sobre operações para apoiar planejamento, organização e controle.",
        "dica": "O SIG transforma registros em acompanhamento gerencial.",
        "fonteId": "s1-ed-tic-f25",
        "pagina": 31
      },
      {
        "frente": "Por que um sistema de apoio à decisão é útil diante de incerteza?",
        "verso": "Ele permite examinar dados e alternativas em situações complexas que não se resolvem apenas com rotinas padronizadas.",
        "dica": "Nem toda decisão tem uma regra fixa pronta.",
        "fonteId": "s1-ed-tic-f25",
        "pagina": 42
      },
      {
        "frente": "Como um sistema especialista representa conhecimento de um domínio?",
        "verso": "Usa uma base de conhecimento e regras para apoiar análises e conclusões em uma área específica.",
        "dica": "Pense em conhecimento especializado organizado em regras.",
        "fonteId": "s1-ed-tic-f26",
        "pagina": 6
      },
      {
        "frente": "Como realidade aumentada e realidade virtual diferem na relação com o ambiente?",
        "verso": "A realidade virtual substitui a percepção por um ambiente virtual; a aumentada sobrepõe informações digitais ao ambiente físico.",
        "dica": "Observe se o mundo físico permanece como base.",
        "fonteId": "s1-ed-tic-f26",
        "pagina": 11
      },
      {
        "frente": "Por que experiência do usuário envolve mais que aparência visual?",
        "verso": "Porque inclui como a pessoa entende, utiliza e percebe o produto, envolvendo usabilidade, acessibilidade e funcionalidade.",
        "dica": "Uma tela bonita também precisa funcionar bem para quem a usa.",
        "fonteId": "s1-ed-tic-f26",
        "pagina": 16
      },
      {
        "frente": "Como conhecimento tácito e explícito se distinguem?",
        "verso": "O tácito se liga à experiência e à prática; o explícito está estruturado e pode ser registrado e compartilhado mais diretamente.",
        "dica": "Experiência pessoal e documentação são formas diferentes de conhecimento.",
        "fonteId": "s1-ed-tic-f26",
        "pagina": 21
      },
      {
        "frente": "Como linhas e colunas organizam uma planilha eletrônica?",
        "verso": "Elas formam células identificáveis, nas quais dados e fórmulas podem ser registrados e relacionados.",
        "dica": "A posição permite referenciar informações.",
        "fonteId": "s1-ed-tic-f27",
        "pagina": 4
      },
      {
        "frente": "Qual a diferença prática entre classificar e filtrar dados em uma planilha?",
        "verso": "Classificar reorganiza a ordem dos registros; filtrar seleciona quais registros são exibidos segundo critérios.",
        "dica": "Ordenar e selecionar são operações distintas.",
        "fonteId": "s1-ed-tic-f27",
        "pagina": 15
      },
      {
        "frente": "Por que referências de células são úteis em fórmulas?",
        "verso": "Permitem calcular usando os valores de posições indicadas, relacionando informações sem reescrever cada valor na fórmula.",
        "dica": "A fórmula acompanha os dados referenciados.",
        "fonteId": "s1-ed-tic-f27",
        "pagina": 18
      },
      {
        "frente": "Como ferramentas de produtividade apoiam tarefas de escritório?",
        "verso": "Ajudam a organizar dados, calcular resultados, preparar documentos e apresentar informações de forma estruturada.",
        "dica": "Escolha a ferramenta conforme a tarefa.",
        "fonteId": "s1-ed-tic-f27",
        "pagina": 1
      }
    ]
  },
  {
    "id": "s2-ava-educacao-ambiental",
    "semestre": 2,
    "origem": "AVA",
    "nome": "Educação Ambiental",
    "resumo": [
      "A educação ambiental ajuda a compreender como as escolhas humanas se relacionam com a qualidade de vida e com os recursos naturais. A industrialização ampliou a produção, mas também intensificou a poluição e a pressão sobre água, solo e energia. Estudar esses problemas exige relacionar seus aspectos ecológicos, econômicos e sociais, evitando reduzir o ambiente a plantas e animais isolados. A história dos debates ambientais mostra a construção de uma preocupação coletiva com essas relações.",
      "Essa aprendizagem precisa resultar em participação e capacidade de decisão. A interdisciplinaridade reúne conhecimentos diferentes para interpretar problemas reais, enquanto projetos educativos consideram a idade, a experiência e o contexto dos participantes. Desenvolver uma atitude ecológica envolve valores, mas também a reflexão sobre comportamentos concretos: consumo, uso de recursos e responsabilidades compartilhadas. A ecocidadania liga ações locais a consequências mais amplas. Um projeto educativo consistente investiga o problema, dialoga com a comunidade e acompanha seus resultados para melhorar as próximas ações."
    ],
    "topicos": [
      "Crise ambiental",
      "História da educação ambiental",
      "Interdisciplinaridade",
      "Ecocidadania",
      "Atitudes e comportamentos",
      "Projetos educativos"
    ],
    "fontes": [
      {
        "id": "s2-ava-educacao-ambiental-f28",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Educação Ambiental/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "Educação Ambiental — Livro-Texto - Unidade I",
        "paginas": [
          9,
          10,
          14,
          18,
          19,
          23
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ava-educacao-ambiental-f29",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Educação Ambiental/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "Educação Ambiental — Livro-Texto - Unidade II",
        "paginas": [
          1,
          3,
          7,
          11,
          14,
          18,
          20,
          32
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Como a industrialização se relaciona com a crise ambiental estudada na disciplina?",
        "verso": "Ela transformou a produção e a vida urbana, ampliando também fontes de poluição do ar, da água e do solo.",
        "dica": "Observe os efeitos ambientais das mudanças econômicas.",
        "fonteId": "s2-ava-educacao-ambiental-f28",
        "pagina": 9
      },
      {
        "frente": "Por que o uso intensivo de energia deve fazer parte da análise ambiental?",
        "verso": "Porque os recursos e os processos usados para gerar energia podem comprometer o ambiente, especialmente quando a demanda cresce sem cuidado com seus impactos.",
        "dica": "Relacione fonte energética, consumo e consequências.",
        "fonteId": "s2-ava-educacao-ambiental-f28",
        "pagina": 10
      },
      {
        "frente": "O que um caso de contaminação do solo ensina sobre resíduos industriais?",
        "verso": "Que abandonar materiais perigosos pode espalhar a contaminação para o solo, a água e a população; o problema não termina quando a atividade industrial encerra.",
        "dica": "O resíduo permanece no ambiente.",
        "fonteId": "s2-ava-educacao-ambiental-f28",
        "pagina": 14
      },
      {
        "frente": "Por que a educação faz parte da resposta aos problemas ambientais?",
        "verso": "Porque mudanças duradouras dependem de compreensão e comportamento, além de medidas de controle da poluição.",
        "dica": "Conhecer o problema ajuda a mudar as práticas.",
        "fonteId": "s2-ava-educacao-ambiental-f28",
        "pagina": 18
      },
      {
        "frente": "Por que recursos naturais não devem ser analisados isoladamente?",
        "verso": "Eles são limitados e interligados: a redução ou degradação de um recurso pode afetar outros e comprometer condições de vida.",
        "dica": "Pense em relações entre água, solo e seres vivos.",
        "fonteId": "s2-ava-educacao-ambiental-f28",
        "pagina": 19
      },
      {
        "frente": "Como a educação ambiental crítica apoia a tomada de decisão?",
        "verso": "Ela desenvolve a capacidade de analisar problemas e escolher ações ambientalmente responsáveis, em espaços formais e não formais.",
        "dica": "Aprender também é avaliar escolhas.",
        "fonteId": "s2-ava-educacao-ambiental-f28",
        "pagina": 19
      },
      {
        "frente": "Por que limitar a educação ambiental à proteção de animais e plantas é insuficiente?",
        "verso": "Porque problemas ambientais também envolvem pobreza, desigualdade, condições de vida e decisões sociais que precisam entrar na análise.",
        "dica": "A sociedade faz parte do ambiente.",
        "fonteId": "s2-ava-educacao-ambiental-f28",
        "pagina": 23
      },
      {
        "frente": "Qual contribuição histórica de Tbilisi aparece no estudo da educação ambiental?",
        "verso": "A conferência consolidou definições, objetivos, princípios e estratégias que orientam práticas educativas sobre o ambiente.",
        "dica": "Lembre dos fundamentos compartilhados da área.",
        "fonteId": "s2-ava-educacao-ambiental-f28",
        "pagina": 23
      },
      {
        "frente": "Por que educação ambiental é um processo contínuo de aprendizagem?",
        "verso": "Porque envolve aprender sobre questões ambientais e reunir conhecimentos para tomar decisões e agir individual e coletivamente.",
        "dica": "Não se resume a uma campanha isolada.",
        "fonteId": "s2-ava-educacao-ambiental-f29",
        "pagina": 1
      },
      {
        "frente": "Qual a vantagem de investigar as causas dos problemas ambientais?",
        "verso": "Atuar sobre suas causas permite prevenir e transformar práticas que geram danos, em vez de apenas aliviar seus efeitos visíveis.",
        "dica": "Pergunte de onde o problema vem.",
        "fonteId": "s2-ava-educacao-ambiental-f29",
        "pagina": 3
      },
      {
        "frente": "Como a ecocidadania amplia a ideia de cidadania?",
        "verso": "Ela acrescenta responsabilidade ecológica à participação social, relacionando a comunidade local à vida no planeta.",
        "dica": "A ação começa perto e pode ter efeitos distantes.",
        "fonteId": "s2-ava-educacao-ambiental-f29",
        "pagina": 7
      },
      {
        "frente": "Por que um projeto de educação ambiental deve respeitar a diversidade do grupo?",
        "verso": "Porque participantes têm conhecimentos, valores e experiências diferentes, que influenciam a compreensão e a participação nas atividades.",
        "dica": "Conheça as pessoas antes de planejar.",
        "fonteId": "s2-ava-educacao-ambiental-f29",
        "pagina": 11
      },
      {
        "frente": "Como a interdisciplinaridade ajuda a compreender uma questão ambiental?",
        "verso": "Ela articula conhecimentos e métodos de diferentes áreas, permitindo compreender relações que uma disciplina isolada pode deixar de lado.",
        "dica": "Problemas reais atravessam fronteiras das matérias.",
        "fonteId": "s2-ava-educacao-ambiental-f29",
        "pagina": 14
      },
      {
        "frente": "Uma atitude ecológica garante um comportamento sustentável em todas as situações?",
        "verso": "Não. Atitudes expressam disposições e valores, mas hábitos e circunstâncias podem levar a comportamentos contraditórios.",
        "dica": "Compare o que a pessoa valoriza com o que faz.",
        "fonteId": "s2-ava-educacao-ambiental-f29",
        "pagina": 18
      },
      {
        "frente": "Como experiências de educação ambiental já realizadas ajudam um novo projeto?",
        "verso": "Elas oferecem referências que podem ser analisadas e adaptadas ao contexto e aos participantes, sem virar uma receita única.",
        "dica": "Adapte a experiência, não apenas a repita.",
        "fonteId": "s2-ava-educacao-ambiental-f29",
        "pagina": 20
      },
      {
        "frente": "O que caracteriza uma aprendizagem ambiental capaz de orientar ações?",
        "verso": "A capacidade de avaliar impactos, reunir informações, comparar alternativas e assumir responsabilidade por decisões que preservem ou melhorem a qualidade ambiental.",
        "dica": "Conhecimento precisa apoiar escolhas concretas.",
        "fonteId": "s2-ava-educacao-ambiental-f29",
        "pagina": 32
      }
    ]
  },
  {
    "id": "s2-ava-pesquisa-tecnologia-inovacao",
    "semestre": 2,
    "origem": "AVA",
    "nome": "Pesquisa, Tecnologia e Inovação",
    "resumo": [
      "A pesquisa científica transforma perguntas em investigação organizada. Ela se distingue pela explicitação de métodos, pela possibilidade de verificar afirmações e pela abertura à revisão diante de novas evidências. Hipóteses oferecem explicações que podem ser examinadas; raciocínios indutivos e dedutivos ajudam a relacionar observações e ideias gerais. Escolher procedimentos adequados ao problema é mais importante que apenas reunir informações sem um objetivo definido.",
      "A comunicação do estudo também faz parte do trabalho. Introdução, desenvolvimento e conclusão apresentam o problema, o caminho adotado e os resultados. Citações reconhecem ideias utilizadas, enquanto referências permitem localizar suas fontes. Resumir com palavras próprias não elimina a necessidade de reconhecer a autoria original. A disciplina ainda conecta pesquisa e inovação: conhecimento pode orientar produtos, processos e serviços que resolvem necessidades reais. Exemplos como transistores mostram como descobertas se transformam em aplicações. Para estudar, relacione sempre pergunta, evidência, conclusão e contribuição prática, distinguindo resultados observados de expectativas."
    ],
    "topicos": [
      "Conhecimento científico",
      "Hipóteses e raciocínio",
      "Trabalho acadêmico",
      "Citações e referências",
      "Integridade acadêmica",
      "Pesquisa e inovação"
    ],
    "fontes": [
      {
        "id": "s2-ava-pesquisa-tecnologia-inovacao-f30",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Pesquisa, Tecnologia e Inovação/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "Pesquisa, Tecnologia e Inovação — Livro-Texto - Unidade I",
        "paginas": [
          15,
          17,
          19
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ava-pesquisa-tecnologia-inovacao-f31",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Pesquisa, Tecnologia e Inovação/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "Pesquisa, Tecnologia e Inovação — Livro-Texto - Unidade II",
        "paginas": [
          9,
          17,
          18,
          21
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ava-pesquisa-tecnologia-inovacao-f32",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Pesquisa, Tecnologia e Inovação/UNIDADE 3/Livro-Texto - Unidade III.pdf",
        "titulo": "Pesquisa, Tecnologia e Inovação — Livro-Texto - Unidade III",
        "paginas": [
          2,
          4,
          18
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ava-pesquisa-tecnologia-inovacao-f33",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Pesquisa, Tecnologia e Inovação/UNIDADE 4/Livro-Texto - Unidade IV.pdf",
        "titulo": "Pesquisa, Tecnologia e Inovação — Livro-Texto - Unidade IV",
        "paginas": [
          1,
          2,
          7
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Por que o conhecimento científico pode ser revisado?",
        "verso": "Porque suas afirmações são verificáveis e falíveis: novas evidências ou análises podem exigir a revisão das explicações.",
        "dica": "Uma conclusão científica não é um dogma.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f30",
        "pagina": 15
      },
      {
        "frente": "Como indução e dedução contribuem de modos diferentes para uma pesquisa?",
        "verso": "A indução parte de observações particulares para formular generalizações; a dedução parte de premissas gerais para examinar consequências específicas.",
        "dica": "Observe o sentido do raciocínio.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f30",
        "pagina": 19
      },
      {
        "frente": "Qual papel uma hipótese desempenha na investigação de um problema?",
        "verso": "Ela propõe uma possível resposta ou explicação que deverá ser confrontada com evidências, em vez de ser tomada como conclusão pronta.",
        "dica": "A hipótese abre uma investigação.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f30",
        "pagina": 17
      },
      {
        "frente": "Por que lei científica e teoria não são sinônimos?",
        "verso": "Uma lei descreve um padrão observado; uma teoria oferece uma explicação fundamentada para um conjunto de fenômenos.",
        "dica": "Descrição de regularidade e explicação têm funções distintas.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f30",
        "pagina": 19
      },
      {
        "frente": "Por que é recomendável escrever o resumo depois do corpo do trabalho?",
        "verso": "Porque o resumo precisa representar o estudo efetivamente realizado, incluindo seu objetivo, percurso e resultados, já definidos no texto.",
        "dica": "Resuma o que foi feito de fato.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f31",
        "pagina": 9
      },
      {
        "frente": "Qual função o desenvolvimento cumpre em um trabalho acadêmico?",
        "verso": "Ele detalha o estudo, articulando fundamentação, métodos e análise dos dados ou argumentos que sustentam a pesquisa.",
        "dica": "É o lugar de mostrar como a investigação foi construída.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f31",
        "pagina": 17
      },
      {
        "frente": "O que uma conclusão deve recuperar de uma pesquisa?",
        "verso": "Os principais resultados e suas interpretações, relacionando-os ao objetivo do trabalho e, quando pertinente, a possibilidades de continuidade.",
        "dica": "Feche o problema apresentado na introdução.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f31",
        "pagina": 18
      },
      {
        "frente": "Como apêndice e anexo se distinguem pela autoria do material?",
        "verso": "O apêndice reúne material complementar elaborado pelo próprio autor; o anexo incorpora material produzido por terceiros com a devida indicação de origem.",
        "dica": "Pergunte quem produziu o documento complementar.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f31",
        "pagina": 21
      },
      {
        "frente": "Como a citação se relaciona com a referência em um texto acadêmico?",
        "verso": "A citação usa uma ideia, dado ou trecho no texto; a referência fornece as informações que identificam a obra de origem.",
        "dica": "Uma aparece no argumento; a outra identifica a fonte.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f32",
        "pagina": 2
      },
      {
        "frente": "Quando uma citação é considerada direta?",
        "verso": "Quando reproduz literalmente um trecho da fonte, preservando as palavras originais e identificando sua autoria e localização.",
        "dica": "A transcrição deve ser reconhecível como transcrição.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f32",
        "pagina": 2
      },
      {
        "frente": "Por que escrever uma ideia de outro autor com suas palavras ainda exige citar a fonte?",
        "verso": "Porque a redação mudou, mas a contribuição intelectual continua vindo da obra consultada; essa é a lógica da citação indireta.",
        "dica": "Parafrasear não transfere a autoria da ideia.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f32",
        "pagina": 4
      },
      {
        "frente": "Como o plágio prejudica a comunicação científica?",
        "verso": "Ele apresenta conteúdo ou ideias alheias como próprios, ocultando sua origem e comprometendo a confiança e o reconhecimento da autoria.",
        "dica": "A integridade depende de atribuição clara.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f32",
        "pagina": 18
      },
      {
        "frente": "Toda pesquisa precisa resultar imediatamente em um produto novo?",
        "verso": "Não. A pesquisa básica também amplia o conhecimento sem exigir uma aplicação imediata; possíveis usos podem surgir depois.",
        "dica": "Produzir conhecimento já é um objetivo válido.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f33",
        "pagina": 1
      },
      {
        "frente": "Como a inovação se relaciona com a aplicação do conhecimento?",
        "verso": "Ela transforma conhecimentos em produtos, processos ou serviços novos ou aprimorados que atendem necessidades e geram valor.",
        "dica": "A ideia precisa chegar a uma aplicação útil.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f33",
        "pagina": 2
      },
      {
        "frente": "Qual a diferença entre criar uma inovação e ela se tornar prática de mercado?",
        "verso": "Criar a inovação introduz uma solução; tornar-se prática de mercado envolve sua adoção mais ampla por empresas, organizações ou usuários.",
        "dica": "Pense na diferença entre desenvolver e difundir.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f33",
        "pagina": 2
      },
      {
        "frente": "Por que o transistor é apresentado como exemplo de pesquisa aplicada à computação?",
        "verso": "Seu desenvolvimento permitiu usar dispositivos eletrônicos como interruptores em grande quantidade, contribuindo para circuitos computacionais mais confiáveis.",
        "dica": "Uma descoberta física pode transformar o hardware.",
        "fonteId": "s2-ava-pesquisa-tecnologia-inovacao-f33",
        "pagina": 7
      }
    ]
  },
  {
    "id": "s2-ava-redes-computadores-sistemas-distribuidos",
    "semestre": 2,
    "origem": "AVA",
    "nome": "Redes de Computadores e Sistemas Distribuídos",
    "resumo": [
      "Redes permitem que equipamentos troquem informações e compartilhem recursos por meios de transmissão e protocolos. Seu funcionamento envolve diferentes responsabilidades: transportar sinais, organizar quadros, encaminhar pacotes e entregar dados às aplicações. Modelos em camadas ajudam a entender essas funções e a localizar problemas. A qualidade percebida também depende de fatores diferentes, como taxa efetiva de transferência, atraso, variação desse atraso e disponibilidade.",
      "O endereçamento conecta a organização lógica à comunicação: portas identificam serviços, endereços IP apoiam a comunicação entre redes e endereços MAC participam da entrega no enlace. Máscaras e sub-redes organizam grupos de endereços, enquanto VLANs permitem segmentação lógica. Sistemas distribuídos usam a rede para coordenar componentes que cooperam na execução de serviços. Essa distribuição possibilita compartilhar carga e recursos, mas introduz falhas independentes, atrasos e desafios de consistência. Ao estudar um cenário, acompanhe o caminho da informação e pergunte qual componente realiza cada função e como o sistema reage quando uma parte falha."
    ],
    "topicos": [
      "Conectividade e protocolos",
      "Desempenho de redes",
      "Modelos em camadas",
      "Endereçamento",
      "Segmentação de redes",
      "Sistemas distribuídos"
    ],
    "fontes": [
      {
        "id": "s2-ava-redes-computadores-sistemas-distribuidos-f34",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Redes de Computadores e Sistemas Distribuídos/UNIDADE 1/Livro-Texto - Unidade I.pdf",
        "titulo": "Redes de Computadores e Sistemas Distribuídos — Livro-Texto - Unidade I",
        "paginas": [
          16,
          31,
          32,
          34
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ava-redes-computadores-sistemas-distribuidos-f35",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Redes de Computadores e Sistemas Distribuídos/UNIDADE 2/Livro-Texto - Unidade II.pdf",
        "titulo": "Redes de Computadores e Sistemas Distribuídos — Livro-Texto - Unidade II",
        "paginas": [
          5,
          7,
          15,
          30
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ava-redes-computadores-sistemas-distribuidos-f36",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Redes de Computadores e Sistemas Distribuídos/UNIDADE 3/Livro-Texto - Unidade III.pdf",
        "titulo": "Redes de Computadores e Sistemas Distribuídos — Livro-Texto - Unidade III",
        "paginas": [
          1,
          2,
          17,
          24
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ava-redes-computadores-sistemas-distribuidos-f37",
        "arquivo": "2° Semestre/Disciplinas On-line/AVA/Redes de Computadores e Sistemas Distribuídos/UNIDADE 4/Livro-Texto - Unidade IV.pdf",
        "titulo": "Redes de Computadores e Sistemas Distribuídos — Livro-Texto - Unidade IV",
        "paginas": [
          1,
          3,
          4,
          7
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Quais elementos precisam atuar juntos para que equipamentos compartilhem dados em rede?",
        "verso": "Dispositivos capazes de comunicar, meios de transmissão que os conectem e protocolos que estabeleçam como a troca ocorre.",
        "dica": "Equipamento, caminho e regras.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f34",
        "pagina": 16
      },
      {
        "frente": "Por que uma videoconferência pode sofrer mesmo com boa capacidade de transmissão?",
        "verso": "Porque aplicações em tempo real também são sensíveis a atraso e jitter, a variação desse atraso, que afetam a continuidade da comunicação.",
        "dica": "Volume de dados não é a única medida de qualidade.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f34",
        "pagina": 31
      },
      {
        "frente": "O que o throughput mostra sobre uma conexão?",
        "verso": "A taxa de transferência efetivamente alcançada, considerando fatores como congestionamento, perdas e limitações dos equipamentos.",
        "dica": "Compare a capacidade anunciada com o resultado real.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f34",
        "pagina": 32
      },
      {
        "frente": "Por que disponibilidade de rede exige pensar em contingência?",
        "verso": "Porque componentes podem falhar e uma alternativa de operação ajuda a manter o serviço quando o caminho principal deixa de funcionar.",
        "dica": "Planeje a continuidade antes da falha.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f34",
        "pagina": 34
      },
      {
        "frente": "Como a divisão em camadas facilita a investigação de uma falha de comunicação?",
        "verso": "Ela organiza responsabilidades, permitindo localizar se o problema envolve sinal, enlace, endereçamento ou outra função da comunicação.",
        "dica": "Investigue a função afetada.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f35",
        "pagina": 5
      },
      {
        "frente": "Quais aspectos da comunicação pertencem à camada física?",
        "verso": "Sinais, meios, conectores e características elétricas ou mecânicas necessárias à transmissão de bits.",
        "dica": "Pense no transporte do sinal.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f35",
        "pagina": 7
      },
      {
        "frente": "Qual diferença entre store-and-forward e cut-through no encaminhamento de quadros?",
        "verso": "Store-and-forward recebe o quadro completo antes de encaminhá-lo e pode verificar erros; cut-through começa a encaminhar após ler o destino, reduzindo a espera.",
        "dica": "O momento de encaminhar cria um compromisso entre espera e verificação.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f35",
        "pagina": 15
      },
      {
        "frente": "Como a escolha entre TCP e UDP se relaciona com as necessidades da aplicação?",
        "verso": "TCP fornece mecanismos de entrega confiável e ordenada; UDP envia datagramas sem essas garantias, deixando à aplicação lidar com perdas e ordem quando necessário.",
        "dica": "Considere confiabilidade e os mecanismos que cada aplicação necessita.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f35",
        "pagina": 30
      },
      {
        "frente": "Por que IP, MAC e porta não substituem uns aos outros?",
        "verso": "Eles identificam aspectos distintos: IP atua no endereçamento entre redes, MAC no enlace e porta na identificação do serviço ou processo de comunicação.",
        "dica": "Cada identificador tem seu contexto.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f36",
        "pagina": 1
      },
      {
        "frente": "Como a notação decimal de um endereço IPv4 representa seus bits?",
        "verso": "Ela separa os 32 bits em quatro grupos de oito, exibidos como números de 0 a 255 separados por pontos.",
        "dica": "Cada número representa um octeto.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f36",
        "pagina": 2
      },
      {
        "frente": "Como a máscara de sub-rede ajuda a interpretar um IPv4?",
        "verso": "Ela indica quais bits pertencem ao prefixo de rede e sub-rede e quais identificam hosts dentro desse grupo.",
        "dica": "Bits 1 marcam o prefixo; bits 0 marcam a parte de host.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f36",
        "pagina": 17
      },
      {
        "frente": "Como uma VLAN permite separar equipamentos ligados ao mesmo switch?",
        "verso": "Ela organiza redes lógicas distintas no mesmo equipamento físico, separando os grupos; a comunicação entre VLANs exige roteamento apropriado.",
        "dica": "A divisão lógica não depende apenas do cabo.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f36",
        "pagina": 24
      },
      {
        "frente": "O que faz um conjunto de computadores ser percebido como um sistema distribuído?",
        "verso": "Os computadores cooperam por uma rede e oferecem um serviço coerente ao usuário, embora existam componentes independentes por trás dele.",
        "dica": "Várias partes podem apresentar um serviço integrado.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f37",
        "pagina": 1
      },
      {
        "frente": "Como os nós de um sistema distribuído coordenam suas tarefas?",
        "verso": "Eles trocam mensagens pela rede para compartilhar informações e organizar a execução, podendo representar máquinas ou processos.",
        "dica": "A comunicação faz a cooperação acontecer.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f37",
        "pagina": 3
      },
      {
        "frente": "Por que falhas independentes são um desafio em sistemas distribuídos?",
        "verso": "Uma parte pode falhar enquanto outras continuam operando, exigindo que o sistema detecte e trate essa situação sem presumir uma falha total.",
        "dica": "Nem todos os componentes têm o mesmo estado ao mesmo tempo.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f37",
        "pagina": 4
      },
      {
        "frente": "Por que réplicas podem apresentar dados diferentes por um breve período?",
        "verso": "A atualização precisa se propagar pela rede; durante esse intervalo, uma réplica pode ainda não ter recebido a alteração processada pelo líder.",
        "dica": "Replicação envolve tempo de comunicação.",
        "fonteId": "s2-ava-redes-computadores-sistemas-distribuidos-f37",
        "pagina": 7
      }
    ]
  },
  {
    "id": "s2-ed-analise-projeto-sistemas",
    "semestre": 2,
    "origem": "ED",
    "nome": "Análise e Projeto de Sistemas",
    "resumo": [
      "Analisar e projetar um sistema é transformar necessidades em uma solução compreensível e implementável. O levantamento e a especificação de requisitos ajudam a registrar o que se espera do produto. Modelos permitem discutir decisões antes e durante a construção, reduzindo ambiguidades entre pessoas com papéis diferentes. A UML oferece uma linguagem visual para representar aspectos complementares da solução, sem impor uma linguagem de programação específica.",
      "Cada diagrama responde a perguntas distintas. Casos de uso ajudam a visualizar serviços e interações externas; classes mostram estrutura, atributos, operações e relacionamentos. Sequência e atividades exploram comportamento, trocas de mensagens, decisões e paralelismo. Estados descrevem mudanças na situação de um objeto, enquanto componentes ajudam a compreender a organização da implementação. Esses modelos precisam permanecer coerentes entre si e com o software. O ciclo de vida inclui evolução e manutenção: versões podem ser refinadas com feedback, e a entrega em produção exige acompanhar falhas, desempenho e experiência dos usuários."
    ],
    "topicos": [
      "Requisitos e modelos",
      "UML",
      "Casos de uso",
      "Classes e relacionamentos",
      "Interações e atividades",
      "Ciclo de vida"
    ],
    "fontes": [
      {
        "id": "s2-ed-analise-projeto-sistemas-f39",
        "arquivo": "2° Semestre/Disciplinas Presenciais/ED/Análise e Projeto de Sistemas/Livro_Computacao_Análise e Projeto de Sistemas.pdf",
        "titulo": "Análise e Projeto de Sistemas — Livro_Computacao_Análise e Projeto de Sistemas",
        "paginas": [
          15,
          26,
          29,
          40,
          48,
          50,
          54,
          55,
          56,
          58,
          68,
          70,
          78,
          95
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ed-analise-projeto-sistemas-f38",
        "arquivo": "2° Semestre/Disciplinas Presenciais/ED/Análise e Projeto de Sistemas/2025-2-Aula01-Análise e Projeto de Sistemas-CicloDeVida.pdf",
        "titulo": "Análise e Projeto de Sistemas — 2025-2-Aula01-Análise e Projeto de Sistemas-CicloDeVida",
        "paginas": [
          14,
          22
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Por que a UML pode apoiar projetos implementados em linguagens diferentes?",
        "verso": "Porque expressa modelos e decisões do sistema de modo independente da linguagem usada para programá-lo.",
        "dica": "Modelar uma solução e codificá-la são atividades relacionadas, mas distintas.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 15
      },
      {
        "frente": "Como os requisitos ajudam a validar um sistema depois de construído?",
        "verso": "Eles registram expectativas aceitas e oferecem uma referência para verificar se as funcionalidades entregues atendem ao que foi solicitado.",
        "dica": "A avaliação precisa de um critério conhecido.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 26
      },
      {
        "frente": "Como um protótipo contribui para esclarecer uma funcionalidade?",
        "verso": "Ele apresenta um esboço que facilita a visualização e a discussão com o usuário, mesmo sem ter toda a lógica ou persistência implementada.",
        "dica": "Experimentar a ideia pode revelar mal-entendidos.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 29
      },
      {
        "frente": "O que muda quando a análise do sistema avança para o projeto?",
        "verso": "O entendimento do problema é refinado em decisões de solução, incluindo estrutura, algoritmos, interfaces e escolhas de implementação.",
        "dica": "Passe do entendimento para a organização da solução.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 40
      },
      {
        "frente": "Como casos de uso ajudam a comunicar a visão geral de um sistema?",
        "verso": "Eles mostram as funcionalidades oferecidas e os perfis externos que interagem com elas, apoiando a discussão do escopo.",
        "dica": "Observe quem usa qual serviço.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 48
      },
      {
        "frente": "Quando a inclusão entre casos de uso é útil na modelagem?",
        "verso": "Quando um caso de uso incorpora comportamento obrigatório representado por outro caso de uso, permitindo explicitar esse reaproveitamento.",
        "dica": "Pense em comportamento incluído, não apenas em ordem temporal.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 50
      },
      {
        "frente": "Que aspecto do sistema um diagrama de classes destaca?",
        "verso": "A estrutura das entidades e seus relacionamentos, mostrando como as responsabilidades e informações estão organizadas.",
        "dica": "Ele descreve a estrutura, não a sequência completa de execução.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 54
      },
      {
        "frente": "Como atributos e operações se distinguem na representação de uma classe?",
        "verso": "Atributos representam características ou dados; operações representam comportamentos e podem indicar parâmetros e retorno.",
        "dica": "Estado e comportamento são dimensões complementares.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 55
      },
      {
        "frente": "Por que uma classe abstrata não representa um objeto criado diretamente?",
        "verso": "Ela serve como uma definição geral a ser especializada; a instanciação direta é reservada a classes concretas.",
        "dica": "Uma abstração pode orientar outras classes.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 56
      },
      {
        "frente": "O que uma dependência indica entre elementos de um modelo?",
        "verso": "Que um elemento utiliza informações ou serviços de outro e pode ser afetado por mudanças nesse fornecedor.",
        "dica": "A relação tem uma direção.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 58
      },
      {
        "frente": "Qual pergunta um diagrama de sequência ajuda a responder?",
        "verso": "Como participantes trocam mensagens ao longo de uma interação, esclarecendo a ordem e a colaboração necessárias ao comportamento.",
        "dica": "Acompanhe quem chama quem.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 68
      },
      {
        "frente": "O que o foco de controle mostra em uma linha de vida?",
        "verso": "O intervalo em que o participante está executando uma ação ou operação na interação representada.",
        "dica": "Observe a atividade dentro da linha de vida.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 70
      },
      {
        "frente": "Como decisão e bifurcação se diferenciam em um diagrama de atividades?",
        "verso": "A decisão seleciona caminhos por condições; a bifurcação separa fluxos que podem ocorrer em paralelo.",
        "dica": "Escolher um caminho é diferente de iniciar trabalhos paralelos.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 78
      },
      {
        "frente": "Quando um diagrama de máquina de estados é especialmente útil?",
        "verso": "Quando importa compreender como um objeto muda de situação ao longo de sua vida em resposta a eventos.",
        "dica": "Pense em estados e transições de um mesmo objeto.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f39",
        "pagina": 95
      },
      {
        "frente": "Como uma iteração contribui para o desenvolvimento de software?",
        "verso": "Ela permite planejar, construir, testar e avaliar uma parte ou versão da solução, usando o aprendizado para orientar refinamentos.",
        "dica": "Cada ciclo pode gerar aprendizado e uma versão avaliável.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f38",
        "pagina": 22
      },
      {
        "frente": "Por que a manutenção continua após a implantação?",
        "verso": "Porque é necessário corrigir problemas, acompanhar desempenho e segurança e ajustar o sistema conforme surgem necessidades dos usuários.",
        "dica": "A entrega inicia também uma fase de acompanhamento.",
        "fonteId": "s2-ed-analise-projeto-sistemas-f38",
        "pagina": 14
      }
    ]
  },
  {
    "id": "s2-ed-engenharia-requisitos-processos-software",
    "semestre": 2,
    "origem": "ED",
    "nome": "Engenharia de Requisitos e Processos de Software",
    "resumo": [
      "A engenharia de requisitos busca compreender as necessidades das partes interessadas e transformá-las em descrições que orientem a construção do software. Esse trabalho envolve descobrir, analisar, negociar, documentar e validar expectativas. Requisitos funcionais descrevem comportamentos; requisitos não funcionais definem qualidades e restrições. A qualidade da especificação depende de clareza, consistência, completude e possibilidade de avaliação, evitando frases que cada pessoa interprete de um jeito.",
      "Entrevistas, oficinas, observação e protótipos ajudam a investigar necessidades sob perspectivas diferentes. Histórias de usuário relacionam funcionalidades ao valor esperado, enquanto critérios de aceitação ajudam a discutir sua conclusão. A rastreabilidade conecta requisitos às origens, ao projeto e aos testes, permitindo avaliar mudanças. Processos de software organizam esse trabalho junto com implementação, verificação e evolução. Modelos sequenciais, iterativos e orientados a riscos apresentam formas distintas de conduzir as atividades. A escolha precisa considerar o contexto e a incerteza, mantendo feedback e evidências de que a solução atende ao problema real."
    ],
    "topicos": [
      "Elicitação e especificação",
      "Tipos de requisitos",
      "Histórias de usuário",
      "Rastreabilidade",
      "Validação",
      "Processos de software",
      "Gestão de riscos"
    ],
    "fontes": [
      {
        "id": "s2-ed-engenharia-requisitos-processos-software-f40",
        "arquivo": "2° Semestre/Disciplinas Presenciais/ED/Engenharia de Requisitos e Processos de Software/UNIDADE 1/Unidade 1 - Engenharia de Requisitos e Processos de Software.pdf",
        "titulo": "Engenharia de Requisitos e Processos de Software — Unidade 1 - Engenharia de Requisitos e Processos de Software",
        "paginas": [
          8,
          13,
          14
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ed-engenharia-requisitos-processos-software-f41",
        "arquivo": "2° Semestre/Disciplinas Presenciais/ED/Engenharia de Requisitos e Processos de Software/UNIDADE 2/Unidade 2 - Técnicas e Ferramentas da Engenharia de Requisitos.pdf",
        "titulo": "Engenharia de Requisitos e Processos de Software — Unidade 2 - Técnicas e Ferramentas da Engenharia de Requisitos",
        "paginas": [
          9,
          11,
          13,
          16
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ed-engenharia-requisitos-processos-software-f42",
        "arquivo": "2° Semestre/Disciplinas Presenciais/ED/Engenharia de Requisitos e Processos de Software/UNIDADE 3/Unidade 3 - Ferramentas e Exemplos de Engenharia de Requisitos.pdf",
        "titulo": "Engenharia de Requisitos e Processos de Software — Unidade 3 - Ferramentas e Exemplos de Engenharia de Requisitos",
        "paginas": [
          10,
          11,
          19
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ed-engenharia-requisitos-processos-software-f43",
        "arquivo": "2° Semestre/Disciplinas Presenciais/ED/Engenharia de Requisitos e Processos de Software/UNIDADE 4/Unidade 4 - Introdução ao Processo de Software.pdf",
        "titulo": "Engenharia de Requisitos e Processos de Software — Unidade 4 - Introdução ao Processo de Software",
        "paginas": [
          9,
          14,
          23
        ],
        "formato": "pdf"
      },
      {
        "id": "s2-ed-engenharia-requisitos-processos-software-f44",
        "arquivo": "2° Semestre/Disciplinas Presenciais/ED/Engenharia de Requisitos e Processos de Software/UNIDADE 5/Unidade 5 - Engenharia de Requisitos e Processos de Software.pdf",
        "titulo": "Engenharia de Requisitos e Processos de Software — Unidade 5 - Engenharia de Requisitos e Processos de Software",
        "paginas": [
          9,
          17,
          23
        ],
        "formato": "pdf"
      }
    ],
    "cartas": [
      {
        "frente": "Por que compreender o propósito do sistema vem antes de detalhar sua implementação?",
        "verso": "Porque o desenvolvimento precisa partir do problema e das necessidades do cliente, evitando construir corretamente uma solução que não atende ao objetivo.",
        "dica": "Primeiro entenda o que precisa ser resolvido.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f40",
        "pagina": 8
      },
      {
        "frente": "Como diferenciar uma função esperada de um atributo de qualidade do sistema?",
        "verso": "A função descreve um comportamento oferecido; o atributo de qualidade ou restrição descreve condições como desempenho, usabilidade ou confiabilidade.",
        "dica": "Pergunte o que faz e sob quais condições.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f40",
        "pagina": 14
      },
      {
        "frente": "Qual diferença entre validar requisitos e gerenciar suas mudanças?",
        "verso": "Validar examina se os requisitos têm qualidade e representam necessidades; gerenciar acompanha e controla suas alterações durante a vida do projeto.",
        "dica": "Uma atividade avalia; a outra acompanha a evolução.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f40",
        "pagina": 13
      },
      {
        "frente": "Por que elicitação exige ouvir diferentes partes interessadas?",
        "verso": "Porque usuários, clientes, equipe técnica e outros envolvidos conhecem necessidades e restrições diferentes que precisam ser conciliadas.",
        "dica": "Uma única visão pode deixar lacunas.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f41",
        "pagina": 9
      },
      {
        "frente": "Como uma história de usuário relaciona uma função ao seu valor?",
        "verso": "Ela apresenta quem precisa da função, o que deseja realizar e por que isso é útil, mantendo o foco no benefício esperado.",
        "dica": "Papel, necessidade e benefício.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f41",
        "pagina": 11
      },
      {
        "frente": "Por que rastrear a origem e o destino de um requisito ajuda a manter o projeto?",
        "verso": "Porque permite relacionar a necessidade aos elementos construídos e avaliar o que deve mudar quando essa necessidade é alterada.",
        "dica": "Siga os vínculos em ambas as direções.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f41",
        "pagina": 13
      },
      {
        "frente": "Como a rastreabilidade entre requisitos e testes apoia a verificação?",
        "verso": "Ela mostra quais testes avaliam cada requisito e ajuda a encontrar necessidades sem cobertura de verificação.",
        "dica": "Um requisito deve ter uma forma de avaliação.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f41",
        "pagina": 16
      },
      {
        "frente": "Por que um épico costuma ser dividido antes de entrar em uma iteração?",
        "verso": "Porque sua abrangência pode ser grande demais para uma entrega curta; a divisão cria histórias menores e mais compreensíveis.",
        "dica": "Reduza o tamanho preservando o valor de cada parte.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f42",
        "pagina": 10
      },
      {
        "frente": "Por que uma tarefa técnica não equivale necessariamente a uma história de usuário?",
        "verso": "A tarefa pode ser apenas uma parte da implementação; a história representa uma funcionalidade ou benefício percebido pelo usuário.",
        "dica": "Criar uma tela pode ser só uma parte da experiência completa.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f42",
        "pagina": 11
      },
      {
        "frente": "Como a ambiguidade na documentação afeta a construção do software?",
        "verso": "Ela permite interpretações diferentes sobre o comportamento esperado, dificultando desenvolvimento, testes e acordo com as partes interessadas.",
        "dica": "Escreva de modo que duas pessoas entendam a mesma coisa.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f42",
        "pagina": 19
      },
      {
        "frente": "Quais grupos de atividades aparecem na organização de um processo de software?",
        "verso": "Especificação, projeto e implementação, verificação e validação, além da evolução da solução ao longo do tempo.",
        "dica": "O processo cobre mais que escrever código.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f43",
        "pagina": 9
      },
      {
        "frente": "Como o modelo cascata organiza suas principais atividades?",
        "verso": "Ele dispõe etapas como requisitos, projeto, implementação, testes e manutenção em uma sequência, na qual resultados anteriores orientam os seguintes.",
        "dica": "Visualize o encadeamento entre etapas.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f43",
        "pagina": 14
      },
      {
        "frente": "Qual benefício o feedback frequente traz ao desenvolvimento incremental?",
        "verso": "Permite avaliar partes funcionais antes da entrega completa e usar o retorno do cliente para orientar os próximos incrementos.",
        "dica": "Aprenda com uma entrega utilizável.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f43",
        "pagina": 23
      },
      {
        "frente": "Por que requisitos de usuário precisam de uma linguagem compreensível aos envolvidos?",
        "verso": "Porque devem comunicar expectativas e permitir sua validação por quem conhece o problema, mesmo sem domínio dos detalhes técnicos.",
        "dica": "A especificação também é um instrumento de diálogo.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f44",
        "pagina": 9
      },
      {
        "frente": "Como completude e consistência se diferenciam na validação de requisitos?",
        "verso": "Completude busca necessidades e detalhes que ficaram ausentes; consistência busca requisitos que se contradizem.",
        "dica": "Procure lacunas e conflitos separadamente.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f44",
        "pagina": 17
      },
      {
        "frente": "Qual papel a análise de riscos exerce no modelo espiral?",
        "verso": "Ela orienta a avaliação de alternativas e o planejamento dos ciclos, ajudando a enfrentar incertezas antes de avançar na solução.",
        "dica": "Cada volta deve reduzir dúvidas importantes.",
        "fonteId": "s2-ed-engenharia-requisitos-processos-software-f44",
        "pagina": 23
      }
    ]
  }
];
