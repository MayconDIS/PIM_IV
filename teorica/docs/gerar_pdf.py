import os
import sys

# Tenta importar fpdf2, se falhar, tenta instalar
try:
    from fpdf import FPDF
except ImportError:
    print("FPDF2 não está instalado. Tentando instalar via pip...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "fpdf2"])
    from fpdf import FPDF

class NexTIPDF(FPDF):
    def header(self):
        # Fundo do cabeçalho em Slate 900
        self.set_fill_color(15, 23, 42)
        self.rect(0, 0, 210, 30, 'F')
        
        # Detalhe decorativo em Cyan
        self.set_fill_color(0, 230, 230)
        self.rect(0, 30, 210, 1.5, 'F')
        
        # Título principal
        self.set_font('Helvetica', 'B', 13)
        self.set_text_color(255, 255, 255)
        self.set_y(5)
        self.cell(0, 7, 'NEX_TI - ROTEIRO & SCRIPTS DE APRESENTACAO DA BANCA', 0, 1, 'C')
        
        # Subtítulo
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(0, 230, 230)
        self.cell(0, 4, 'Guia de Apoio para Defesa das 9 Etapas e Metodologia do PIM III (Proj. Integrado Multidisciplinar)', 0, 1, 'C')
        
        self.set_y(36)

    def footer(self):
        # Rodapé posicionado a 12 mm da margem inferior
        self.set_y(-12)
        
        # Linha decorativa
        self.set_draw_color(226, 232, 240)
        self.line(15, self.get_y(), 195, self.get_y())
        
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(100, 116, 139)
        
        # Nome do projeto e grupo
        self.cell(90, 8, 'UNIP - CST ADS (Analise e Desenv. de Sistemas) - Grupo 02', 0, 0, 'L')
        # Paginação
        self.cell(90, 8, f'Página {self.page_no()}', 0, 0, 'R')

    def add_slide_title(self, number, title):
        self.set_font('Helvetica', 'B', 12.5)
        self.set_text_color(15, 23, 42)
        
        # Caixa de fundo para o título do slide
        self.set_fill_color(241, 245, 249)
        self.cell(0, 8.0, f' SLIDE {number}: {title.upper()}', 0, 1, 'L', fill=True)
        self.ln(1.5)

    def add_bullet_point(self, title, text):
        orig_left = self.l_margin
        
        # Desenha o bullet
        self.set_font('Helvetica', 'B', 10.5)
        self.set_text_color(30, 41, 59)
        self.set_x(20)
        self.cell(4, 4.0, chr(149), 0, 0, 'L')
        
        # Recuo dinâmico de margem
        self.set_left_margin(24)
        self.set_x(24)
        
        # Título em negrito
        self.set_font('Helvetica', 'B', 10.5)
        self.write(4.5, f'{title}: ')
        
        # Descrição normal
        self.set_font('Helvetica', '', 10.5)
        self.set_text_color(71, 85, 105)
        self.write(4.5, text)
        
        # Quebra de linha e restauração de margem
        self.ln(5.5)
        self.set_left_margin(orig_left)

    def add_script_fala(self, texto_fala):
        # Caixa estilizada para a fala da equipe
        self.set_fill_color(248, 250, 252) # Light Slate
        self.set_draw_color(203, 213, 225) # Border Slate
        self.set_text_color(15, 23, 42)
        
        # Posicionamento e borda esquerda decorativa em ciano
        x_init = self.get_x()
        y_init = self.get_y()
        
        # Desenha um retângulo de fundo de 33mm para caber a fala expandida com fontes maiores
        self.rect(x_init, y_init, 180, 33, 'F')
        
        # Desenha a barra ciano
        self.set_fill_color(0, 200, 200)
        self.rect(x_init, y_init, 2, 33, 'F')
        
        # Escreve o texto com recuo
        self.set_xy(x_init + 5, y_init + 2)
        self.set_font('Helvetica', 'B', 9.5)
        self.set_text_color(13, 148, 136) # Teal
        self.cell(0, 4, 'ROTEIRO DE FALA SUGERIDO (APRESENTACAO):', 0, 1, 'L')
        
        self.set_x(x_init + 5)
        self.set_font('Helvetica', 'I', 9.0)
        self.set_text_color(30, 41, 59)
        self.multi_cell(170, 4.4, texto_fala)
        
        # Ajusta a posição Y final
        self.set_xy(x_init, y_init + 35)

    def add_defesa(self, question, answer):
        orig_left = self.l_margin
        
        # Pergunta
        self.set_font('Helvetica', 'B', 9.5)
        self.set_text_color(15, 23, 42) # Slate 900
        self.write(4.4, f'Duvida Banca: {question}')
        self.ln(4.8)
        
        # Recuo da resposta
        self.set_left_margin(20)
        self.set_x(20)
        
        # Resposta
        self.set_font('Helvetica', '', 9.0)
        self.set_text_color(15, 23, 42) # Slate 900
        self.write(4.4, f'Defesa Rapida: {answer}')
        
        # Linha em branco e restaura margem
        self.ln(5.8)
        self.set_left_margin(orig_left)

    def add_defesa_divider(self):
        self.set_font('Helvetica', 'B', 10.5)
        self.set_text_color(15, 23, 42) # Slate 900
        self.cell(0, 5.0, 'GUIA DE DEFESA RÁPIDA (PERGUNTAS DA BANCA):', 0, 1, 'L')
        self.ln(1.0)

def gerar_apresentacao(output_path):
    pdf = NexTIPDF()
    pdf.set_top_margin(36)
    pdf.set_left_margin(15)
    pdf.set_right_margin(15)
    pdf.set_auto_page_break(auto=True, margin=12)
    
    # ==================== PÁGINA 1: SLIDE 1 ====================
    pdf.add_page()
    pdf.add_slide_title("1", "Caracterizacao do Negocio (Etapa 1)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Caracterizacao', 'Startup fictícia de tecnologia educacional (EdTech) voltada ao nivelamento acadêmico de estudantes de TI.')
    pdf.add_bullet_point('Objetivo Pedagogico', 'Aplicação de estudo ativo por flashcards para fixação e memorização de conceitos técnicos básicos.')
    pdf.add_bullet_point('Regras de Negocio', 'RN01 (bonificação de XP e moedas condicionada à conclusão total do deck), perfis de acesso e limites de uso.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'Ola, professores. O nosso projeto desenvolve a Nex_TI, uma empresa ficticia de tecnologia educacional voltada ao nivelamento academico de alunos ingressantes em cursos de TI. Projetamos uma plataforma de estudo ativo para mitigar a evasao escolar e facilitar o aprendizado de conceitos basicos. Estabelecemos como regra de negocio principal que a bonificacao em experiencia e moedas virtuais ocorra apenas apos o encerramento completo do ciclo de flashcards.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Como voces justificam a RN01 (Atribuicao de Recompensas) no fluxo do sistema?',
                   'Para assegurar que o estudante conclua o ciclo de revisao programado, garantindo que o algoritmo de repeticao espacada atue de forma eficaz na memorizacao, sem interrupcoes parciais da atividade.')
    pdf.add_defesa('Quem e o Publico-Alvo e qual o modelo operacional da plataforma?',
                   'O publico-alvo sao estudantes ingressantes na area de tecnologia. O modelo de negocio e de assinatura, atendendo tanto a instituicoes de ensino interessadas no nivelamento de turmas (B2B) quanto a usuarios individuais (B2C).')

    # ==================== PÁGINA 2: SLIDE 2 ====================
    pdf.add_page()
    pdf.add_slide_title("2", "Engenharia de Requisitos & LGPD (Etapa 2)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Levantamento de requisitos, organizacao do backlog de produto e diretrizes de conformidade com a LGPD.')
    pdf.add_bullet_point('Requisitos', 'Classificacao em funcionais (autenticacao, motor de flashcards) e nao funcionais (responsividade, acessibilidade e criptografia).')
    pdf.add_bullet_point('Conformidade e Estimativas', 'Pontuacao do backlog usando a sequencia de Fibonacci e implementacao de termos de consentimento e criptografia hash SHA-256.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'Nesta etapa, estruturamos a engenharia de requisitos do projeto. Mapeamos os requisitos funcionais para descrever os comportamentos do sistema e os nao funcionais para estabelecer os parametros de acessibilidade e desempenho. A organizacao das tarefas foi feita por meio de rituais ageis com estimativas baseadas na escala de Fibonacci. Para estar em conformidade com a LGPD, incluimos o fluxo de consentimento na interface e definimos o uso de hash SHA-256 para a persistencia segura das senhas.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Como foi realizada a estimativa e priorizacao das historias de usuario no backlog?',
                   'Utilizamos a escala de Fibonacci para pontuar a complexidade. Atividades focadas na interface receberam pontuacoes menores, enquanto logicas complexas, como o motor matematico do SM-2, receberam maior peso.')
    pdf.add_defesa('Como a LGPD foi integrada no projeto?',
                   'Projetamos no fluxo do cadastro a coleta de consentimento explicito dos termos de privacidade e, no banco de dados, estabelecemos o armazenamento seguro de credenciais via hash criptografico SHA-256.')

    # ==================== PÁGINA 3: SLIDE 3 ====================
    pdf.add_page()
    pdf.add_slide_title("3", "Modelagem de Banco de Dados (Etapa 3)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Projeto logico e fisico do banco de dados estruturado no Microsoft SQL Server.')
    pdf.add_bullet_point('Transacoes e Consistencia', 'Adocao do modelo relacional para assegurar as propriedades ACID nas operacoes de pontuacao.')
    pdf.add_bullet_point('Normalizacao', 'Tabelas estruturadas na 1a, 2a e 3a Formas Normais, aplicando restricoes de integridade e delecao em cascata.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'Para a persistencia de dados, projetamos o banco relacional utilizando o Microsoft SQL Server. O modelo relacional garante a aplicacao das propriedades transacionais ACID, assegurando que operacoes envolvendo a pontuacao e os dados de usuarios ocorram com integridade absoluta. Normalizamos as entidades nas Formas Normais e implementamos chaves estrangeiras com acao de exclusao em cascata para evitar dados orfaos.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Por que optar por um banco de dados relacional em vez de uma abordagem nao relacional?',
                   'Pela necessidade de garantias transacionais estritas nas operacoes financeiras da loja virtual e pelo alto acoplamento relacional entre usuarios, flashcards e questoes, cenario em que os bancos SQL fornecem maior consistencia e controle de integridade.')
    pdf.add_defesa('Qual a vantagem pratica da modelagem de exclusao em cascata?',
                   'Garantir a integridade referencial de forma automatica. Ao remover uma questao, suas alternativas relacionadas na tabela dependente sao automaticamente eliminadas pelo banco, evitando inconsistencias e lixo logico.')

    # ==================== PÁGINA 4: SLIDE 4 ====================
    pdf.add_page()
    pdf.add_slide_title("4", "Programacao Orientada a Objetos (Etapa 4)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Modelagem de classes no Astah UML e implementacao na linguagem C# (.NET 10).')
    pdf.add_bullet_point('Heranca e Polimorfismo', 'Especializacao da classe abstrata Usuario em subclasses de Aluno e Tutor, promovendo reutilizacao de codigo.')
    pdf.add_bullet_point('Encapsulamento e SOLID', 'Restricao de escrita direta em atributos de pontuacao e aplicacao do Principio de Responsabilidade Unica (SRP) no motor de calculo.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'A modelagem de classes foi desenhada no Astah UML e implementada em C#. Estruturamos a superclasse Usuario, aplicando heranca para estender os perfis de Aluno e Tutor. O encapsulamento foi empregado para proteger as propriedades de saldo de experiencia e moedas por meio de modificadores de acesso restritos. Alem disso, aplicamos conceitos do SOLID, isolando o calculo do SM-2 em um servico independente.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Como o modelo conceitual foi planejado e traduzido para o codigo?',
                   'Elaboramos o diagrama de classes no Astah UML detalhando tipos, atributos e relacionamentos. Essa estrutura serviu de base direta para a codificacao das entidades em C#.')
    pdf.add_defesa('De que forma o encapsulamento protege as regras de negocio no codigo?',
                   'Os atributos de pontuacao possuem escrita privada. Alteracoes nesses valores so podem ser feitas de forma controlada atraves de metodos especificos expostos pela propria classe.')

    # ==================== PÁGINA 5: SLIDE 5 ====================
    pdf.add_page()
    pdf.add_slide_title("5", "Desenvolvimento Web Responsivo (Etapa 5)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Desenvolvimento do frontend em formato SPA (Single Page Application) utilizando tecnologias nativas (HTML5, CSS3 e JavaScript).')
    pdf.add_bullet_point('Arquitetura SPA', 'Consumo assincrono das APIs com transferencia de dados de flashcards estruturados em JSON.')
    pdf.add_bullet_point('Estilizacao e Layout', 'Emprego de CSS Grid para a estrutura geral do painel e Flexbox para os componentes de menu. Configuracao de estilo de impressao ABNT por @media print.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'Desenvolvemos o frontend no formato de Single Page Application, dispensando frameworks pesados para garantir um carregamento otimizado. O layout utiliza CSS Grid na divisao das secoes do dashboard e Flexbox no alinhamento dos componentes de navegacao. Um diferencial do projeto foi a formatacao das paginas academicas diretamente no CSS atraves da folha de estilo de impressao, atendendo as normas da ABNT.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Qual a justificativa para a escolha de Javascript Vanilla em detrimento de frameworks modernos?',
                   'Permitir o controle absoluto do estilo e um carregamento leve para dispositivos moveis, alem de facilitar a criacao nativa do estilo de impressao ABNT via CSS puro.')
    pdf.add_defesa('Como foi dividida a aplicacao de Grid e Flexbox no layout?',
                   'O CSS Grid foi aplicado para a estruturacao bidimensional de grandes blocos do dashboard. O Flexbox foi reservado para o alinhamento unidimensional de itens internos, como botoes de controle e cabeçalhos de menus.')

    # ==================== PÁGINA 6: SLIDE 6 ====================
    pdf.add_page()
    pdf.add_slide_title("6", "UX/UI Design & Heurísticas (Etapa 6)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Prototipagem da interface no Figma, mapeamento da jornada do usuario e aplicacao de heuristicas de usabilidade.')
    pdf.add_bullet_point('Prototipo de Alta Fidelidade', 'Criacao do design system com cores consistentes e feedbacks visuais claros para o usuario.')
    pdf.add_bullet_point('Heuristicas de Nielsen', 'Aplicacao de principios como consistencia estetica, controle do usuario e correspondencia com o mundo real no Mapa Neural de estudos.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'Elaboramos os prototipos de alta fidelidade no Figma, modelando as jornadas com foco na nossa persona de estudantes iniciantes em TI. Aplicamos as heuristicas de usabilidade de Nielsen para garantir uma navegacao intuitiva: destacamos a correspondencia com o mundo real na visualizacao em forma de mapa mental de estudos e a consistencia visual em todos os elementos da interface.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Onde e como foi estruturado o prototipo do sistema?',
                   'As telas e fluxos de interacao do sistema foram desenhados e validados no Figma, estabelecendo a base visual antes do desenvolvimento.')
    pdf.add_defesa('Como as Heurísticas de Nielsen foram representadas no prototipo?',
                   'Atraves da Consistencia de cores e fontes, do Controle do usuario com fluxos de retorno simples, e do Feedback constante do sistema, como as notificacoes de acerto e atualizacao de progresso.')

    # ==================== PÁGINA 7: SLIDE 7 ====================
    pdf.add_page()
    pdf.add_slide_title("7", "Machine Learning & Dados (Etapa 7)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Aplicacao do algoritmo de repeticao espacada SuperMemo-2 (SM-2) para auxilio na retencao de conteudo.')
    pdf.add_bullet_point('Logica do Algoritmo', 'Ajuste dinamico dos intervalos de revisao (em dias) com base no desempenho e facilidade fornecido pelo usuario (escala de 0 a 5).')
    pdf.add_bullet_point('Estrutura de Dados', 'Registro do historico de estudos na tabela de flashcards para futuras analises estatisticas de engajamento.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'Para auxiliar na retencao do conhecimento tecnico, integramos o algoritmo SM-2. Quando o estudante responde a um flashcard e atribui uma classificacao de facilidade, a logica recalcula o Fator de Facilidade e agenda a proxima data de revisao. O armazenamento desses dados estruturados viabiliza a geracao de relatorios de desempenho e fornece a base de dados para analises preditivas futuras.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Como o algoritmo SM-2 define os intervalos das revisoes?',
                   'O algoritmo utiliza a classificacao de facilidade inserida pelo usuario para calibrar o Fator de Facilidade. Avaliacoes melhores aumentam progressivamente o intervalo entre as revisoes, enquanto dificuldades frequentes reduzem o tempo de retorno do card.')
    pdf.add_defesa('Como a modelagem proposta se relaciona com o aprendizado de maquina?',
                   'A persistencia estruturada do historico de revisoes acumula a massa de dados necessaria para treinar modelos preditivos voltados a identificar previamente riscos de desinteresse academico.')

    # ==================== PÁGINA 8: SLIDE 8 ====================
    pdf.add_page()
    pdf.add_slide_title("8", "Acessibilidade & LIBRAS (Etapa 8)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Diretrizes de acessibilidade aplicadas a interface do portal em conformidade com as normas web.')
    pdf.add_bullet_point('Navegacao Assistiva', 'Utilizacao de atributos WAI-ARIA (aria-label, role) para garantir a leitura correta por leitores de tela.')
    pdf.add_bullet_point('Responsividade e Suporte Visual', 'Dimensionamento dinamico via CSS que suporta zoom de ate 200% e planejamento de integracao de traducao de LIBRAS via widget digital.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'A acessibilidade foi projetada na interface do portal. Codificamos as paginas utilizando elementos semânticos do HTML5 e atributos WAI-ARIA, o que permite a correta interpretacao do sistema por leitores de tela. Alem disso, a estruturacao responsiva em Grid e Flexbox garante que a ampliacao visual da tela ocorra de forma consistente, permitindo tambem a integracao de widgets de traducao de LIBRAS.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Qual a funcao dos atributos WAI-ARIA implementados?',
                   'Eles fornecem metadados adicionais a leitores de tela, indicando o papel e a funcao de componentes interativos que nao possuem tags HTML nativas equivalentes.')
    pdf.add_defesa('Como foi tratada a responsividade sob a otica de acessibilidade?',
                   'Utilizamos unidades flexiveis e grids fluidos que se ajustam sem sobrepor textos ou quebrar o layout, mesmo quando o usuario aumenta o zoom do navegador para baixa visao.')

    # ==================== PÁGINA 9: SLIDE 9 ====================
    pdf.add_page()
    pdf.add_slide_title("9", "Integracao & Modelagem UML (Etapa 9)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Modelagem de sistemas via UML (Unified Modeling Language) desenvolvida no Astah.')
    pdf.add_bullet_point('Diagramas Estruturais e Dinamicos', 'Uso do Diagrama de Casos de Uso (limites), Diagrama de Classes (arquitetura estrutural de objetos) e Diagrama de Sequencia (fluxo de mensagens).')
    pdf.add_bullet_point('Consistencia Arquitetural', 'Validacao visual dos fluxos de dados do prototipo com os modelos relacionais e logicos do software.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'Para garantir a consistência do sistema, realizamos a modelagem UML no software Astah. O Diagrama de Casos de Uso delimita os escopos e as acoes permitidas para cada perfil; o Diagrama de Classes define a estrutura logica e os relacionamentos do codigo C#; e o Diagrama de Sequencia ilustra a troca cronologica de mensagens entre a interface e o banco de dados.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Qual a importância do Diagrama de Sequencia no projeto?',
                   'Ele mapeia o fluxo temporal das interacoes, comprovando a viabilidade tecnica das requisicoes entre a interface do usuario, a logica de negocio e as consultas ao banco de dados.')
    pdf.add_defesa('Como os diagramas UML auxiliam na consistência do projeto?',
                   'Eles unificam a especificacao tecnica, garantindo que a implementacao de banco de dados, o comportamento orientado a objetos em C# e o prototipo de telas sigam a mesma especificacao logica.')

    # ==================== PÁGINA 10: METODOLOGIA DE GRUPO ====================
    pdf.add_page()
    pdf.add_slide_title("10", "Metodologia Scrum & Escopo (Scrum)")
    pdf.ln(1)
    
    pdf.add_bullet_point('Conteudo', 'Gestao do projeto com framework Scrum, coordenacao de tarefas e divisao de escopo.')
    pdf.add_bullet_point('Rituais Scrum', 'Sprints semanais documentadas em atas de reuniao, monitoramento do progresso por quadro Kanban e divisao de responsabilidades.')
    pdf.add_bullet_point('Divisao de Escopo', 'Delimitacao da entrega do PIM III focada na modelagem conceitual, prototipagem e especificacao tecnica, preparando o desenvolvimento fisico do portal.')
    pdf.ln(2.0)
    
    pdf.add_script_fala(
        'Finalizando, a gestao do projeto utilizou rituais ageis com sprints semanais e monitoramento continuo por meio do Kanban. Dividimos o escopo estabelecendo que o foco do PIM III seria a modelagem arquitetural (UML, Banco e Prototipo de Alta Fidelidade) e a base logica inicial, ficando o desenvolvimento completo e a validacao em producao programados para a proxima fase do projeto.'
    )
    
    pdf.add_defesa_divider()
    pdf.add_defesa('Como o grupo lidou com impedimentos no fluxo de trabalho agil?',
                   'As reunioes semanais serviram para revisar as entregas do Kanban e redistribuir atividades em caso de atraso de dependências, garantindo que o cronograma fosse cumprido.')
    pdf.add_defesa('Como foi justificado o escopo atual em relacao as fases futuras?',
                   'Mapeamos os requisitos fundamentais do MVP para esta entrega academica e documentamos nos manuais que a integracao de funcionalidades secundarias de simulados e loja sera completada no proximo periodo letivo.')

    # Salva o arquivo PDF
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    pdf.output(output_path)
    print(f"PDF gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        out = sys.argv[1]
    else:
        out = "docs/apresentação.pdf"
    gerar_apresentacao(out)
