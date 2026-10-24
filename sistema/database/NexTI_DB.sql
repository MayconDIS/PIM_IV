-- =====================================================================
-- Nex_TI — script completo do banco de dados (SQL Server / Azure SQL)
-- PIM IV · Etapa 7 · Programação de Banco de Dados
--
-- 1. Cria o banco NexTI_DB (se não existir).
-- 2. Cria as tabelas, a tabela de histórico, os 2 triggers, as 2 funções,
--    as 2 views e as 4 procedures (mesmas migrations que a API aplica).
-- 3. Insere as 29 fases, as 702 cartas e os simulados ENADE.
--
-- Pode ser executado mais de uma vez: cada parte confere se já existe.
-- Gerado por sistema/scripts/gerar-nexti-db.py — não editar à mão.
-- =====================================================================

IF DB_ID(N'NexTI_DB') IS NULL
    CREATE DATABASE NexTI_DB;
GO

USE NexTI_DB;
GO

-- =====================================================================
-- ESTRUTURA (tabelas, chaves, índices, triggers, funções, views e procedures)
-- =====================================================================
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [migration_id] nvarchar(150) NOT NULL,
        [product_version] nvarchar(32) NOT NULL,
        CONSTRAINT [pk___ef_migrations_history] PRIMARY KEY ([migration_id])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [fases] (
        [codigo_fase] nvarchar(20) NOT NULL,
        [descricao] nvarchar(100) NOT NULL,
        CONSTRAINT [pk_fases] PRIMARY KEY ([codigo_fase])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [tb_areas_conhecimento] (
        [id_area] int NOT NULL IDENTITY,
        [nome_area] nvarchar(100) NOT NULL,
        CONSTRAINT [pk_tb_areas_conhecimento] PRIMARY KEY ([id_area])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [tb_provas] (
        [id_prova] int NOT NULL IDENTITY,
        [ano] int NOT NULL,
        [tipo] nvarchar(50) NOT NULL,
        CONSTRAINT [pk_tb_provas] PRIMARY KEY ([id_prova])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [usuarios] (
        [id] int NOT NULL IDENTITY,
        [username] nvarchar(50) NOT NULL,
        [email] nvarchar(100) NOT NULL,
        [senha_hash] nvarchar(255) NOT NULL,
        [nivel] int NOT NULL,
        [xp] int NOT NULL,
        [moedas] int NOT NULL,
        [data_criacao] datetime2 NOT NULL,
        CONSTRAINT [pk_usuarios] PRIMARY KEY ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [flashcards] (
        [id] int NOT NULL IDENTITY,
        [codigo_fase] nvarchar(20) NOT NULL,
        [frente] nvarchar(max) NOT NULL,
        [verso] nvarchar(max) NOT NULL,
        [dica] nvarchar(255) NULL,
        [opcoes] nvarchar(max) NULL,
        [correta] int NULL,
        CONSTRAINT [pk_flashcards] PRIMARY KEY ([id]),
        CONSTRAINT [fk_flashcards_fases_codigo_fase] FOREIGN KEY ([codigo_fase]) REFERENCES [fases] ([codigo_fase]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [tb_questoes] (
        [id_questao] int NOT NULL IDENTITY,
        [id_area] int NOT NULL,
        [enunciado] nvarchar(max) NOT NULL,
        [origem] nvarchar(50) NULL,
        CONSTRAINT [pk_tb_questoes] PRIMARY KEY ([id_questao]),
        CONSTRAINT [fk_tb_questoes_tb_areas_conhecimento_id_area] FOREIGN KEY ([id_area]) REFERENCES [tb_areas_conhecimento] ([id_area]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [progresso_flashcards] (
        [usuario_id] int NOT NULL,
        [flashcard_id] int NOT NULL,
        [repeticoes] int NOT NULL,
        [intervalo_dias] float NOT NULL,
        [fator_facilidade] float NOT NULL,
        [data_proxima_revisao] datetime2 NOT NULL,
        CONSTRAINT [pk_progresso_flashcards] PRIMARY KEY ([usuario_id], [flashcard_id]),
        CONSTRAINT [fk_progresso_flashcards_flashcards_flashcard_id] FOREIGN KEY ([flashcard_id]) REFERENCES [flashcards] ([id]) ON DELETE CASCADE,
        CONSTRAINT [fk_progresso_flashcards_usuarios_usuario_id] FOREIGN KEY ([usuario_id]) REFERENCES [usuarios] ([id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [tb_alternativas] (
        [id_alternativa] int NOT NULL IDENTITY,
        [id_questao] int NOT NULL,
        [texto] nvarchar(max) NOT NULL,
        [is_correta] bit NOT NULL,
        CONSTRAINT [pk_tb_alternativas] PRIMARY KEY ([id_alternativa]),
        CONSTRAINT [fk_tb_alternativas_tb_questoes_id_questao] FOREIGN KEY ([id_questao]) REFERENCES [tb_questoes] ([id_questao]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE TABLE [tb_prova_questao] (
        [id_prova] int NOT NULL,
        [id_questao] int NOT NULL,
        CONSTRAINT [pk_tb_prova_questao] PRIMARY KEY ([id_prova], [id_questao]),
        CONSTRAINT [fk_tb_prova_questao_tb_provas_id_prova] FOREIGN KEY ([id_prova]) REFERENCES [tb_provas] ([id_prova]) ON DELETE CASCADE,
        CONSTRAINT [fk_tb_prova_questao_tb_questoes_id_questao] FOREIGN KEY ([id_questao]) REFERENCES [tb_questoes] ([id_questao]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE INDEX [ix_flashcards_codigo_fase] ON [flashcards] ([codigo_fase]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE INDEX [ix_progresso_flashcards_flashcard_id] ON [progresso_flashcards] ([flashcard_id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE INDEX [ix_tb_alternativas_id_questao] ON [tb_alternativas] ([id_questao]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE INDEX [ix_tb_prova_questao_id_questao] ON [tb_prova_questao] ([id_questao]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE INDEX [ix_tb_questoes_id_area] ON [tb_questoes] ([id_area]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE UNIQUE INDEX [ix_usuarios_email] ON [usuarios] ([email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    CREATE UNIQUE INDEX [ix_usuarios_username] ON [usuarios] ([username]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261013142800_InicialAzureSql'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([migration_id], [product_version])
    VALUES (N'20261013142800_InicialAzureSql', N'10.0.12');
END;

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN

    CREATE TABLE tb_historico_revisoes (
        id_historico         INT IDENTITY(1,1) NOT NULL,
        usuario_id           INT NOT NULL,
        flashcard_id         INT NOT NULL,
        repeticoes           INT NOT NULL,
        intervalo_dias       FLOAT NOT NULL,
        fator_facilidade     FLOAT NOT NULL,
        data_proxima_revisao DATETIME2 NOT NULL,
        data_revisao         DATETIME2 NOT NULL CONSTRAINT df_historico_data DEFAULT SYSUTCDATETIME(),
        CONSTRAINT pk_tb_historico_revisoes PRIMARY KEY (id_historico),
        CONSTRAINT fk_historico_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
        CONSTRAINT fk_historico_flashcards FOREIGN KEY (flashcard_id) REFERENCES flashcards (id) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    CREATE INDEX ix_historico_usuario_data ON tb_historico_revisoes (usuario_id, data_revisao);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER TRIGGER tg_progresso_historico
    ON progresso_flashcards
    AFTER INSERT, UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        INSERT INTO tb_historico_revisoes
            (usuario_id, flashcard_id, repeticoes, intervalo_dias, fator_facilidade, data_proxima_revisao)
        SELECT usuario_id, flashcard_id, repeticoes, intervalo_dias, fator_facilidade, data_proxima_revisao
        FROM inserted;
    END;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER TRIGGER tg_usuarios_protege_gamificacao
    ON usuarios
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        IF EXISTS (
            SELECT 1
            FROM inserted i
            JOIN deleted d ON d.id = i.id
            WHERE i.xp < d.xp OR i.nivel < d.nivel
        )
            THROW 50001, ''XP e nível do aluno não podem diminuir.'', 1;
    END;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER FUNCTION fn_nivel_por_xp (@xp INT)
    RETURNS INT
    AS
    BEGIN
        RETURN CASE
            WHEN @xp >= 300 THEN 6   -- Expert
            WHEN @xp >= 100 THEN 3   -- Intermediário
            ELSE 1                   -- Ingressante
        END;
    END;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER FUNCTION fn_cartas_devidas (@usuario_id INT, @data DATE)
    RETURNS TABLE
    AS
    RETURN (
        SELECT p.flashcard_id, f.codigo_fase, f.frente, p.data_proxima_revisao, p.fator_facilidade
        FROM progresso_flashcards p
        JOIN flashcards f ON f.id = p.flashcard_id
        WHERE p.usuario_id = @usuario_id
          AND CAST(p.data_proxima_revisao AS DATE) <= @data
    );');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER VIEW vw_ranking_alunos
    AS
    SELECT
        RANK() OVER (ORDER BY u.xp DESC) AS posicao,
        u.username,
        u.xp,
        u.nivel,
        u.moedas
    FROM usuarios u;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER VIEW vw_desempenho_por_fase
    AS
    SELECT
        fa.codigo_fase,
        fa.descricao,
        COUNT(DISTINCT fl.id)          AS total_cartas,
        COUNT(DISTINCT p.usuario_id)   AS alunos_estudando,
        AVG(p.fator_facilidade)        AS facilidade_media
    FROM fases fa
    LEFT JOIN flashcards fl ON fl.codigo_fase = fa.codigo_fase
    LEFT JOIN progresso_flashcards p ON p.flashcard_id = fl.id
    GROUP BY fa.codigo_fase, fa.descricao;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER PROCEDURE sp_ranking_alunos (@top INT = 5)
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT TOP (@top) posicao, username, xp, nivel, moedas
        FROM vw_ranking_alunos
        ORDER BY posicao, username;
    END;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER PROCEDURE sp_estatisticas_aluno (@username NVARCHAR(50))
    AS
    BEGIN
        SET NOCOUNT ON;
        DECLARE @id INT = (SELECT id FROM usuarios WHERE username = @username);
        IF @id IS NULL
            THROW 50002, ''Usuário não encontrado.'', 1;

        SELECT
            u.username,
            u.xp,
            u.nivel,
            u.moedas,
            COUNT(p.flashcard_id)                                              AS total_estudados,
            SUM(CASE WHEN p.intervalo_dias >= 21 THEN 1 ELSE 0 END)            AS cartas_maduras,
            SUM(CASE WHEN p.intervalo_dias < 21 THEN 1 ELSE 0 END)             AS cartas_em_aprendizado,
            (SELECT COUNT(*) FROM dbo.fn_cartas_devidas(@id, CAST(SYSUTCDATETIME() AS DATE))) AS cartas_devidas_hoje,
            ROUND(ISNULL(AVG(p.fator_facilidade), 2.5), 2)                     AS facilidade_media
        FROM usuarios u
        LEFT JOIN progresso_flashcards p ON p.usuario_id = u.id
        WHERE u.id = @id
        GROUP BY u.username, u.xp, u.nivel, u.moedas;
    END;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER PROCEDURE sp_cadastrar_flashcard (
        @codigo_fase NVARCHAR(20),
        @frente      NVARCHAR(MAX),
        @verso       NVARCHAR(MAX),
        @dica        NVARCHAR(255) = NULL)
    AS
    BEGIN
        SET NOCOUNT ON;
        SET @codigo_fase = LOWER(LTRIM(RTRIM(@codigo_fase)));
        IF NULLIF(LTRIM(RTRIM(@frente)), '''') IS NULL OR NULLIF(LTRIM(RTRIM(@verso)), '''') IS NULL
            THROW 50003, ''Frente e verso são obrigatórios.'', 1;
        IF NOT EXISTS (SELECT 1 FROM fases WHERE codigo_fase = @codigo_fase)
            THROW 50004, ''Fase não encontrada.'', 1;

        INSERT INTO flashcards (codigo_fase, frente, verso, dica)
        VALUES (@codigo_fase, LTRIM(RTRIM(@frente)), LTRIM(RTRIM(@verso)),
                NULLIF(LTRIM(RTRIM(@dica)), ''''));

        SELECT CAST(SCOPE_IDENTITY() AS INT) AS id;
    END;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    EXEC(N'CREATE OR ALTER PROCEDURE sp_historico_revisoes (@username NVARCHAR(50), @ultimas INT = 20)
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT TOP (@ultimas)
            h.data_revisao, f.codigo_fase, f.frente, h.repeticoes, h.intervalo_dias, h.data_proxima_revisao
        FROM tb_historico_revisoes h
        JOIN usuarios u   ON u.id = h.usuario_id
        JOIN flashcards f ON f.id = h.flashcard_id
        WHERE u.username = @username
        ORDER BY h.data_revisao DESC, h.id_historico DESC;
    END;');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022134317_ObjetosDoBanco'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([migration_id], [product_version])
    VALUES (N'20261022134317_ObjetosDoBanco', N'10.0.12');
END;

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022201301_AreaAdministrativa'
)
BEGIN
    ALTER TABLE [usuarios] ADD [perfil] nvarchar(20) NOT NULL DEFAULT N'Aluno';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022201301_AreaAdministrativa'
)
BEGIN
    CREATE TABLE [cartas_moderadas] (
        [id] int NOT NULL IDENTITY,
        [codigo_fase] nvarchar(20) NOT NULL,
        [frente] nvarchar(max) NOT NULL,
        [data_moderacao] datetime2 NOT NULL,
        CONSTRAINT [pk_cartas_moderadas] PRIMARY KEY ([id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022201301_AreaAdministrativa'
)
BEGIN
    EXEC(N'ALTER TABLE [usuarios] ADD CONSTRAINT [ck_usuarios_perfil] CHECK (perfil IN (''Aluno'', ''Tutor'', ''Admin''))');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261022201301_AreaAdministrativa'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([migration_id], [product_version])
    VALUES (N'20261022201301_AreaAdministrativa', N'10.0.12');
END;

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261024192728_FasesConcluidas'
)
BEGIN
    CREATE TABLE [fases_concluidas] (
        [usuario_id] int NOT NULL,
        [codigo_fase] nvarchar(20) NOT NULL,
        [data_conclusao] datetime2 NOT NULL,
        CONSTRAINT [pk_fases_concluidas] PRIMARY KEY ([usuario_id], [codigo_fase]),
        CONSTRAINT [fk_fases_concluidas_usuarios_usuario_id] FOREIGN KEY ([usuario_id]) REFERENCES [usuarios] ([id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [migration_id] = N'20261024192728_FasesConcluidas'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([migration_id], [product_version])
    VALUES (N'20261024192728_FasesConcluidas', N'10.0.12');
END;

COMMIT;
GO
GO

-- =====================================================================
-- DADOS (conteúdo de estudo e simulados ENADE)
-- =====================================================================

-- fases: 29 registro(s)
IF NOT EXISTS (SELECT 1 FROM fases)
BEGIN
    INSERT INTO fases (codigo_fase, descricao) VALUES
        (N'bonus1', N'Curiosidades e Hackers'),
        (N'bonus2', N'História e Cultura da Tecnologia'),
        (N'bonus3', N'Carreira e Mercado'),
        (N'bonus4', N'Mercado das Startups'),
        (N'fase1', N'Lógica com Python'),
        (N'fase10', N'Inteligência Artificial'),
        (N'fase11', N'Banco de Dados e NoSQL'),
        (N'fase12', N'Programação Orientada a Objetos com C#'),
        (N'fase13', N'Web Responsivo e UX/UI Design'),
        (N'fase14', N'Aprendizado de Máquina (Machine Learning)'),
        (N'fase15', N'Engenharia de Software Ágil'),
        (N'fase16', N'Web e Aplicativos com .NET'),
        (N'fase17', N'Desenvolvimento Mobile'),
        (N'fase18', N'Programação de Banco de Dados'),
        (N'fase19', N'Cloud Computing e DevOps'),
        (N'fase2', N'Matemática e Estatística'),
        (N'fase20', N'Empreendedorismo em Tecnologia'),
        (N'fase21', N'ENADE: Conhecimentos Gerais e Negócios'),
        (N'fase22', N'ENADE: Específicos de Análise e Desenvolvimento de Sistemas'),
        (N'fase23', N'ENADE: Guia de Estudos'),
        (N'fase24', N'ENADE 2017: Prova Oficial de ADS'),
        (N'fase25', N'ENADE 2021: Prova Oficial de ADS'),
        (N'fase3', N'Infraestrutura e Tecnologia da Informação'),
        (N'fase4', N'Cibersegurança e Proteção de Dados'),
        (N'fase5', N'Ética e Humanidades'),
        (N'fase6', N'Algoritmos em Python'),
        (N'fase7', N'Programação em C'),
        (N'fase8', N'Análise e Engenharia de Sistemas'),
        (N'fase9', N'Redes e Sistemas Distribuídos');
END;
GO

-- flashcards: 702 registro(s)
IF NOT EXISTS (SELECT 1 FROM flashcards)
BEGIN
    SET IDENTITY_INSERT flashcards ON;
    INSERT INTO flashcards (id, codigo_fase, frente, verso, dica, opcoes, correta) VALUES
        (1, N'fase1', N'O que é uma Variável?', N'Um espaço reservado na memória para armazenar um dado.', N'Disciplina: Lógica com Python.', NULL, NULL),
        (2, N'fase1', N'Para que serve a estrutura ''for'' em Python?', N'Para criar um laço de repetição iterável (loop).', N'Percorre listas e sequências.', NULL, NULL),
        (3, N'fase1', N'O que é um Dicionário?', N'Uma estrutura de dados baseada em pares de ''chave: valor''.', N'Usa chaves {}. Ex: {''curso'': ''ADS''}', NULL, NULL),
        (4, N'fase1', N'Qual a diferença entre = e == em programação?', N'= é para Atribuição. == é para Comparação (Verificar se é igual).', N'Erro muito comum em lógica básica.', NULL, NULL),
        (5, N'fase1', N'O que faz a palavra ''def'' em Python?', N'Serve para definir/criar uma nova função.', N'Ex: def calcular_media():', NULL, NULL),
        (6, N'fase1', N'Para que serve a função len()?', N'Para retornar o tamanho (quantidade de itens) de uma lista ou string.', N'Vem da palavra ''length'' (comprimento).', NULL, NULL),
        (7, N'fase1', N'O que é uma Lista (List) em Python?', N'Uma coleção ordenada e mutável de itens.', N'Usa colchetes []. Ex: notas = [10, 8, 9]', NULL, NULL),
        (8, N'fase1', N'O que faz o método .append()?', N'Adiciona um novo item ao final de uma lista existente.', N'Muito usado dentro de laços de repetição.', NULL, NULL),
        (9, N'fase1', N'Para que serve o if/elif/else?', N'Para criar estruturas de decisão (condicionais) na lógica do código.', N'Se (if) chover, levo guarda-chuva. Senão (else)...', NULL, NULL),
        (10, N'fase1', N'O que é o laço ''while''?', N'Um loop que continua executando enquanto uma condição for Verdadeira (True).', N'Cuidado com o loop infinito!', NULL, NULL),
        (11, N'fase1', N'Qual a diferença entre int e float?', N'Int é número inteiro (ex: 5). Float é número decimal/quebrado (ex: 5.5).', N'Tipos de dados primitivos.', NULL, NULL),
        (12, N'fase1', N'O que é um dado Booleano (bool)?', N'Um tipo de dado que só possui dois valores: True (Verdadeiro) ou False (Falso).', N'Base da álgebra booleana.', NULL, NULL),
        (13, N'fase1', N'Como se faz um comentário em Python?', N'Usando o símbolo de hashtag (#) antes do texto.', N'O computador ignora essa linha na execução.', NULL, NULL),
        (14, N'fase1', N'Para que serve a função input()?', N'Para capturar um dado ou texto digitado pelo usuário no teclado.', N'Sempre retorna o dado como String (texto).', NULL, NULL),
        (15, N'fase1', N'Para que serve a função print()?', N'Para exibir mensagens ou valores na tela (console).', N'O ''Olá, Mundo!'' usa essa função.', NULL, NULL),
        (16, N'fase1', N'O que é uma função Lambda?', N'Uma função anônima e rápida, escrita em uma única linha.', N'Usada para lógicas curtas e matemáticas.', NULL, NULL),
        (17, N'fase1', N'Para que serve o bloco try/except?', N'Para tratar erros (exceções) e evitar que o programa ''crache'' e feche sozinho.', N'Tente (try) fazer isso, se der erro (except) avise.', NULL, NULL),
        (18, N'fase1', N'O que faz o comando ''import''?', N'Traz bibliotecas, módulos ou arquivos externos para dentro do seu código atual.', N'Ex: import math, import random', NULL, NULL),
        (19, N'fase1', N'Qual a diferença entre ''=='' e ''is''?', N'''=='' compara se o valor é igual. ''is'' compara se são o mesmo objeto na memória.', N'Conceito avançado de gerenciamento de memória.', NULL, NULL),
        (20, N'fase1', N'O que é Slicing (Fatiamento) em Python?', N'Uma técnica para extrair pedaços de uma string ou lista usando [início:fim].', N'Ex: texto[0:4] pega as primeiras 4 letras.', NULL, NULL),
        (21, N'fase2', N'O que é a Média Aritmética?', N'A soma de todos os valores dividida pela quantidade deles.', N'Disciplina: Matemática e Estatística.', NULL, NULL),
        (22, N'fase2', N'O que é a Mediana em um conjunto de dados?', N'É o valor que fica exatamente no meio quando os dados estão em ordem crescente.', N'Não é afetada por valores extremos (outliers).', NULL, NULL),
        (23, N'fase2', N'O que é a Moda estatística?', N'É o valor que aparece com maior frequência num conjunto de dados.', N'Pode haver mais de uma moda (bimodal).', NULL, NULL),
        (24, N'fase2', N'Para que serve o Desvio Padrão?', N'Para medir a dispersão dos dados, ou seja, o quão distantes eles estão da média.', N'Desvio baixo = dados muito próximos da média.', NULL, NULL),
        (25, N'fase2', N'O que é a Variância?', N'É o quadrado do desvio padrão, indicando o quão longe os valores se encontram do valor esperado.', N'Base para análises estatísticas profundas.', NULL, NULL),
        (26, N'fase2', N'O que estuda a Lógica Proposicional?', N'Proposições que podem ser classificadas como Verdadeiras ou Falsas.', N'Base para a programação de computadores.', NULL, NULL),
        (27, N'fase2', N'Na Tabela Verdade, o que faz o operador AND (E)?', N'Retorna Verdadeiro apenas se TODAS as condições forem verdadeiras.', N'Multiplicação lógica.', NULL, NULL),
        (28, N'fase2', N'Na Tabela Verdade, o que faz o operador OR (OU)?', N'Retorna Verdadeiro se PELO MENOS UMA das condições for verdadeira.', N'Soma lógica.', NULL, NULL),
        (29, N'fase2', N'Na Tabela Verdade, o que faz o operador NOT (NÃO)?', N'Inverte o valor lógico da proposição (Verdadeiro vira Falso e vice-versa).', N'Negação.', NULL, NULL),
        (30, N'fase2', N'O que é um Grafo?', N'Conjunto de Vértices (nós) conectados por Arestas (linhas).', N'Usado em GPS, mapas e redes.', NULL, NULL),
        (31, N'fase2', N'Num Grafo, o que é um Vértice?', N'É a entidade, ponto ou nó que armazena a informação.', N'Pense nas cidades num mapa.', NULL, NULL),
        (32, N'fase2', N'Num Grafo, o que é uma Aresta?', N'É a linha ou caminho que conecta dois vértices.', N'Pense nas estradas que ligam as cidades.', NULL, NULL),
        (33, N'fase2', N'O que é uma Árvore na Teoria dos Grafos?', N'Um grafo conectado e sem ciclos (sem caminhos fechados que voltem à origem).', N'Usada na organização de pastas no PC.', NULL, NULL),
        (34, N'fase2', N'O que é o Teorema de Bayes?', N'Fórmula matemática usada para calcular a probabilidade condicional de um evento baseado em conhecimentos anteriores.', N'Base matemática para filtros de Spam.', NULL, NULL),
        (35, N'fase2', N'Na Teoria dos Conjuntos, o que é a União (A ∪ B)?', N'A junção de todos os elementos do conjunto A com todos os do conjunto B.', N'Soma de conjuntos sem repetir os iguais.', NULL, NULL),
        (36, N'fase2', N'O que é a Interseção de Conjuntos (A ∩ B)?', N'Apenas os elementos que existem SIMULTANEAMENTE no conjunto A e no conjunto B.', N'O que eles têm em comum.', NULL, NULL),
        (37, N'fase2', N'O que é uma Matriz (Álgebra Linear)?', N'Um arranjo bidimensional de números organizados em linhas e colunas.', N'Essencial para a computação gráfica.', NULL, NULL),
        (38, N'fase2', N'O que é um Vetor?', N'Uma matriz de uma única linha ou única coluna. Na física, possui magnitude e direção.', N'Usado como array na programação.', NULL, NULL),
        (39, N'fase2', N'O que é uma Função Linear?', N'Uma função cujo gráfico forma uma linha reta (f(x) = ax + b).', N'Crescimento constante.', NULL, NULL),
        (40, N'fase2', N'O que é uma Função Exponencial?', N'Uma função onde a variável está no expoente, gerando um crescimento ou decaimento curvo e muito rápido.', N'A forma como os vírus se espalham.', NULL, NULL),
        (41, N'fase3', N'O que é a Placa-Mãe (Motherboard)?', N'A placa de circuito principal que conecta todos os componentes do computador.', N'Disciplinas: Infraestrutura e Hardware.', NULL, NULL),
        (42, N'fase3', N'Para que serve a CPU (Processador)?', N'É o cérebro do computador, responsável por processar e executar as instruções e cálculos.', N'Central Processing Unit.', NULL, NULL),
        (43, N'fase3', N'Qual a diferença entre RAM e HD/SSD?', N'RAM é a memória de curto prazo (volátil). HD/SSD é o armazenamento permanente.', N'Desligou o PC, a RAM apaga tudo.', NULL, NULL),
        (44, N'fase3', N'O que é a BIOS / UEFI?', N'O primeiro software que é executado ao ligar o PC, responsável por acordar e testar o hardware (POST).', N'Basic Input/Output System.', NULL, NULL),
        (45, N'fase3', N'O que é uma Placa de Vídeo (GPU)?', N'O componente especializado na renderização e processamento pesado de gráficos e imagens.', N'Graphic Processing Unit.', NULL, NULL),
        (46, N'fase3', N'Para que serve a Fonte de Alimentação?', N'Converter a energia elétrica da tomada (Corrente Alternada) para a energia usada pelo PC (Corrente Contínua).', N'O coração elétrico da máquina.', NULL, NULL),
        (47, N'fase3', N'O que é um Sistema Operacional (SO)?', N'O software base que gere o hardware e permite executar outros programas e interfaces.', N'Ex: Windows, Linux, macOS.', NULL, NULL),
        (48, N'fase3', N'O que é o Kernel de um Sistema Operacional?', N'O núcleo do SO, que faz a ponte direta entre o software (aplicativos) e o hardware (CPU, memória).', N'O motor invisível do SO.', NULL, NULL),
        (49, N'fase3', N'O que é a Virtualização?', N'A tecnologia que permite criar versões virtuais de recursos físicos, como correr um Windows dentro do Linux.', N'A base da Computação em Nuvem.', NULL, NULL),
        (50, N'fase3', N'O que é uma Máquina Virtual (VM)?', N'Um ficheiro que atua como um computador físico independente, com o seu próprio SO, correndo isolado.', N'Um PC dentro do PC.', NULL, NULL),
        (51, N'fase3', N'O que é um Hypervisor?', N'O software, firmware ou hardware que cria e executa as máquinas virtuais.', N'O gestor das VMs (Ex: VirtualBox).', NULL, NULL),
        (52, N'fase3', N'O que é Computação em Nuvem?', N'O fornecimento de serviços de computação (servidores, armazenamento, bancos) através da Internet.', N'AWS, Azure, Google Cloud.', NULL, NULL),
        (53, N'fase3', N'O que é um Servidor?', N'Um computador muito potente e ligado 24/7 projetado para fornecer serviços e recursos a outros computadores (clientes).', N'A espinha dorsal da web.', NULL, NULL),
        (54, N'fase3', N'O que é um Data Center?', N'Um local físico (prédio ou sala) focado em abrigar centenas de servidores e infraestruturas de TI.', N'Onde a nuvem mora fisicamente.', NULL, NULL),
        (55, N'fase3', N'O que é o Endereço MAC?', N'O identificador físico e único de fábrica da placa de rede de um dispositivo.', N'Media Access Control.', NULL, NULL),
        (56, N'fase3', N'Qual a diferença entre Software e Firmware?', N'Software são os programas normais. Firmware é o software gravado diretamente na memória do hardware para o controlar.', N'O sistema do controlo remoto da TV é um firmware.', NULL, NULL),
        (57, N'fase3', N'O que são periféricos de Entrada e Saída (I/O)?', N'Entrada envia dados ao PC (Teclado/Rato). Saída mostra dados do PC ao utilizador (Monitor/Impressora).', N'I/O (Input / Output).', NULL, NULL),
        (58, N'fase3', N'O que é o Sistema de Arquivos?', N'O método que o Sistema Operacional usa para controlar como os dados são guardados e recuperados no disco.', N'Ex: NTFS no Windows, ext4 no Linux.', NULL, NULL),
        (59, N'fase3', N'O que é o RAID em armazenamento?', N'A combinação de vários discos rígidos físicos numa única unidade lógica para melhorar o desempenho ou a segurança (cópia espelho).', N'Redundant Array of Independent Disks.', NULL, NULL),
        (60, N'fase3', N'O que significa formatação de baixo nível?', N'A criação de trilhas e setores no disco magnético na fábrica. A formatação que fazemos em casa é a de alto nível.', N'O reset físico absoluto do disco.', NULL, NULL),
        (61, N'fase4', N'O que significa a sigla LGPD?', N'Lei Geral de Proteção de Dados (Lei 13.709/2018).', N'Disciplinas: Cibersegurança e Legislação.', NULL, NULL),
        (62, N'fase4', N'Na LGPD, quem é o Titular dos Dados?', N'A pessoa singular (física) a quem se referem os dados pessoais recolhidos.', N'O cidadão, o dono da informação.', NULL, NULL),
        (63, N'fase4', N'O que é um Dado Pessoal Sensível?', N'Dado que revela origem racial, religião, filiação política, saúde ou biometria.', N'Dados que podem causar discriminação.', NULL, NULL),
        (64, N'fase4', N'Quem é o Encarregado de Dados (DPO)?', N'O profissional indicado pela empresa para ser o canal de comunicação sobre a proteção de dados.', N'Data Protection Officer.', NULL, NULL),
        (65, N'fase4', N'O que é Phishing?', N'Ataque de engenharia social que usa e-mails ou sites falsos para roubar informações da vítima.', N'Pense em ''pescar'' a senha do utilizador.', NULL, NULL),
        (66, N'fase4', N'O que é um Ransomware?', N'Um malware que criptografa os dados do computador e exige o pagamento de um resgate (geralmente em Bitcoin).', N'Ransom = Resgate.', NULL, NULL),
        (67, N'fase4', N'O que é um ataque DDoS?', N'Enviar milhares de requisições simultâneas para derrubar um servidor por sobrecarga.', N'Distributed Denial of Service.', NULL, NULL),
        (68, N'fase4', N'O que é um Cavalo de Troia (Trojan)?', N'Malware disfarçado de programa legítimo para abrir as ''portas'' do PC ao atacante.', N'Presente de grego.', NULL, NULL),
        (69, N'fase4', N'Qual a diferença entre Vírus e Worm?', N'O vírus precisa que o utilizador execute o ficheiro para o infetar. O Worm (verme) espalha-se sozinho pela rede.', N'Worms são autónomos.', NULL, NULL),
        (70, N'fase4', N'O que é a Engenharia Social no hacking?', N'Técnica de manipulação psicológica para enganar pessoas e fazê-las entregar senhas ou dados confidenciais.', N'Hackear a mente humana.', NULL, NULL),
        (71, N'fase4', N'Para que serve um Firewall?', N'Barreira de segurança que monitoriza e bloqueia o tráfego de rede de entrada e saída baseado em regras.', N'Parede de fogo da rede.', NULL, NULL),
        (72, N'fase4', N'O que é uma VPN?', N'Uma rede privada virtual que cria um túnel criptografado, ocultando o endereço IP e o tráfego do utilizador.', N'Virtual Private Network.', NULL, NULL),
        (73, N'fase4', N'O que é Criptografia Simétrica?', N'Usa a MESMA chave secreta tanto para encriptar quanto para desencriptar a mensagem.', N'Rápida, mas difícil de partilhar a chave em segurança.', NULL, NULL),
        (74, N'fase4', N'O que é Criptografia Assimétrica?', N'Usa um par de chaves: uma Chave Pública (para encriptar) e uma Chave Privada (para desencriptar).', N'A base da segurança na Internet moderna.', NULL, NULL),
        (75, N'fase4', N'O que é uma função de Hash?', N'Algoritmo de mão única que transforma qualquer dado numa string de tamanho fixo, impossível de reverter.', N'Usada para guardar palavras-passe no banco de dados.', NULL, NULL),
        (76, N'fase4', N'O que é a Autenticação de 2 Fatores (2FA)?', N'Adicionar uma camada extra de segurança (ex: SMS, Token, Biometria) além da palavra-passe padrão.', N'Algo que você sabe + Algo que você tem.', NULL, NULL),
        (77, N'fase4', N'O que é um Teste de Invasão (PenTest)?', N'Um ataque cibernético simulado e autorizado num sistema para encontrar e corrigir vulnerabilidades.', N'Realizado por White Hats (Hackers Éticos).', NULL, NULL),
        (78, N'fase4', N'O que é uma vulnerabilidade Zero-Day?', N'Uma falha de software recém-descoberta que os criadores do sistema ainda não tiveram tempo de corrigir (zero dias).', N'Ataques indetectáveis no momento.', NULL, NULL),
        (79, N'fase4', N'O que é a Regra de Backup 3-2-1?', N'Ter 3 cópias dos dados, em 2 tipos de média diferentes, sendo 1 cópia fora da empresa (offsite/nuvem).', N'Garante a recuperação total em caso de desastre.', NULL, NULL),
        (80, N'fase4', N'Qual a função do protocolo HTTPS?', N'Permitir a navegação segura na web, criptografando a comunicação entre o navegador e o servidor com certificados SSL/TLS.', N'O cadeado verde na barra de endereço.', NULL, NULL),
        (81, N'fase5', N'O que é a Inclusão Digital?', N'A democratização do acesso às tecnologias de informação para todas as camadas da sociedade.', N'Disciplinas: Ética e Sociedade.', NULL, NULL),
        (82, N'fase5', N'O que é o conceito de Green IT (TI Verde)?', N'O conjunto de práticas para reduzir o impacto ambiental da tecnologia (consumo de energia, lixo eletrônico).', N'Sustentabilidade na tecnologia.', NULL, NULL),
        (83, N'fase5', N'O que garante a Propriedade Intelectual em Software?', N'Protege o código-fonte de um sistema como direitos de autor, impedindo a cópia ou pirataria comercial.', N'Software é tratado como uma obra literária por lei.', NULL, NULL),
        (84, N'fase5', N'O que é o Viés Algorítmico (Bias)?', N'Quando uma IA reproduz discriminações e preconceitos humanos porque foi treinada com dados históricos falhos.', N'O algoritmo herda os defeitos da sociedade.', NULL, NULL),
        (85, N'fase5', N'Qual a diferença entre Open Source e Software Proprietário?', N'Open Source tem o código-fonte aberto e colaborativo. Proprietário é fechado, patenteado e pertence a uma empresa.', N'Linux vs Windows.', NULL, NULL),
        (86, N'fase5', N'O que é o Copyleft?', N'Licença que permite o livre uso, modificação e partilha de uma obra, desde que as versões alteradas mantenham as mesmas liberdades.', N'O oposto do Copyright restritivo.', NULL, NULL),
        (87, N'fase5', N'O que é o Cyberbullying?', N'A intimidação, assédio ou violência psicológica realizada através da internet e redes sociais.', N'Bullying digital.', NULL, NULL),
        (88, N'fase5', N'O que é um Deepfake?', N'Vídeos ou áudios gerados por IA que substituem o rosto ou a voz de uma pessoa para criar situações falsas e realistas.', N'Ameaça gigante à política e privacidade.', NULL, NULL),
        (89, N'fase5', N'O que é a Obsolescência Programada?', N'A tática da indústria de fabricar aparelhos desenhados para quebrarem ou ficarem inúteis rapidamente, forçando uma nova compra.', N'Telemóvel que fica lento após 2 anos.', NULL, NULL),
        (90, N'fase5', N'O que é o Lixo Eletrônico (E-waste)?', N'Equipamentos tecnológicos descartados incorretamente que libertam metais pesados tóxicos no solo.', N'O lado negro do consumo tecnológico.', NULL, NULL),
        (91, N'fase5', N'O que são Fake News?', N'Notícias falsas ou distorcidas disseminadas rapidamente em massa pelas redes sociais para manipular opiniões.', N'A desinformação digital.', NULL, NULL),
        (92, N'fase5', N'O que é Privacidade Digital?', N'O direito do utilizador de controlar como as suas informações pessoais são recolhidas e usadas na internet.', N'O seu histórico de pesquisa é seu.', NULL, NULL),
        (93, N'fase5', N'O que são as normas WCAG (Acessibilidade Web)?', N'Diretrizes internacionais que garantem que sites e aplicações possam ser usados por pessoas com deficiências (visuais, motoras, etc).', N'Web Content Accessibility Guidelines.', NULL, NULL),
        (94, N'fase5', N'Qual o foco da Ergonomia na TI?', N'A conceção de estações de trabalho (cadeira, monitor, teclado) para evitar lesões por esforço repetitivo em profissionais de tecnologia.', N'Cuidar da saúde do desenvolvedor.', NULL, NULL),
        (95, N'fase5', N'Qual o impacto social da Automação e da IA?', N'A eliminação de empregos operacionais antigos, mas simultaneamente a criação de novas especializações tecnológicas.', N'A Quarta Revolução Industrial.', NULL, NULL),
        (96, N'fase5', N'O que é Netiqueta?', N'O conjunto de regras de etiqueta e boa educação que governam o comportamento social na internet.', N'Não escrever tudo em CAIXA ALTA (Gritar).', NULL, NULL),
        (97, N'fase5', N'O que é a Sociedade da Informação?', N'Uma sociedade onde a criação, distribuição e uso da informação tornaram-se a atividade económica e cultural mais importante.', N'A Era da Informação.', NULL, NULL),
        (98, N'fase5', N'O que é o Tecnocentrismo?', N'A crença ilusória de que a tecnologia, por si só, resolverá todos os problemas da humanidade.', N'A tecnologia é ferramenta, não milagre.', NULL, NULL),
        (99, N'fase5', N'O que é a Exclusão Digital?', N'A desigualdade entre aqueles que têm fácil acesso à tecnologia e aqueles que não têm, agravando a pobreza e o desemprego.', N'A consequência da falta de Inclusão Digital.', NULL, NULL),
        (100, N'fase5', N'Como a Tecnologia afeta os Direitos Humanos?', N'Pode promovê-los (liberdade de expressão) ou ameaçá-los (vigilância estatal em massa e invasão de privacidade).', N'A tecnologia como uma faca de dois gumes.', NULL, NULL);
    INSERT INTO flashcards (id, codigo_fase, frente, verso, dica, opcoes, correta) VALUES
        (101, N'bonus1', N'Bônus 01: O que é a ''Deep Web''?', N'A parte da internet que não é indexada por motores de busca como o Google.', N'Não é necessariamente ilegal, apenas oculta.', NULL, NULL),
        (102, N'bonus1', N'Bônus 01: O que foi o vírus ''ILOVEYOU'' (2000)?', N'Um dos maiores worms de e-mail da história que causou bilhões em prejuízos.', N'Engenharia social pura.', NULL, NULL),
        (103, N'bonus1', N'Bônus 01: O que é o Teste de Invasão (PenTest)?', N'Simular um ataque cibernético autorizado para encontrar falhas de segurança.', N'Feito por Hackers Éticos.', NULL, NULL),
        (104, N'bonus1', N'Bônus 01: Quem é o grupo ''Anonymous''?', N'Um coletivo descentralizado internacional de ativistas hackers (hacktivistas).', N'Usam a máscara de Guy Fawkes.', NULL, NULL),
        (105, N'bonus1', N'Bônus 01: Quem é Kevin Mitnick?', N'Um dos hackers mais famosos da história, especialista em Engenharia Social.', N'Chegou a ser o homem mais procurado do FBI.', NULL, NULL),
        (106, N'bonus1', N'Bônus 01: O que é uma vulnerabilidade ''Zero-Day''?', N'Uma falha de segurança recém-descoberta que os criadores do software ainda não conhecem e não corrigiram.', N'Dia-zero (nenhum tempo para consertar).', NULL, NULL),
        (107, N'bonus1', N'Bônus 01: Qual a diferença entre Malware e Vírus?', N'Malware é qualquer código malicioso. Vírus é um tipo de malware que se replica inserindo seu código em outros programas.', N'Todo vírus é um malware, mas nem todo malware é vírus.', NULL, NULL),
        (108, N'bonus1', N'Bônus 01: O que é um Cavalo de Troia (Trojan)?', N'Um malware disfarçado de software legítimo e inofensivo para enganar o usuário.', N'Inspirado na lenda grega.', NULL, NULL),
        (109, N'bonus1', N'Bônus 01: O que é Engenharia Social no hacking?', N'A arte de manipular psicologicamente as pessoas para que entreguem informações confidenciais.', N'O ''hackeamento'' do cérebro humano.', NULL, NULL),
        (110, N'bonus1', N'Bônus 01: Qual a diferença entre Black Hat e White Hat?', N'Black Hats invadem para roubar e destruir. White Hats (éticos) invadem para testar e proteger o sistema.', N'Chapéu preto (vilão) vs Chapéu branco (herói).', NULL, NULL),
        (111, N'bonus1', N'Bônus 01: O que é um programa de ''Bug Bounty''?', N'Empresas que pagam recompensas em dinheiro para hackers que encontrarem e reportarem falhas em seus sistemas.', N'Caçadores de recompensas digitais.', NULL, NULL),
        (112, N'bonus1', N'Bônus 01: O que significa CAPTCHA?', N'Completely Automated Public Turing test to tell Computers and Humans Apart (Teste para diferenciar humanos e robôs).', N'Aquelas imagens irritantes de semáforos.', NULL, NULL),
        (113, N'bonus1', N'Bônus 01: Como funciona uma VPN?', N'Cria um túnel criptografado entre você e a internet, ocultando seu IP e sua localização.', N'Virtual Private Network.', NULL, NULL),
        (114, N'bonus1', N'Bônus 01: O que é o navegador Tor?', N'Um navegador projetado para comunicação anônima, roteando o tráfego por vários servidores voluntários (nós).', N'Símbolo da cebola (The Onion Router).', NULL, NULL),
        (115, N'bonus1', N'Bônus 01: Quem criou o Bitcoin?', N'Uma pessoa ou grupo sob o pseudônimo de ''Satoshi Nakamoto''. A identidade real nunca foi descoberta.', N'Criado logo após a crise de 2008.', NULL, NULL),
        (116, N'bonus1', N'Bônus 01: O que foi o Stuxnet?', N'Um vírus de computador militar extremamente sofisticado, criado para sabotar usinas nucleares.', N'A primeira arma cibernética do mundo.', NULL, NULL),
        (117, N'bonus1', N'Bônus 01: O que foi o Morris Worm (1988)?', N'Um dos primeiros malwares distribuídos pela internet, que acidentalmente derrubou milhares de computadores.', N'Criado por um estudante para ''medir'' o tamanho da internet.', NULL, NULL),
        (118, N'bonus1', N'Bônus 01: O que foi o WannaCry (2017)?', N'Um ataque de ransomware global que infectou centenas de milhares de PCs exigindo resgate em Bitcoin.', N'Paralisou até os hospitais do Reino Unido.', NULL, NULL),
        (119, N'bonus1', N'Bônus 01: O que foi a Máquina Enigma?', N'Uma máquina de criptografia usada pelos nazistas na 2ª Guerra Mundial, quebrada pela equipe de Alan Turing.', N'Filme: O Jogo da Imitação.', NULL, NULL),
        (120, N'bonus1', N'Bônus 01: O que foi a ARPANET?', N'A rede de computadores financiada pelo departamento de defesa dos EUA que deu origem à Internet atual.', N'Avó da internet.', NULL, NULL),
        (121, N'bonus1', N'Bônus 01: Qual foi o primeiro ''Bug'' de computador real?', N'Uma mariposa (inseto/bug) real que ficou presa nos relés do computador Mark II em 1947.', N'Encontrada pela pioneira Grace Hopper.', NULL, NULL),
        (122, N'bonus1', N'Bônus 01: Quem foi Alan Turing?', N'Matemático britânico considerado o pai da ciência da computação e da Inteligência Artificial.', N'Criou o ''Teste de Turing''.', NULL, NULL),
        (123, N'bonus1', N'Bônus 01: Quem foi Ada Lovelace?', N'Matemática inglesa reconhecida como a primeira pessoa programadora da história (anos 1840).', N'Escreveu o primeiro algoritmo para a Máquina Analítica.', NULL, NULL),
        (124, N'bonus1', N'Bônus 01: Qual a arquitetura de Von Neumann?', N'O design base de quase todos os PCs modernos, separando CPU, memória e dispositivos de Entrada/Saída.', N'Conceito criado em 1945.', NULL, NULL),
        (125, N'bonus1', N'Bônus 01: Quem é Linus Torvalds?', N'O engenheiro de software finlandês que criou o núcleo (kernel) do sistema operacional Linux.', N'Também criou o sistema de versionamento Git.', NULL, NULL),
        (126, N'bonus1', N'Bônus 01: O que é o Konami Code?', N'Um código de trapaça famoso nos videogames: Cima, Cima, Baixo, Baixo, Esquerda, Direita, Esquerda, Direita, B, A.', N'O maior easter egg da cultura pop.', NULL, NULL),
        (127, N'bonus1', N'Bônus 01: O que é um ataque de Força Bruta?', N'Tentar adivinhar uma senha testando milhões de combinações possíveis até acertar.', N'Motivo pelo qual pedem senhas complexas.', NULL, NULL),
        (128, N'bonus1', N'Bônus 01: O que é Phreaking?', N'A exploração e hackeamento do sistema de telecomunicações e linhas telefônicas antigas.', N'Steve Jobs e Wozniak vendiam as ''Blue Boxes'' de phreaking.', NULL, NULL),
        (129, N'bonus1', N'Bônus 01: O que significa a mensagem de erro HTTP 404?', N'Indica que o cliente conseguiu se comunicar com o servidor, mas o servidor não encontrou o arquivo ou página solicitada.', N'Page Not Found.', NULL, NULL),
        (130, N'bonus1', N'Bônus 01: O que significa a mensagem de erro HTTP 418?', N'I''m a teapot (Eu sou um bule de chá). É uma piada oficial de primeiro de abril criada no protocolo HTTP em 1998.', N'O easter egg oficial da web.', NULL, NULL),
        (131, N'fase6', N'O que é a estrutura de dados Pilha (Stack)?', N'O último elemento a entrar é o primeiro a sair (LIFO - Last In, First Out).', N'Disciplina: Algoritmos e Dados. Ex: Botão ''Desfazer''.', NULL, NULL),
        (132, N'fase6', N'O que é a Fila (Queue)?', N'O primeiro elemento a entrar é o primeiro a sair (FIFO - First In, First Out).', N'Ex: Fila de impressão numa impressora.', NULL, NULL),
        (133, N'fase6', N'O que é um Algoritmo de Ordenação?', N'Um método para organizar dados numa sequência lógica (ex: crescente ou decrescente).', N'Ex: Bubble Sort, Quick Sort.', NULL, NULL),
        (134, N'fase6', N'O que é a Complexidade ''Big O''?', N'Uma notação matemática para medir a eficiência de um algoritmo (tempo e memória) à medida que os dados crescem.', N'O(1) é excelente, O(n²) é muito lento.', NULL, NULL),
        (135, N'fase6', N'O que é uma Árvore Binária?', N'Estrutura de dados onde cada nó tem no máximo dois filhos (ramo esquerdo e direito).', N'Excelente para pesquisas rápidas.', NULL, NULL),
        (136, N'fase6', N'O que é uma Lista Ligada (Linked List)?', N'Uma sequência de elementos onde cada nó contém um valor e um ''ponteiro'' para o próximo nó da lista.', N'Não usa blocos de memória contíguos como os Arrays.', NULL, NULL),
        (137, N'fase6', N'O que é uma Tabela de Dispersão (Hash Table)?', N'Estrutura que mapeia chaves para valores usando uma função matemática (Hash), permitindo pesquisas ultra-rápidas.', N'A base dos Dicionários em Python.', NULL, NULL),
        (138, N'fase6', N'Como funciona a Pesquisa Binária (Binary Search)?', N'Procura um item dividindo repetidamente uma lista ORDENADA pela metade até encontrar o valor.', N'Muito mais rápido que olhar um por um.', NULL, NULL),
        (139, N'fase6', N'Como funciona a Pesquisa Linear?', N'Percorre a lista elemento por elemento, do início ao fim, até encontrar o que procura.', N'Simples, mas lento em listas gigantes (O(n)).', NULL, NULL),
        (140, N'fase6', N'O que é a Recursividade?', N'É quando uma função se invoca a si mesma repetidamente até atingir uma condição de paragem.', N'Muito usada para calcular fatoriais e percorrer árvores.', NULL, NULL),
        (141, N'fase6', N'Como funciona o algoritmo Bubble Sort?', N'Compara pares vizinhos e troca-os se estiverem na ordem errada, fazendo o maior valor ''flutuar'' para o final.', N'O algoritmo de ordenação mais simples e menos eficiente.', NULL, NULL),
        (142, N'fase6', N'O que é o algoritmo Merge Sort?', N'Usa a técnica ''Dividir para Conquistar'', cortando a lista em metades e depois unindo-as já ordenadas.', N'Muito eficiente e estável (O(n log n)).', NULL, NULL),
        (143, N'fase6', N'O que é o Quick Sort?', N'Escolhe um elemento como ''Pivô'' e particiona a lista, colocando os menores à esquerda e os maiores à direita.', N'O algoritmo de ordenação mais famoso do mundo.', NULL, NULL),
        (144, N'fase6', N'O que significa um algoritmo ter complexidade O(1)?', N'Significa ''Tempo Constante''. O algoritmo demora exatamente o mesmo tempo, quer a lista tenha 10 ou 1 milhão de itens.', N'O Santo Graal da eficiência.', NULL, NULL),
        (145, N'fase6', N'O que é a Programação Dinâmica (Memoization)?', N'Técnica de otimização que guarda os resultados de funções pesadas numa cache para não ter de os calcular de novo.', N'Memória salva processamento.', NULL, NULL),
        (146, N'fase6', N'O que é um Algoritmo Guloso (Greedy)?', N'Toma a melhor decisão local disponível no momento imediato, na esperança de que leve à melhor solução global.', N'Nem sempre entrega o cenário perfeito, mas é rápido.', NULL, NULL),
        (147, N'fase6', N'Em Python, o que é uma Tupla (Tuple)?', N'Uma coleção de itens ordenados, mas que é IMUTÁVEL (não pode ser alterada depois de criada).', N'Usa parênteses (). Ex: coordenadas = (x, y)', NULL, NULL),
        (148, N'fase6', N'Em Python, o que é um Conjunto (Set)?', N'Uma coleção não ordenada de itens ÚNICOS (não permite valores duplicados).', N'Usa chaves {}. Excelente para remover repetições.', NULL, NULL),
        (149, N'fase6', N'Qual é a estrutura LIFO?', N'Last In, First Out (Último a entrar, primeiro a sair).', N'É a regra da estrutura de Pilha (Stack).', NULL, NULL),
        (150, N'fase6', N'Qual é a estrutura FIFO?', N'First In, First Out (Primeiro a entrar, primeiro a sair).', N'É a regra da estrutura de Fila (Queue).', NULL, NULL),
        (151, N'fase7', N'O que são Ponteiros (Pointers) em C?', N'Variáveis especiais que, em vez de guardar um valor, guardam o ENDEREÇO DE MEMÓRIA de outra variável.', N'Disciplina: Programação em C.', NULL, NULL),
        (152, N'fase7', N'Para que serve a biblioteca <stdio.h>?', N'Standard Input/Output. É obrigatória para usar as funções básicas de entrada e saída, como printf e scanf.', N'O cabeçalho (header) mais famoso do C.', NULL, NULL),
        (153, N'fase7', N'Para que serve a função malloc()?', N'Memory Allocation. Serve para alocar blocos de memória dinamicamente enquanto o programa está a correr.', N'Pede memória emprestada ao sistema.', NULL, NULL),
        (154, N'fase7', N'O que a função free() faz?', N'Liberta a memória que foi alocada dinamicamente com o malloc(), devolvendo-a ao sistema operativo.', N'Evita o Memory Leak (Fuga de Memória).', NULL, NULL),
        (155, N'fase7', N'O que é um Struct em C?', N'Uma estrutura que agrupa diferentes tipos de variáveis sob um único nome.', N'É o ''avô'' das Classes da Orientação a Objetos.', NULL, NULL),
        (156, N'fase7', N'Como declaramos o tipo ''String'' em C?', N'O C não tem um tipo ''String'' nativo. Usamos um Array (vetor) de caracteres (char).', N'Ex: char nome[50];', NULL, NULL),
        (157, N'fase7', N'O que faz o operador ''&'' numa variável em C?', N'Retorna o endereço de memória físico onde essa variável está guardada.', N'Muito usado dentro do scanf().', NULL, NULL),
        (158, N'fase7', N'O que faz o operador ''*'' associado a um ponteiro?', N'Faz a ''desreferenciação'', acedendo ao valor que está guardado naquele endereço de memória.', N'Lê o conteúdo apontado.', NULL, NULL),
        (159, N'fase7', N'O que faz a função printf()?', N'Imprime texto formatado e valores de variáveis no ecrã (console).', N'Print Formatted.', NULL, NULL),
        (160, N'fase7', N'O que faz a função scanf()?', N'Lê os dados formatados introduzidos pelo utilizador através do teclado.', N'Scan Formatted.', NULL, NULL),
        (161, N'fase7', N'O que é um Array (Vetor) em C?', N'Uma estrutura que armazena uma coleção sequencial de elementos do MESMO TIPO de dados.', N'A primeira posição é sempre o índice [0].', NULL, NULL),
        (162, N'fase7', N'O que é uma Matriz em C?', N'Um Array bidimensional (ou com mais dimensões), organizado em linhas e colunas.', N'Ex: int matriz[3][3];', NULL, NULL),
        (163, N'fase7', N'O que é o GCC?', N'GNU Compiler Collection. É o compilador mais utilizado no mundo para transformar código C em linguagem máquina.', N'Traduz o texto para binário.', NULL, NULL),
        (164, N'fase7', N'Para que serve a diretiva #define?', N'Usada para criar macros ou definir constantes globais que não mudam durante o programa.', N'Ex: #define PI 3.1415', NULL, NULL),
        (165, N'fase7', N'O que marca o fim de uma string (char array) em C?', N'O caractere nulo (Null Terminator), representado por ''\0''.', N'Diz ao programa onde a frase termina.', NULL, NULL),
        (166, N'fase7', N'Como funciona o loop ''do-while''?', N'Executa o bloco de código PELO MENOS UMA VEZ antes de verificar se a condição é verdadeira.', N'A verificação fica no final.', NULL, NULL),
        (167, N'fase7', N'Para que serve o comando ''switch-case''?', N'Substitui uma longa cadeia de ''if-else'', permitindo testar o valor de uma variável contra vários casos específicos.', N'Ideal para menus de opções.', NULL, NULL),
        (168, N'fase7', N'Para que serve a palavra-chave ''break'' num switch?', N'Para interromper a execução e sair do bloco switch; caso contrário, executará os casos seguintes em cascata.', N'Trava a cascata.', NULL, NULL),
        (169, N'fase7', N'O que é Passagem por Valor numa função?', N'A função recebe apenas uma CÓPIA da variável. Alterar o valor dentro da função não afeta a variável original.', N'Seguro, mas gasta memória duplicada.', NULL, NULL),
        (170, N'fase7', N'O que é Passagem por Referência numa função?', N'A função recebe o PONTEIRO (endereço) da variável original. Qualquer alteração afeta os dados reais do programa.', N'Rápido e afeta a raiz do dado.', NULL, NULL),
        (171, N'fase8', N'O que são Requisitos Funcionais?', N'Descrevem o que o sistema DEVE FAZER (as suas funções). Ex: ''O sistema deve emitir faturas''.', N'Disciplina: Análise e Eng. de Sistemas.', NULL, NULL),
        (172, N'fase8', N'O que são Requisitos Não Funcionais?', N'Descrevem COMO o sistema deve ser, as suas qualidades e restrições. Ex: ''O ecrã deve carregar em 1 segundo''.', N'Focam em performance, segurança, design.', NULL, NULL),
        (173, N'fase8', N'O que é um Diagrama de Casos de Uso (UML)?', N'Um desenho que mostra as interações entre os Utilizadores (Atores) e o Sistema.', N'Foca nas ações principais do ponto de vista do utilizador.', NULL, NULL),
        (174, N'fase8', N'Qual a diferença entre a Metodologia Ágil e o modelo Cascata (Waterfall)?', N'O Ágil é flexível e iterativo (entregas parciais). O Cascata é linear, rígido e só testa no final.', N'Ágil adapta-se; Cascata planeia tudo antes.', NULL, NULL),
        (175, N'fase8', N'O que é um Diagrama de Classes?', N'Diagrama estrutural da UML que mapeia a estrutura estática do sistema (classes, atributos, métodos e heranças).', N'A planta-baixa dos programadores Orientados a Objetos.', NULL, NULL),
        (176, N'fase8', N'Quais são as fases clássicas do Ciclo de Vida do Software?', N'1. Levantamento de Requisitos; 2. Análise/Design; 3. Implementação (Código); 4. Testes; 5. Implantação; 6. Manutenção.', N'O passo a passo para criar qualquer sistema.', NULL, NULL),
        (177, N'fase8', N'O que faz a Engenharia de Requisitos?', N'É a disciplina que foca em descobrir, documentar e manter as regras de negócio e necessidades do cliente.', N'A ponte entre o cliente e os programadores.', NULL, NULL),
        (178, N'fase8', N'O que é o Diagrama de Sequência (UML)?', N'Mostra como os objetos interagem num determinado cenário ao longo de uma linha de tempo temporal.', N'Foco na troca de mensagens cronológicas.', NULL, NULL),
        (179, N'fase8', N'O que é o Diagrama de Atividades (UML)?', N'Semelhante a um fluxograma, modela o fluxo de controlo de uma atividade para outra dentro do sistema.', N'Mostra o caminho da lógica, passo a passo.', NULL, NULL),
        (180, N'fase8', N'O que é o Framework Scrum?', N'Uma estrutura de trabalho ágil focada em equipas pequenas que realizam entregas de software em ciclos curtos (Sprints).', N'A metodologia ágil mais famosa.', NULL, NULL),
        (181, N'fase8', N'O que é a metodologia Kanban?', N'Método de gestão visual do fluxo de trabalho contínuo, usando um quadro com colunas (A Fazer, Fazendo, Feito).', N'Criado originalmente pela Toyota.', NULL, NULL),
        (182, N'fase8', N'O que é o XP (Extreme Programming)?', N'Metodologia ágil extremamente focada na excelência técnica, exigindo testes contínuos e Programação em Par (Pair Programming).', N'Foco pesado na qualidade do código.', NULL, NULL),
        (183, N'fase8', N'O que é o padrão MVC?', N'Model (Dados/Regras), View (Interface Visual) e Controller (Mediador). Um padrão de arquitetura que separa responsabilidades.', N'Não mistura HTML com acessos à base de dados.', NULL, NULL),
        (184, N'fase8', N'O que são Testes Unitários?', N'Testes de baixo nível que verificam se a menor parte testável de um código (uma função ou método) funciona corretamente de forma isolada.', N'Testa o tijolo antes de construir o muro.', NULL, NULL),
        (185, N'fase8', N'O que são Testes de Integração?', N'Testes que verificam se os diferentes módulos, classes ou bases de dados funcionam bem quando ligados entre si.', N'Testa a junção dos tijolos.', NULL, NULL),
        (186, N'fase8', N'O que é o Teste de Aceitação do Utilizador (UAT)?', N'A fase final onde o cliente ou o utilizador real testa o sistema para validar se atende aos requisitos de negócio.', N'A validação final antes de ir para produção.', NULL, NULL),
        (187, N'fase8', N'O que é Refatoração (Refactoring)?', N'O processo de reescrever e limpar o código-fonte para melhorar a sua estrutura interna, sem alterar o seu comportamento externo.', N'Arrumar a casa por dentro.', NULL, NULL),
        (188, N'fase8', N'O que é a Dívida Técnica (Technical Debt)?', N'O custo futuro acumulado ao escolhermos soluções de código fáceis e rápidas agora, em vez da abordagem correta e otimizada.', N'Fazer rápido hoje significa ter de refazer amanhã.', NULL, NULL),
        (189, N'fase8', N'O que são os Padrões de Projeto (Design Patterns)?', N'Soluções típicas, testadas e reutilizáveis para resolver problemas comuns no design de software.', N'Ex: Singleton, Factory, Observer.', NULL, NULL),
        (190, N'fase8', N'O que significa a sigla UML?', N'Unified Modeling Language (Linguagem de Modelação Unificada). É a linguagem visual padrão para documentar sistemas de software.', N'O ''idioma'' internacional dos diagramas de sistemas.', NULL, NULL),
        (191, N'fase9', N'O que é um endereço IP?', N'Identificador numérico exclusivo atribuído a cada dispositivo conectado numa rede de computadores.', N'Disciplina: Redes e Sistemas Distribuídos.', NULL, NULL),
        (192, N'fase9', N'Para que serve o DNS?', N'Domain Name System. Traduz nomes de domínios fáceis (google.com) para endereços IP numéricos.', N'A lista telefónica da Web.', NULL, NULL),
        (193, N'fase9', N'Qual a diferença entre os protocolos TCP e UDP?', N'TCP garante a entrega e ordem dos dados. O UDP é muito mais rápido, mas não verifica se o dado chegou (não é fiável).', N'TCP para ficheiros. UDP para jogos/streaming.', NULL, NULL),
        (194, N'fase9', N'O que é um Sistema Distribuído?', N'Vários computadores independentes na rede a trabalharem juntos para parecerem um único sistema coeso para o utilizador.', N'A base arquitetural da Nuvem (Cloud).', NULL, NULL),
        (195, N'fase9', N'O que faz um Load Balancer (Balanceador de Carga)?', N'Distribui o tráfego de rede e as requisições igualmente entre vários servidores para evitar sobrecargas e quedas.', N'Evita que um único servidor suporte todo o peso.', NULL, NULL),
        (196, N'fase9', N'O que é um endereço MAC?', N'O endereço físico gravado permanentemente na placa de rede pelo fabricante. Não muda com a internet.', N'Media Access Control.', NULL, NULL),
        (197, N'fase9', N'O que é o Modelo OSI?', N'Um modelo de referência conceitual dividido em 7 camadas (Física, Ligação, Rede, Transporte, Sessão, Apresentação, Aplicação).', N'Cria um padrão de comunicação universal.', NULL, NULL),
        (198, N'fase9', N'O que é o Modelo TCP/IP?', N'O modelo prático que realmente move a internet, condensando o modelo OSI em apenas 4 camadas.', N'Aplicação, Transporte, Internet e Acesso à Rede.', NULL, NULL),
        (199, N'fase9', N'Qual a diferença entre HTTP e HTTPS?', N'O HTTPS utiliza a camada de segurança SSL/TLS, encriptando todo o tráfego para que não possa ser intercetado.', N'Hyper Text Transfer Protocol (Secure).', NULL, NULL),
        (200, N'fase9', N'O que é o protocolo FTP?', N'File Transfer Protocol. Usado historicamente para transferir ficheiros de um computador para um servidor na rede.', N'Transferência pura de ficheiros.', NULL, NULL);
    INSERT INTO flashcards (id, codigo_fase, frente, verso, dica, opcoes, correta) VALUES
        (201, N'fase9', N'Para que serve o SSH?', N'Secure Shell. Protocolo de rede que permite ligar-se de forma encriptada e segura a servidores remotos através de um terminal em linha de comando.', N'Acesso remoto seguro a servidores Linux.', NULL, NULL),
        (202, N'fase9', N'Quais são as portas padrão para os protocolos HTTP e HTTPS?', N'HTTP corre na porta 80. HTTPS corre na porta segura 443.', N'Portas essenciais do Firewall.', NULL, NULL),
        (203, N'fase9', N'O que faz um Router (Roteador)?', N'É o equipamento de rede que envia os pacotes de dados entre diferentes redes (ex: da sua rede local para a Internet global).', N'O ''carteiro'' da internet.', NULL, NULL),
        (204, N'fase9', N'O que faz um Switch?', N'Equipamento que liga vários dispositivos dentro de uma mesma rede local (LAN), enviando os dados apenas para o dispositivo correto (usando o MAC).', N'Diferente do Hub, que enviava para todos.', NULL, NULL),
        (205, N'fase9', N'Para que serve um Firewall numa rede?', N'Filtra o tráfego de entrada e de saída com base num conjunto de regras de segurança, bloqueando ligações não autorizadas.', N'A barreira de segurança da rede.', NULL, NULL),
        (206, N'fase9', N'O que é uma VPN?', N'Virtual Private Network. Cria um túnel encriptado na internet pública, simulando uma ligação privada e segura à rede da empresa.', N'Segurança e privacidade remotas.', NULL, NULL),
        (207, N'fase9', N'Para que serve a Máscara de Sub-rede (Subnet Mask)?', N'Divide um grande bloco de endereços IP em redes menores, indicando que parte do IP é a rede e que parte é a máquina.', N'Ex: 255.255.255.0', NULL, NULL),
        (208, N'fase9', N'O que faz o protocolo DHCP?', N'Dynamic Host Configuration Protocol. Atribui automaticamente endereços IP, gateways e DNS aos computadores quando estes se ligam à rede.', N'Imagina configurar o IP de cada telemóvel manualmente!', NULL, NULL),
        (209, N'fase9', N'O que testa o comando Ping?', N'Envia pacotes ICMP para um IP de destino e aguarda a resposta, medindo o tempo de ida e volta para verificar se a máquina está online.', N'Teste básico de conectividade.', NULL, NULL),
        (210, N'fase9', N'Na rede, o que é a Latência (vulgo ''Lag'')?', N'O tempo que um pacote de dados demora a viajar do ponto A (o seu PC) até ao ponto B (Servidor) e voltar.', N'Baixa latência = resposta rápida.', NULL, NULL),
        (211, N'fase10', N'O que é o Teste de Turing?', N'Um teste proposto por Alan Turing para verificar se uma máquina consegue exibir um comportamento inteligente indistinguível de um humano.', N'Disciplina: Inteligência Artificial.', NULL, NULL),
        (212, N'fase10', N'O que são Agentes Inteligentes em IA?', N'Sistemas (software ou hardware) que percebem o ambiente através de sensores e agem para maximizar a hipótese de sucesso dos seus objetivos.', N'Ex: Um robô aspirador de pó.', NULL, NULL),
        (213, N'fase10', N'O que é uma Heurística na IA?', N'Uma ''regra de ouro'' ou atalho mental usado pela IA para encontrar soluções boas o suficiente num tempo muito rápido, sem garantir a perfeição absoluta.', N'Troca perfeição por velocidade.', NULL, NULL),
        (214, N'fase10', N'O que é o PLN (Processamento de Linguagem Natural)?', N'Área da IA focada em ensinar as máquinas a compreender, interpretar e gerar a linguagem humana (texto e fala).', N'Como o ChatGPT ou a Alexa funcionam.', NULL, NULL),
        (215, N'fase10', N'Qual a diferença entre Inovação Incremental e Disruptiva?', N'Incremental melhora algo que já existe (iPhone 14 para 15). Disruptiva cria um novo mercado, matando o anterior (Netflix vs Blockbuster).', N'Evolução vs Revolução.', NULL, NULL),
        (216, N'fase10', N'O que é o Machine Learning (Aprendizado de Máquina)?', N'Subárea da IA onde os sistemas aprendem a identificar padrões em grandes volumes de dados, sem serem explicitamente programados passo a passo.', N'A máquina cria a sua própria lógica.', NULL, NULL),
        (217, N'fase10', N'O que é o Deep Learning (Aprendizado Profundo)?', N'Uma evolução do Machine Learning baseada em Redes Neurais Artificiais profundas (com várias camadas ocultas) para lidar com dados muito complexos.', N'A base do reconhecimento facial moderno.', NULL, NULL),
        (218, N'fase10', N'O que são Redes Neurais Artificiais?', N'Algoritmos matemáticos divididos em nós (neurónios) e camadas (Input, Ocultas, Output), biologicamente inspirados no cérebro humano.', N'Mimetizam as sinapses cerebrais.', NULL, NULL),
        (219, N'fase10', N'Como funciona o Aprendizado Supervisionado?', N'O modelo de IA é treinado recebendo os dados de exemplo E o ''gabarito'' com a resposta correta (dados rotulados).', N'Existe um supervisor a dizer à IA o que é certo.', NULL, NULL),
        (220, N'fase10', N'O que é o Aprendizado Não Supervisionado?', N'O modelo recebe dados brutos sem rótulos ou categorias, e tem de descobrir padrões ou agrupar informações sozinho (Clustering).', N'A IA tenta encontrar lógica no caos sozinha.', NULL, NULL),
        (221, N'fase10', N'Como funciona o Aprendizado por Reforço (Reinforcement Learning)?', N'A IA aprende por tentativa e erro dentro de um ambiente, recebendo ''recompensas'' ao acertar e ''punições'' ao errar.', N'Como treinar um cão de estimação.', NULL, NULL),
        (222, N'fase10', N'Na IA, o que é o erro de Overfitting?', N'Quando o modelo de IA ''decora'' viciosamente os dados de treino, acertando tudo no laboratório, mas errando gravemente quando lida com dados novos reais.', N'Falta de capacidade de generalização.', NULL, NULL),
        (223, N'fase10', N'O que é um Algoritmo de Classificação?', N'Um algoritmo que prevê uma etiqueta ou categoria (Variável Discreta). Ex: Dizer se um e-mail é ''Spam'' ou ''Não Spam''.', N'Divide os dados em caixas.', NULL, NULL),
        (224, N'fase10', N'O que é um Algoritmo de Regressão?', N'Um algoritmo que prevê um número ou valor contínuo baseado em tendências históricas. Ex: Prever o preço de uma casa no futuro.', N'Desenha uma linha de tendência.', NULL, NULL),
        (225, N'fase10', N'O que estuda a Visão Computacional?', N'O campo da IA focado em permitir que computadores extraiam informações e entendam imagens digitais e vídeos do mundo real.', N'Como os carros da Tesla conduzem sozinhos.', NULL, NULL),
        (226, N'fase10', N'O que é um Chatbot?', N'Um programa de computador projetado para simular conversas com utilizadores humanos, geralmente suportado por árvores de decisão ou PNL.', N'Atendimento automatizado.', NULL, NULL),
        (227, N'fase10', N'O que é o Viés Algorítmico (Bias)?', N'Quando a IA herda e reproduz preconceitos e discriminações raciais ou sociais devido à má qualidade dos dados usados para a treinar.', N'A máquina apenas reflete os defeitos da sociedade.', NULL, NULL),
        (228, N'fase10', N'O que significa o conceito de Big Data?', N'O processamento e armazenamento de volumes de dados tão gigantescos, rápidos e complexos (Os 3 Vs) que as bases de dados tradicionais não suportam.', N'Volume, Velocidade e Variedade.', NULL, NULL),
        (229, N'fase10', N'O que é a Mineração de Dados (Data Mining)?', N'A exploração e análise de bases de dados colossais para descobrir padrões ocultos, correlações ou anomalias valiosas para o negócio.', N'Extrair ouro comercial dos dados.', NULL, NULL),
        (230, N'fase10', N'O que significa a sigla LLM na IA moderna?', N'Large Language Model (Grande Modelo de Linguagem). IAs de processamento de linguagem treinadas com terabytes de texto da internet.', N'A tecnologia base do ChatGPT.', NULL, NULL),
        (231, N'bonus2', N'Bônus 02: O que foi o ENIAC (1946)?', N'O primeiro computador digital eletrónico de grande escala, construído com válvulas para calcular tabelas de artilharia militar.', N'Ocupava uma sala inteira e pesava 30 toneladas.', NULL, NULL),
        (232, N'bonus2', N'Bônus 02: Quem foi Ada Lovelace?', N'A primeira programadora da história (século XIX), que criou o primeiro algoritmo focado numa máquina mecânica de computação.', N'Matemática visionária.', NULL, NULL),
        (233, N'bonus2', N'Bônus 02: Quem foi Alan Turing?', N'Matemático britânico considerado o ''Pai da Ciência da Computação''. Decifrou os códigos nazis da Máquina Enigma.', N'Criou o ''Teste de Turing'' para inteligência artificial.', NULL, NULL),
        (234, N'bonus2', N'Bônus 02: O que foi a Máquina Analítica?', N'Um projeto de computador mecânico desenhado por Charles Babbage em 1837, ancestral dos computadores modernos.', N'Nunca foi totalmente construída no seu tempo.', NULL, NULL),
        (235, N'bonus2', N'Bônus 02: Qual foi o impacto da invenção do Transístor?', N'Substituiu as válvulas, permitindo que os computadores se tornassem muito mais pequenos, baratos e não superaquecessem.', N'A base de toda a eletrónica moderna.', NULL, NULL),
        (236, N'bonus2', N'Bônus 02: O que ditava a Lei de Moore (1965)?', N'Que a quantidade de transístores (o poder de processamento) num microchip dobraria a cada dois anos, sem aumento de custos.', N'A profecia que guiou a evolução do Hardware.', NULL, NULL),
        (237, N'bonus2', N'Bônus 02: O que foi a ARPANET?', N'Uma rede de computadores financiada pelo departamento militar dos EUA que é a base histórica da Internet.', N'Para proteger os dados em caso de ataque nuclear.', NULL, NULL),
        (238, N'bonus2', N'Bônus 02: Quem inventou a World Wide Web (WWW)?', N'Tim Berners-Lee em 1989, trabalhando no CERN, com o objetivo de partilhar ficheiros HTML entre cientistas.', N'Criou também o protocolo HTTP.', NULL, NULL),
        (239, N'bonus2', N'Bônus 02: Qual o papel de Margaret Hamilton na Missão Apollo 11?', N'Ela foi a Diretora de Engenharia de Software da NASA; o código da sua equipa impediu que o módulo lunar caísse na lua.', N'A mãe do termo ''Engenharia de Software''.', NULL, NULL),
        (240, N'bonus2', N'Bônus 02: Qual foi o primeiro ''Bug'' de computador real?', N'Uma traça real que ficou presa num relé do computador Mark II em 1947, encontrada por Grace Hopper.', N'A origem literal do termo ''Inseto''.', NULL, NULL),
        (241, N'bonus2', N'Bônus 02: Quem criou o sistema operacional Linux?', N'Linus Torvalds, em 1991, lançando o kernel de forma aberta (open source) para a comunidade.', N'Hoje o Linux domina os servidores do mundo.', NULL, NULL),
        (242, N'bonus2', N'Bônus 02: O que foi o Computador Altair 8800 (1975)?', N'O primeiro computador pessoal de sucesso comercial. Inspirou Bill Gates a fundar a Microsoft para vender software.', N'Era uma caixa com interruptores e luzes.', NULL, NULL),
        (243, N'bonus2', N'Bônus 02: O que a Xerox PARC inventou que a Apple e a Microsoft copiaram?', N'A Interface Gráfica de Utilizador (GUI) com janelas e o Rato de computador.', N'A Xerox não sabia comercializar a invenção.', NULL, NULL),
        (244, N'bonus2', N'Bônus 02: O que foi o ''Bug do Milénio'' (Y2K)?', N'O medo de que os computadores parassem no ano 2000, pois as datas eram guardadas apenas com os dois últimos dígitos (99 para 1999).', N'Bilhões foram gastos em refatoração de código.', NULL, NULL),
        (245, N'bonus2', N'Bônus 02: O que foi a ''Bolha da Internet'' (Dot-com Bubble) no ano 2000?', N'Uma crise financeira causada pela especulação cega em qualquer empresa que tivesse um site ''.com'', quebrando milhares de startups.', N'Muitas promessas, pouco lucro real.', NULL, NULL),
        (246, N'bonus2', N'Bônus 02: Qual a origem da linguagem Python?', N'Criada por Guido van Rossum em 1991, com foco na legibilidade do código. O nome é uma homenagem ao grupo ''Monty Python''.', N'Não tem a ver com a cobra.', NULL, NULL),
        (247, N'bonus2', N'Bônus 02: O que foi a ''Guerra dos Navegadores'' nos anos 90?', N'A competição feroz pela fatia de mercado de browsers entre o Netscape Navigator e o Internet Explorer da Microsoft.', N'O IE venceu por vir pré-instalado no Windows.', NULL, NULL),
        (248, N'bonus2', N'Bônus 02: O que é o Easter Egg ''Konami Code''?', N'Um código de trapaça famoso em videojogos: Cima, Cima, Baixo, Baixo, Esquerda, Direita, Esquerda, Direita, B, A.', N'O mais famoso ovo de páscoa digital.', NULL, NULL),
        (249, N'bonus2', N'Bônus 02: Como começou a Amazon.com em 1994?', N'Fundada por Jeff Bezos na garagem de sua casa operando exclusivamente como uma livraria online.', N'Hoje vende desde pens a infraestrutura cloud (AWS).', NULL, NULL),
        (250, N'bonus2', N'Bônus 02: Como o Google revolucionou a busca na Web (1998)?', N'Com o algoritmo PageRank, que ordenava os sites com base na quantidade e qualidade de links (relevância) apontados para eles.', N'Mataram os diretórios organizados manualmente.', NULL, NULL),
        (251, N'bonus2', N'Bônus 02: O que representou o lançamento do iPhone (2007)?', N'Revolucionou a computação móvel ao eliminar os teclados físicos em favor do ''Multitouch'' capacitivo e a entrada de lojas de apps.', N'Transformou os telemóveis em computadores de bolso.', NULL, NULL),
        (252, N'bonus2', N'Bônus 02: Quem é o criador da linguagem C?', N'Dennis Ritchie, na década de 1970. A linguagem foi usada para reescrever o sistema operativo UNIX.', N'A base da maioria dos sistemas modernos.', NULL, NULL),
        (253, N'bonus2', N'Bônus 02: O que significa ''RTFM'' na cultura Hacker?', N'Read The F***ing Manual (Leia o maldito manual).', N'A resposta rude mas clássica para perguntas óbvias.', NULL, NULL),
        (254, N'bonus2', N'Bônus 02: O que foi o sistema MS-DOS?', N'O sistema operativo em linha de comando da Microsoft que dominou os PCs na década de 1980.', N'Antecessor do Windows.', NULL, NULL),
        (255, N'bonus2', N'Bônus 02: O que era o Cartão Perfurado?', N'Pedaços de papel rígido com furos estrategicamente posicionados usados para inserir dados e código nos primeiros computadores.', N'Código físico.', NULL, NULL),
        (256, N'bonus2', N'Bônus 02: Qual o papel de Steve Wozniak na fundação da Apple?', N'Ele era o gênio técnico que projetou e construiu manualmente as placas de circuito dos computadores Apple I e Apple II.', N'Jobs vendia, Wozniak construía.', NULL, NULL),
        (257, N'bonus2', N'Bônus 02: O que foi o ''Projeto Manhattan'' do Google?', N'A criação de um sistema de IA focado em vencer o melhor jogador humano do mundo de Go (um complexo jogo de tabuleiro asiático).', N'AlphaGo.', NULL, NULL),
        (258, N'bonus2', N'Bônus 02: O que significa o acrónimo ''CAPTCHA''?', N'Completely Automated Public Turing test to tell Computers and Humans Apart.', N'Testes de semáforos e passadeiras de peões.', NULL, NULL),
        (259, N'bonus2', N'Bônus 02: O que foi o erro 418 do protocolo HTTP?', N'I''m a teapot (Eu sou um bule de chá). Foi criado em 1998 como uma piada de primeiro de abril sobre protocolos de cafeteiras conectadas.', N'O Easter Egg oficial da Web.', NULL, NULL),
        (260, N'bonus2', N'Bônus 02: O que são as ''Blue Boxes'' (Caixas Azuis) dos anos 70?', N'Dispositivos criados por hackers (Phreakers) que emitiam os mesmos tons acústicos da operadora de telefonia para fazer chamadas gratuitas.', N'Jobs e Wozniak vendiam essas caixas antes da Apple.', NULL, NULL),
        (261, N'fase11', N'O que é uma Chave Primária (Primary Key)?', N'Um campo (ou conjunto de campos) que identifica de forma exclusiva uma linha numa tabela.', N'Disciplina: Bases de Dados. Ex: NIF ou CPF.', NULL, NULL),
        (262, N'fase11', N'O que é uma Chave Estrangeira (Foreign Key)?', N'Um campo numa tabela que faz referência à Chave Primária de outra tabela, criando um vínculo entre ambas.', N'Garante a integridade referencial.', NULL, NULL),
        (263, N'fase11', N'Qual a diferença entre SQL e NoSQL?', N'SQL é relacional (tabelas e esquemas rígidos). NoSQL é não-relacional (documentos flexíveis, chave-valor, grafos).', N'MySQL vs MongoDB.', NULL, NULL),
        (264, N'fase11', N'O que significa a sigla CRUD?', N'Create (Criar), Read (Ler), Update (Atualizar), Delete (Apagar).', N'As 4 operações básicas de qualquer sistema.', NULL, NULL),
        (265, N'fase11', N'Para que serve a cláusula JOIN no SQL?', N'Para combinar e recuperar dados de duas ou mais tabelas baseando-se numa coluna em comum entre elas.', N'Une os ''Clientes'' aos seus ''Pedidos''.', NULL, NULL),
        (266, N'fase11', N'O que é a Normalização de Dados?', N'O processo de organizar as tabelas para minimizar a redundância (dados repetidos) e evitar anomalias de atualização.', N'Dividir para organizar.', NULL, NULL),
        (267, N'fase11', N'O que dita a Primeira Forma Normal (1FN)?', N'Que uma tabela não deve conter atributos multivalorados ou compostos. Cada célula deve ter um valor atómico (único).', N'Não colocar dois telefones na mesma célula.', NULL, NULL),
        (268, N'fase11', N'O que significa o acrónimo ACID em transações de Bases de Dados?', N'Atomicidade, Consistência, Isolamento e Durabilidade.', N'Garante que a transação bancária não falha a meio.', NULL, NULL),
        (269, N'fase11', N'Qual a diferença entre DDL e DML no SQL?', N'DDL define a estrutura (CREATE, ALTER, DROP). DML manipula os dados (INSERT, UPDATE, DELETE).', N'DDL mexe na tabela, DML mexe na linha.', NULL, NULL),
        (270, N'fase11', N'Para que serve o comando SELECT?', N'Para consultar e extrair dados específicos de uma ou mais tabelas.', N'A operação mais usada (Read do CRUD).', NULL, NULL),
        (271, N'fase11', N'Como funciona o comando GROUP BY?', N'Agrupa linhas com os mesmos valores em colunas de resumo, frequentemente usado com funções matemáticas (SUM, COUNT).', N'Agrupa para somar ou contar.', NULL, NULL),
        (272, N'fase11', N'O que é um Índice (Index) numa Base de Dados?', N'Uma estrutura de dados especial criada para acelerar incrivelmente a velocidade das pesquisas nas tabelas.', N'Como o índice remissivo no fim de um livro.', NULL, NULL),
        (273, N'fase11', N'O que é uma Trigger (Gatilho)?', N'Um código SQL que é executado automaticamente APÓS ou ANTES de um evento (Insert, Update ou Delete) numa tabela.', N'Excelente para criar logs de auditoria automáticos.', NULL, NULL),
        (274, N'fase11', N'O que é uma Stored Procedure (Procedimento Armazenado)?', N'Um bloco de código SQL guardado no servidor que pode ser invocado pela aplicação várias vezes.', N'Poupa tráfego de rede e centraliza regras de negócio.', NULL, NULL),
        (275, N'fase11', N'O que é uma View (Vista)?', N'Uma ''tabela virtual'' baseada no resultado de uma consulta SELECT (Query). Não guarda os dados fisicamente.', N'Facilita a leitura de JOINs muito complexos.', NULL, NULL),
        (276, N'fase11', N'O que é um SGBD?', N'Sistema Gestor de Bases de Dados. O software responsável por administrar as bases de dados.', N'Ex: SQL Server, PostgreSQL, Oracle.', NULL, NULL),
        (277, N'fase11', N'Como o MongoDB guarda os seus dados?', N'Em coleções de Documentos no formato BSON (semelhante ao JSON), sem necessidade de colunas rígidas.', N'Ideal para dados desestruturados.', NULL, NULL),
        (278, N'fase11', N'O que é um Diagrama Entidade-Relacionamento (DER)?', N'Um modelo visual que descreve a estrutura lógica da base de dados, as suas entidades e como se conectam.', N'A planta-baixa do banco.', NULL, NULL),
        (279, N'fase11', N'Para que servem os comandos COMMIT e ROLLBACK?', N'COMMIT guarda as alterações da transação permanentemente. ROLLBACK desfaz e reverte tudo em caso de erro.', N'Salvar vs Desfazer.', NULL, NULL),
        (280, N'fase11', N'Qual a diferença entre DELETE e TRUNCATE?', N'DELETE apaga linhas específicas e regista isso no log (mais lento). TRUNCATE limpa a tabela inteira de imediato (rápido).', N'TRUNCATE é um ''reset'' à tabela.', NULL, NULL),
        (281, N'fase12', N'O que é uma Classe na POO?', N'Um molde, planta ou especificação que define os atributos e comportamentos de um objeto.', N'Disciplina: POO com C#.', NULL, NULL),
        (282, N'fase12', N'O que é um Objeto?', N'Uma instância concreta (materialização) de uma Classe, residente na memória durante a execução do programa.', N'A classe é a forma do bolo; o objeto é o bolo.', NULL, NULL),
        (283, N'fase12', N'O que é a Herança em POO?', N'O mecanismo onde uma classe filha adquire automaticamente as características e comportamentos de uma classe pai.', N'Promove o reaproveitamento de código.', NULL, NULL),
        (284, N'fase12', N'O que é o Polimorfismo?', N'A capacidade de um método ter diferentes comportamentos dependendo do objeto que o invoca.', N'Ex: ''EmitirSom()'' -> Cão ladra, Gato mia.', NULL, NULL),
        (285, N'fase12', N'O que é o Encapsulamento?', N'A técnica de ocultar o estado interno de um objeto (usando variáveis private) e expor apenas os métodos seguros (public).', N'Protege os dados de alterações indevidas.', NULL, NULL),
        (286, N'fase12', N'O que é uma Classe Abstrata?', N'Uma classe genérica que não pode ser instanciada (não se pode fazer ''new''), servindo apenas de base para outras classes herdarem.', N'Modelo base obrigatório.', NULL, NULL),
        (287, N'fase12', N'O que é uma Interface?', N'Um contrato 100% vazio. Define APENAS a assinatura dos métodos que as classes que a implementam são obrigadas a criar.', N'Resolve o problema da herança múltipla no C#.', NULL, NULL),
        (288, N'fase12', N'O que é um Construtor?', N'Um método especial, executado automaticamente quando o objeto é instanciado, usado para inicializar os seus atributos.', N'Tem sempre o mesmo nome da Classe.', NULL, NULL),
        (289, N'fase12', N'Qual a diferença entre os modificadores ''public'' e ''private''?', N'Public: Qualquer parte do código acede. Private: Apenas a própria classe tem acesso.', N'Níveis de visibilidade.', NULL, NULL),
        (290, N'fase12', N'O que é a Sobrecarga (Overloading)?', N'Criar vários métodos com o MESMO NOME na mesma classe, mas com parâmetros diferentes (quantidade ou tipo).', N'Comportamentos variados consoante os argumentos.', NULL, NULL),
        (291, N'fase12', N'O que é a Sobrescrita (Overriding)?', N'Quando a classe filha reescreve e muda a lógica de um método herdado da classe pai.', N'Usa as palavras ''virtual'' e ''override'' no C#.', NULL, NULL),
        (292, N'fase12', N'O que faz a palavra-chave ''static'' num método ou atributo?', N'O membro pertence à Classe em si e não aos objetos gerados. Pode ser usado sem instanciar a classe.', N'Ex: Math.Round();', NULL, NULL),
        (293, N'fase12', N'Para que servem as Propriedades (Getters / Setters) em C#?', N'Para aceder e modificar os atributos privados de forma controlada e segura.', N'O filtro de entrada de dados.', NULL, NULL),
        (294, N'fase12', N'Para que serve o operador ''new''?', N'Para alocar memória e instanciar um novo objeto a partir de uma classe.', N'Ex: Carro c = new Carro();', NULL, NULL),
        (295, N'fase12', N'O que é o Garbage Collector (Coletor de Lixo)?', N'Um processo automático do .NET que limpa a memória, destruindo objetos que já não estão a ser usados pelo programa.', N'Evita o Memory Leak automaticamente.', NULL, NULL),
        (296, N'fase12', N'Para que servem os ''Namespaces'' em C#?', N'Para organizar o código e evitar conflitos de nomes entre classes (ex: duas classes chamadas ''Usuario'' em pastas diferentes).', N'Como se fossem ''sobrenomes'' das classes.', NULL, NULL),
        (297, N'fase12', N'Para que serve o bloco ''try / catch''?', N'Para capturar e tratar exceções (erros) em tempo de execução, impedindo que o programa feche abruptamente.', N'Gestão elegante de erros.', NULL, NULL),
        (298, N'fase12', N'No C#, qual a diferença entre Value Types e Reference Types?', N'Value (structs, int) guarda o dado direto na memória Stack. Reference (classes, arrays) guarda um ponteiro na memória Heap.', N'Gestão interna do .NET.', NULL, NULL),
        (299, N'fase12', N'Qual a grande diferença entre o Paradigma POO e o Procedural?', N'O Procedural foca numa sequência de funções e dados globais soltos. O POO agrupa dados e funções no mesmo elemento (Objeto).', N'POO modela o mundo real.', NULL, NULL),
        (300, N'fase12', N'Para que serve a palavra-chave ''this''?', N'Faz referência à instância ATUAL do objeto. Usado para diferenciar atributos da classe de variáveis locais com o mesmo nome.', N'Eu próprio.', NULL, NULL);
    INSERT INTO flashcards (id, codigo_fase, frente, verso, dica, opcoes, correta) VALUES
        (301, N'fase13', N'Qual a diferença entre UX e UI?', N'UX = User Experience (Jornada, sentimento e usabilidade). UI = User Interface (Cores, botões e estética visual).', N'Disciplina: Web Responsivo e UX/UI.', NULL, NULL),
        (302, N'fase13', N'O que é o Design Responsivo?', N'Técnica que permite que um site adapte o seu layout automaticamente ao tamanho do ecrã (PC, Tablet, Smartphone).', N'Feito usando Media Queries no CSS.', NULL, NULL),
        (303, N'fase13', N'O que é a abordagem ''Mobile First''?', N'Estratégia de desenhar e programar o site primeiro para o telemóvel, e só depois expandi-lo para monitores maiores.', N'Altamente recomendado pelo Google.', NULL, NULL),
        (304, N'fase13', N'Para que serve o CSS Flexbox?', N'Para organizar, alinhar e distribuir o espaço entre os itens numa linha ou coluna (1 dimensão).', N'Ideal para alinhar menus e botões.', NULL, NULL),
        (305, N'fase13', N'Para que serve o CSS Grid Layout?', N'Para criar estruturas de layout complexas trabalhando com linhas E colunas simultaneamente (2 dimensões).', N'A grelha de construção do site.', NULL, NULL),
        (306, N'fase13', N'O que é um Wireframe?', N'O ''esqueleto'' ou rascunho estrutural de um ecrã, sem cores, fontes ou imagens finais.', N'A planta-baixa do site.', NULL, NULL),
        (307, N'fase13', N'O que é um Protótipo de Alta Fidelidade?', N'Uma simulação interativa que se parece exatamente com o produto final, contendo cores, animações e cliques funcionais.', N'Geralmente criado no Figma.', NULL, NULL),
        (308, N'fase13', N'O que são as normas WCAG?', N'Web Content Accessibility Guidelines. Diretrizes mundiais para tornar a web acessível a pessoas com deficiência.', N'Acessibilidade para todos.', NULL, NULL),
        (309, N'fase13', N'O que é a Hierarquia Visual?', N'A organização dos elementos na interface para guiar o olhar do utilizador por ordem de importância (usando tamanho, cor, contraste).', N'O que devo ler primeiro?', NULL, NULL),
        (310, N'fase13', N'O que estuda a Psicologia das Cores?', N'Como as cores afetam a perceção e o comportamento do utilizador (ex: Vermelho para alertas, Verde para sucesso).', N'Cores transmitem emoções.', NULL, NULL),
        (311, N'fase13', N'Qual a diferença entre fontes Serifadas e Sem Serifa?', N'Serifadas (Serif) têm ''perninhas'' ou prolongamentos nos cantos (ex: Times New Roman). Sem Serifa (Sans-Serif) têm traços retos (ex: Arial).', N'Sans-Serif é o padrão para Web.', NULL, NULL),
        (312, N'fase13', N'O que é uma Call to Action (CTA)?', N'Um elemento (geralmente um botão de destaque) que incita o utilizador a realizar uma ação desejada (ex: ''Comprar Agora'').', N'Chamar para a ação.', NULL, NULL),
        (313, N'fase13', N'No CSS, para que servem as Media Queries?', N'Para aplicar estilos condicionados ao tamanho do ecrã do dispositivo (ex: @media (max-width: 600px)).', N'O motor da responsividade.', NULL, NULL),
        (314, N'fase13', N'O que é o DOM (Document Object Model)?', N'A representação estrutural em árvore do documento HTML, permitindo que o JavaScript altere os elementos em tempo real.', N'A ponte entre HTML e JavaScript.', NULL, NULL),
        (315, N'fase13', N'O que é o HTML Semântico?', N'O uso de tags apropriadas para o significado do conteúdo (ex: <header>, <article>, <nav>) em vez de apenas <div> genéricas.', N'Melhora a acessibilidade e o SEO.', NULL, NULL),
        (316, N'fase13', N'O que é o ''White Space'' (Espaço em Branco) no UI Design?', N'A área vazia entre os elementos de uma interface. É crucial para deixar o design respirar e evitar poluição visual.', N'O vazio também é design.', NULL, NULL),
        (317, N'fase13', N'O que é um Teste A/B?', N'Testar duas versões diferentes de uma mesma página simultaneamente para ver qual delas tem melhor taxa de conversão.', N'O botão verde vende mais que o azul?', NULL, NULL),
        (318, N'fase13', N'O que é o conceito de ''Affordance'' em UX?', N'A característica visual de um objeto que sugere intuitivamente como ele deve ser usado (ex: um botão com sombra parece clicável).', N'Sugestão visual de uso.', NULL, NULL),
        (319, N'fase13', N'O que é uma ''Persona'' em UX Design?', N'Uma representação semi-fictícia do cliente ideal da aplicação, baseada em dados reais, para guiar as decisões de design.', N'Dar rosto e nome ao público-alvo.', NULL, NULL),
        (320, N'fase13', N'O que é o Mapa da Jornada do Utilizador (User Journey)?', N'A documentação visual de todos os passos, frustrações e sucessos que um utilizador tem ao interagir com o produto.', N'O passo a passo da experiência.', NULL, NULL),
        (321, N'fase14', N'O que é Machine Learning (ML)?', N'Sistemas que aprendem a identificar padrões em grandes volumes de dados sem precisarem de ser explicitamente programados passo a passo.', N'Disciplina: Machine Learning.', NULL, NULL),
        (322, N'fase14', N'O que é a Inteligência Artificial (IA)?', N'O campo amplo da ciência da computação que procura criar máquinas capazes de realizar tarefas que normalmente exigem inteligência humana.', N'ML é um subcampo da IA.', NULL, NULL),
        (323, N'fase14', N'O que é o Aprendizado Supervisionado?', N'O modelo é treinado usando um conjunto de dados onde a RESPOSTA CORRETA (rótulo) já é fornecida.', N'Treinado com ''gabarito''.', NULL, NULL),
        (324, N'fase14', N'O que é o Aprendizado Não Supervisionado?', N'O modelo recebe dados brutos sem rótulos e tenta descobrir padrões ou agrupar os dados sozinho.', N'Organiza o caos de forma autónoma.', NULL, NULL),
        (325, N'fase14', N'O que é o Aprendizado por Reforço?', N'A IA aprende por tentativa e erro dentro de um ambiente, recebendo ''recompensas'' (pontos) ao acertar e ''punições'' ao errar.', N'Como ensinar um cão com biscoitos.', NULL, NULL),
        (326, N'fase14', N'O que é o Overfitting?', N'Quando o modelo memoriza ou decora os dados de treino tão bem que falha miseravelmente quando tenta analisar dados novos e reais.', N'Falta de generalização.', NULL, NULL),
        (327, N'fase14', N'O que é o Underfitting?', N'Quando o modelo é demasiado simples ou treinado por pouco tempo e não consegue sequer capturar os padrões dos dados de treino.', N'Erro na teoria e na prática.', NULL, NULL),
        (328, N'fase14', N'O que é um Algoritmo de Regressão?', N'Prevê um número ou valor contínuo baseado em tendências históricas. Ex: Prever o preço de uma casa ou o valor das ações.', N'Desenha uma linha de tendência (gráfico).', NULL, NULL),
        (329, N'fase14', N'O que é um Algoritmo de Classificação?', N'Prevê a que categoria pertence um dado. Ex: Classificar se um tumor é maligno ou benigno, ou se um e-mail é spam.', N'Separa em caixas/etiquetas.', NULL, NULL),
        (330, N'fase14', N'O que são as Redes Neurais Artificiais?', N'Modelos matemáticos inspirados no cérebro humano, organizados em camadas de nós (neurónios) interligados.', N'A base da inteligência artificial moderna.', NULL, NULL),
        (331, N'fase14', N'O que é o Deep Learning (Aprendizado Profundo)?', N'Uma área do ML que utiliza Redes Neurais com múltiplas camadas ocultas (''Deep'') para resolver problemas altamentes complexos.', N'O poder por trás do reconhecimento facial e ChatGPT.', NULL, NULL),
        (332, N'fase14', N'O que é o Processamento de Linguagem Natural (PLN)?', N'A capacidade de a máquina compreender, interpretar e gerar texto ou fala na linguagem humana (inglês, português, etc).', N'A ponte entre o homem e o texto do robô.', NULL, NULL),
        (333, N'fase14', N'O que é a Visão Computacional?', N'O ensino dos computadores para extraírem informações, identificarem e interpretarem imagens e vídeos do mundo real.', N'Carros autónomos dependem disto.', NULL, NULL),
        (334, N'fase14', N'Qual a diferença entre Dados de Treino e Dados de Teste?', N'Treino: 80% dos dados, usados para ensinar o modelo. Teste: 20% guardados em segredo para avaliar se o modelo aprendeu de verdade.', N'O teste é a ''prova final'' do modelo.', NULL, NULL),
        (335, N'fase14', N'O que é o Viés Algorítmico (Bias)?', N'Quando a IA herda preconceitos (sociais ou raciais) devido ao uso de uma base de dados histórica defeituosa.', N'A IA pode ser racista se ensinada assim.', NULL, NULL),
        (336, N'fase14', N'O que é Clustering (Agrupamento)?', N'Uma técnica de Aprendizado Não Supervisionado que divide os dados em grupos semelhantes baseados nas suas características intrínsecas.', N'Usado para segmentar perfis de clientes de marketing.', NULL, NULL),
        (337, N'fase14', N'Como funciona uma Árvore de Decisão?', N'Um modelo em forma de fluxograma onde cada ''nó'' é uma pergunta e os ''ramos'' são as respostas possíveis até chegar à decisão final.', N'Mapeia uma série de regras ''se-então''.', NULL, NULL),
        (338, N'fase14', N'O que é o algoritmo KNN (K-Nearest Neighbors)?', N'Classifica um dado observando a categoria da maioria dos seus ''K'' vizinhos mais próximos no gráfico.', N'Diz-me com quem andas e eu dir-te-ei quem és.', NULL, NULL),
        (339, N'fase14', N'O que é a Matriz de Confusão?', N'Uma tabela usada para avaliar o desempenho de um modelo de classificação, mostrando Verdadeiros Positivos, Falsos Positivos, etc.', N'Onde o algoritmo acertou e onde se confundiu.', NULL, NULL),
        (340, N'fase14', N'O que é a Extração de Características (Feature Engineering)?', N'O processo de selecionar, manipular e limpar as variáveis de entrada mais importantes para ajudar a IA a aprender melhor.', N'Entra lixo, sai lixo (GIGO).', NULL, NULL),
        (341, N'fase15', N'O que é o Manifesto Ágil (2001)?', N'O documento fundador das metodologias ágeis, que prioriza Indivíduos, Software a funcionar, Colaboração com o cliente e Resposta a mudanças.', N'Disciplina: Engenharia de Software Ágil.', NULL, NULL),
        (342, N'fase15', N'O que é o Scrum?', N'Um framework ágil iterativo (por ciclos) e incremental, focado no trabalho de equipa para entregar valor rápido ao cliente.', N'A metodologia mais adotada no mundo.', NULL, NULL),
        (343, N'fase15', N'Quem é o Product Owner (PO)?', N'A voz do cliente na equipa. É o ÚNICO responsável por definir as prioridades do produto e gerir o Backlog.', N'O dono da visão do produto.', NULL, NULL),
        (344, N'fase15', N'Quem é o Scrum Master?', N'O líder servidor da equipa. A sua função é garantir o uso correto do Scrum e remover impedimentos ou barreiras técnicas e burocráticas.', N'O facilitador e protetor da equipa.', NULL, NULL),
        (345, N'fase15', N'O que é uma Sprint no Scrum?', N'Um ciclo de trabalho fixo (timebox de 1 a 4 semanas) onde um conjunto de tarefas é planeado e executado até estar pronto.', N'O ''coração'' pulsante do Scrum.', NULL, NULL),
        (346, N'fase15', N'Qual o objetivo da reunião Daily Scrum?', N'Sincronização tática da equipa de Desenvolvimento. Duração máxima de 15 minutos. O que fiz ontem, farei hoje e há algum impedimento?', N'Reunião rápida, feita em pé.', NULL, NULL),
        (347, N'fase15', N'O que ocorre na Sprint Planning?', N'A reunião onde a equipa define o Objetivo da Sprint e seleciona as histórias do Backlog que consegue construir nesse ciclo.', N'O planeamento inicial.', NULL, NULL),
        (348, N'fase15', N'Qual o propósito da Sprint Review?', N'Ocorre no FIM da Sprint para demonstrar o incremento (o software pronto) ao cliente e aos stakeholders para colher feedback.', N'Hora da demonstração prática.', NULL, NULL),
        (349, N'fase15', N'O que é a Sprint Retrospective (Retrospectiva)?', N'A última cerimónia, onde a equipa debate O PROCESSO (o que correu bem, o que falhou) para encontrar melhorias contínuas para a próxima Sprint.', N'Melhorar a forma como se trabalha.', NULL, NULL),
        (350, N'fase15', N'O que é o Product Backlog?', N'A lista viva, ordenada e priorizada pelo PO de TUDO o que é necessário construir e melhorar no produto.', N'A lista de desejos do software.', NULL, NULL),
        (351, N'fase15', N'O que é o Sprint Backlog?', N'O subconjunto de tarefas selecionadas do Product Backlog pela equipa para serem desenvolvidas apenas durante a Sprint atual.', N'O trabalho fechado para o mês.', NULL, NULL),
        (352, N'fase15', N'O que é o Incremento no Scrum?', N'A soma de todas as tarefas concluídas numa Sprint. Deve ser um software testado, a funcionar e pronto para uso pelo cliente.', N'Valor real entregue no fim.', NULL, NULL),
        (353, N'fase15', N'O que é uma História de Utilizador (User Story)?', N'A descrição simples de um requisito do ponto de vista de quem usa o sistema. ''Como [perfil], eu quero [ação], para [benefício]''.', N'Foca no valor gerado para o cliente.', NULL, NULL),
        (354, N'fase15', N'O que é um Épico (Epic)?', N'Uma História de Utilizador muito grande ou complexa que não cabe numa única Sprint e tem de ser fatiada em histórias menores.', N'Um requisito gigante.', NULL, NULL),
        (355, N'fase15', N'O que são Story Points (Planning Poker)?', N'Uma técnica da equipa para estimar o ESFORÇO e a complexidade de uma tarefa usando valores relativos (como a sequência de Fibonacci).', N'Não mede horas, mede esforço.', NULL, NULL),
        (356, N'fase15', N'O que é um Burndown Chart?', N'Um gráfico que mostra diariamente a quantidade de trabalho restante na Sprint em relação ao tempo. A linha ''queima'' para baixo até zero.', N'Mede a velocidade da equipa.', NULL, NULL),
        (357, N'fase15', N'Como funciona o método Kanban?', N'Uma metodologia baseada na gestão visual do fluxo de trabalho contínuo através de um quadro (A Fazer, Fazendo, Feito).', N'Não tem Sprints com tempos fixos como o Scrum.', NULL, NULL),
        (358, N'fase15', N'O que é o limite de WIP no Kanban?', N'Work In Progress. Consiste em limitar a quantidade máxima de tarefas que a equipa pode realizar em simultâneo na coluna ''Fazendo''.', N'Pare de começar, comece a terminar.', NULL, NULL),
        (359, N'fase15', N'O que é o DoD (Definition of Done)?', N'O Acordo da Definição de Pronto. Um checklist que determina se uma tarefa foi codificada, testada e atende aos níveis de qualidade.', N'Pronto significa realmente pronto a usar.', NULL, NULL),
        (360, N'fase15', N'O que significa ''Timebox'' nos métodos Ágeis?', N'A duração de tempo MÁXIMA permitida para realizar uma cerimónia ou ciclo (Ex: a Daily tem um Timebox cravado de 15 minutos).', N'Bateu no tempo, a reunião acaba.', NULL, NULL),
        (361, N'bonus3', N'Bônus 03: O que é a Síndrome do Impostor?', N'O sentimento constante de que não é bom o suficiente, de que é uma fraude e que o seu sucesso se deve apenas à sorte.', N'Afeta cerca de 80% dos desenvolvedores iniciantes.', NULL, NULL),
        (362, N'bonus3', N'Bônus 03: Qual a linguagem de programação que foi para a Lua (Apollo 11)?', N'Assembly, escrito por Margaret Hamilton e a sua equipa.', N'O código era literalmente costurado em fios de cobre.', NULL, NULL),
        (363, N'bonus3', N'Bônus 03: O que dita a Lei de Moore?', N'A observação de que o número de transístores num microchip dobra aproximadamente a cada dois anos.', N'Dita o ritmo da evolução do hardware mundial.', NULL, NULL),
        (364, N'bonus3', N'Bônus 03: Qual a principal diferença entre um Júnior, um Pleno e um Sénior?', N'Júnior precisa de orientação. Pleno resolve problemas de forma independente. Sénior previne os problemas antes que eles aconteçam e orienta a equipa.', N'Evolução natural de carreira.', NULL, NULL),
        (365, N'bonus3', N'Bônus 03: O que são Hard Skills?', N'Habilidades técnicas e mensuráveis que podem ser aprendidas, como programar em C#, configurar redes ou gerir bases de dados.', N'O que coloca no currículo.', NULL, NULL),
        (366, N'bonus3', N'Bônus 03: O que são Soft Skills?', N'Habilidades comportamentais e interpessoais, como comunicação, empatia, inteligência emocional e resolução de conflitos.', N'Muitas empresas contratam pelo Hard e demitem pelo Soft.', NULL, NULL),
        (367, N'bonus3', N'Bônus 03: O que é a Síndrome de Burnout?', N'Um estado de esgotamento físico e mental extremo causado por stress crónico e prolongado no ambiente de trabalho.', N'Muito comum em TI; a saúde mental vem primeiro.', NULL, NULL),
        (368, N'bonus3', N'Bônus 03: O que significa ter um perfil profissional ''T-Shaped''?', N'Ter conhecimentos gerais amplos em várias áreas da TI (a barra horizontal do T), mas ser profundamente especialista numa única área (a barra vertical).', N'O perfil mais procurado pelas empresas.', NULL, NULL),
        (369, N'bonus3', N'Bônus 03: O que é o ''Tutorial Hell'' (Inferno dos Tutoriais)?', N'O ciclo vicioso em que o aluno consome dezenas de cursos e vídeos, mas sente-se incapaz de construir um projeto real sozinho a partir do zero.', N'Para sair: pare de assistir e comece a programar.', NULL, NULL),
        (370, N'bonus3', N'Bônus 03: O que é a Síndrome do Objeto Brilhante (Shiny Object Syndrome)?', N'A tendência de abandonar uma tecnologia ou linguagem que se está a aprender a meio, só porque surgiu um novo framework ''da moda''.', N'Foco vence o ''hype''.', NULL, NULL),
        (371, N'bonus3', N'Bônus 03: O que é um Hackathon?', N'Uma maratona de programação (geralmente de 24h a 48h) onde equipas competem para criar um protótipo de software que resolva um problema específico.', N'Excelente para networking e portfólio.', NULL, NULL),
        (372, N'bonus3', N'Bônus 03: Por que o GitHub é considerado o ''Currículo do Programador''?', N'Porque mostra o código real que escreveu, os seus commits e a sua capacidade de colaborar, o que vale mais do que diplomas em muitas vagas.', N'Mantenha o seu portfólio ativo.', NULL, NULL),
        (373, N'bonus3', N'Bônus 03: O que é o trabalho Assíncrono?', N'Modelo de trabalho onde a comunicação não exige uma resposta imediata. Permite que cada pessoa trabalhe no seu fuso horário e ritmo, usando ferramentas como o Slack ou Jira.', N'A base do trabalho remoto global.', NULL, NULL),
        (374, N'bonus3', N'Bônus 03: Qual a importância do idioma Inglês na TI?', N'As linguagens, frameworks, a melhor documentação oficial, os fóruns (Stack Overflow) e os melhores salários remotos estão todos em inglês.', N'É a verdadeira linguagem de programação universal.', NULL, NULL),
        (375, N'bonus3', N'Bônus 03: O que é o ''Fit Cultural'' numa entrevista de emprego?', N'A avaliação feita pelos RH para saber se os valores, crenças e o comportamento do candidato estão alinhados com a cultura da empresa.', N'Não basta codar bem, tem de se dar bem com a equipa.', NULL, NULL),
        (376, N'bonus3', N'Bônus 03: O que é o ''Mito do Programador 10x''?', N'A ideia de que existe um programador ''lobo solitário'' tão genial que produz dez vezes mais que uma pessoa normal.', N'O trabalho em equipa consistente supera sempre o talento isolado.', NULL, NULL),
        (377, N'bonus3', N'Bônus 03: O que é o Code Review (Revisão de Código)?', N'Prática onde outros programadores da equipa leem e analisam o seu código antes de ele ser fundido (merge) ao projeto principal.', N'A melhor forma de aprender a programar melhor.', NULL, NULL),
        (378, N'bonus3', N'Bônus 03: O que é Pair Programming (Programação em Par)?', N'Técnica Ágil onde dois programadores partilham o mesmo ecrã: um digita o código (Piloto) e o outro revê e pensa na estratégia (Navegador).', N'Duas cabeças pensam melhor que uma.', NULL, NULL),
        (379, N'bonus3', N'Bônus 03: O que significa ''Networking'' profissional?', N'A construção e manutenção de uma rede de contactos profissionais que trocam conhecimentos, indicações de vagas e experiências mútuas.', N'Quem não é visto não é lembrado.', NULL, NULL),
        (380, N'bonus3', N'Bônus 03: O que é um NDA (Non-Disclosure Agreement)?', N'Um Acordo de Confidencialidade. Um contrato legal em que promete não revelar os segredos de negócio e o código da empresa a terceiros.', N'Nunca coloque código da empresa no seu GitHub público.', NULL, NULL),
        (381, N'bonus3', N'Bônus 03: O que é a técnica Pomodoro?', N'Um método de gestão de tempo que alterna blocos de 25 minutos de foco absoluto com 5 minutos de descanso para manter o cérebro fresco.', N'Aumenta a produtividade e evita a fadiga.', NULL, NULL),
        (382, N'bonus3', N'Bônus 03: O que é atuar como Freelancer?', N'Trabalhar de forma independente, prestando serviços de desenvolvimento ou design para vários clientes sem vínculo de emprego exclusivo.', N'Seja o seu próprio patrão.', NULL, NULL),
        (383, N'bonus3', N'Bônus 03: O que é um teste de ''Live Coding'' em processos seletivos?', N'Uma etapa da entrevista onde o candidato tem de partilhar o ecrã e resolver um problema de lógica em tempo real, enquanto o avaliador observa.', N'Testa como lida com a pressão.', NULL, NULL),
        (384, N'bonus3', N'Bônus 03: Qual a importância de participar em Comunidades de Devs?', N'Acelera a aprendizagem através do apoio de pessoas mais experientes, ajuda a resolver bloqueios técnicos e abre portas no mercado de trabalho.', N'Discord, Reddit, Fóruns locais.', NULL, NULL),
        (385, N'bonus3', N'Bônus 03: O que significa trabalhar ''Alocado'' vs ''Outsourcing'' (Terceirização)?', N'Alocado é ser contratado para a equipa interna. Outsourcing é trabalhar para uma empresa que o ''aluga'' como consultor a outro cliente corporativo.', N'Modelo muito comum em consultorias de TI.', NULL, NULL),
        (386, N'bonus3', N'Bônus 03: O que é uma Mentoria de Carreira?', N'Um relacionamento profissional onde uma pessoa experiente (mentor) orienta, partilha atalhos e aconselha um profissional menos experiente (mentorado).', N'Encurta a curva de aprendizagem.', NULL, NULL),
        (387, N'bonus3', N'Bônus 03: O que significa ter Inteligência Emocional no trabalho?', N'A capacidade de reconhecer e gerir as suas próprias emoções (não entrar em pânico perante bugs) e ter empatia com os colegas.', N'Fundamental para liderar.', NULL, NULL),
        (388, N'bonus3', N'Bônus 03: O que é a síndrome do ''Not Invented Here'' (Não Inventado Aqui)?', N'O preconceito nocivo de empresas ou equipas que recusam usar bibliotecas de terceiros excelentes, querendo criar tudo do zero internamente.', N'Não reinvente a roda.', NULL, NULL),
        (389, N'bonus3', N'Bônus 03: O que é ''Gamificação'' (O que estamos a fazer agora)?', N'O uso de mecânicas e dinâmicas de jogos (pontos, níveis, recompensas) em contextos que não são de jogo (estudo, trabalho) para aumentar o engajamento.', N'A magia do Nex_TI!', NULL, NULL),
        (390, N'bonus3', N'Bônus 03: O que é o Princípio de Pareto (Regra 80/20)?', N'A regra que diz que 80% dos resultados vêm de 20% dos esforços. Na TI, 80% dos bugs estão em 20% do código.', N'Foco no que realmente dá resultado.', NULL, NULL),
        (391, N'fase16', N'O que é o .NET Core (ou apenas .NET)?', N'Um framework open-source e multiplataforma (Windows, Linux, macOS) criado pela Microsoft para construir vários tipos de aplicações.', N'Disciplina: Web e Aplicações com .NET.', NULL, NULL),
        (392, N'fase16', N'O que é o Entity Framework Core (EF Core)?', N'Um ORM (Object-Relational Mapper) que permite manipular bases de dados usando objetos C# em vez de escrever código SQL manual.', N'Mapeamento Objeto-Relacional.', NULL, NULL),
        (393, N'fase16', N'Para que serve uma API REST?', N'Para comunicar sistemas (Front-end e Back-end) trocando dados, geralmente no formato JSON, através do protocolo HTTP.', N'Usa os métodos GET, POST, PUT e DELETE.', NULL, NULL),
        (394, N'fase16', N'O que é a Injeção de Dependência (DI)?', N'Técnica onde uma classe recebe os objetos (dependências) de que precisa a partir de uma fonte externa, em vez de os instanciar (usar ''new'') internamente.', N'Desacopla o código e facilita os testes.', NULL, NULL),
        (395, N'fase16', N'O que é o padrão MVC no ASP.NET?', N'Um padrão de arquitetura que divide a aplicação em Model (Dados), View (Interface) e Controller (Lógica de interligação).', N'Separação de responsabilidades.', NULL, NULL),
        (396, N'fase16', N'O que é o Kestrel?', N'O servidor web embutido, multiplataforma e extremamente rápido, incluído por padrão nas aplicações ASP.NET Core.', N'Servidor web do .NET.', NULL, NULL),
        (397, N'fase16', N'O que é o NuGet?', N'O gestor de pacotes oficial da plataforma .NET. Permite instalar, remover e atualizar bibliotecas de terceiros no projeto.', N'O equivalente ao ''npm'' do Node.js.', NULL, NULL),
        (398, N'fase16', N'Qual a diferença entre IEnumerable e IQueryable no C#?', N'IEnumerable executa a consulta na memória (após trazer os dados da base). IQueryable traduz os filtros para SQL e executa diretamente na base de dados.', N'IQueryable é muito mais otimizado para bases de dados.', NULL, NULL),
        (399, N'fase16', N'O que é o Swagger (OpenAPI)?', N'Uma ferramenta que gera automaticamente uma interface visual e interativa para documentar e testar os endpoints de uma API REST.', N'A documentação viva da API.', NULL, NULL),
        (400, N'fase16', N'No ciclo de vida de Injeção de Dependência, o que significa ''Singleton''?', N'Cria uma única instância do serviço a primeira vez que é solicitado, e partilha essa mesma instância com todas as requisições futuras.', N'Único para todos.', NULL, NULL);
    INSERT INTO flashcards (id, codigo_fase, frente, verso, dica, opcoes, correta) VALUES
        (401, N'fase16', N'No ciclo de vida de Injeção de Dependência, o que significa ''Scoped''?', N'Cria uma nova instância do serviço por cada requisição HTTP (request).', N'O mais comum em APIs web.', NULL, NULL),
        (402, N'fase16', N'O que é o LINQ (Language Integrated Query)?', N'Um conjunto de funcionalidades do C# que permite escrever consultas complexas (filtros, ordenações) em coleções de dados ou bases de dados de forma nativa.', N'O SQL dentro do C#.', NULL, NULL),
        (403, N'fase16', N'O que é uma Minimal API no .NET?', N'Uma forma simplificada de criar APIs HTTP no C# com poucas linhas de código, sem a complexidade dos Controllers tradicionais.', N'Rápido e direto ao ponto.', NULL, NULL),
        (404, N'fase16', N'O que faz a palavra-chave ''await'' em C#?', N'Pausa a execução do método atual até que a tarefa assíncrona (Task) seja concluída, libertando a thread principal.', N'Programação Assíncrona (async/await).', NULL, NULL),
        (405, N'fase16', N'O que é o ficheiro appsettings.json?', N'O ficheiro principal de configuração das aplicações .NET, usado para guardar chaves, strings de conexão e parâmetros globais.', N'Onde fica a ''Connection String''.', NULL, NULL),
        (406, N'fase16', N'O que é o CORS (Cross-Origin Resource Sharing)?', N'Um mecanismo de segurança dos navegadores que bloqueia requisições HTTP de domínios diferentes, a menos que a API as autorize explicitamente.', N'Erro clássico ao ligar Front-end ao Back-end.', NULL, NULL),
        (407, N'fase16', N'O que é um token JWT (JSON Web Token)?', N'Um padrão de mercado para autenticação. É uma string encriptada gerada após o login que o cliente usa para aceder a rotas protegidas da API.', N'O ''passaporte'' de acesso do utilizador.', NULL, NULL),
        (408, N'fase16', N'O que é o Middleware no ASP.NET Core?', N'Um pedaço de código (componente) inserido no pipeline de requisições da aplicação, que pode intercetar, processar ou alterar o request/response.', N'Ex: Autenticação, tratamento de erros globais.', NULL, NULL),
        (409, N'fase16', N'O que são Data Annotations?', N'Atributos colocados por cima das propriedades de uma classe (ex: [Required], [MaxLength(50)]) para validar os dados automaticamente.', N'Validação de modelos.', NULL, NULL),
        (410, N'fase16', N'O que são as Migrations no Entity Framework Core?', N'Um sistema que permite gerar e aplicar alterações na estrutura da base de dados (criar tabelas, colunas) a partir das mudanças feitas nas classes C#.', N'Versionamento do esquema da base de dados.', NULL, NULL),
        (411, N'fase17', N'Qual a principal diferença entre uma Aplicação Nativa e Híbrida?', N'A Nativa usa o código original (Kotlin/Swift) para uma performance máxima. A Híbrida usa tecnologias web (HTML/JS) dentro de uma ''casca'' mobile.', N'Disciplina: Desenvolvimento Mobile.', NULL, NULL),
        (412, N'fase17', N'O que é o desenvolvimento Cross-Platform?', N'A capacidade de escrever um código numa única linguagem (ex: C#, Dart, JS) e compilá-lo para gerar aplicações tanto para Android como iOS.', N'Escreve uma vez, corre em todo o lado.', NULL, NULL),
        (413, N'fase17', N'O que é o .NET MAUI?', N'Framework da Microsoft (evolução do Xamarin) para criar aplicações nativas para Android, iOS, macOS e Windows utilizando C# e XAML.', N'Multi-platform App UI.', NULL, NULL),
        (414, N'fase17', N'O que é o Ciclo de Vida (Lifecycle) de um ecrã mobile?', N'A série de estados pelos quais uma app passa: Criada (OnCreate), Visível (OnStart), Em Pausa (OnPause) e Destruída (OnDestroy).', N'Evita consumo excessivo de bateria em 2º plano.', NULL, NULL),
        (415, N'fase17', N'Para que serve a API de Geolocalização?', N'Permite à aplicação aceder ao GPS e às redes móveis do telemóvel para determinar a latitude e longitude do utilizador.', N'Usada no Uber, iFood, Waze.', NULL, NULL),
        (416, N'fase17', N'Para que serve o SQLite em projetos Mobile?', N'É uma base de dados relacional extremamente leve, que fica embutida dentro do próprio telemóvel para guardar informações offline.', N'Funciona sem internet.', NULL, NULL),
        (417, N'fase17', N'Qual é a linguagem oficial recomendada atualmente pela Google para o Android?', N'Kotlin (substituindo o antigo Java).', N'Moderna, concisa e segura.', NULL, NULL),
        (418, N'fase17', N'Qual é a linguagem oficial recomendada atualmente pela Apple para o iOS?', N'Swift (substituindo o antigo Objective-C).', N'Rápida e interativa.', NULL, NULL),
        (419, N'fase17', N'O que é o React Native?', N'Um framework Cross-Platform criado pelo Facebook que permite desenvolver apps nativas utilizando JavaScript e React.', N'Usado pelo Instagram e Discord.', NULL, NULL),
        (420, N'fase17', N'O que é o Flutter?', N'Um UI Toolkit Cross-Platform criado pela Google, que utiliza a linguagem Dart para desenhar interfaces bonitas e fluidas rapidamente.', N'O principal concorrente do React Native.', NULL, NULL),
        (421, N'fase17', N'O que é o ficheiro APK ou AAB no Android?', N'O pacote final compilado e compactado que contém a aplicação pronta para ser instalada ou enviada para a Google Play Store.', N'Android Package / Android App Bundle.', NULL, NULL),
        (422, N'fase17', N'O que é o Xcode?', N'O Ambiente de Desenvolvimento Integrado (IDE) oficial da Apple, obrigatório para compilar e publicar aplicações para o iOS.', N'Só funciona no macOS.', NULL, NULL),
        (423, N'fase17', N'O que são Push Notifications?', N'Mensagens ou alertas curtos enviados pelo servidor diretamente para o ecrã do telemóvel do utilizador, mesmo quando a app está fechada.', N'Mensagens de aviso do WhatsApp ou Banco.', NULL, NULL),
        (424, N'fase17', N'O que significa ''Background Process'' no mobile?', N'Um processo em segundo plano, ou seja, código que continua a ser executado mesmo quando o utilizador está noutra app.', N'Ex: O Spotify a tocar música enquanto lê e-mails.', NULL, NULL),
        (425, N'fase17', N'Qual a diferença entre ''px'' (pixels) e ''dp'' (density-independent pixels)?', N'O pixel varia de tamanho consoante o ecrã. O ''dp'' ajusta-se automaticamente à densidade do ecrã para que os botões tenham sempre o mesmo tamanho físico.', N'Responsividade móvel.', NULL, NULL),
        (426, N'fase17', N'O que é o Firebase?', N'Uma plataforma da Google (BaaS) que fornece base de dados em tempo real, autenticação, analytics e hospedagem, simplificando o Back-end de apps.', N'Back-end as a Service.', NULL, NULL),
        (427, N'fase17', N'O que é a funcionalidade ''Hot Reload''?', N'A capacidade de injetar código alterado diretamente na app em execução, atualizando a interface em segundos sem perder o estado ou reiniciar a app.', N'Acelera a criação de UIs.', NULL, NULL),
        (428, N'fase17', N'O que é o Material Design?', N'Um sistema de design global criado pela Google focado em UI limpa, com sombras físicas, cores vibrantes e animações de transição intuitivas.', N'O padrão visual do Android.', NULL, NULL),
        (429, N'fase17', N'O que é uma WebView?', N'Um componente invisível que embute um navegador web dentro de uma app nativa, permitindo renderizar páginas HTML diretamente no ecrã.', N'Um browser disfarçado de app.', NULL, NULL),
        (430, N'fase17', N'O que é o sistema de Permissões Mobile?', N'O mecanismo de segurança (exigido por Android e iOS) que obriga a app a perguntar ao utilizador se pode aceder à câmara, microfone ou ficheiros.', N'''Permitir acesso à câmara?''', NULL, NULL),
        (431, N'fase18', N'O que é uma Stored Procedure (Procedimento Armazenado)?', N'Um bloco de código SQL guardado na base de dados para ser reutilizado várias vezes pelas aplicações que se conectam a ela.', N'Disciplina: Programação de Bases de Dados.', NULL, NULL),
        (432, N'fase18', N'O que é uma Trigger (Gatilho)?', N'Um código SQL que é disparado e executado automaticamente no exato momento em que ocorre um evento (Insert, Update, Delete) numa tabela.', N'Ótimo para manter históricos/logs automáticos.', NULL, NULL),
        (433, N'fase18', N'Qual a principal diferença entre uma View e uma Tabela?', N'A tabela armazena dados físicos no disco. A View é uma ''tabela virtual'' temporária que apresenta o resultado de uma consulta pré-definida (SELECT).', N'A View não ocupa espaço com os dados.', NULL, NULL),
        (434, N'fase18', N'O que é o conceito ACID em transações?', N'Um conjunto de propriedades (Atomicidade, Consistência, Isolamento, Durabilidade) que garante que as transações na base de dados processam com segurança.', N'Garante a fiabilidade do sistema bancário.', NULL, NULL),
        (435, N'fase18', N'Para que serve o comando COMMIT?', N'Para confirmar o sucesso de uma transação, guardando e gravando permanentemente as alterações efetuadas na base de dados.', N'Confirmar a gravação.', NULL, NULL),
        (436, N'fase18', N'Para que serve o comando ROLLBACK?', N'Para reverter e cancelar todas as alterações feitas numa transação caso ocorra um erro antes do comando COMMIT.', N'O ''Desfazer'' (Ctrl+Z) da base de dados.', NULL, NULL),
        (437, N'fase18', N'O que é um Cursor em SQL?', N'Uma estrutura de controlo que permite percorrer e processar os registos (linhas) resultantes de um SELECT, um por um.', N'Como um laço ''for'', mas muito lento em SQL.', NULL, NULL),
        (438, N'fase18', N'O que é uma User-Defined Function (UDF)?', N'Uma função criada pelo utilizador para efetuar cálculos ou formatar dados e retornar um único valor (escalar) ou uma tabela.', N'Pode ser usada dentro de um comando SELECT.', NULL, NULL),
        (439, N'fase18', N'Qual a principal diferença entre Procedure e Function em SQL?', N'Uma Function tem SEMPRE de devolver um valor e pode ser usada num SELECT. A Procedure pode apenas alterar dados e não pode ser usada num SELECT.', N'A função calcula, a procedure executa tarefas.', NULL, NULL),
        (440, N'fase18', N'O que é um Índice Agrupado (Clustered Index)?', N'Ordena fisicamente os dados no disco da mesma forma que o índice. Uma tabela só pode ter UM índice agrupado (geralmente a Chave Primária).', N'Muda a ordem real das folhas no arquivo.', NULL, NULL),
        (441, N'fase18', N'O que é um Índice Não Agrupado (Non-Clustered Index)?', N'Cria uma estrutura de procura separada (como um índice de livro) que aponta para os dados. Uma tabela pode ter vários.', N'Índice remissivo no fim de um livro.', NULL, NULL),
        (442, N'fase18', N'O que é um Deadlock (Impasse)?', N'Quando duas ou mais transações ficam bloqueadas eternamente, com cada uma à espera que a outra liberte um recurso (tabela) que a outra bloqueou.', N'Abraço da morte.', NULL, NULL),
        (443, N'fase18', N'O que é o nível de isolamento ''Read Uncommitted''?', N'O nível mais baixo de isolamento; permite a uma transação ler dados não confirmados (sujos) que ainda estão a ser alterados por outra transação.', N'Leitura fantasma/suja (Dirty Read).', NULL, NULL),
        (444, N'fase18', N'O que é o T-SQL (Transact-SQL)?', N'Uma extensão proprietária da linguagem SQL criada pela Microsoft para uso no SQL Server, que adiciona lógica de programação (IF, WHILE, Variáveis).', N'A linguagem de programação do SQL Server.', NULL, NULL),
        (445, N'fase18', N'O que faz o comando EXEC ou EXECUTE?', N'É utilizado para invocar e correr uma Stored Procedure ou executar uma string de código SQL dinâmico.', N'Dá o ''play'' na Procedure.', NULL, NULL),
        (446, N'fase18', N'O que é uma Tabela Temporária (ex: #Tabela)?', N'Uma tabela que existe apenas temporariamente na memória (ou no tempdb) durante a ligação do utilizador e é eliminada ao encerrar a sessão.', N'Usa o símbolo ''#'' na frente do nome.', NULL, NULL),
        (447, N'fase18', N'Para que serve a função SCOPE_IDENTITY() em T-SQL?', N'Devolve o último valor de Identidade (ID autoincremental) que acabou de ser gerado pelo INSERT na sessão e escopo atuais.', N'Qual foi o ID que acabei de inserir?', NULL, NULL),
        (448, N'fase18', N'Qual a diferença entre a cláusula WHERE e a HAVING?', N'O WHERE filtra os dados ANTES do agrupamento. O HAVING filtra os dados JÁ AGRUPADOS por uma função agregadora (SUM, COUNT).', N'HAVING é o WHERE do GROUP BY.', NULL, NULL),
        (449, N'fase18', N'O que é o Particionamento de Tabelas?', N'A divisão de uma tabela gigantesca em pedaços (partições) menores distribuídos por vários discos, para melhorar drasticamente a performance.', N'Ex: Particionar dados por ano (2025, 2026).', NULL, NULL),
        (450, N'fase18', N'O que é um Plano de Execução (Execution Plan)?', N'A rota ou estratégia interna escolhida pelo motor da base de dados para recuperar os dados da forma mais otimizada possível.', N'Mostra se o SQL está a usar os índices corretamente.', NULL, NULL),
        (451, N'fase19', N'O que é a Cloud Computing (Computação em Nuvem)?', N'A entrega de serviços informáticos (servidores, bases de dados, software) via Internet, geridos por terceiros com base no ''pague o que utilizar''.', N'Disciplina: Cloud e DevOps.', NULL, NULL),
        (452, N'fase19', N'O que é o Docker?', N'Uma plataforma de código aberto que automatiza a instalação e execução de aplicações em unidades padronizadas e isoladas chamadas Contentores.', N'Acaba com o ''no meu PC funciona''.', NULL, NULL),
        (453, N'fase19', N'Para que serve o Kubernetes?', N'É um sistema (orquestrador) desenvolvido pela Google para automatizar o deployment, o escalonamento e a gestão de milhares de contentores Docker.', N'O capitão/orquestrador dos contentores.', NULL, NULL),
        (454, N'fase19', N'O que significa CI/CD?', N'Continuous Integration (Integração Contínua) e Continuous Deployment (Entrega Contínua). O processo de automatizar testes e lançamentos de código em produção.', N'Automatização desde o ''git push'' até ao servidor.', NULL, NULL),
        (455, N'fase19', N'Defina IaaS, PaaS e SaaS.', N'IaaS (Máquina/Infraestrutura alugada); PaaS (Ambiente para desenvolvimento); SaaS (Software final pronto para o utilizador, ex: Gmail).', N'Os 3 níveis do serviço Cloud.', NULL, NULL),
        (456, N'fase19', N'O que é Escalabilidade Horizontal?', N'Aumentar a capacidade adicionando MAIS máquinas (servidores) ao sistema, dividindo a carga entre eles.', N'Scale-out.', NULL, NULL),
        (457, N'fase19', N'O que é Escalabilidade Vertical?', N'Aumentar a capacidade colocando mais recursos físicos (mais RAM ou CPU mais potente) na MESMA máquina existente.', N'Scale-up.', NULL, NULL),
        (458, N'fase19', N'O que é Serverless (Computação sem Servidor)?', N'Modelo onde o provedor Cloud aloca recursos dinamicamente. O programador apenas escreve o código (funções) e só paga pelo tempo exato de execução.', N'Ex: AWS Lambda.', NULL, NULL),
        (459, N'fase19', N'O que é IaC (Infraestrutura como Código)?', N'A gestão e provisionamento de centros de dados Cloud através de ficheiros com código e scripts, em vez de configurar as coisas manualmente em painéis web.', N'O servidor configurado em linhas de código.', NULL, NULL),
        (460, N'fase19', N'O que é o Terraform?', N'Uma ferramenta open-source popular de IaC (Infraestrutura como Código) que permite criar, alterar e gerir redes seguras e eficientes em múltiplos provedores Cloud.', N'Automatiza a criação do servidor.', NULL, NULL),
        (461, N'fase19', N'O que é o AWS EC2?', N'Amazon Elastic Compute Cloud. O serviço de IaaS da Amazon que permite alugar e correr servidores virtuais (instâncias) na nuvem.', N'A máquina virtual da Amazon.', NULL, NULL),
        (462, N'fase19', N'O que é o Amazon S3?', N'Amazon Simple Storage Service. Um serviço de armazenamento de ficheiros em nuvem seguro e infinitamente escalável focado em objetos (imagens, backups).', N'O ''disco rígido'' infinito da AWS.', NULL, NULL),
        (463, N'fase19', N'O que é um Pipeline de DevOps?', N'Um conjunto de etapas automatizadas (Build, Test, Deploy) que o código percorre desde o repositório até ser publicado no servidor final.', N'A esteira de montagem do software.', NULL, NULL),
        (464, N'fase19', N'O que é uma Arquitetura de Microsserviços?', N'Onde uma aplicação grande é construída como um conjunto de pequenos serviços modulares e independentes, cada um correndo o seu próprio processo.', N'Opõe-se à arquitetura Monolítica.', NULL, NULL),
        (465, N'fase19', N'O que é o GitHub Actions?', N'Uma plataforma nativa no GitHub que permite criar, testar e fazer o deployment automático do seu código (pipeline de CI/CD).', N'Ação automatizada sempre que se faz um ''push''.', NULL, NULL),
        (466, N'fase19', N'O que significa ''Alta Disponibilidade'' (High Availability)?', N'Sistemas configurados (usando balanceadores e redundância) para garantirem que estão online e acessíveis 99,99% do tempo, sem paralisações.', N'O sistema não pode cair.', NULL, NULL),
        (467, N'fase19', N'No Docker, o que é uma Imagem?', N'Um modelo/ficheiro imutável de apenas leitura contendo as instruções necessárias (SO, bibliotecas, código) para instanciar um Contentor.', N'A ''forma de bolo'' do contentor.', NULL, NULL),
        (468, N'fase19', N'O que faz o comando ''docker-compose up''?', N'Lê o ficheiro ''docker-compose.yml'' e inicia simultaneamente múltiplos contentores interligados (ex: Aplicação + Banco de Dados).', N'Sobe todo o ambiente de uma vez.', NULL, NULL),
        (469, N'fase19', N'O que é o Blue-Green Deployment?', N'Técnica de lançamento de software em que dois ambientes idênticos coexistem (Azul ativo, Verde atualizado). O tráfego é movido do Azul para o Verde sem o utilizador notar.', N'Atualização com Zero Downtime (sem paralisação).', NULL, NULL),
        (470, N'fase19', N'O que é Monitorização e Observabilidade em DevOps?', N'Uso de ferramentas (métricas, logs, traces) para compreender rapidamente o estado interno de um sistema e detetar gargalos ou quedas antes do cliente.', N'Medição contínua da saúde do software.', NULL, NULL),
        (471, N'fase20', N'O que é um MVP (Minimum Viable Product)?', N'A versão mais simples de um novo produto que permite à equipa recolher o máximo de validação sobre o cliente com o mínimo esforço.', N'Disciplina: Empreendedorismo em TI.', NULL, NULL),
        (472, N'fase20', N'Qual o principal objetivo do Empreendedorismo em TI?', N'Identificar problemas ou necessidades reais da sociedade e criar soluções de base tecnológica escaláveis e inovadoras.', N'Não é só programar, é resolver uma dor.', NULL, NULL),
        (473, N'fase20', N'O que caracteriza uma Startup?', N'Um grupo de pessoas à procura de um modelo de negócio inovador, repetível e escalável, a trabalhar em condições de extrema incerteza.', N'Não é apenas uma ''pequena empresa''.', NULL, NULL),
        (474, N'fase20', N'O que é um Modelo B2B (Business to Business)?', N'Um modelo onde a empresa comercializa os seus produtos (como softwares ERP) ou serviços diretamente a outras Empresas, não a pessoas físicas.', N'Ex: A Microsoft a vender o Office à IBM.', NULL, NULL),
        (475, N'fase20', N'O que é um Modelo B2C (Business to Consumer)?', N'Um modelo comercial em que os produtos ou serviços são vendidos diretamente da empresa para o consumidor ou utilizador final.', N'Ex: Spotify, Netflix, iFood.', NULL, NULL),
        (476, N'fase20', N'O que é um ''Pitch'' (ou Pitch Deck)?', N'Uma apresentação verbal rápida (entre 3 a 5 minutos) utilizada para vender a ideia da sua startup a potenciais investidores ou parceiros.', N'Venda de elevador (Elevator Pitch).', NULL, NULL),
        (477, N'fase20', N'O que é um Investidor Anjo (Angel Investor)?', N'Uma pessoa física (geralmente empresários de sucesso) que investe o seu próprio capital numa startup ainda na sua fase inicial de risco.', N'Aporta dinheiro e mentoria inteligente (Smart Money).', NULL, NULL),
        (478, N'fase20', N'O que é Venture Capital (Capital de Risco)?', N'Fundos de investimento de grandes grupos aplicados em startups maduras com alto potencial de crescimento escalável e retorno agressivo.', N'Injetam os milhões na empresa.', NULL, NULL),
        (479, N'fase20', N'O que significa o indicador CAC (Custo de Aquisição de Clientes)?', N'O montante médio que a empresa tem de gastar em marketing, anúncios e vendas para conseguir atrair um único cliente novo para o produto.', N'Quanto custa comprar um cliente.', NULL, NULL),
        (480, N'fase20', N'O que é a métrica LTV (Lifetime Value)?', N'O lucro financeiro líquido que um cliente gera para a empresa durante todo o tempo em que mantém relacionamento e assinatura ativa.', N'A regra de ouro: O LTV tem de ser superior ao CAC.', NULL, NULL),
        (481, N'fase20', N'O que significa o Churn Rate?', N'A taxa de cancelamento. A percentagem de clientes que param de pagar ou de usar o serviço da sua empresa num determinado período.', N'A métrica do ''balde furado''.', NULL, NULL),
        (482, N'fase20', N'O que significa o termo ''Pivotar'' (Pivot) no mundo das startups?', N'Alterar fundamentalmente a estratégia do modelo de negócio ou as funcionalidades do produto ao perceber que a ideia original não está a dar lucro.', N'Mudar a rota do barco antes dele afundar.', NULL, NULL),
        (483, N'fase20', N'O que é o Break-even Point (Ponto de Equilíbrio)?', N'O ponto financeiro de viragem em que os custos da empresa são iguais às suas receitas. Daí para a frente, a empresa passa finalmente a gerar lucro líquido.', N'O famoso ''ficar a zero e sair do vermelho''.', NULL, NULL),
        (484, N'fase20', N'O que é a prática do ''Bootstrapping''?', N'Iniciar e desenvolver uma startup usando apenas os próprios recursos do fundador e o dinheiro dos primeiros clientes, sem aceitar investimento externo.', N'Crescer pelos seus próprios meios.', NULL, NULL),
        (485, N'fase20', N'O que é o Business Model Canvas?', N'Uma ferramenta de gestão estratégica em formato visual (1 quadro com 9 blocos) focada em desenvolver ou documentar um modelo de negócio completo.', N'A evolução ágil do Plano de Negócios clássico.', NULL, NULL),
        (486, N'fase20', N'O que é a Proposta de Valor (Value Proposition)?', N'A afirmação simples que explica o benefício do seu produto, como ele resolve a dor do cliente e por que ele deve comprar de si e não da concorrência.', N'O pilar central do seu negócio.', NULL, NULL),
        (487, N'fase20', N'O que é o conceito de ''Growth Hacking''?', N'Uma abordagem focada no marketing impulsionado por experiências rápidas, ciência de dados e desenvolvimento de software para garantir o crescimento (Growth) explosivo.', N'Usar tecnologia no marketing em prol do crescimento.', NULL, NULL),
        (488, N'fase20', N'O que é o indicador ROI (Return on Investment)?', N'Retorno Sobre o Investimento. Uma métrica utilizada para medir o lucro (rentabilidade) gerado num projeto em relação ao montante que foi inicialmente investido nele.', N'O projeto deu dinheiro ou prejuízo?', NULL, NULL),
        (489, N'fase20', N'O que é considerado uma Startup ''Unicórnio''?', N'Uma empresa privada de tecnologia ou startup que consegue alcançar uma avaliação de mercado financeira igual ou superior a 1 Milhão de Dólares antes de ir para a bolsa de valores.', N'Uma avaliação astronômica e rara.', NULL, NULL),
        (490, N'fase20', N'O que preconiza o método ''Lean Startup'' (Startup Enxuta) criado por Eric Ries?', N'Aplicar o ciclo ''Construir-Medir-Aprender'' num processo científico focado em lançar o MVP o mais depressa possível para validar factos sem desperdiçar dinheiro e tempo.', N'Falhar rapidamente, aprender depressa, gastar pouco.', NULL, NULL),
        (491, N'bonus4', N'Bônus 04: O que é um ''Unicórnio'' no mercado de TI?', N'Uma startup de capital fechado que conseguiu atingir uma avaliação de mercado superior a 1 Bilhão de Dólares.', N'Ex: Nubank, Uber, iFood (no seu início).', NULL, NULL),
        (492, N'bonus4', N'Bônus 04: O que é um Pitch Deck?', N'Uma apresentação visual curta (10 a 15 slides) usada por empreendedores para apresentar o seu modelo de negócio a investidores para levantar capital.', N'A apresentação que pode valer milhões.', NULL, NULL),
        (493, N'bonus4', N'Bônus 04: O que é Bootstrapping?', N'Iniciar e escalar uma empresa usando exclusivamente o próprio dinheiro dos fundadores e o fluxo de caixa gerado pelas vendas iniciais.', N'Crescer sem dinheiro de fora.', NULL, NULL),
        (494, N'bonus4', N'Bônus 04: O que é o Burn Rate (Taxa de Queima)?', N'A velocidade (geralmente mensal) com que uma startup gasta o seu capital de investimento para se manter a operar antes de ser rentável.', N'A que velocidade queima o dinheiro do investidor.', NULL, NULL),
        (495, N'bonus4', N'Bônus 04: O que é Runway (Pista de Descolagem)?', N'A quantidade de tempo (em meses) que a startup tem para sobreviver operando com o seu saldo atual, com base no seu Burn Rate.', N'Se acabar a pista, a empresa fecha.', NULL, NULL),
        (496, N'bonus4', N'Bônus 04: Qual a diferença entre Incubadora e Aceleradora?', N'A incubadora ajuda ideias embrionárias a estruturarem-se fisicamente. A aceleradora pega numa startup que já fatura e injeta capital intensivo para escalar rapidamente.', N'Apoio inicial vs Crescimento explosivo.', NULL, NULL),
        (497, N'bonus4', N'Bônus 04: O que significa B2B2C?', N'Business to Business to Consumer. Uma empresa que vende um serviço a outra empresa, mas o foco final é chegar ao consumidor daquela empresa.', N'Ex: iFood vendendo o sistema aos Restaurantes (B2B) para chegar a nós (B2C).', NULL, NULL),
        (498, N'bonus4', N'Bônus 04: O que é a métrica CAC (Custo de Aquisição de Clientes)?', N'O investimento médio exigido em marketing e vendas para conseguir convencer um novo cliente a comprar o seu produto.', N'Quanto custa cada cliente novo.', NULL, NULL),
        (499, N'bonus4', N'Bônus 04: O que é a métrica LTV (Lifetime Value)?', N'A estimativa da receita líquida total que um cliente gerará para a empresa durante todo o seu tempo de retenção/assinatura.', N'O LTV tem de ser pelo menos 3x maior que o CAC.', NULL, NULL),
        (500, N'bonus4', N'Bônus 04: O que é o Churn Rate?', N'A taxa que mede a percentagem de clientes ou assinantes que cancelaram o serviço ou deixaram de comprar num determinado período.', N'O ''buraco'' no balde da empresa.', NULL, NULL);
    INSERT INTO flashcards (id, codigo_fase, frente, verso, dica, opcoes, correta) VALUES
        (501, N'bonus4', N'Bônus 04: O que é ''Pivotar'' (Pivot)?', N'Mudar drasticamente a direção do modelo de negócio, do produto ou do público-alvo quando se percebe que a estratégia atual falhou no mercado.', N'Correção de rota sem fechar a empresa.', NULL, NULL),
        (502, N'bonus4', N'Bônus 04: O que é o Break-even Point (Ponto de Equilíbrio)?', N'O momento exato em que os custos de operação da empresa se igualam às receitas de vendas (Lucro Zero). Tudo o que entrar acima disso é lucro real.', N'Sair do vermelho e empatar o jogo.', NULL, NULL),
        (503, N'bonus4', N'Bônus 04: O que é um modelo Freemium?', N'Um modelo de negócio que oferece uma versão básica do produto de forma totalmente gratuita, cobrando uma assinatura (Premium) por recursos avançados.', N'Free + Premium. Ex: Spotify, LinkedIn.', NULL, NULL),
        (504, N'bonus4', N'Bônus 04: O que é Crowdfunding?', N'Um financiamento coletivo em que várias pessoas (''a multidão'') investem pequenas quantias de dinheiro pela internet para ajudar a viabilizar um projeto.', N'A famosa ''vaquinha online'' empresarial.', NULL, NULL),
        (505, N'bonus4', N'Bônus 04: O que é o Valuation de uma empresa?', N'A avaliação financeira estimativa do valor total de mercado de uma startup. Usado para definir quanta % da empresa os investidores recebem pelo dinheiro aportado.', N'Quanto vale a sua empresa hoje?', NULL, NULL),
        (506, N'bonus4', N'Bônus 04: O que é o ''Exit'' (Saída) de uma startup?', N'O evento final em que os fundadores e primeiros investidores vendem as suas participações e têm o retorno lucrativo (Ex: Sendo comprados por uma gigante como a Google).', N'O dia do grande pagamento.', NULL, NULL),
        (507, N'bonus4', N'Bônus 04: O que significa IPO (Initial Public Offering)?', N'A Oferta Pública Inicial, momento em que uma empresa privada cresce tanto que abre o seu capital para vender ações na Bolsa de Valores pública.', N'Quando a startup vira uma ''Megacorporação''.', NULL, NULL),
        (508, N'bonus4', N'Bônus 04: O que significa atingir o ''Product-Market Fit''?', N'É o momento mágico em que uma startup construiu um produto que resolve tão bem a dor do cliente, que este mercado começa a comprar e recomendar avidamente.', N'O produto casa perfeitamente com a procura.', NULL, NULL),
        (509, N'bonus4', N'Bônus 04: Quem são os ''Early Adopters'' (Adotantes Iniciais)?', N'O pequeno grupo de clientes visionários que estão dispostos a comprar e testar a primeira versão (MVP) de um produto antes de ele se tornar famoso.', N'Os clientes que validam o seu negócio.', NULL, NULL),
        (510, N'bonus4', N'Bônus 04: O que é Growth Hacking?', N'O uso de estratégias criativas de marketing com baixo custo, análise de dados rigorosa e engenharia de software para gerar um crescimento (growth) rápido de utilizadores.', N'Hackear o crescimento através da tecnologia.', NULL, NULL),
        (511, N'bonus4', N'Bônus 04: O que é um MVP (Minimum Viable Product)?', N'O Produto Mínimo Viável. A versão mais básica da sua solução que possui as funcionalidades mínimas para atrair os Early Adopters e testar o mercado.', N'Se não tem vergonha da primeira versão do seu produto, lançou-o tarde demais.', NULL, NULL),
        (512, N'bonus4', N'Bônus 04: O que são OKRs (Objectives and Key Results)?', N'Metodologia de gestão usada pelo Google e Netflix para alinhar a empresa, definindo Objetivos qualitativos inspiradores e Resultados Chave quantitativos e mensuráveis.', N'Para onde vamos (O) e como mediremos se chegámos (KR).', NULL, NULL),
        (513, N'bonus4', N'Bônus 04: O que são KPIs (Key Performance Indicators)?', N'Indicadores chave de desempenho. Métricas numéricas que os gestores analisam diariamente para medir a saúde técnica e comercial da empresa.', N'O painel do carro do gestor.', NULL, NULL),
        (514, N'bonus4', N'Bônus 04: O que é uma Cap Table (Capitalization Table)?', N'Uma tabela jurídica que detalha quem são os donos da startup e qual a percentagem exata (quotas ou ações) que pertence aos fundadores, funcionários e investidores.', N'A divisão oficial do bolo da empresa.', NULL, NULL),
        (515, N'bonus4', N'Bônus 04: O que é o ''Vale da Morte'' das Startups?', N'A fase crítica inicial em que a startup já começou a operar e gastar capital (Burn Rate alto), mas ainda não atingiu receitas suficientes (Break-even).', N'Onde 90% das empresas morrem de falta de caixa.', NULL, NULL),
        (516, N'bonus4', N'Bônus 04: O que é o Contrato de ''Vesting'' para fundadores?', N'Uma cláusula que exige que os sócios permaneçam a trabalhar na empresa por um tempo mínimo (ex: 4 anos) para receberem progressivamente o total das suas ações.', N'Evita que um sócio abandone o barco com metade da empresa.', NULL, NULL),
        (517, N'bonus4', N'Bônus 04: O que é um ''Term Sheet''?', N'O documento preliminar que resume os termos e condições básicos de um investimento proposto por um Venture Capital antes do contrato jurídico final.', N'A proposta de noivado antes do casamento.', NULL, NULL),
        (518, N'bonus4', N'Bônus 04: O que é Inovação Disruptiva?', N'Uma tecnologia ou modelo de negócio que é criado na base do mercado, mais acessível e barato, e que eventualmente desaloja os gigantes e domina o mundo.', N'Ex: Câmaras digitais aniquilaram as de filme (Kodak).', NULL, NULL),
        (519, N'bonus4', N'Bônus 04: O que é um Acordo de Confidencialidade (NDA) para startups?', N'Um contrato que protege o sigilo da ideia, código ou plano de negócio. NOTA: Investidores não assinam NDAs para escutar a sua ideia inicial.', N'As ideias não valem nada, a execução vale tudo.', NULL, NULL),
        (520, N'bonus4', N'Bônus 04: O que significa ''Escalabilidade'' num modelo de negócio?', N'A capacidade da empresa de multiplicar as suas receitas de forma exponencial, enquanto os seus custos operacionais crescem de forma muito lenta ou quase zero.', N'O Santo Graal de qualquer software.', NULL, NULL),
        (521, N'fase21', N'(ENADE - Gestão) Uma empresa adotou metodologias ágeis. Durante uma iteração, a equipe percebeu que um dos requisitos estava mal detalhado, gerando atraso.

Qual cerimônia do Scrum é o momento IDEAL para a equipe inspecionar esse problema de processo e sugerir melhorias para o próximo ciclo?', N'Alternativa D: Sprint Retrospective.

Justificativa: A Retrospectiva serve exatamente para avaliar o processo, as falhas de comunicação e ferramentas, buscando melhoria contínua para a próxima Sprint.', N'Foco no processo e na equipe, não no produto.', N'["A) Sprint Planning","B) Daily Scrum","C) Sprint Review","D) Sprint Retrospective"]', 3),
        (522, N'fase21', N'(ENADE - LGPD) Uma clínica médica recolhe dados biométricos e histórico de doenças de seus pacientes. Segundo a Lei Geral de Proteção de Dados (LGPD), estes dados são classificados como:', N'Alternativa B: Dados Sensíveis.

Justificativa: Dados sobre saúde, biometria, origem racial, religião e orientação sexual são sensíveis pois podem gerar discriminação, exigindo maior rigor de proteção.', N'A saúde é um tema que exige proteção redobrada.', N'["A) Dados P\u00FAblicos","B) Dados Sens\u00EDveis","C) Dados Anonimizados","D) Dados Tempor\u00E1rios"]', 1),
        (523, N'fase21', N'(ENADE - UX/UI) Uma equipe está refatorando a interface de um sistema. O sistema atual possui textos com baixo contraste e depende apenas da cor vermelha para indicar erros.

Qual das ações abaixo NÃO corresponde a uma boa prática de Acessibilidade (WCAG)?', N'Alternativa B: Depender exclusivamente da cor para mensagens de erro.

Justificativa: Pessoas daltônicas não conseguirão identificar o erro. O correto é usar Cor + Ícone + Texto descritivo.', N'Pense na experiência de um usuário daltônico.', N'["A) Adicionar atributos \u0027alt\u0027 em imagens.","B) Depender exclusivamente da cor para mensagens de erro.","C) Garantir navega\u00E7\u00E3o completa via teclado (Tab).","D) Manter alto contraste entre fundo e texto."]', 1),
        (524, N'fase21', N'(ENADE - Eng. de Software) No contexto de levantamento de requisitos, um analista documentou: ''O sistema deve ser capaz de processar 10.000 transações por segundo''.

Este é um exemplo clássico de:', N'Alternativa C: Requisito Não Funcional.

Justificativa: Requisitos Não Funcionais descrevem *como* o sistema deve operar (desempenho, segurança, usabilidade), enquanto os Funcionais descrevem *o que* ele faz.', N'Refere-se à performance (o ''como''), não a uma funcionalidade.', N'["A) Requisito Funcional","B) Regra de Neg\u00F3cio","C) Requisito N\u00E3o Funcional","D) Caso de Uso"]', 2),
        (525, N'fase21', N'(ENADE - Scrum) Durante o desenvolvimento de um produto, o cliente solicita constantemente mudanças. No framework Scrum, quem é o papel responsável por maximizar o valor do produto e gerenciar o Backlog, aceitando ou recusando essas mudanças?', N'Alternativa B: Product Owner (PO).

Justificativa: O PO é a voz do cliente dentro da equipe. Ele é o único responsável por priorizar, adicionar ou remover itens do Product Backlog.', N'É o ''dono'' do produto e do backlog.', N'["A) Scrum Master","B) Product Owner (PO)","C) Tech Lead","D) Desenvolvedor Full-Stack"]', 1),
        (526, N'fase21', N'(ENADE - Ética) Um desenvolvedor descobre uma falha crítica de segurança no sistema da empresa e decide vendê-la na Dark Web em vez de reportá-la. 

Na segurança da informação, essa atitude enquadra-se no perfil de um hacker do tipo:', N'Alternativa C: Black Hat.

Justificativa: Hackers Black Hat exploram vulnerabilidades para ganho financeiro ou fins maliciosos, agindo de forma ilegal e antiética.', N'Chapéu preto = intenções maliciosas.', N'["A) White Hat","B) Gray Hat","C) Black Hat","D) Red Hat"]', 2),
        (527, N'fase21', N'(ENADE - UML) Em um Diagrama de Casos de Uso, quando um Caso de Uso ''A'' obrigatoriamente executa o Caso de Uso ''B'' para completar sua função, qual é o tipo de relacionamento entre eles?', N'Alternativa B: <<include>>.

Justificativa: O relacionamento <<include>> (inclusão) indica que o caso de uso base sempre, obrigatoriamente, incorpora o comportamento do caso de uso incluído.', N'É uma dependência obrigatória.', N'["A) \u003C\u003Cextend\u003E\u003E","B) \u003C\u003Cinclude\u003E\u003E","C) Generaliza\u00E7\u00E3o","D) Associa\u00E7\u00E3o Simples"]', 1),
        (528, N'fase21', N'(ENADE - Governança) A biblioteca ITIL tem como foco principal o alinhamento da TI com os negócios da empresa. Qual é a principal diferença entre a ITIL e o COBIT?', N'Alternativa A: A ITIL foca em serviços; o COBIT foca em auditoria e governança.

Justificativa: A ITIL foca nas boas práticas de Gestão de Serviços de TI (ITSM), enquanto o COBIT fornece um modelo abrangente de Governança corporativa e auditoria de TI.', N'ITIL = Serviços. COBIT = Controle/Auditoria.', N'["A) A ITIL foca em servi\u00E7os de TI; o COBIT foca em auditoria e governan\u00E7a.","B) O COBIT \u00E9 para desenvolvimento \u00E1gil; a ITIL \u00E9 para gest\u00E3o financeira.","C) Ambos s\u00E3o frameworks exclusivos para seguran\u00E7a da informa\u00E7\u00E3o.","D) A ITIL substitui a LGPD; o COBIT substitui o Scrum."]', 0),
        (529, N'fase21', N'(ENADE - Qualidade) Em um processo de testes de software, os testes unitários são fundamentais. Quem é o principal responsável pela criação e execução dos testes unitários?', N'Alternativa C: O Desenvolvedor do código.

Justificativa: Os testes unitários validam os menores blocos de código (funções/métodos) e devem ser escritos pelo próprio programador que desenvolveu a lógica.', N'Quem escreve a função, testa a função.', N'["A) O Analista de Requisitos","B) O Usu\u00E1rio Final","C) O Desenvolvedor do c\u00F3digo","D) O Gerente de Projetos"]', 2),
        (530, N'fase21', N'(ENADE - Inovação) No contexto de startups, o conceito de MVP (Minimum Viable Product) refere-se a:', N'Alternativa C: A versão mais simples de um produto para validação.

Justificativa: O MVP serve para testar a viabilidade do negócio no mercado rapidamente, recolhendo feedback antes de investir pesadamente no desenvolvimento.', N'Mínimo + Viável = Rápido e Funcional.', N'["A) Um produto finalizado e sem bugs.","B) A vers\u00E3o mais complexa de um sistema para testes de estresse.","C) A vers\u00E3o mais simples de um produto que permite validar uma hip\u00F3tese com o menor esfor\u00E7o.","D) Um prot\u00F3tipo visual feito apenas no papel."]', 2),
        (531, N'fase21', N'(ENADE - Negócios) Um modelo de negócio onde uma empresa fornece software através da internet mediante uma assinatura mensal (como a Netflix ou Spotify) é classificado como:', N'Alternativa C: SaaS (Software as a Service).

Justificativa: No modelo SaaS, o usuário final acessa uma aplicação pronta e hospedada na nuvem, pagando pelo uso ou assinatura, sem se preocupar com a infraestrutura.', N'O S significa Software.', N'["A) IaaS (Infrastructure as a Service)","B) PaaS (Platform as a Service)","C) SaaS (Software as a Service)","D) DaaS (Data as a Service)"]', 2),
        (532, N'fase21', N'(ENADE - Métricas) O que mede o KPI conhecido como ''Churn Rate'' em uma empresa de tecnologia SaaS?', N'Alternativa B: A taxa de cancelamento de clientes.

Justificativa: O Churn mede a porcentagem de clientes que pararam de usar o serviço. É uma métrica crítica para avaliar a retenção e a satisfação do cliente.', N'Churn significa perda ou cancelamento.', N'["A) O n\u00FAmero de novos usu\u00E1rios por m\u00EAs.","B) A taxa de cancelamento ou evas\u00E3o de clientes em um determinado per\u00EDodo.","C) A velocidade de carregamento da p\u00E1gina.","D) O custo para adquirir um novo cliente (CAC)."]', 1),
        (533, N'fase21', N'(ENADE - Negócios) Em finanças e gestão de TI, o que significa a métrica ROI?', N'Alternativa B: Return on Investment (Retorno sobre Investimento).

Justificativa: O ROI mede a rentabilidade de um investimento, calculando quanto dinheiro a empresa ganhou ou perdeu em relação ao valor que foi investido no projeto.', N'Mede se o projeto deu lucro ou prejuízo.', N'["A) Return on Incident (Retorno sobre Incidente).","B) Return on Investment (Retorno sobre Investimento).","C) Rate of Integration (Taxa de Integra\u00E7\u00E3o).","D) Resource Optimization Index (\u00CDndice de Otimiza\u00E7\u00E3o de Recursos)."]', 1),
        (534, N'fase21', N'(ENADE - Kanban) O que significa a prática de ''Limitar o WIP'' (Work in Progress) na metodologia Kanban?', N'Alternativa B: Restringir a quantidade de tarefas em andamento.

Justificativa: Limitar o WIP evita a sobrecarga da equipe, foca na finalização das tarefas (terminar o que começou) e identifica gargalos no fluxo de trabalho.', N'Pare de começar e comece a terminar.', N'["A) Limitar o n\u00FAmero de horas que a equipe pode trabalhar por dia.","B) Restringir a quantidade m\u00E1xima de tarefas que podem estar em andamento simultaneamente em uma coluna do quadro.","C) Limitar o acesso do cliente ao c\u00F3digo-fonte.","D) Reduzir o escopo do projeto pela metade."]', 1),
        (535, N'fase21', N'(ENADE - LGPD) De acordo com a LGPD, quem é a figura do ''Titular'' dos dados?', N'Alternativa C: A pessoa natural (física) a quem se referem os dados pessoais.

Justificativa: Na LGPD, o titular é o dono dos dados (o cidadão, cliente ou funcionário), e a ele são garantidos os direitos de acesso, alteração e eliminação.', N'É o verdadeiro dono da informação.', N'["A) A empresa que armazena os dados no banco de dados.","B) O administrador do sistema (DBA).","C) A pessoa natural (f\u00EDsica) a quem se referem os dados pessoais.","D) O governo federal."]', 2),
        (536, N'fase21', N'(ENADE - LGPD) De acordo com a LGPD, quem é o ''DPO'' (Data Protection Officer) ou Encarregado de Dados?', N'Alternativa C: O canal de comunicação sobre proteção de dados.

Justificativa: O DPO (Encarregado) é o profissional responsável por garantir que a empresa está em conformidade com a LGPD e atuar como ponte de comunicação oficial.', N'É o ''porta-voz'' da privacidade na empresa.', N'["A) O hacker contratado para testar o sistema.","B) O gerente de banco de dados (DBA).","C) A pessoa indicada pela empresa para atuar como canal de comunica\u00E7\u00E3o entre a empresa, os titulares dos dados e a Autoridade Nacional (ANPD).","D) O desenvolvedor back-end s\u00EAnior."]', 2),
        (537, N'fase21', N'(ENADE - Cloud) Uma empresa quer focar apenas em escrever o código do seu sistema web, sem precisar gerenciar o sistema operacional do servidor, atualizações de segurança ou redes. Qual modelo de Cloud deve ser contratado?', N'Alternativa B: PaaS (Platform as a Service).

Justificativa: O modelo PaaS fornece o ambiente e as ferramentas para o desenvolvedor executar a aplicação, abstraindo toda a gestão da infraestrutura por trás.', N'Plataforma focada no desenvolvedor (Platform).', N'["A) IaaS","B) PaaS","C) SaaS","D) On-Premises"]', 1),
        (538, N'fase21', N'(ENADE - Projetos) Em uma matriz SWOT (FOFA), quais os fatores representam o ambiente EXTERNO da organização, sobre os quais a empresa não tem controle direto?', N'Alternativa D: Oportunidades e Ameaças.

Justificativa: Forças e Fraquezas são aspectos internos (equipe, tecnologia). Oportunidades e Ameaças vêm de fora (mercado, concorrência, novas leis).', N'O que vem de fora (mercado/leis).', N'["A) For\u00E7as e Fraquezas","B) Fraquezas e Oportunidades","C) For\u00E7as e Amea\u00E7as","D) Oportunidades e Amea\u00E7as"]', 3),
        (539, N'fase21', N'(ENADE - Qualidade de Software) O que é o processo de Refatoração (Refactoring)?', N'Alternativa B: Melhorar a estrutura interna sem alterar o comportamento externo.

Justificativa: Refatorar é limpar o código (deixá-lo mais legível, otimizado e modular) sem mudar as regras de negócio ou a interface do usuário.', N'Melhorar por dentro, manter igual por fora.', N'["A) Reescrever o c\u00F3digo para alterar suas funcionalidades externas e adicionar bot\u00F5es.","B) Melhorar a estrutura interna do c\u00F3digo sem alterar seu comportamento externo (o que o usu\u00E1rio v\u00EA).","C) Apagar o sistema e come\u00E7ar tudo do zero.","D) Adicionar novas features durante a fase de testes."]', 1),
        (540, N'fase21', N'(ENADE - Gestão) O Ciclo PDCA é uma ferramenta de gestão interativa amplamente utilizada para o controle e melhoria contínua. O que significam as siglas PDCA?', N'Alternativa B: Plan (Planejar), Do (Fazer), Check (Checar), Act (Agir).

Justificativa: O PDCA é um método de 4 passos para garantir a melhoria contínua de processos e produtos em qualquer área da empresa.', N'Planejar, Fazer, Verificar e Agir.', N'["A) Program, Develop, Code, Analyze.","B) Plan, Do, Check, Act.","C) Process, Data, Control, Audit.","D) Plan, Deploy, Compile, Act."]', 1),
        (541, N'fase21', N'(ENADE - Eng. Requisitos) Uma técnica ágil eficaz para capturar requisitos sob a perspectiva do usuário segue o formato: ''Como [perfil], eu quero [ação], para [benefício]''. Como se chama essa técnica?', N'Alternativa B: História de Usuário (User Story).

Justificativa: A User Story é uma técnica ágil focada em descrever uma funcionalidade sob a perspectiva do usuário final e do valor que ela gera para o negócio.', N'Foca no ''quem'', ''o quê'' e ''porquê''.', N'["A) Diagrama de Classes","B) Hist\u00F3ria de Usu\u00E1rio (User Story)","C) Mapa Mental","D) Documento de Vis\u00E3o"]', 1),
        (542, N'fase21', N'(ENADE - Eng. Requisitos) Na metodologia Ágil, quando uma História de Usuário (User Story) é muito grande ou complexa para ser entregue em uma única Sprint, como ela é chamada?', N'Alternativa B: Épico (Epic).

Justificativa: Um Épico é uma grande iniciativa ou requisito que não cabe em uma Sprint e precisa ser quebrado (fatiado) em várias User Stories menores.', N'Uma história grande e épica.', N'["A) Bug","B) \u00C9pico (Epic)","C) Tarefa (Task)","D) Spike"]', 1),
        (543, N'fase21', N'(ENADE - Design Thinking) O Design Thinking é uma abordagem de inovação centrada no ser humano. Qual é a primeira etapa fundamental desse processo?', N'Alternativa D: Empatia (Imersão).

Justificativa: Antes de criar soluções, a equipe precisa se colocar no lugar do usuário (empatia) para entender profundamente suas dores, necessidades e o contexto do problema.', N'Se colocar no lugar do cliente primeiro.', N'["A) Prototipa\u00E7\u00E3o","B) Idea\u00E7\u00E3o","C) Teste","D) Empatia (Imers\u00E3o)"]', 3),
        (544, N'fase21', N'(ENADE - Projetos) No PMBOK, o que é o ''Caminho Crítico'' em um cronograma de projeto?', N'Alternativa B: A sequência que determina a duração total mais longa.

Justificativa: As tarefas no caminho crítico têm zero ''folga''. Se uma delas atrasar um dia, todo o projeto atrasará um dia no cronograma.', N'São as tarefas sem folga de tempo.', N'["A) A sequ\u00EAncia de atividades com o menor risco de falha.","B) A sequ\u00EAncia de atividades que determina a dura\u00E7\u00E3o total do projeto, onde qualquer atraso afeta a data de entrega final.","C) O conjunto de tarefas que custam mais dinheiro.","D) O caminho percorrido pelo cliente."]', 1),
        (545, N'fase21', N'(ENADE - Projetos) O ''Triângulo de Ferro'' da gestão de projetos clássica define três restrições principais que devem ser equilibradas para garantir a qualidade do projeto. Quais são elas?', N'Alternativa B: Escopo, Tempo e Custo.

Justificativa: Alterar um lado do triângulo invariavelmente afeta os outros. Se o cliente aumentar o Escopo, o Tempo e/ou o Custo precisarão ser aumentados para manter a qualidade.', N'Restrições triplas clássicas.', N'["A) C\u00F3digo, Testes e Deploy.","B) Escopo, Tempo e Custo.","C) Risco, Qualidade e Comunica\u00E7\u00E3o.","D) Design, Front-end e Back-end."]', 1),
        (546, N'fase21', N'(ENADE - Empreendedorismo) O que significa a sigla B2B em modelos de negócios?', N'Alternativa A: Business to Business.

Justificativa: B2B ocorre quando uma empresa cria soluções (como um ERP de RH ou maquinário pesado) e vende para outras empresas, e não para pessoas físicas.', N'Empresa para Empresa.', N'["A) Business to Business (Empresa vendendo para Empresa).","B) Business to Consumer (Empresa vendendo para Consumidor final).","C) Back to Basics (De volta ao b\u00E1sico).","D) Banco para Banco."]', 0),
        (547, N'fase21', N'(ENADE - Inovação) A Uber mudou completamente a indústria de transportes sem possuir um único carro de frota. O Netflix fez o mesmo com as locadoras de vídeo. Esse fenômeno é conhecido como:', N'Alternativa C: Inovação Disruptiva.

Justificativa: Inovações disruptivas criam um novo mercado ou rede de valor, desestabilizando líderes de mercado existentes e mudando as regras do jogo.', N'Destrói o modelo antigo e cria um novo.', N'["A) Inova\u00E7\u00E3o Incremental","B) Inova\u00E7\u00E3o de Sustenta\u00E7\u00E3o","C) Inova\u00E7\u00E3o Disruptiva","D) Reengenharia Reversa"]', 2),
        (548, N'fase21', N'(ENADE - Scrum) O que é o objetivo da cerimônia ''Daily Scrum''?', N'Alternativa B: Reunião diária de sincronização (Timebox de 15 min).

Justificativa: A Daily serve para a equipe de desenvolvimento inspecionar o progresso em direção ao objetivo da Sprint e identificar impedimentos rapidamente.', N'Reunião em pé (Stand-up), rápida e diária.', N'["A) Discutir a arquitetura t\u00E9cnica do banco de dados por 2 horas.","B) Reuni\u00E3o di\u00E1ria de no m\u00E1ximo 15 minutos para sincronizar as atividades da equipe e planejar as pr\u00F3ximas 24 horas.","C) Apresentar o software finalizado para o cliente.","D) Revisar as falhas do membro mais lento da equipe."]', 1),
        (549, N'fase21', N'(ENADE - Scrum) Quem é o ''Scrum Master'' na metodologia ágil?', N'Alternativa B: O líder servidor e facilitador.

Justificativa: O Scrum Master não é um gerente que dita tarefas. Ele facilita cerimônias, protege a equipe de distrações externas e remove gargalos (impedimentos).', N'Líder servidor e facilitador.', N'["A) O chefe ou gerente tradicional que manda na equipe.","B) O l\u00EDder servidor que garante que o Scrum seja compreendido e aplicado, removendo impedimentos t\u00E9cnicos e organizacionais da equipe.","C) O desenvolvedor que escreve o c\u00F3digo mais r\u00E1pido.","D) O representante legal do cliente (Product Owner)."]', 1),
        (550, N'fase21', N'(ENADE - Negócios) O que é o CAC (Custo de Aquisição de Clientes)?', N'Alternativa B: O custo para atrair um novo cliente.

Justificativa: O CAC mostra quanto dinheiro a empresa precisou gastar em campanhas publicitárias e vendedores para convencer uma pessoa a comprar o produto.', N'Quanto custa ''comprar'' um cliente novo.', N'["A) O valor que o cliente paga mensalmente pelo software.","B) O custo total com marketing e vendas dividido pelo n\u00FAmero de novos clientes conquistados.","C) A taxa de cancelamento de assinaturas.","D) O custo dos servidores na nuvem AWS."]', 1),
        (551, N'fase21', N'(ENADE - Sustentabilidade) O conceito de ''Green IT'' (TI Verde) busca reduzir o impacto ambiental da tecnologia. Qual das práticas abaixo NÃO é uma prática de TI Verde?', N'Alternativa B: Descarte de lixo eletrônico em aterros comuns.

Justificativa: Lixo eletrônico contém metais pesados (chumbo, mercúrio) tóxicos. A TI Verde exige a reciclagem e o descarte correto especializado desses componentes.', N'Lixo eletrônico é altamente tóxico.', N'["A) Virtualiza\u00E7\u00E3o de servidores para economizar energia f\u00EDsica.","B) Descarte de lixo eletr\u00F4nico em aterros sanit\u00E1rios comuns.","C) Uso de data centers alimentados por energia e\u00F3lica/solar.","D) Pol\u00EDticas de impress\u00E3o reduzida e digitaliza\u00E7\u00E3o de documentos."]', 1),
        (552, N'fase21', N'(ENADE - Qualidade) O que é o Teste UAT (User Acceptance Testing) no ciclo de vida de um software?', N'Alternativa C: Teste de Aceitação do Usuário.

Justificativa: O UAT é o momento onde os stakeholders finais (quem pediu o software) validam se o sistema construído realmente atende às necessidades de negócio acordadas.', N'É a validação final do cliente.', N'["A) Teste focado em verificar vulnerabilidades de banco de dados.","B) Teste executado por um rob\u00F4 para checar a API.","C) Teste de Aceita\u00E7\u00E3o do Usu\u00E1rio, a fase final onde o cliente testa o sistema no mundo real antes de o aprovar para produ\u00E7\u00E3o.","D) Teste de mesa para revisar diagramas UML."]', 2),
        (553, N'fase21', N'(ENADE - Governança) O que é um SLA (Service Level Agreement - Acordo de Nível de Serviço)?', N'Alternativa B: Um contrato de garantia de serviço.

Justificativa: O SLA estabelece métricas claras (tempo de resposta do suporte, uptime do site, penalidades financeiras se o serviço cair) que o fornecedor deve cumprir.', N'É o contrato de garantias técnicas.', N'["A) Um protocolo de internet para enviar e-mails.","B) Um contrato que define as expectativas de n\u00EDvel de servi\u00E7o entre o provedor e o cliente (ex: garantir 99,9% de disponibilidade do servidor).","C) Uma lei brasileira de prote\u00E7\u00E3o de dados.","D) Uma certifica\u00E7\u00E3o de qualidade de c\u00F3digo C#."]', 1),
        (554, N'fase21', N'(ENADE - DevOps) A cultura DevOps visa a integração contínua (CI) e entrega contínua (CD). O que é o processo de ''Integração Contínua'' (CI)?', N'Alternativa B: Fazer merge frequente de código com testes automatizados.

Justificativa: A CI (Continuous Integration) garante que as alterações de código feitas pela equipe sejam validadas constantemente, evitando o ''integration hell'' no final do projeto.', N'Evita conflitos gigantes de código no GitHub.', N'["A) Juntar as equipes de RH e TI na mesma sala.","B) Fazer o merge frequente do c\u00F3digo de v\u00E1rios desenvolvedores em um reposit\u00F3rio central, executando testes automatizados a cada envio.","C) Ligar o banco de dados SQL a um banco NoSQL.","D) Lan\u00E7ar o sistema diretamente em produ\u00E7\u00E3o sem testes."]', 1),
        (555, N'fase21', N'(ENADE - Inovação) No mundo das Startups, o que significa a expressão ''Pivotar'' (Pivot)?', N'Alternativa C: Alterar a direção e o modelo de negócio.

Justificativa: Pivotar significa manter um pé na visão da empresa, mas girar em outra direção para encontrar um mercado mais lucrativo (Ex: A Netflix começou entregando DVDs pelo correio).', N'Mudar a rota do barco antes de afundar.', N'["A) Vender a empresa para o Google.","B) Mudar o c\u00F3digo de Python para Java.","C) Alterar drasticamente a estrat\u00E9gia ou o modelo de neg\u00F3cio da startup ap\u00F3s perceber que a ideia original n\u00E3o est\u00E1 dando certo no mercado.","D) Demitir toda a equipe executiva."]', 2),
        (556, N'fase21', N'(ENADE - Gestão) Na gestão de projetos e Governança de TI, quem são os ''Stakeholders''?', N'Alternativa C: Todas as partes interessadas.

Justificativa: Stakeholder é qualquer pessoa ou grupo que tem interesse no sucesso (ou fracasso) do projeto, indo desde o CEO até o usuário final do aplicativo.', N'Partes interessadas (todos os envolvidos).', N'["A) Apenas os acionistas que colocaram dinheiro na empresa.","B) Os rob\u00F4s que testam o software.","C) Todas as partes interessadas que podem afetar ou ser afetadas pelo projeto (clientes, equipe, usu\u00E1rios, governo, diretores).","D) Apenas os programadores do sistema."]', 2),
        (557, N'fase21', N'(ENADE - Ágil) No Scrum, qual é a principal função do gráfico ''Burndown Chart''?', N'Alternativa B: Visualizar o trabalho restante na Sprint.

Justificativa: A linha do Burndown cai (queima) a cada dia conforme as tarefas são concluídas, permitindo que a equipe saiba rapidamente se conseguirá entregar tudo até o fim da Sprint.', N'O gráfico ''queima'' para baixo até chegar a zero.', N'["A) Mostrar o lucro financeiro da empresa ao longo do m\u00EAs.","B) Visualizar graficamente a quantidade de trabalho restante versus o tempo restante na Sprint.","C) Rastrear quais desenvolvedores cometeram mais bugs.","D) Mapear a arquitetura de rede em nuvem."]', 1),
        (558, N'fase21', N'(ENADE - Governança) O que significa atuar em ''Compliance'' na área de Tecnologia da Informação?', N'Alternativa B: Estar em conformidade legal e normativa.

Justificativa: Compliance vem do verbo *to comply* (cumprir, estar de acordo). Significa seguir rigidamente as leis trabalhistas, de segurança de dados, ambientais e normas da indústria.', N'Andar na linha com as leis e regras.', N'["A) Programar em linguagens modernas de alto n\u00EDvel.","B) Garantir que os processos de TI estejam em total conformidade e obede\u00E7am a leis, regulamentos, pol\u00EDticas internas e normas externas (ex: LGPD).","C) Usar computadores da Apple.","D) Contratar seguro contra inc\u00EAndios no servidor."]', 1),
        (559, N'fase21', N'(ENADE - Ética) Uma empresa copia integralmente o código-fonte e o layout de um aplicativo concorrente sem permissão, lançando-o como se fosse seu. Isso fere qual princípio ético/legal?', N'Alternativa B: Propriedade Intelectual e Direitos Autorais.

Justificativa: O código-fonte original é protegido por leis de direitos autorais como propriedade intelectual do seu criador. Copiá-lo para fins comerciais caracteriza pirataria/plágio.', N'O código tem um ''dono'' por direito autoral.', N'["A) LGPD (Prote\u00E7\u00E3o de Dados).","B) Propriedade Intelectual e Direitos Autorais de Software.","C) C\u00F3digo de Defesa do Consumidor.","D) Marco Civil da Internet."]', 1),
        (560, N'fase21', N'(ENADE - Negócios) Em métricas financeiras de startups, o que é o Break-even Point (Ponto de Equilíbrio)?', N'Alternativa B: Receitas igualam os custos totais.

Justificativa: O Break-even é a linha mágica. A partir do momento em que a empresa ultrapassa esse ponto, cada nova venda começa finalmente a gerar Lucro real.', N'O zero a zero financeiro (empatou).', N'["A) O momento em que a empresa decreta fal\u00EAncia.","B) O momento em que a receita total da empresa iguala exatamente seus custos totais (n\u00E3o h\u00E1 lucro, nem preju\u00EDzo).","C) O pico m\u00E1ximo de vendas no final do ano.","D) O desconto dado aos primeiros clientes."]', 1),
        (561, N'fase21', N'(ENADE - Negócios) O que é a métrica LTV (Lifetime Value) em produtos SaaS?', N'Alternativa B: Valor gerado pelo cliente durante seu tempo de retenção.

Justificativa: Se um cliente paga R$ 50/mês na Netflix e assina por 20 meses, o LTV dele é de R$ 1.000. Uma empresa saudável deve ter o LTV muito maior que o CAC (Custo de Aquisição).', N'Valor de vida do cliente.', N'["A) O tempo que o servidor fica ligado sem reiniciar.","B) O valor total de receita que um cliente gera para a empresa durante todo o tempo em que ele permanece como assinante.","C) O tempo de vida \u00FAtil da bateria do notebook.","D) A multa rescis\u00F3ria do contrato."]', 1),
        (562, N'fase21', N'(ENADE - Projetos) Qual ferramenta visual, muito comum na gestão clássica de projetos (PMBOK), é formada por barras horizontais e ilustra o cronograma de atividades ao longo dos dias e meses?', N'Alternativa B: Gráfico de Gantt.

Justificativa: O Gráfico de Gantt é a representação visual de um cronograma, mostrando quando uma tarefa começa, quando termina e se ela depende do fim de outra tarefa anterior.', N'Gráfico de barras temporais em cascata.', N'["A) Diagrama de Entidade-Relacionamento (DER).","B) Gr\u00E1fico de Gantt.","C) Quadro Kanban.","D) Diagrama de Dispers\u00E3o."]', 1),
        (563, N'fase21', N'(ENADE - Qualidade) Uma equipe implementou uma nova tela no sistema. Qual teste deve ser rodado para garantir que o código novo não quebrou ou gerou bugs em funcionalidades antigas que já estavam funcionando?', N'Alternativa C: Teste de Regressão.

Justificativa: Como o nome sugere, serve para verificar se o software ''regrediu'' em qualidade. É essencial rodá-lo (geralmente de forma automatizada) a cada nova atualização do sistema.', N'Garante que o passado não quebrou.', N'["A) Teste de Usabilidade.","B) Teste de Carga/Estresse.","C) Teste de Regress\u00E3o.","D) Teste de Invas\u00E3o (PenTest)."]', 2),
        (564, N'fase21', N'(ENADE - Scrum) No final de uma Sprint, a equipe realiza a ''Sprint Review'' (Revisão da Sprint). Qual é o propósito desta reunião?', N'Alternativa B: Inspecionar o produto pronto e colher feedback do cliente.

Justificativa: Enquanto a Retrospectiva foca no Processo da equipe, a Review foca no Produto. É a hora do ''Show and Tell'', mostrando o software rodando na prática.', N'Demonstração prática para o cliente.', N'["A) Discutir os sentimentos da equipe e as falhas de comunica\u00E7\u00E3o.","B) Apresentar o incremento do software pronto para os Stakeholders/Cliente e adaptar o Backlog do Produto conforme o feedback.","C) Estimar o esfor\u00E7o das tarefas da pr\u00F3xima semana (Planning Poker).","D) Escrever a documenta\u00E7\u00E3o t\u00E9cnica da API."]', 1),
        (565, N'fase21', N'(ENADE - Inovação) O que é um ''Design Sprint'' (criado pelo Google Ventures)?', N'Alternativa B: Processo de 5 dias para prototipar e validar ideias.

Justificativa: O Design Sprint condensa meses de debates em uma única semana focada, saindo do problema para uma ideia desenhada, prototipada e testada com usuários reais na sexta-feira.', N'Validação de ideia em 5 dias.', N'["A) Uma corrida de programa\u00E7\u00E3o onde ganha quem digitar mais r\u00E1pido.","B) Um processo de 5 dias usado para responder quest\u00F5es cr\u00EDticas de neg\u00F3cios atrav\u00E9s do design, prototipa\u00E7\u00E3o e teste de ideias com clientes.","C) Um framework para otimizar o banco de dados do Google.","D) Apenas o desenho do logotipo da empresa."]', 1),
        (566, N'fase21', N'(ENADE - Governança) O que é o COBIT na área de TI?', N'Alternativa B: Framework de Governança de TI.

Justificativa: O COBIT ajuda diretores e executivos a gerenciarem os riscos de TI, garantirem a segurança da informação e auditarem se os investimentos tecnológicos geram valor ao negócio.', N'Focado em Diretoria, Governança e Auditoria.', N'["A) Uma linguagem de programa\u00E7\u00E3o orientada a objetos baseada em COBOL.","B) Um framework global para a Governan\u00E7a e Gest\u00E3o corporativa de Tecnologia da Informa\u00E7\u00E3o.","C) Um software antiv\u00EDrus empresarial.","D) Uma lei americana de prote\u00E7\u00E3o de patentes."]', 1),
        (567, N'fase21', N'(ENADE - Negócios) O que é o modelo de negócio ''Marketplace''?', N'Alternativa B: Uma plataforma que conecta múltiplos vendedores a compradores.

Justificativa: A plataforma de Marketplace não possui necessariamente o estoque dos produtos; ela intermedeia a transação financeira, garantindo segurança e tráfego para os parceiros.', N'É um shopping center virtual.', N'["A) Uma empresa que fabrica os pr\u00F3prios sapatos e os vende em loja f\u00EDsica.","B) Uma plataforma online que conecta vendedores independentes a compradores, recebendo comiss\u00F5es pelas vendas (Ex: Mercado Livre, Amazon, Uber).","C) Uma ONG focada na doa\u00E7\u00E3o de hardware antigo.","D) Um modelo onde o software \u00E9 gr\u00E1tis mas o suporte \u00E9 pago."]', 1),
        (568, N'fase21', N'(ENADE - Ética e IA) Em relação ao desenvolvimento de algoritmos de Inteligência Artificial, o que é o ''Viés Algorítmico'' (Algorithmic Bias)?', N'Alternativa C: Decisões discriminatórias baseadas em dados viciados.

Justificativa: Se uma IA de recrutamento for treinada com currículos de uma empresa que historicamente contratava mais homens brancos, a IA aprenderá que esse perfil é o ''ideal'' e passará a descartar minorias, herdando o preconceito humano.', N'A IA reproduzindo o preconceito humano.', N'["A) Quando o c\u00F3digo Python \u00E9 substitu\u00EDdo por R.","B) A capacidade da IA de ter sentimentos humanos.","C) Quando a IA toma decis\u00F5es preconceituosas, injustas ou discriminat\u00F3rias devido a falhas nos dados hist\u00F3ricos usados em seu treinamento.","D) O atraso na resposta de um servidor de IA na nuvem."]', 2),
        (569, N'fase21', N'(ENADE - Ágil) No Scrum, O que representa o ''Product Backlog''?', N'Alternativa C: Lista viva e priorizada de requisitos.

Justificativa: O Product Backlog nunca está ''pronto''. Enquanto o produto existir, o backlog existirá, sendo constantemente refinado e priorizado pelo Product Owner com base no valor de negócio.', N'Lista de desejos do produto.', N'["A) Uma lista est\u00E1tica de requisitos que nunca pode ser alterada ap\u00F3s o in\u00EDcio do projeto.","B) O log de erros do servidor em produ\u00E7\u00E3o.","C) Uma lista viva, ordenada e priorizada de tudo que \u00E9 conhecido e necess\u00E1rio para criar e melhorar o Produto.","D) O painel visual onde as tarefas est\u00E3o na coluna \u0027Em Andamento\u0027."]', 2),
        (570, N'fase21', N'(ENADE - Projetos) Durante o levantamento de Requisitos Funcionais, um usuário relata: ''A tela de login travou e apareceu erro 404''. Como a equipe de TI classifica essa informação?', N'Alternativa C: É um Bug (Defeito/Incidente).

Justificativa: O erro 404 indica que algo no código ou servidor que já deveria estar operando falhou. Bugs devem ser priorizados na fila de resolução, separados de novas features.', N'O sistema não operou conforme projetado.', N'["A) \u00C9 um requisito funcional novo.","B) \u00C9 uma melhoria (Feature).","C) \u00C9 um Bug (Defeito/Incidente) que afeta a disponibilidade e funcionalidade do sistema.","D) \u00C9 um requisito de neg\u00F3cio estrutural."]', 2),
        (571, N'fase22', N'(ENADE - Algoritmos) Considere a estrutura de dados ''Fila'' (Queue) a ser usada para gerir requisições de impressão num escritório. Foram inseridos, nesta ordem, os ficheiros: A, B e C.

Se o comando ''dequeue()'' for executado duas vezes, qual ficheiro restará na fila?', N'Alternativa C: Ficheiro C.

Justificativa: A Fila segue o princípio FIFO (First In, First Out). O primeiro a entrar é o primeiro a sair. Sairão o A e o B, restando apenas o C.', N'FIFO = First In, First Out.', N'["A) Ficheiro A","B) Ficheiro B","C) Ficheiro C","D) A fila ficar\u00E1 vazia"]', 2),
        (572, N'fase22', N'(ENADE - POO) Na Programação Orientada a Objetos, qual é o pilar que permite ocultar os detalhes internos de implementação de uma classe (colocando variáveis como private) e expor apenas os métodos públicos necessários (getters/setters)?', N'Alternativa C: Encapsulamento.

Justificativa: O encapsulamento protege os dados do objeto contra alterações diretas indevidas por parte de outras classes, garantindo a integridade do estado interno.', N'Funciona como uma cápsula de proteção.', N'["A) Heran\u00E7a","B) Polimorfismo","C) Encapsulamento","D) Abstra\u00E7\u00E3o"]', 2),
        (573, N'fase22', N'(ENADE - Bases de Dados) Num modelo relacional, o que caracteriza uma restrição de integridade referencial implementada através de uma Chave Estrangeira (Foreign Key)?', N'Alternativa B: Garante que os valores correspondam a uma Chave Primária noutra tabela.

Justificativa: A Chave Estrangeira impede que se registe um ''Pedido'' para um ''Cliente'' que não existe na base de dados, mantendo a integridade dos dados.', N'Evita registos órfãos.', N'["A) Garante que uma coluna n\u00E3o tenha valores nulos (NOT NULL).","B) Garante que os valores de uma coluna de uma tabela existam como valores de uma chave prim\u00E1ria (PK) noutra tabela relacionada.","C) Garante a ordena\u00E7\u00E3o alfab\u00E9tica das colunas.","D) Impede atualiza\u00E7\u00F5es na base de dados."]', 1),
        (574, N'fase22', N'(ENADE - SQL) Qual comando DML (Data Manipulation Language) do SQL é utilizado para atualizar registos já existentes numa tabela?', N'Alternativa D: UPDATE.

Justificativa: O comando UPDATE altera os dados de uma ou mais linhas existentes. (O ALTER TABLE é um comando DDL usado para alterar a estrutura da tabela, não os dados).', N'Lembre-se da estrutura UPDATE ... SET ... WHERE.', N'["A) ALTER TABLE","B) MODIFY","C) INSERT","D) UPDATE"]', 3),
        (575, N'fase22', N'(ENADE - UML) Qual é a finalidade principal do Diagrama de Sequência na linguagem UML?', N'Alternativa C: Modelar a interação e a troca de mensagens ao longo do tempo.

Justificativa: O diagrama de sequência evidencia a ordem temporal cronológica das interações entre componentes ou atores num determinado cenário.', N'Foco na linha do tempo e nas mensagens (setas).', N'["A) Mostrar a hierarquia de heran\u00E7a entre as classes.","B) Descrever os estados pelos quais um objeto passa durante a sua vida.","C) Modelar a intera\u00E7\u00E3o e a troca de mensagens entre os objetos ao longo do tempo.","D) Estruturar a base de dados do sistema."]', 2),
        (576, N'fase22', N'(ENADE - Estruturas de Dados) Se necessitar de um algoritmo que faça pesquisas extremamente rápidas em grandes conjuntos de dados ordenados, qual estrutura e respetivo algoritmo oferecem complexidade O(log n)?', N'Alternativa C: Árvore Binária de Busca (Busca Binária).

Justificativa: Na busca binária, a cada passo dividimos o conjunto de dados pela metade, o que resulta na eficiência logarítmica O(log n).', N'A cada passo corta o problema pela metade.', N'["A) Fila (Pesquisa Linear)","B) Array n\u00E3o ordenado (Busca Cega)","C) \u00C1rvore Bin\u00E1ria de Busca (Busca Bin\u00E1ria)","D) Pilha (LIFO)"]', 2),
        (577, N'fase22', N'(ENADE - Redes) Numa aplicação cliente-servidor (ex: Streaming de vídeo), onde a velocidade e o envio contínuo são mais importantes que a garantia de entrega de cada pacote, qual protocolo da camada de transporte é preferível utilizar?', N'Alternativa B: UDP.

Justificativa: O UDP não verifica se os pacotes chegaram ao destino (não tem confirmação de entrega - ACK), sendo muito mais rápido e ideal para transmissões em tempo real.', N'Rápido, mas sem confirmação.', N'["A) TCP","B) UDP","C) HTTP","D) FTP"]', 1),
        (578, N'fase22', N'(ENADE - Arquitetura) Qual é a principal característica da arquitetura de Microserviços em comparação com uma arquitetura Monolítica?', N'Alternativa B: Dividir a aplicação em pequenos serviços independentes.

Justificativa: Nos microserviços, cada serviço foca-se numa regra de negócio específica, podendo ser implementado e escalado de forma totalmente isolada.', N'Serviços pequenos e isolados.', N'["A) Partilhar a mesma base de dados para todo o sistema de forma r\u00EDgida.","B) Dividir a aplica\u00E7\u00E3o em pequenos servi\u00E7os independentes que comunicam via APIs.","C) O c\u00F3digo-fonte reside inteiramente num \u00FAnico ficheiro execut\u00E1vel.","D) N\u00E3o \u00E9 compat\u00EDvel com computa\u00E7\u00E3o na nuvem."]', 1),
        (579, N'fase22', N'(ENADE - SO) O que é o processo de ''Swapping'' (troca) gerido pelo Sistema Operativo?', N'Alternativa C: Transferir processos da RAM para o Disco (memória virtual).

Justificativa: Quando a memória RAM fica cheia, o SO move dados inativos para uma área de troca (Swap) no disco rígido, libertando RAM para processos mais urgentes.', N'Cria a ''memória virtual'' no disco.', N'["A) Trocar o processador principal em tempo de execu\u00E7\u00E3o.","B) Substituir o sistema Linux pelo Windows.","C) Transferir processos temporariamente da mem\u00F3ria RAM para o Disco/SSD (mem\u00F3ria virtual) para libertar espa\u00E7o.","D) Efetuar a troca de pacotes de rede pelo router."]', 2),
        (580, N'fase22', N'(ENADE - Criptografia) Numa comunicação com criptografia Assimétrica (Chave Pública/Privada), como a Alice garante que uma mensagem que ela envia para o Bob só poderá ser lida por ele?', N'Alternativa B: Encriptando com a Chave Pública do Bob.

Justificativa: Se a Alice usar a Chave Pública do Bob (que todos conhecem) para encriptar, apenas a Chave Privada do Bob (que só ele possui) conseguirá desencriptar e ler a mensagem.', N'A fechadura é pública, mas a chave é privada.', N'["A) Encriptando com a Chave Privada da Alice.","B) Encriptando com a Chave P\u00FAblica do Bob.","C) Encriptando com a Chave P\u00FAblica da Alice.","D) Encriptando com a Chave Privada do Bob."]', 1),
        (581, N'fase22', N'(ENADE - Web) O que é o modelo DOM (Document Object Model) no desenvolvimento Front-end?', N'Alternativa C: Representação estrutural do documento HTML como árvore de objetos.

Justificativa: O DOM permite que o JavaScript modifique elementos, estilos e eventos da página em tempo real, alterando a estrutura de árvore.', N'A ''árvore'' estrutural do HTML vista pelo JS.', N'["A) Uma base de dados nativa do navegador.","B) Uma linguagem que substitui o HTML.","C) Uma interface de programa\u00E7\u00E3o (API) que representa o documento HTML como uma \u00E1rvore de objetos.","D) Um protocolo de rede."]', 2),
        (582, N'fase22', N'(ENADE - Lógica) O que é a Recursividade na construção de um algoritmo?', N'Alternativa B: Quando uma função chama-se a si mesma.

Justificativa: Algoritmos recursivos resolvem problemas complexos quebrando-os em instâncias menores do próprio problema (ex: cálculo de Fatorial).', N'Uma função que se invoca a si própria.', N'["A) Um loop while infinito.","B) Quando uma fun\u00E7\u00E3o chama-se a si mesma at\u00E9 atingir uma condi\u00E7\u00E3o de paragem.","C) Quando o c\u00F3digo partilha vari\u00E1veis globais.","D) Quando o c\u00F3digo \u00E9 executado num servidor remoto."]', 1),
        (583, N'fase22', N'(ENADE - POO) Qual é a utilidade prática de uma Classe Abstrata na POO?', N'Alternativa A: Servir apenas como modelo para herança.

Justificativa: Uma classe abstrata (ex: ''Animal'') representa um conceito genérico. Não se cria um ''Animal'' direto, mas sim instâncias concretas das filhas (''Cão'', ''Gato'').', N'Não permite usar o operador ''new'' diretamente nela.', N'["A) Evitar que a classe seja instanciada diretamente, servindo apenas como modelo (superclasse) para as suas classes filhas.","B) For\u00E7ar que todos os seus m\u00E9todos estejam vazios (como numa Interface).","C) Esconder o c\u00F3digo-fonte num ficheiro DLL fechado.","D) Substituir o uso de vari\u00E1veis locais no escopo."]', 0),
        (584, N'fase22', N'(ENADE - Segurança) Um atacante envia um link manipulado para a vítima. Quando a vítima clica no link, estando autenticada no site do banco, o código faz uma transferência indesejada. Este ataque é o:', N'Alternativa C: CSRF (Falsificação de Pedido Entre Sites).

Justificativa: No CSRF, o atacante usa a sessão válida (os cookies de login) do utilizador para executar ações indesejadas no servidor de destino.', N'Falsifica uma ação do próprio utilizador autenticado.', N'["A) SQL Injection","B) Cross-Site Scripting (XSS)","C) Cross-Site Request Forgery (CSRF)","D) Buffer Overflow"]', 2),
        (585, N'fase22', N'(ENADE - Redes) O que diferencia o protocolo HTTPS do protocolo HTTP padrão?', N'Alternativa B: O HTTPS utiliza encriptação SSL/TLS.

Justificativa: O ''S'' (Secure) garante que toda a comunicação entre o cliente e o servidor esteja encriptada, impedindo a interceção de dados em texto claro.', N'O cadeado no navegador.', N'["A) O HTTPS \u00E9 mais r\u00E1pido para v\u00EDdeo.","B) O HTTPS utiliza uma camada adicional de seguran\u00E7a (SSL/TLS) para encriptar os dados.","C) O HTTPS n\u00E3o exige servidor web.","D) O HTTPS usa o UDP em vez do TCP."]', 1),
        (586, N'fase22', N'(ENADE - ACID) A respeito das transações em Bases de Dados Relacionais, o que garante a propriedade da ''Atomicidade''?', N'Alternativa A: Tudo ou nada na transação.

Justificativa: Se no meio de uma transferência o sistema for abaixo, a atomicidade garante o ROLLBACK, revertendo toda a operação para que os dados não fiquem inconsistentes.', N'Ação indestrutível, executa tudo ou não executa nada.', N'["A) A transa\u00E7\u00E3o ser\u00E1 executada inteiramente com sucesso, ou falhar\u00E1 totalmente (tudo ou nada).","B) O sistema volta sempre \u00E0 vers\u00E3o original do dia anterior.","C) Duas transa\u00E7\u00F5es n\u00E3o afetam a mesma tabela.","D) Os dados s\u00E3o salvos em m\u00FAltiplos discos simultaneamente."]', 0),
        (587, N'fase22', N'(ENADE - API REST) Qual o método HTTP utilizado especificamente para solicitar a *atualização completa* de um recurso no servidor?', N'Alternativa A: PUT.

Justificativa: O PUT é usado para substituir completamente um recurso existente. O PATCH é usado quando se deseja atualizar apenas uma parte (atualização parcial) do recurso.', N'Substitui todo o objeto.', N'["A) PUT","B) GET","C) PATCH","D) DELETE"]', 0),
        (588, N'fase22', N'(ENADE - Design Patterns) O Padrão de Projeto ''Singleton'' é categorizado como um padrão de Criação. Qual é a sua finalidade no código?', N'Alternativa B: Garantir uma única instância global da classe.

Justificativa: Singleton é muito usado para gerir conexões com a base de dados, onde ter várias instâncias ativas gastaria memória desnecessária.', N'Single (Uma única instância).', N'["A) Criar m\u00FAltiplas inst\u00E2ncias din\u00E2micas de uma classe.","B) Garantir que uma classe tenha uma \u00FAnica inst\u00E2ncia em todo o sistema e fornecer um ponto global de acesso a ela.","C) Ocultar a complexidade de cria\u00E7\u00E3o sob uma Interface.","D) Criar fam\u00EDlias de objetos inter-relacionados."]', 1),
        (589, N'fase22', N'(ENADE - Git) Num fluxo de trabalho usando Git, o que o comando ''git commit'' executa?', N'Alternativa C: Guarda o estado atual no repositório LOCAL.

Justificativa: O comando commit regista as alterações no histórico da máquina do utilizador. Para enviar para a nuvem, usa-se o git push.', N'Grava a versão localmente.', N'["A) Envia o c\u00F3digo para a nuvem no GitHub.","B) Cria uma c\u00F3pia do projeto.","C) Guarda um snapshot do estado atual dos ficheiros modificados no reposit\u00F3rio LOCAL do desenvolvedor.","D) Apaga o hist\u00F3rico."]', 2),
        (590, N'fase22', N'(ENADE - Algoritmos) Qual é a finalidade principal do algoritmo de ordenação ''Bubble Sort''?', N'Alternativa B: Percorrer listas e trocar pares vizinhos até ordenar.

Justificativa: O Bubble Sort é o algoritmo de ordenação mais simples e menos eficiente O(n²). O maior valor ''borbulha'' para a extremidade a cada ciclo.', N'Como bolhas a flutuar num copo.', N'["A) Compactar ficheiros ZIP.","B) Percorrer uma lista, comparando pares vizinhos e trocando de posi\u00E7\u00E3o se estiverem fora de ordem, at\u00E9 que o maior flutue para o final.","C) Pesquisar a palavra mais longa num texto.","D) Criar matrizes multidimensionais vazias."]', 1),
        (591, N'fase22', N'(ENADE - Bases de Dados) O que significa a operação de ''Normalização'' aplicada a um esquema de base de dados relacional?', N'Alternativa C: Eliminar anomalias e reduzir a redundância.

Justificativa: A normalização (1FN, 2FN, 3FN) garante que não haverá inconsistências (ex: ter duas moradas diferentes para a mesma pessoa) isolando dados repetidos.', N'Regras para organizar tabelas sem repetições.', N'["A) Aumentar propositadamente a redund\u00E2ncia para tornar as pesquisas r\u00E1pidas.","B) Aumentar os tipos de dados permitidos.","C) Reestruturar as tabelas para eliminar anomalias de atualiza\u00E7\u00E3o, inser\u00E7\u00E3o e reduzir a redund\u00E2ncia de dados.","D) Traduzir a base de dados para ORM."]', 2),
        (592, N'fase22', N'(ENADE - Sistemas Distribuídos) O que dita o Teorema CAP focado em Bases de Dados NoSQL e Sistemas Distribuídos?', N'Alternativa B: Impossível garantir as 3 propriedades simultaneamente (C, A e P).

Justificativa: Num cluster, em caso de falha de rede (Partição), deve-se escolher se paralisa o sistema para manter a Consistência ou se permite gravações para manter a Disponibilidade.', N'Escolha apenas duas de três.', N'["A) Que n\u00E3o se pode ter uma rede sem routers.","B) Que \u00E9 imposs\u00EDvel fornecer simultaneamente as tr\u00EAs garantias: Consist\u00EAncia (C), Disponibilidade (A) e Toler\u00E2ncia a Parti\u00E7\u00E3o (P). S\u00F3 se escolhe duas.","C) Que toda a base distribu\u00EDda deve usar SQL.","D) Que backups evitam qualquer falha de hardware."]', 1),
        (593, N'fase22', N'(ENADE - Cloud) O que caracteriza a ''Escalabilidade Horizontal'' numa infraestrutura Web em comparação com a Vertical?', N'Alternativa B: Adicionar mais servidores e dividir o tráfego com Load Balancer.

Justificativa: A escalabilidade vertical (Scale-up) aumenta o poder da própria máquina. A horizontal (Scale-out) resolve a alta procura colocando mais máquinas a trabalhar em equipa.', N'Mais máquinas lado a lado = Horizontal.', N'["A) Aumentar a CPU e a RAM do mesmo servidor existente.","B) Adicionar mais servidores \u00E0 arquitetura e dividir o tr\u00E1fego (Load Balancer) entre eles.","C) Aumento da largura de banda do provedor.","D) Mover o sistema on-premises para a nuvem."]', 1),
        (594, N'fase22', N'(ENADE - C) Na linguagem C, qual o grande problema causado quando o programador aloca memória dinamicamente usando malloc() e esquece de a libertar com free()?', N'Alternativa B: Memory Leak (Fuga de Memória).

Justificativa: O sistema operativo perde a referência dessa alocação, mas não a liberta. Se ocorrer repetidamente, o computador fica sem memória RAM disponível e crasha.', N'Fuga contínua de memória RAM.', N'["A) Stack Overflow (Estouro da Pilha).","B) Memory Leak (Fuga de Mem\u00F3ria).","C) Null Pointer Exception.","D) Loop Infinito."]', 1),
        (595, N'fase22', N'(ENADE - Engenharia de Software) Qual é o objetivo do padrão arquitetural MVC (Model-View-Controller)?', N'Alternativa B: Separar dados, interface e controlo lógico.

Justificativa: O MVC promove a separação de preocupações (Separation of Concerns), tornando o código mais modular, fácil de testar e de manter.', N'Separa o ecrã da lógica.', N'["A) Aumentar o acoplamento do sistema.","B) Separar a representa\u00E7\u00E3o da informa\u00E7\u00E3o (dados), a intera\u00E7\u00E3o do utilizador (interface) e o controlo l\u00F3gico em tr\u00EAs componentes interligados.","C) Juntar todo o c\u00F3digo num \u00FAnico ficheiro JavaScript.","D) Substituir a necessidade de uma base de dados."]', 1),
        (596, N'fase22', N'(ENADE - POO) A técnica em que duas ou mais funções da mesma classe têm o mesmo nome, mas diferem no número ou tipo dos seus parâmetros, chama-se:', N'Alternativa B: Sobrecarga (Overloading).

Justificativa: A sobrecarga de métodos ocorre em tempo de compilação. Permite criar métodos com o mesmo nome (ex: calcularArea(int lado) e calcularArea(int base, int altura)) na mesma classe.', N'Mesmo nome, assinaturas diferentes.', N'["A) Sobrescrita (Overriding)","B) Sobrecarga (Overloading)","C) Abstra\u00E7\u00E3o","D) Interface"]', 1),
        (597, N'fase22', N'(ENADE - Bases de Dados) Numa tabela de base de dados relacional, uma chave primária (Primary Key) composta é formada por:', N'Alternativa B: Dois ou mais atributos combinados.

Justificativa: Quando uma única coluna não é suficiente para garantir a exclusividade do registo (ex: ID_Aluno e ID_Disciplina numa tabela de matrículas), utiliza-se a junção das colunas como Chave Primária Composta.', N'Combinação de duas ou mais colunas.', N'["A) Apenas um atributo num\u00E9rico e autoincremental.","B) Dois ou mais atributos que, combinados, identificam unicamente uma linha na tabela.","C) Uma chave que faz refer\u00EAncia a outra tabela externa.","D) Uma chave que permite valores nulos."]', 1),
        (598, N'fase22', N'(ENADE - Estruturas de Dados) Numa estrutura do tipo Pilha (Stack), as operações clássicas de inserção e remoção são conhecidas, respetivamente, como:', N'Alternativa C: Push e Pop.

Justificativa: Numa Pilha (LIFO - Last In, First Out), a operação de empilhar um item no topo chama-se ''Push'', e a operação de retirar o item do topo chama-se ''Pop''.', N'Empurrar e Estourar.', N'["A) Enqueue e Dequeue","B) Insert e Delete","C) Push e Pop","D) Add e Remove"]', 2),
        (599, N'fase22', N'(ENADE - Lógica) Numa expressão condicional, o operador lógico ''XOR'' (OU Exclusivo) retorna VERDADEIRO apenas quando:', N'Alternativa C: Apenas uma das proposições é verdadeira, e a outra é falsa.

Justificativa: O XOR (Exclusive OR) exige que as entradas sejam diferentes para ser verdadeiro. Se ambas forem iguais (True/True ou False/False), o resultado é falso.', N'Um ou outro, mas não os dois.', N'["A) Ambas as proposi\u00E7\u00F5es s\u00E3o verdadeiras.","B) Ambas as proposi\u00E7\u00F5es s\u00E3o falsas.","C) Apenas uma das proposi\u00E7\u00F5es \u00E9 verdadeira, e a outra \u00E9 falsa.","D) O valor \u00E9 nulo."]', 2),
        (600, N'fase22', N'(ENADE - SQL) A cláusula GROUP BY no SQL é geralmente utilizada em conjunto com:', N'Alternativa B: Funções de agregação.

Justificativa: O GROUP BY serve para agrupar linhas que têm os mesmos valores em colunas de resumo, permitindo calcular médias, somas ou totais por grupo (ex: COUNT(*) de utilizadores agrupados por País).', N'Agrupa para somar ou contar.', N'["A) Comandos INSERT e UPDATE.","B) Fun\u00E7\u00F5es de agrega\u00E7\u00E3o (como SUM, AVG, COUNT, MAX, MIN).","C) Comandos de cria\u00E7\u00E3o de tabelas (CREATE TABLE).","D) Cl\u00E1usulas LIMIT e OFFSET exclusivamente."]', 1);
    INSERT INTO flashcards (id, codigo_fase, frente, verso, dica, opcoes, correta) VALUES
        (601, N'fase22', N'(ENADE - Engenharia de Software) Qual é o modelo de ciclo de vida de software que se caracteriza por uma progressão estrita e linear através de fases (Requisitos, Design, Implementação, Testes, Manutenção) sem possibilidade de retorno natural à fase anterior?', N'Alternativa C: Modelo Cascata (Waterfall).

Justificativa: O modelo em cascata é sequencial e rígido. Uma nova fase só começa quando a anterior termina totalmente, sendo difícil e dispendioso acomodar mudanças de requisitos no meio do projeto.', N'A água só cai, não sobe.', N'["A) Modelo \u00C1gil (Scrum)","B) Modelo em Espiral","C) Modelo Cascata (Waterfall)","D) Modelo Prototipagem"]', 2),
        (602, N'fase22', N'(ENADE - DevOps) Na terminologia de contentorização (ex: Docker), o que é uma ''Imagem'' (Image)?', N'Alternativa B: Um template read-only contendo as dependências para rodar a app.

Justificativa: A Imagem é o ''molde'' estático. Quando executamos uma Imagem no Docker, ela torna-se um Contentor (Container) vivo e em execução.', N'É a ''receita de bolo'' do contentor.', N'["A) Uma fotografia JPEG do layout do site.","B) Um template apenas de leitura (read-only) que cont\u00E9m o SO, bibliotecas e o c\u00F3digo-fonte necess\u00E1rio para executar a aplica\u00E7\u00E3o num contentor.","C) O disco r\u00EDgido f\u00EDsico onde os dados s\u00E3o salvos permanentemente.","D) Um servi\u00E7o de hospedagem na AWS."]', 1),
        (603, N'fase22', N'(ENADE - Sistemas Operativos) O conceito de ''Multithreading'' refere-se à:', N'Alternativa B: Múltiplas linhas de execução paralelas.

Justificativa: O Multithreading permite que a aplicação faça várias tarefas ao mesmo tempo (ex: um jogo carrega o som numa thread enquanto processa a física noutra), otimizando o uso do processador.', N'Processamento simultâneo.', N'["A) Capacidade de ligar v\u00E1rios monitores ao computador.","B) Capacidade de um programa se dividir em m\u00FAltiplas threads (linhas de execu\u00E7\u00E3o) que podem ser processadas em paralelo pelo CPU.","C) Transfer\u00EAncia de ficheiros pesados via FTP.","D) Instala\u00E7\u00E3o de m\u00FAltiplos sistemas operativos no mesmo disco."]', 1),
        (604, N'fase22', N'(ENADE - Web) No desenvolvimento web, o que são as sessões armazenadas nos Cookies ou no Local Storage do navegador?', N'Alternativa B: Dados armazenados no cliente para manter o estado.

Justificativa: Como o HTTP é ''sem estado'' (não lembra da última requisição), os cookies e o Local Storage guardam os tokens de autenticação (ex: JWT) para manter o utilizador ''logado''.', N'Memória do navegador.', N'["A) Ficheiros de v\u00EDdeo em cache.","B) Pequenos fragmentos de dados armazenados no cliente (navegador) para manter o estado da aplica\u00E7\u00E3o e identificar o utilizador entre as requisi\u00E7\u00F5es HTTP (que s\u00E3o stateless).","C) Componentes do servidor de base de dados MySQL.","D) Um protocolo de encripta\u00E7\u00E3o de senhas."]', 1),
        (605, N'fase22', N'(ENADE - Segurança) O que caracteriza um ataque do tipo ''SQL Injection'' (Injeção de SQL)?', N'Alternativa B: Inserir instruções SQL maliciosas em campos de input.

Justificativa: Ocorre quando a aplicação não filtra/higieniza os dados do utilizador. O atacante pode enviar algo como `'' OR 1=1 --` num campo de login para aceder ao sistema sem password.', N'Input malicioso que engana a base de dados.', N'["A) Inserir um cabo de rede n\u00E3o autorizado no servidor.","B) Explorar vulnerabilidades numa aplica\u00E7\u00E3o inserindo instru\u00E7\u00F5es SQL maliciosas nos campos de input (formul\u00E1rios) para manipular ou destruir a base de dados.","C) Quando o banco de dados desliga por sobrecarga de mem\u00F3ria.","D) Interce\u00E7\u00E3o de pacotes na rede Wi-Fi aberta."]', 1),
        (606, N'fase22', N'(ENADE - Redes) O Modelo OSI é um padrão de referência para interligação de sistemas abertos. É composto por quantas camadas lógicas?', N'Alternativa C: 7 camadas.

Justificativa: O Modelo OSI tem 7 camadas: Física, Enlace (Dados), Rede, Transporte, Sessão, Apresentação e Aplicação. O modelo TCP/IP, mais prático, é que condensa estas em apenas 4 camadas.', N'F-E-R-T-S-A-A.', N'["A) 4 camadas","B) 5 camadas","C) 7 camadas","D) 9 camadas"]', 2),
        (607, N'fase22', N'(ENADE - POO) A que conceito de POO se refere a afirmação: ''As subclasses podem fornecer a sua própria implementação específica para um método que já foi definido na superclasse''?', N'Alternativa B: Sobrescrita (Overriding).

Justificativa: A sobrescrita ocorre em tempo de execução quando uma classe herda de outra e redefine (altera o bloco de código) de um método existente no pai (ex: @Override no Java/C#).', N'A mesma assinatura, comportamento redefinido.', N'["A) Construtor","B) Sobrescrita (Overriding)","C) Sobrecarga (Overloading)","D) Interface"]', 1),
        (608, N'fase22', N'(ENADE - Arquitetura REST) Uma API RESTful deve ser ''Stateless'' (Sem Estado). O que isto significa obrigatoriamente?', N'Alternativa B: Cada requisição contém toda a informação necessária.

Justificativa: O servidor não guarda quem está ''logado''. O cliente envia um token (como o JWT) no cabeçalho (Header) de TODAS as requisições para provar quem é.', N'O servidor não tem memória da requisição passada.', N'["A) Que n\u00E3o pode usar base de dados.","B) Que cada requisi\u00E7\u00E3o do cliente para o servidor deve conter todas as informa\u00E7\u00F5es necess\u00E1rias para ser compreendida e processada, sem depender de contextos salvos no servidor.","C) Que o servidor deve gravar a sess\u00E3o do cliente na mem\u00F3ria RAM.","D) Que o formato de resposta tem de ser em XML."]', 1),
        (609, N'fase22', N'(ENADE - Lógica) Numa tabela de verdade para o operador lógico ''AND'' (E), se tivermos as variáveis A (Verdadeiro), B (Falso) e C (Verdadeiro), qual será o resultado da expressão A AND B AND C?', N'Alternativa B: Falso.

Justificativa: O operador AND lógico só retorna Verdadeiro se TODAS as condições fornecidas forem Verdadeiras. Como a variável B é Falsa, toda a expressão se torna Falsa.', N'AND exige perfeição (todos verdadeiros).', N'["A) Verdadeiro","B) Falso","C) Null","D) Ocorre um erro de compila\u00E7\u00E3o."]', 1),
        (610, N'fase22', N'(ENADE - Algoritmos) Qual é a técnica de otimização de algoritmos (frequentemente usada junto com recursividade) que consiste em guardar os resultados de cálculos pesados já processados num cache/tabela para evitar reprocessamento futuro?', N'Alternativa B: Memoization (Programação Dinâmica).

Justificativa: Memoization é o ato de memorizar a saída de uma função cara. Na sequência de Fibonacci recursiva, sem Memoization a árvore de chamadas cresce exponencialmente (repetindo cálculos iguais).', N'Memorizar o que já foi calculado.', N'["A) Backtracking","B) Memoization (Programa\u00E7\u00E3o Din\u00E2mica)","C) Algoritmo Guloso (Greedy)","D) Ordena\u00E7\u00E3o por inser\u00E7\u00E3o"]', 1),
        (611, N'fase22', N'(ENADE - Criptografia) O algoritmo de Hash (como SHA-256 ou MD5) possui uma característica fundamental que o difere da Criptografia padrão (como AES ou RSA). Qual é essa característica?', N'Alternativa B: É de mão única (One-way), não tem reversão.

Justificativa: Criptografia serve para encriptar e depois desencriptar. O Hash destrói a string original e cria uma ''impressão digital''. É assim que as palavras-passe são guardadas com segurança no banco de dados.', N'Pode transformar a carne na salsicha, mas não a salsicha na carne.', N'["A) O Hash \u00E9 utilizado para encriptar ficheiros grandes em formato zip.","B) O Hash \u00E9 uma via de m\u00E3o \u00FAnica (One-way): \u00E9 imposs\u00EDvel (ou invi\u00E1vel computacionalmente) reverter o c\u00F3digo gerado de volta para a palavra original.","C) O Hash necessita sempre de uma chave p\u00FAblica para ser lido.","D) O Hash s\u00F3 aceita n\u00FAmeros inteiros como entrada."]', 1),
        (612, N'fase22', N'(ENADE - Cloud) Em provedores de nuvem (AWS, Azure, GCP), o conceito de ''Elasticidade'' refere-se à capacidade do sistema de:', N'Alternativa B: Aumentar e diminuir recursos automaticamente com a procura.

Justificativa: A elasticidade é o que permite a um e-commerce manter-se online na Black Friday (alugando mais servidores por algumas horas) e reduzir os custos na semana seguinte.', N'Estica e encolhe como um elástico.', N'["A) Alterar a cor da interface dependendo do fuso hor\u00E1rio do utilizador.","B) Aumentar (Scale-out) ou diminuir (Scale-in) automaticamente e de forma din\u00E2mica os recursos de infraestrutura com base na procura em tempo real.","C) Compactar o tamanho do banco de dados relacional.","D) Impedir ataques DDoS bloqueando IPs asi\u00E1ticos."]', 1),
        (613, N'fase22', N'(ENADE - Mobile) Qual é a principal diferença entre criar uma aplicação Mobile Nativa e uma aplicação Cross-Platform (Híbrida)?', N'Alternativa C: A Cross-Platform usa uma base de código única para ambos os sistemas operativos.

Justificativa: Aplicações nativas têm o melhor desempenho e integração, mas exigem duas equipas (Android e iOS). Frameworks híbridos ganham em produtividade e tempo de lançamento.', N'Nativa = Código diferente. Híbrida = Código único.', N'["A) A Nativa s\u00F3 funciona offline. A H\u00EDbrida precisa de internet.","B) A Nativa utiliza o GPS. A H\u00EDbrida n\u00E3o tem acesso ao hardware.","C) A Nativa exige c\u00F3digos separados para Android (Kotlin/Java) e iOS (Swift/Objective-C). A Cross-Platform (ex: React Native, Flutter) gera ambos a partir de uma base de c\u00F3digo \u00FAnica.","D) N\u00E3o existem diferen\u00E7as estruturais."]', 2),
        (614, N'fase22', N'(ENADE - Banco de Dados) O que faz o comando JOIN da cláusula LEFT OUTER JOIN (ou LEFT JOIN) no SQL?', N'Alternativa B: Retorna todos da esquerda, independentemente da correspondência na direita.

Justificativa: O LEFT JOIN é essencial quando queremos listar, por exemplo, todos os ''Clientes'' e os seus ''Pedidos'', incluindo na lista os clientes que ainda não fizeram nenhum pedido (NULL).', N'Prioriza a tabela da Esquerda.', N'["A) Retorna apenas os registos que t\u00EAm correspond\u00EAncia nas duas tabelas.","B) Retorna todos os registos da tabela da ESQUERDA, e apenas as correspond\u00EAncias da tabela da direita. Se n\u00E3o houver correspond\u00EAncia, preenche com NULL.","C) Apaga as linhas duplicadas do lado esquerdo.","D) Multiplica todos os registos (Produto Cartesiano)."]', 1),
        (615, N'fase22', N'(ENADE - Segurança) O que significa aplicar o princípio do ''Menor Privilégio'' (Least Privilege) num sistema operativo ou base de dados?', N'Alternativa B: Fornecer apenas as permissões estritamente necessárias.

Justificativa: É uma regra de ouro em segurança cibernética. Se a conta de um funcionário comum for pirateada, o atacante não conseguirá eliminar a base de dados central, pois a conta não tem esse privilégio.', N'Só dê a chave da porta que a pessoa precisa de abrir.', N'["A) Dar acesso total de Admin a todos para evitar bloqueios de trabalho.","B) Fornecer a cada utilizador ou programa apenas as permiss\u00F5es e acessos estritamente necess\u00E1rios para realizar as suas tarefas, e nada mais.","C) Remover as permiss\u00F5es de quem ganha o menor sal\u00E1rio.","D) Cobrar menos por assinaturas de software b\u00E1sicas."]', 1),
        (616, N'fase22', N'(ENADE - Eng. de Requisitos) No desenvolvimento de software, os ''Diagramas de Casos de Uso'' são utilizados primariamente durante qual fase do ciclo de vida?', N'Alternativa C: Levantamento e Análise de Requisitos.

Justificativa: Os Casos de Uso (da UML) são ferramentas visuais para traduzir as necessidades do negócio e as interações entre os atores (utilizadores) e o sistema, antes de a equipa começar a programar.', N'É o planeamento antes do código.', N'["A) Manuten\u00E7\u00E3o e Evolu\u00E7\u00E3o","B) Testes de Integra\u00E7\u00E3o e Deployment","C) Levantamento e An\u00E1lise de Requisitos","D) Refatora\u00E7\u00E3o de C\u00F3digo"]', 2),
        (617, N'fase22', N'(ENADE - Versionamento) No Git, se um desenvolvedor quiser criar um caminho isolado para desenvolver uma nova funcionalidade sem interferir com o código principal, qual comando deverá usar?', N'Alternativa B: git branch.

Justificativa: O comando branch cria uma ''ramificação''. Isto permite que o programador crie código isoladamente numa ramificação de testes, e só faça a junção (merge) com a ramificação principal (main) após ter a certeza que o código funciona.', N'Cria um ramo (branch) isolado.', N'["A) git clone","B) git branch","C) git log","D) git rm"]', 1),
        (618, N'fase22', N'(ENADE - Design de Interface) No CSS, utilizando o modelo Flexbox (display: flex), qual propriedade é utilizada para alinhar os itens horizontalmente ao longo do eixo principal?', N'Alternativa C: justify-content.

Justificativa: A propriedade `justify-content` lida com o alinhamento no eixo principal (que por padrão é o horizontal, da esquerda para a direita). O `align-items` faz o alinhamento no eixo transversal (vertical).', N'Justifica o conteúdo na linha.', N'["A) align-items","B) flex-direction","C) justify-content","D) float: left"]', 2),
        (619, N'fase22', N'(ENADE - Web) Numa API REST desenvolvida em NodeJS ou C#, se o cliente envia dados sigilosos, como uma palavra-passe, no corpo (body) de um formulário. Qual método HTTP está a ser utilizado?', N'Alternativa C: POST.

Justificativa: O verbo POST é usado para enviar dados sensíveis ou longos contidos no corpo (body) da requisição. O método GET anexa os dados no URL (na barra de endereço), o que expõe a password publicamente.', N'O GET mostra no URL, o POST oculta no Corpo.', N'["A) GET","B) OPTIONS","C) POST","D) HEAD"]', 2),
        (620, N'fase22', N'(ENADE - Eng. de Software) O padrão de arquitetura SOLID traz princípios para a programação orientada a objetos. O ''S'' (Single Responsibility Principle) diz que:', N'Alternativa B: Uma classe deve ter apenas uma responsabilidade.

Justificativa: O Princípio da Responsabilidade Única evita a criação de ''Classes Deus'' (classes gigantes que fazem de tudo: enviam email, guardam no banco, desenham a interface). Classes pequenas e focadas evitam bugs.', N'Princípio da Responsabilidade Única.', N'["A) O sistema deve rodar num servidor \u00FAnico.","B) Uma classe deve ter uma, e apenas uma, raz\u00E3o para mudar (uma \u00FAnica responsabilidade).","C) S\u00F3 pode existir uma heran\u00E7a por classe.","D) O c\u00F3digo deve ser escrito por um \u00FAnico programador."]', 1),
        (621, N'fase23', N'O que é o ENADE?', N'O Exame Nacional de Desempenho dos Estudantes, aplicado pelo INEP. Ele avalia os cursos de graduação e, para o estudante convocado, é obrigatório: quem não faz fica com pendência para receber o diploma.', N'Quem aplica é o INEP.', NULL, NULL),
        (622, N'fase23', N'Como a prova do ENADE é dividida?', N'40 questões em 4 horas:
• Formação Geral: 2 discursivas + 8 objetivas.
• Componente Específico (ADS): 3 discursivas + 27 objetivas.
No fim há ainda um questionário de percepção da prova, que não vale nota.', N'10 de Formação Geral + 30 específicas.', NULL, NULL),
        (623, N'fase23', N'Quanto vale cada parte do ENADE?', N'Formação Geral vale 25% da nota e Componente Específico, 75%.
Dentro da Formação Geral: discursivas 40% e objetivas 60%.
Dentro do Específico: discursivas 15% e objetivas 85%.', N'As objetivas específicas são a maior parte da nota.', NULL, NULL),
        (624, N'fase23', N'Como são as questões discursivas do ENADE?', N'Cada resposta tem no máximo 15 linhas. Na Formação Geral, pedem um texto argumentativo com proposta (2021: arte, cultura e censura; cidades inteligentes). No Específico de ADS caíram código em pseudocódigo (fila, lista encadeada, média de valores) e diagrama de classes.', N'15 linhas, sem passar do espaço.', NULL, NULL),
        (625, N'fase23', N'Como resolver uma questão do tipo "avalie as afirmações"?', N'Julgue cada afirmação sozinha (V ou F) e anote. Depois procure a alternativa com exatamente as verdadeiras. Achou uma falsa com certeza? Elimine todas as alternativas que a incluem.', N'Eliminar alternativas economiza tempo.', NULL, NULL),
        (626, N'fase23', N'Como resolver uma questão de asserção-razão ("I PORQUE II")?', N'1º veja se I é verdadeira. 2º veja se II é verdadeira. 3º só se as duas forem, pergunte se II explica I. Se uma for falsa, a relação nem importa.', N'Julgue as duas antes da relação.', NULL, NULL),
        (627, N'fase23', N'Qual a diferença entre requisito funcional e não funcional?', N'Funcional diz O QUE o sistema faz ("emitir relatório de compras"). Não funcional diz COMO ou com que restrição ("responder em até 2 segundos", "rodar no Linux", "ficar pronto em 6 meses").', N'Caiu em 2017 (Q12) e 2021 (Q09).', NULL, NULL),
        (628, N'fase23', N'Quais são os tipos de requisito não funcional?', N'Desempenho (tempo de resposta), usabilidade (facilidade de aprender e usar, acessibilidade), portabilidade (trocar de sistema operacional), segurança (controle de acesso) e confiabilidade (funcionar sem falhas).', N'Confiabilidade não é tempo de resposta.', NULL, NULL),
        (629, N'fase23', N'Quais são os subprocessos da engenharia de requisitos?', N'Estudo de viabilidade, elicitação (ex.: entrevista com usuários), especificação (ex.: casos de uso dos requisitos funcionais) e validação (ex.: protótipo de telas).', N'Caso de uso modela requisito funcional.', NULL, NULL),
        (630, N'fase23', N'O que é o caminho crítico de um projeto?', N'A sequência de atividades com a maior duração total. Se qualquer atividade dele atrasar, o projeto inteiro atrasa. Para achar: some as durações de cada caminho e pegue o maior.', N'Some todos os caminhos.', NULL, NULL),
        (631, N'fase23', N'Quais são os tipos de manutenção de software?', N'Corretiva: conserta defeito.
Adaptativa: ajusta a um ambiente novo (outro SO, nova lei).
Evolutiva/perfectiva: acrescenta ou melhora funções (ex.: um relatório novo).
Preventiva: evita problemas futuros.', N'Relatório novo = evolutiva.', NULL, NULL),
        (632, N'fase23', N'Quando usar cascata, incremental, espiral e RAD?', N'Cascata: requisitos estáveis, fases em sequência (lida mal com mudanças).
Incremental: entrega o sistema em partes.
Espiral: projetos grandes e arriscados, com análise de risco no planejamento.
RAD: prazo muito curto.', N'Urgência pede incremental ou RAD.', NULL, NULL),
        (633, N'fase23', N'No Scrum, quem gerencia o Product Backlog?', N'O Product Owner. O Scrum Master cuida do processo e remove impedimentos; os desenvolvedores constroem o incremento.', N'Pegadinha clássica: não é o Scrum Master.', NULL, NULL),
        (634, N'fase23', N'O que caracteriza a XP (eXtreme Programming)?', N'Foco na qualidade do código: testes automatizados escritos antes do código (TDD), programação em par, integração contínua e entregas pequenas e frequentes.', N'Teste antes do código = TDD.', NULL, NULL),
        (635, N'fase23', N'Quais são as tarefas da gerência de configuração de software?', N'Identificação dos itens de configuração, controle de versão, controle de alterações, auditoria de configuração e relatório de status. Ela começa junto com o projeto, não depois da entrega.', N'São cinco tarefas.', NULL, NULL),
        (636, N'fase23', N'No controle de versão, para que servem checkout, branch, merge e tag?', N'Checkout: baixa os arquivos do repositório.
Branch: ramo separado para uma mudança grande.
Merge: junta versões e resolve conflitos.
Tag: marca uma versão (release); não resolve conflito.', N'Conflito se resolve com merge.', NULL, NULL),
        (637, N'fase23', N'Qual a diferença entre teste caixa-branca e caixa-preta?', N'Caixa-branca olha a estrutura interna do código (caminhos, condições). Caixa-preta olha só entradas e saídas, sem ver o código (ex.: testar em vários navegadores).', N'Branca = vê o código.', NULL, NULL),
        (638, N'fase23', N'O que são teste unitário, de carga, alfa e de aceitação?', N'Unitário: testa um método ou classe isolado.
Carga: vê se aguenta o volume (ex.: 100 pedidos simultâneos).
Alfa: o usuário testa no ambiente do desenvolvedor, supervisionado (o beta é no ambiente do usuário).
Aceitação: o cliente confirma que é o que pediu.', N'Alfa = com os desenvolvedores por perto.', NULL, NULL),
        (639, N'fase23', N'O que é o CMMI?', N'Um modelo de maturidade de processos: a empresa sobe de nível cumprindo metas de processo, até chegar à melhoria contínua. É pesado e voltado a organizações maiores; no Brasil, o MPS.BR foi pensado para pequenas e médias.', N'Maturidade = processo estável e institucionalizado.', NULL, NULL),
        (640, N'fase23', N'Em casos de uso, qual a diferença entre <<include>> e <<extend>>?', N'<<include>>: o comportamento incluído SEMPRE acontece (obrigatório).
<<extend>>: acontece só em certa condição (opcional), como "matrícula fora do prazo".
Generalização: formas diferentes de fazer a mesma coisa (validar por retina ou por digital).', N'Include obrigatório, extend opcional.', NULL, NULL),
        (641, N'fase23', N'Como ler as multiplicidades 1, 0..1, 0..* e 1..* na UML?', N'1: exatamente um. 0..1: no máximo um, pode não ter. 0..*: zero ou muitos. 1..*: pelo menos um, sem limite. Um lado 1..* pede uma coleção (lista) no código, não um atributo simples.', N'1..* não tem limite superior.', NULL, NULL),
        (642, N'fase23', N'O que indica o losango cheio num diagrama de classes?', N'Composição: a parte depende do todo e não existe sem ele. O losango vazio é agregação, um vínculo mais fraco.', N'Cheio = composição.', NULL, NULL),
        (643, N'fase23', N'O que é o padrão de projeto Strategy?', N'Uma família de algoritmos com a mesma interface, que podem ser trocados em tempo de execução trocando o objeto usado (ex.: modo comum e modo probabilista de uma calculadora). Princípio: programar para uma interface.', N'Não confunda com Adapter, que converte interfaces.', NULL, NULL),
        (644, N'fase23', N'Pode criar um vetor de uma classe abstrata em Java?', N'Pode: Impressora imp[] = new Impressora[3] cria só o vetor. O que não pode é new Impressora(). Cada posição recebe um objeto concreto, e imp[i].imprimir() chama a versão de cada classe: polimorfismo.', N'Vetor do tipo abstrato compila.', NULL, NULL),
        (645, N'fase23', N'Como funcionam a pilha e a fila?', N'Pilha é LIFO: push empilha, pop tira o topo, top só lê.
Fila é FIFO: enqueue entra no fim, dequeue sai do início.
No push de uma pilha encadeada: novo.prox = topo; topo = novo.', N'top() não remove nada.', NULL, NULL),
        (646, N'fase23', N'Quais são os percursos de uma árvore binária?', N'Pré-ordem: raiz, esquerda, direita.
Em-ordem: esquerda, raiz, direita (numa árvore de busca, sai ordenado).
Pós-ordem: esquerda, direita, raiz.', N'O nome diz quando a raiz é visitada.', NULL, NULL),
        (647, N'fase23', N'Como funciona a ordenação por inserção?', N'Pega cada elemento e o encaixa na parte já ordenada, empurrando os maiores uma casa para a direita (vetor[j + 1] <- vetor[j]) até achar a posição.', N'Como ordenar cartas na mão.', NULL, NULL),
        (648, N'fase23', N'Quando usar GROUP BY numa consulta SQL?', N'Sempre que usar função de agregação (SUM, AVG, COUNT, MAX, MIN) junto de outras colunas: agrupe por essas colunas. SUM soma valores, COUNT conta linhas, AVG tira média. Para mostrar do maior para o menor: ORDER BY ... DESC.', N'Total de votos é SUM, não COUNT.', NULL, NULL),
        (649, N'fase23', N'Como ler a cardinalidade (mínimo, máximo) no modelo entidade-relacionamento?', N'O par (mín, máx) junto de uma entidade diz quantas vezes ela participa. Ex.: pessoa (1,1) — possui — (0,1) cavalo: cada cavalo tem exatamente um dono, e cada pessoa tem no máximo um cavalo (pode não ter).', N'Mínimo 0 = participação opcional.', NULL, NULL),
        (650, N'fase23', N'Como converter números de outras bases para decimal?', N'Multiplique cada dígito pela potência da base. (1001)₂ = 8 + 1 = 9; (15)₈ = 1×8 + 5 = 13; (FF)₁₆ = 15×16 + 15 = 255.', N'Em hexadecimal, A = 10 ... F = 15.', NULL, NULL),
        (651, N'fase23', N'Para que serve a máscara de sub-rede?', N'Ela diz que parte do IP é a rede. Máquinas só se falam direto se estiverem na mesma rede: 175.16.10.200 com máscara 255.255.255.0 fica na rede 175.16.10.0 e não alcança 175.16.30.200 sem roteador. Com 255.255.0.0, as duas ficam na 175.16.0.0.', N'Mesma rede = comunicação direta.', NULL, NULL),
        (652, N'fase23', N'O que é multiprogramação, e quem protege a memória dos processos?', N'Multiprogramação: a CPU alterna rapidamente entre processos, dando a impressão de paralelismo. A gerência de memória do sistema operacional dá a cada processo o seu espaço e impede que um escreva na área do outro.', N'Proteção de memória = gerência de memória.', NULL, NULL),
        (653, N'fase23', N'Quais são os fundamentos da LGPD (art. 2º)?', N'Respeito à privacidade; autodeterminação informativa; liberdade de expressão, informação, comunicação e opinião; inviolabilidade da intimidade, da honra e da imagem; desenvolvimento econômico e tecnológico e inovação; livre iniciativa, livre concorrência e defesa do consumidor; direitos humanos, dignidade e cidadania.', N'Lei 13.709/2018.', NULL, NULL),
        (654, N'fase23', N'Qual recurso do HTML atende a acessibilidade em imagens?', N'O atributo alt: os leitores de tela leem esse texto para pessoas com deficiência visual. Outras boas práticas (WCAG): bom contraste, navegação pelo teclado e não depender só da cor.', N'Acessibilidade = igualdade de acesso.', NULL, NULL),
        (655, N'fase23', N'Quais são os 9 blocos do Business Model Canvas?', N'Segmentos de clientes, proposta de valor, canais, relacionamento com clientes, fontes de receita, recursos principais, atividades-chave, parcerias principais e estrutura de custo. Serve para modelar e validar a ideia de negócio.', N'Nenhum bloco pode ser ignorado.', NULL, NULL),
        (656, N'fase23', N'Como funciona um sistema especialista com regras de produção?', N'Usa regras "se condição então conclusão" sobre os fatos da memória de trabalho. Uma regra como "se febre e dores, então dengue com 70% de chance" dá uma probabilidade para cada caso, não uma contagem exata de pessoas.', N'Probabilidade não é garantia.', NULL, NULL),
        (657, N'fase24', N'(ENADE 2017 · Questão 10 · Matemática e Lógica) A álgebra booleana possui o operador unário ~ (NÃO) e os operadores binários * (E) e + (OU). A tabela verdade da fórmula G, para as proposições p, q e r, é:

p q r | G
V V V | V
V V F | F
V F V | F
V F F | F
F V V | V
F V F | V
F F V | V
F F F | V

Considerando a ordem de precedência dos operadores booleanos, a fórmula G possui a mesma tabela verdade da proposição', N'Alternativa C.

Justificativa: Quando p é falso, ~p já torna G verdadeira (as quatro últimas linhas). Quando p é verdadeiro, G só vale V se q e r forem verdadeiros, ou seja, q * r.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 10 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Matemática e Lógica.', N'["A) p \u002B ~q * r.","B) p \u002B q * ~r.","C) ~p \u002B q * r.","D) ~p \u002B ~q * r.","E) ~p \u002B q * ~r."]', 2),
        (658, N'fase24', N'(ENADE 2017 · Questão 11 · Banco de Dados) Num sistema para um clube recreativo, o diagrama de classes tem: Tipo_Associado (codigo, descricao, valorMensalidade) ligado a Associado com multiplicidade 1 para 0..*; e Associado (codigo, nome, endereco, telefone) ligado a Mensalidade (codigo, anomesreferencia, valormensalidade, datavencimento, valorpago, datapagamento) com multiplicidade 1 para 1..*.

Avalie as afirmações:
I. Haverá somente 12 mensalidades para cada associado, ou seja, elas não poderão ultrapassar os 12 meses do ano.
II. Não existem associados sem mensalidades, nem mensalidades sem associado a elas relacionado.
III. Alterando-se o valor da mensalidade definido para cada tipo de associado, o sistema automaticamente altera os valores das mensalidades geradas anteriormente.
IV. Poderão existir tipos de associados que não terão nenhum associado relacionado a eles.

É correto apenas o que se afirma em', N'Alternativa C.

Justificativa: II: 1..* obriga cada associado a ter ao menos uma mensalidade, e cada mensalidade tem exatamente um associado. IV: 0..* permite tipo sem associados. I é falsa (1..* não tem limite) e III também (cada mensalidade guarda o próprio valor).

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 11 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Banco de Dados.', N'["A) I e II.","B) I e III.","C) II e IV.","D) I, III e IV.","E) II, III e IV."]', 2),
        (659, N'fase24', N'(ENADE 2017 · Questão 12 · Engenharia de Software) Considere os requisitos de um sistema acadêmico de uma universidade:
R1: o sistema deve permitir que cada professor realize o lançamento de notas das turmas nas quais lecionou;
R2: o sistema deverá ser desenvolvido de forma a possibilitar seu transporte para outro sistema operacional em, no máximo, sessenta dias;
R3: o sistema deve permitir que um estudante realize a sua matrícula nas disciplinas oferecidas em um semestre letivo;
R4: o sistema atualiza a nota do estudante, permitindo sua visualização, em até dois segundos depois do momento que o professor a registra;
R5: o sistema deve permitir que o auxiliar de serviços acadêmicos realize o cadastro de um estudante em não mais do que dez minutos de orientação.

Representam requisitos não funcionais apenas os requisitos', N'Alternativa D.

Justificativa: R2 é portabilidade, R4 é desempenho e R5 é usabilidade (facilidade de aprendizado). R1 e R3 descrevem funções do sistema.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 12 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Engenharia de Software.', N'["A) R1, R2 e R3.","B) R1, R2 e R5.","C) R1, R3 e R4.","D) R2, R4 e R5.","E) R3, R4 e R5."]', 3),
        (660, N'fase24', N'(ENADE 2017 · Questão 13 · Engenharia de Software) Sobre o modelo CMMI, avalie as asserções e a relação proposta entre elas.

I. O CMMI fornece diretrizes para a melhoria dos processos e habilidades organizacionais, incluindo o ciclo de vida de produtos e serviços, que abrange as fases de concepção, desenvolvimento, aquisição, entrega e manutenção.

PORQUE

II. As empresas brasileiras estão aderindo a programas de fomento à melhoria da qualidade de software, por meio da aplicação do modelo de maturidade CMMI, que é mais direcionado às pequenas e médias empresas, apesar de também ser aplicável em grandes organizações.', N'Alternativa C.

Justificativa: I descreve o CMMI corretamente. II é falsa: o CMMI não é voltado principalmente a pequenas e médias empresas (no Brasil, quem tem esse foco é o MPS.BR).

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 13 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Engenharia de Software.', N'["A) As asser\u00E7\u00F5es I e II s\u00E3o verdadeiras, e a II \u00E9 uma justificativa correta da I.","B) As asser\u00E7\u00F5es I e II s\u00E3o verdadeiras, mas a II n\u00E3o \u00E9 uma justificativa correta da I.","C) A asser\u00E7\u00E3o I \u00E9 verdadeira, e a II \u00E9 falsa.","D) A asser\u00E7\u00E3o I \u00E9 falsa, e a II \u00E9 verdadeira.","E) As asser\u00E7\u00F5es I e II s\u00E3o falsas."]', 2),
        (661, N'fase24', N'(ENADE 2017 · Questão 14 · Gestão de Projetos) A tabela apresenta as atividades de um projeto (predecessora; duração em dias):
A (--; 3), B (A; 5), C (--; 12), D (--; 4), E (D; 2), F (D; 5), G (F; 7), H (E e G; 8), I (B; 11), J (C, H e I; 3).

Avalie as afirmações:
I. O caminho crítico é composto pelas atividades A, B, I e J.
II. O caminho crítico tem 27 dias.
III. A atividade H faz parte do caminho crítico.
IV. O projeto em pauta possui dois caminhos críticos.

É correto apenas o que se afirma em', N'Alternativa C.

Justificativa: D-F-G-H-J soma 4+5+7+8+3 = 27 dias, o maior caminho. A-B-I-J soma 22 e C-J soma 15, então só há um caminho crítico, e ele passa por H.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 14 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Gestão de Projetos.', N'["A) I e II.","B) I e IV.","C) II e III.","D) I, III e IV.","E) II, III e IV."]', 2),
        (662, N'fase24', N'(ENADE 2017 · Questão 16 · Programação Orientada a Objetos) Um diagrama de classes modela a transferência de materiais entre funcionários. RequisicaoTransferencia (dataRequisicao: date) tem duas associações navegáveis para Funcionario (nome: string), com os papéis "origem" e "destino" e multiplicidade 1. RequisicaoTransferencia também tem uma composição (losango cheio do seu lado) com Material (descricao: string, preco: double), navegável para Material, com papel "material" e multiplicidade 0..1 do lado da requisição e 1..* do lado de Material.

Avalie as afirmações:
I. A classe Funcionario é abstrata.
II. Uma RequisicaoTransferencia só existe se estiver vinculada a um Material.
III. A classe Funcionario, em razão de sua associação, possui um atributo do tipo RequisicaoTransferencia.
IV. Em uma implementação da classe RequisicaoTransferencia, é necessário adicionar um atributo simples do tipo Material.

É correto o que se afirma em', N'Alternativa A.

Justificativa: A multiplicidade 1..* obriga a requisição a ter ao menos um material. Funcionario não é abstrata, a navegação vai da requisição para o funcionário (não o contrário) e 1..* pede uma coleção de materiais, não um atributo simples.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 16 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Programação Orientada a Objetos.', N'["A) II, apenas.","B) I e II, apenas.","C) III e IV, apenas.","D) I, III e IV, apenas.","E) I, II, III e IV."]', 0),
        (663, N'fase24', N'(ENADE 2017 · Questão 17 · Engenharia de Software) Considerando a etapa de manutenção no processo de desenvolvimento de software, avalie as afirmações:
I. A fase de manutenção é uma parte explícita do modelo em cascata do processo de desenvolvimento de software.
II. A atualização do sistema para inserir customizações é considerada um tipo de manutenção.
III. A depuração do programa é um processo específico da fase de desenvolvimento e um tipo de manutenção.
IV. O acréscimo de novas funções a um sistema existente, sem perturbar sua operação, é considerado um tipo de manutenção.
V. A manutenção do sistema está relacionada ao aumento do ciclo de vida do software.

É correto apenas o que se afirma em', N'Alternativa D.

Justificativa: A cascata termina em operação e manutenção, e customizar ou acrescentar funções são manutenções que prolongam a vida do software. A depuração faz parte do desenvolvimento, não é um tipo de manutenção.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 17 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Engenharia de Software.', N'["A) I e III.","B) IV e V.","C) I, II e III.","D) I, II, IV e V.","E) II, III, IV e V."]', 3),
        (664, N'fase24', N'(ENADE 2017 · Questão 18 · Redes e Sistemas Distribuídos) As redes de computadores estão por toda parte e compartilham recursos por meio de sistemas distribuídos, que comunicam e coordenam vários dispositivos.

Assinale a opção que apresenta exemplos atuais de sistemas distribuídos.', N'Alternativa A.

Justificativa: Todos os itens da alternativa A rodam em várias máquinas que se comunicam pela rede. Pesquisa no Windows e jogos em mídia física rodam numa máquina só.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 18 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Redes e Sistemas Distribuídos.', N'["A) Pesquisa na web, jogos on-line, e-commerce e o banco de dados das ag\u00EAncias banc\u00E1rias.","B) Jogos on-line, e-commerce, pesquisa no Windows e e-mails.","C) E-commerce, jogos em m\u00EDdia f\u00EDsica, pesquisa no Windows e redes sociais.","D) Pesquisa na web, jogos em m\u00EDdia f\u00EDsica, e-commerce e e-mails.","E) Pesquisa no Windows, pesquisa na web, jogos on-line e o banco de dados das ag\u00EAncias banc\u00E1rias."]', 0),
        (665, N'fase24', N'(ENADE 2017 · Questão 19 · Sistemas Operacionais) Conceitualmente, cada processo tem sua própria CPU virtual. Na realidade, a CPU troca a execução, a todo momento, de um processo para outro, mas é muito mais fácil pensar em um conjunto de processos sendo executados (pseudo) paralelamente do que tentar controlar o modo como a CPU faz esses chaveamentos. (Tanenbaum, adaptado)

De acordo com o exposto, o conceito descrito denomina-se', N'Alternativa C.

Justificativa: Multiprogramação é a CPU alternando rapidamente entre vários processos, o que dá a impressão de execução paralela mesmo com um só processador.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 19 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Sistemas Operacionais.', N'["A) thread.","B) multiprocessador.","C) multiprograma\u00E7\u00E3o.","D) processo monothread.","E) m\u00E1quina de estados finitos."]', 2),
        (666, N'fase24', N'(ENADE 2017 · Questão 21 · Engenharia de Software) A respeito dos modelos de processo de software, avalie as afirmações:
I. São atividades do modelo incremental: especificação, desenvolvimento e validação.
II. No modelo espiral, a fase de modelagem é responsável, entre outras atividades, pela estimativa, cronograma e análise de risco.
III. O modelo cascata sugere uma abordagem sequencial e sistemática para o desenvolvimento de software, iniciando na especificação de requisitos e finalizando com a entrega do software concluído.

É correto o que se afirma em', N'Alternativa D.

Justificativa: No espiral, estimativa, cronograma e análise de risco ficam na fase de planejamento, não na de modelagem. I e III descrevem corretamente o incremental e o cascata.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 21 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Engenharia de Software.', N'["A) II, apenas.","B) III, apenas.","C) I e II, apenas.","D) I e III, apenas.","E) I, II e III."]', 3),
        (667, N'fase24', N'(ENADE 2017 · Questão 22 · Engenharia de Software) Um desenvolvedor recém-formado recebeu explicações sobre como a gerência de configuração funcionava. Avalie as afirmações:
I. Inicialmente, para ter acesso à base de desenvolvimento, o profissional deve realizar uma operação de checkout para baixar os arquivos do projeto que estão armazenados no servidor.
II. Quando mais de um desenvolvedor estiver modificando um mesmo documento, ao se tentar realizar um commit, pode ser necessário realizar uma operação de tag (release) para resolução do conflito entre a versão local e a versão mais recente no repositório.
III. No desenvolvimento de um novo caso de uso, em que diversos arquivos sejam modificados, é recomendada a criação de uma ramificação (branch).
IV. A versão estável é o ramo principal de desenvolvimento, que segue do começo do desenvolvimento até o momento presente.

É correto apenas o que se afirma em', N'Alternativa B.

Justificativa: Conflito se resolve com merge, não com tag (tag só marca uma versão). O ramo principal de desenvolvimento é o trunk/main, que não é necessariamente a versão estável.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 22 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Engenharia de Software.', N'["A) I e II.","B) I e III.","C) II e IV.","D) I, III e IV.","E) II, III e IV."]', 1),
        (668, N'fase24', N'(ENADE 2017 · Questão 23 · Engenharia de Software) Verificações, validações e testes são fundamentais para certificar a qualidade do software. Avalie as afirmações:
I. O teste funcional certifica se o software desempenha as funções especificadas nos requisitos.
II. O teste de desempenho valida a conformidade da especificação do processo de desenvolvimento de software.
III. O teste de aceitação é realizado pelo cliente a fim de validar se aquilo que foi implementado é o que foi solicitado.
IV. O teste de instalação, invariavelmente, é executado no local determinado pelo cliente para instalação do software.
V. As técnicas de verificação e validação de software asseguram que o sistema que está sendo desenvolvido seja adequado ao seu propósito.

É correto apenas o que se afirma em', N'Alternativa B.

Justificativa: O teste de desempenho mede tempo de resposta e carga, não a conformidade do processo. E o teste de instalação nem sempre é feito no local do cliente.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 23 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Engenharia de Software.', N'["A) I e IV.","B) I, III e V.","C) II, III e IV.","D) II, IV e V.","E) I, II, III e V."]', 1),
        (669, N'fase24', N'(ENADE 2017 · Questão 24 · Engenharia de Software) Muitos sistemas corporativos das décadas de 1970 e 1980 foram feitos em Cobol, com ADABAS e arquivos ISAM e VSAM, produtos que estão sendo descontinuados. A reengenharia desses sistemas com linguagens e bancos mais modernos é uma oportunidade de negócio. Avalie as afirmações:
I. A dificuldade de reengenharia de sistemas antigos deve-se ao fato de que, na maioria das vezes, o desenvolvedor definia o sistema e esse já era o próprio processo da organização.
II. O custo de alteração para modernização de uma linha de código em Cobol é alto; por isso, fazer a manutenção desses sistemas é menos dispendioso.
III. Uma estratégia de conversão dos referidos sistemas para uma linguagem orientada a objetos é definir uma estrutura de classes e métodos e realizar o refatoramento do código.

É correto o que se afirma em', N'Alternativa E.

Justificativa: As três descrevem a realidade dos sistemas legados: a regra de negócio ficou presa no código, reescrever é caro e a migração para OO passa por definir classes e refatorar.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 24 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Engenharia de Software.', N'["A) I, apenas.","B) III, apenas.","C) I e II, apenas.","D) II e III, apenas.","E) I, II e III."]', 4),
        (670, N'fase24', N'(ENADE 2017 · Questão 25 · Algoritmos e Estruturas de Dados) O fragmento C++ a seguir insere um nó em uma árvore binária.

struct noArvore {
    int dado;
    noArvore *esquerda;
    noArvore *direita;
};

noArvore *insere(noArvore *arvore, int valor) {
    if (arvore == NULL) {
        arvore = new noArvore;
        arvore->esquerda = NULL;
        arvore->direita = NULL;
        arvore->dado = valor;
    } else if (valor < arvore->dado) {
        arvore->esquerda = insere(arvore->esquerda, valor);
    } else {
        arvore->direita = insere(arvore->direita, valor);
    }
    return arvore;
}

Assinale a opção que imprime os valores dos nós percorrendo a árvore em pré-ordem.', N'Alternativa A.

Justificativa: Pré-ordem visita primeiro a raiz, depois a subárvore esquerda e por fim a direita. A opção C é em-ordem e a D é pós-ordem.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 25 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Algoritmos e Estruturas de Dados.', N'["A) if (raiz != NULL) {\n    cout \u003C\u003C raiz-\u003Edado \u003C\u003C \u0022 \u0022;\n    preorder(raiz-\u003Eesquerda);\n    preorder(raiz-\u003Edireita);\n}","B) if (raiz != NULL) {\n    preorder(raiz-\u003Edireita);\n    preorder(raiz-\u003Eesquerda);\n    cout \u003C\u003C raiz-\u003Edado \u003C\u003C \u0022 \u0022;\n}","C) if (raiz != NULL) {\n    preorder(raiz-\u003Eesquerda);\n    cout \u003C\u003C raiz-\u003Edado \u003C\u003C \u0022 \u0022;\n    preorder(raiz-\u003Edireita);\n}","D) if (raiz != NULL) {\n    preorder(raiz-\u003Eesquerda);\n    preorder(raiz-\u003Edireita);\n    cout \u003C\u003C raiz-\u003Edado \u003C\u003C \u0022 \u0022;\n}","E) if (raiz != NULL) {\n    preorder(raiz-\u003Edireita);\n    cout \u003C\u003C raiz-\u003Edado \u003C\u003C \u0022 \u0022;\n    preorder(raiz-\u003Eesquerda);\n}"]', 0),
        (671, N'fase24', N'(ENADE 2017 · Questão 26 · Programação Orientada a Objetos) Uma calculadora feita com MVC tem dois modos: comum e probabilista. A classe Calculadora guarda uma variável c do tipo CalculadoraController; o método multiplica(valores) apenas retorna c.multiplica(valores), e alteraModo() faz c = new ProbabilistaController() se modo == 1, senão c = new OrdinarioController(). ProbabilistaController e OrdinarioController herdam de CalculadoraController e implementam multiplica(valores: double[]): double, formando uma família de algoritmos intercambiáveis.

Avalie as afirmações:
I. A hierarquia exibida ilustra o uso do padrão de projetos Strategy.
II. O padrão composto MVC define a existência de um único controller e, portanto, a solução proposta não caracteriza o uso desse padrão.
III. O método multiplica da classe Calculadora chama o método multiplica de CalculadoraController, o que caracteriza uma conversão de interfaces e, portanto, o uso do padrão de projetos Adapter.

É correto o que se afirma em', N'Alternativa A.

Justificativa: Trocar o algoritmo trocando o objeto referenciado é o Strategy. O MVC não exige um controller único, e repassar a chamada com a mesma assinatura é delegação, não Adapter.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 26 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Programação Orientada a Objetos.', N'["A) I, apenas.","B) II, apenas.","C) I e III, apenas.","D) II e III, apenas.","E) I, II e III."]', 0),
        (672, N'fase24', N'(ENADE 2017 · Questão 28 · Engenharia de Software) O processo de descobrir, analisar, documentar e verificar os serviços e restrições de um sistema é denominado engenharia de requisitos (Sommerville). Avalie as atribuições listadas, no que se refere à etapa de especificação de requisitos:
I. Identificar as expectativas e necessidades dos stakeholders com relação ao software a ser desenvolvido.
II. Distribuir os requisitos em categorias, explorar as relações entre eles e classificar sua importância para os stakeholders.
III. Produzir um documento de especificação de requisitos, de forma que todos os stakeholders possam entendê-lo.
IV. Examinar a especificação do software para assegurar que todos os requisitos foram definidos sem inconsistências.

São atribuições na etapa de especificação de requisitos os itens', N'Alternativa E.

Justificativa: Segundo o gabarito oficial, as quatro atribuições fazem parte da especificação: entender os stakeholders, organizar e priorizar, documentar e checar a consistência.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 28 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Engenharia de Software.', N'["A) I e III, apenas.","B) I e IV, apenas.","C) II e III, apenas.","D) II e IV, apenas.","E) I, II, III e IV."]', 4),
        (673, N'fase24', N'(ENADE 2017 · Questão 29 · Matemática e Lógica) Uma pesquisa usa os conjuntos A ("possui ensino superior"), B ("possui pós-graduação") e C ("possui pelo menos 5 anos de experiência"). As expressões são:
Expressão 1: x ∈ A ∧ x ∉ (B ∪ C)
Expressão 2: x ∈ A − (B ∪ C)
Expressão 3: x ∈ A ∧ x ∈ B ∧ x ∈ C

Um programa em C usa a função contem(conjunto, p):
/* condição 1 */
if (contem(A, p) && !contem(B, p) && !contem(C, p)) { ... }
/* condição 2 */
else if (contem(A, p) || contem(B, p) || contem(C, p)) { ... }

Assinale a opção correta.', N'Alternativa D.

Justificativa: As três descrevem "está em A e não está em B nem em C". A condição 2 usa OU (é uma união), por isso não equivale à expressão 3, que usa E.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 29 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Matemática e Lógica.', N'["A) A condi\u00E7\u00E3o 2 do programa \u00E9 equivalente \u00E0 express\u00E3o 3.","B) Pessoas com p\u00F3s-gradua\u00E7\u00E3o pertencem ao conjunto definido pela express\u00E3o 2.","C) A condi\u00E7\u00E3o 1 do programa \u00E9 verdadeira para todas as pessoas com ensino superior.","D) A condi\u00E7\u00E3o 1 do programa e as express\u00F5es 1 e 2, que representam o mesmo subconjunto, s\u00E3o equivalentes.","E) A condi\u00E7\u00E3o 2 do programa define o conjunto de pessoas que tem ensino superior, p\u00F3s-gradua\u00E7\u00E3o e pelo menos cinco anos de experi\u00EAncia em sua \u00E1rea de atua\u00E7\u00E3o."]', 3),
        (674, N'fase24', N'(ENADE 2017 · Questão 30 · Programação Orientada a Objetos) Considere o código Java:

public abstract class Impressora {
    String nome;
    public void imprimir() {}
}
public class Laser extends Impressora {
    public void imprimir() { System.out.println("Imprimindo na Laser"); }
}
class Matricial extends Impressora {
    public void imprimir() { System.out.println("Imprimindo na Matricial"); }
}
public class JatoDeTinta extends Impressora {
    public void imprimir() { System.out.println("Imprimindo na Jato de tinta"); }
}
public class Main {
    public static void main(String args[]) {
        Impressora imp[] = new Impressora[3];
        imp[0] = new Laser();
        imp[1] = new JatoDeTinta();
        imp[2] = new Matricial();
        for (int i = imp.length - 1; i >= 0; i--) {
            imp[i].imprimir();
        }
    }
}

Avalie as afirmações:
I. A execução resulta em: Imprimindo na Laser / Imprimindo na Matricial / Imprimindo na Jato de tinta.
II. O código faz uso da técnica denominada polimorfismo.
III. O código não será compilado, pois o vetor imp foi instanciado por meio da classe abstrata Impressora.

É correto o que se afirma em', N'Alternativa A.

Justificativa: O laço vai do fim para o começo: imprime Matricial, Jato de tinta e Laser. Criar um vetor do tipo abstrato é permitido (só não dá para instanciar a classe). Cada objeto executa o seu imprimir(): polimorfismo.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 30 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Programação Orientada a Objetos.', N'["A) II, apenas.","B) III, apenas.","C) I e II, apenas.","D) I e III, apenas.","E) I, II e III."]', 0),
        (675, N'fase24', N'(ENADE 2017 · Questão 31 · UX/UI e Requisitos) À medida que o projeto de uma interface evolui, quatro questões quase sempre aparecem: tempo de resposta, recursos de ajuda, tratamento de erros e nomes de comandos (Pressman). Avalie as afirmações:
I. A análise de interfaces tem por objetivo identificar o perfil dos usuários e auxiliar na especificação do requisito não funcional de segurança pertinente ao perfil de acesso dos usuários.
II. O requisito não funcional de segurança descreve as características relacionadas a inteligibilidade, modo de usar ou operar o sistema.
III. O requisito não funcional de confiabilidade descreve as características relacionadas ao tempo de resposta para processamento de dados ou informações.
IV. O requisito não funcional de usabilidade descreve diretrizes de acessibilidade para pessoas com deficiência.

É correto apenas o que se afirma em', N'Alternativa B.

Justificativa: II descreve usabilidade, não segurança. III descreve desempenho (eficiência), não confiabilidade.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 31 (gabarito definitivo).', N'Questão oficial do ENADE 2017: UX/UI e Requisitos.', N'["A) I e III.","B) I e IV.","C) II e IV.","D) I, II e III.","E) II, III e IV."]', 1),
        (676, N'fase24', N'(ENADE 2017 · Questão 32 · Banco de Dados) Um banco guarda o resultado de uma eleição nas tabelas Partido (numero, nome, sigla), Candidato (numero, nome), em que o número do candidato é o número do seu partido, e Votacao (partido, votos, estado), com os votos de cada partido em cada estado.

Qual comando SQL seleciona os nomes dos candidatos, seus partidos e o total de votos de cada partido?', N'Alternativa C.

Justificativa: Total de votos é SUM (COUNT só contaria as linhas), e uma função de agregação junto de outras colunas exige GROUP BY por essas colunas.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 32 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Banco de Dados.', N'["A) SELECT c.nome, p.nome, SUM(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero;","B) SELECT c.nome, p.nome, COUNT(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome;","C) SELECT c.nome, p.nome, SUM(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome;","D) SELECT c.nome, p.nome, v.votos FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome, SUM(v.votos);","E) SELECT c.nome, p.nome, COUNT(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome, v.votos;"]', 2),
        (677, N'fase24', N'(ENADE 2017 · Questão 33 · Algoritmos e Estruturas de Dados) Um programador implementou a ordenação por inserção para vetor[1..9], mas o algoritmo não funciona:

01 para i <- 2 até 9 faça
02    valor <- vetor[i]
03    j <- i - 1
04    enquanto ((j >= 1) e (valor < vetor[j])) faça
05       vetor[i] <- vetor[j]
06       j <- j - 1
07       se (j = 0) então
08          interrompa
09       fim se
10    fim enquanto
11    vetor[j + 1] <- valor
12 fim para

Qual linha e comando devem ser substituídos para que o algoritmo ordene o vetor de forma crescente?', N'Alternativa D.

Justificativa: Na inserção, cada elemento maior é empurrado uma posição para a direita: vetor[j + 1] <- vetor[j]. Escrever sempre em vetor[i] perde os valores.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 33 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Algoritmos e Estruturas de Dados.', N'["A) Linha 01; para i \u003C- 1 at\u00E9 9 fa\u00E7a","B) Linha 03; j \u003C- i","C) Linha 04; enquanto ((j \u003E= 1) ou (valor \u003C vetor[j])) fa\u00E7a","D) Linha 05; vetor[j \u002B 1] \u003C- vetor[j]","E) Linha 11; vetor[j] \u003C- valor"]', 3),
        (678, N'fase24', N'(ENADE 2017 · Questão 34 · Banco de Dados) Inspirado no diálogo entre Chicó e João Grilo (Auto da Compadecida), um modelo de dados tem a entidade pessoa (codigo, que é o identificador; rg; cpf; nome) ligada pelo relacionamento possui à entidade cavalo (codigo, que é o identificador; raca; eBento?). A cardinalidade (1,1) aparece junto de pessoa e (0,1) junto de cavalo.

Avalie as afirmações:
I. O Chicó e a velha poderão ser cadastrados na entidade pessoa.
II. O Chicó e a velha poderão ter mais que um cavalo cadastrados.
III. O atributo rg da entidade pessoa pode ter a função de chave primária nessa entidade.
IV. O cavalo deverá ter no mínimo uma pessoa e uma pessoa poderá ser cadastrada sem a necessidade de ter um cavalo.

É correto apenas o que se afirma em', N'Alternativa B.

Justificativa: (1,1) do lado de pessoa: todo cavalo tem exatamente um dono. (0,1) do lado de cavalo: a pessoa tem no máximo um cavalo, e pode não ter nenhum. O identificador escolhido é codigo, não rg.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 34 (gabarito definitivo).', N'Questão oficial do ENADE 2017: Banco de Dados.', N'["A) I e III.","B) I e IV.","C) II e III.","D) I, II e IV.","E) II, III e IV."]', 1),
        (679, N'fase24', N'(ENADE 2017 · Questão 35 · UX/UI e Requisitos) Num site de venda de ingressos, os links para cada show são imagens. O web designer implementou cada link assim, para que usuários de leitores de tela recebam um texto informativo:

<a href="link-area-venda-ingresso">
    <img src="imagem-show.jpg" alt="identificação do show" />
</a>

Considerando o uso do atributo alt e a interação humano-computador, o web designer atendeu o requisito de', N'Alternativa C.

Justificativa: O alt é lido pelos leitores de tela: é o recurso básico de acessibilidade para pessoas com deficiência visual.

Fonte: INEP, ENADE 2017, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 35 (gabarito definitivo).', N'Questão oficial do ENADE 2017: UX/UI e Requisitos.', N'["A) seguran\u00E7a no uso, pois se uma imagem tiver baixa resolu\u00E7\u00E3o, o texto associado possibilita identificar o conte\u00FAdo do link.","B) facilidade de aprendizado, pois imagens aliadas a textos informativos ajudam o usu\u00E1rio a aprender os caminhos de navega\u00E7\u00E3o.","C) acessibilidade, pois a possibilidade de acesso \u00E0 p\u00E1gina por pessoas com defici\u00EAncia visual oferece condi\u00E7\u00F5es de igualdade na intera\u00E7\u00E3o com o sistema web.","D) ergonomia, pois imagens em links causam cansa\u00E7o visual em smartphones e o atributo alt substitui a imagem por texto.","E) comunicabilidade, pois se uma imagem n\u00E3o comunica adequadamente a informa\u00E7\u00E3o, o texto alternativo deve complement\u00E1-la."]', 2),
        (680, N'fase25', N'(ENADE 2021 · Questão 9 · Engenharia de Software) A etapa de definição de requisitos estabelece quais funções são requeridas pelo sistema e as restrições sobre a operação e o desenvolvimento do software. Os requisitos podem ser funcionais ou não funcionais (Sommerville).

Assinale a alternativa em que o item é um requisito funcional.', N'Alternativa C.

Justificativa: Emitir relatórios é uma função do sistema. As demais são restrições: plataforma, prazo, desempenho e segurança.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 9 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) O software deve ser operacionalizado no sistema Linux.","B) O tempo de desenvolvimento n\u00E3o deve ultrapassar seis meses.","C) O software deve emitir relat\u00F3rios de compras a cada quinze dias.","D) O tempo de resposta do sistema n\u00E3o deve ultrapassar 30 segundos.","E) A base de dados deve ser protegida para acesso apenas de usu\u00E1rios autorizados."]', 2),
        (681, N'fase25', N'(ENADE 2021 · Questão 11 · Algoritmos e Estruturas de Dados) O código Java a seguir implementa uma Pilha encadeada.

public class No {
    public int dado;
    public No prox;
    public No(int dado) { this.dado = dado; }
}
public class PilhaEncadeada {
    private No topo;
    public int pop() {
        if (topo == null) return -1;
        No lixo = topo;
        topo = topo.prox;
        lixo.prox = null;
        return lixo.dado;
    }
    public int top() {
        if (topo == null) return -1;
        return topo.dado;
    }
}

Assinale a opção com a implementação correta do método push.', N'Alternativa E.

Justificativa: O novo nó aponta para o topo atual e passa a ser o topo. Assim o pop(), que lê topo.prox, encontra o elemento de baixo.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 11 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Algoritmos e Estruturas de Dados.', N'["A) No novo = new No(elemento);\nif (topo == null) topo = novo;\nelse topo.prox = novo;","B) No novo = new No(elemento);\ntopo = novo;","C) topo.dado = elemento;","D) No novo = new No(elemento);\nwhile (topo != null) topo = topo.prox;\ntopo.prox = novo;","E) No novo = new No(elemento);\nnovo.prox = topo;\ntopo = novo;"]', 4),
        (682, N'fase25', N'(ENADE 2021 · Questão 12 · Engenharia de Software) Uma fábrica de software usa Scrum, eXtreme Programming (XP) e quadro Kanban. Avalie as afirmações:
I. Métodos ágeis são baseados em ciclos iterativos e incrementais que se concentram no desenvolvimento rápido e na flexibilidade às mudanças, com a participação do cliente no processo de software.
II. Uma forte característica da XP é a garantia da qualidade do código produzido e, para isso, os desenvolvedores produzem testes automatizados antes mesmo de codificar uma funcionalidade.
III. O planejamento no Scrum é baseado na elaboração dos itens do product backlog, que é uma lista de funcionalidades desejadas pelo cliente, sendo o Scrum Master o responsável por gerenciá-lo.
IV. O quadro Kanban permite monitorar a evolução das tarefas necessárias durante o processo ágil, possibilitando um acompanhamento visual das atividades em construção.

É correto apenas o que se afirma em', N'Alternativa C.

Justificativa: Quem gerencia o product backlog é o Product Owner, não o Scrum Master. As outras afirmações estão certas (o teste antes do código da II é o TDD).

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 12 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) II.","B) I e III.","C) I, II e IV.","D) I, III e IV.","E) II, III e IV."]', 2),
        (683, N'fase25', N'(ENADE 2021 · Questão 13 · Algoritmos e Estruturas de Dados) As variáveis pilha e fila são uma Pilha e uma Fila. Um programador executou:

pilha.push(''A''); pilha.push(''B''); pilha.push(''C'');
fila.enqueue(pilha.top());
fila.enqueue(pilha.top());
fila.enqueue(''D'');
pilha.push(fila.dequeue());
fila.enqueue(fila.dequeue());
fila.enqueue(pilha.pop());
pilha.push(''E'');
fila.enqueue(''E'');
pilha.pop();

Ao imprimir o conteúdo de pilha e fila, respectivamente, seria exibido:', N'Alternativa C.

Justificativa: top() só lê, então a fila recebe C, C e D. O primeiro C volta para a pilha, o segundo vai para o fim da fila, e o pop() devolve esse C para a fila. O E entra e sai da pilha: pilha C, B, A e fila D, C, C, E.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 13 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Algoritmos e Estruturas de Dados.', N'["A) pilha: topo \u2192 C \u2192 A \u2192 E; fila: in\u00EDcio \u2192 D \u2192 A \u2192 A \u2192 E","B) pilha: topo \u2192 A; fila: in\u00EDcio \u2192 D \u2192 B \u2192 C \u2192 E","C) pilha: topo \u2192 C \u2192 B \u2192 A; fila: in\u00EDcio \u2192 D \u2192 C \u2192 C \u2192 E","D) pilha: topo \u2192 B \u2192 A; fila: in\u00EDcio \u2192 D \u2192 B \u2192 C \u2192 E","E) pilha: topo \u2192 C \u2192 B \u2192 A; fila: in\u00EDcio \u2192 D \u2192 B \u2192 C \u2192 E"]', 2),
        (684, N'fase25', N'(ENADE 2021 · Questão 14 · Gestão de Projetos) Um projeto de integração de um ERP com um CRM não implementou todos os serviços esperados e há falhas nos já implementados. Uma auditoria identificou desentendimentos entre os membros da equipe; os membros da qualidade não compreendem o que deve ser avaliado; demandas de novos solicitantes aparecem constantemente; e o patrocinador demora muito a responder às solicitações. Tudo isso atrasou o projeto e estourou o orçamento.

O gerente de projeto deve priorizar o gerenciamento de', N'Alternativa E.

Justificativa: Todos os problemas citados vêm das pessoas envolvidas: equipe, qualidade, solicitantes e patrocinador. Atraso e custo são consequências.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 14 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Gestão de Projetos.', N'["A) custo.","B) tempo.","C) escopo.","D) qualidade.","E) partes interessadas."]', 4),
        (685, N'fase25', N'(ENADE 2021 · Questão 17 · Banco de Dados) Um banco de dados bancário tem, entre outras, as tabelas CLIENTE (COD_CLIENTE, NOM_CLIENTE, ...), CONTA (NUM_CONTA, COD_CLIENTE, ...) e HISTORICO_MOVIMENTACAO (COD_HISTORICO_MOVIMENTACAO, NUM_CONTA, VAL_MOVIMENTACAO, DTA_MOVIMENTACAO, ...).

Indique a consulta SQL que recupera o nome dos clientes e o valor médio movimentado por eles em sua conta até o momento, exibindo primeiro os clientes com maior média.', N'Alternativa C.

Justificativa: Média por cliente pede AVG com GROUP BY pelo cliente (o código evita juntar homônimos) e ORDER BY ... DESC. A opção D liga as chaves erradas e a E agrupa só pelo nome.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 17 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Banco de Dados.', N'["A) SELECT CL.NOME, HM.VAL_MOVIMENTADO FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA ORDER BY HM.VAL_MOVIMENTADO","B) SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA ORDER BY HM.VAL_MOVIMENTADO DESC","C) SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA GROUP BY CL.COD_CLIENTE, CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC","D) SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL LEFT OUTER JOIN CONTA CO ON CL.COD_CLIENTE = CO.NUM_CONTA LEFT OUTER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.COD_HISTORICO_MOVIMENTACAO GROUP BY CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC","E) SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL LEFT OUTER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE LEFT OUTER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA GROUP BY CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC"]', 2),
        (686, N'fase25', N'(ENADE 2021 · Questão 18 · Engenharia de Software) A engenharia de requisitos tem quatro subprocessos: estudo de viabilidade, elicitação, especificação e validação (Sommerville). Uma equipe vai desenvolver um software de Suporte Técnico; o estudo de viabilidade já foi aprovado e ela seguirá os outros três subprocessos.

Quais artefatos podem ser usados nesses três subprocessos?', N'Alternativa A.

Justificativa: Entrevista serve à elicitação, caso de uso à especificação dos requisitos funcionais e protótipo à validação. Viabilidade já foi feita, e caso de uso não modela requisito não funcional.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 18 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) Documento de entrevista com usu\u00E1rios; modelo de caso de uso para os requisitos funcionais; prototipa\u00E7\u00E3o de telas.","B) Documento de estudo de viabilidade; modelo de caso de uso para os requisitos funcionais; prototipa\u00E7\u00E3o de telas.","C) Matriz de rastreabilidade; modelo de caso de uso para os requisitos n\u00E3o-funcionais; prototipa\u00E7\u00E3o de telas.","D) Documento de entrevista com usu\u00E1rios; modelo de caso de uso para os requisitos n\u00E3o-funcionais; matriz de rastreabilidade.","E) Documento de estudo de viabilidade; modelo de caso de uso para os requisitos funcionais; matriz de rastreabilidade."]', 0),
        (687, N'fase25', N'(ENADE 2021 · Questão 19 · Engenharia de Software) A respeito dos estilos e padrões arquiteturais, avalie as afirmações:
I. Em arquiteturas orientadas a objetos, a comunicação entre os componentes do software é realizada por intermédio da troca de mensagens.
II. As arquiteturas monolíticas consistem de um sistema dividido em pequenas partes, possibilitando que estas tenham sua manutenção, execução e evolução individual.
III. No padrão MVC, a camada de Modelo armazena as interações realizadas no Controle, podendo ser apresentadas/manipuladas posteriormente na Visão.
IV. Nas arquiteturas de microsserviços, o software possui componentes altamente acoplados, dificultando a manutenção.

É correto apenas o que se afirma em', N'Alternativa A.

Justificativa: II descreve microsserviços, não monólito. E microsserviços buscam baixo acoplamento, o contrário do que diz a IV.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 19 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) I e III.","B) II e III.","C) II e IV.","D) I, II e IV.","E) I, III e IV."]', 0),
        (688, N'fase25', N'(ENADE 2021 · Questão 20 · UX/UI e Requisitos) Uma secretaria municipal vai criar um site para pessoas da terceira idade, com orientações de saúde, eventos esportivos e publicação de fotos que podem ser curtidas e comentadas. A maioria desse público acessa a internet pelo celular ou tablet, e uma parte prefere computadores.

Avalie as afirmações:
I. A segurança no uso é um fator crítico de usabilidade a ser considerado no projeto, tendo em vista que pessoas da terceira idade são temerosas quanto ao registro de dados pessoais e confidenciais em sites e aplicativos.
II. A responsividade, que pressupõe o uso de valores relativos para definir as dimensões de elementos na estilização de páginas HTML, deve ser considerada, tendo em vista o acesso por dispositivos com diferentes tamanhos de tela.
III. A construção de protótipos pode antecipar problemas de design de interação e minimizar custos, e é viável para uma comunicação mais objetiva com o público-alvo, possibilitando validar a usabilidade e a experiência do usuário.
IV. O design participativo é um processo de design de IHC viável para direcionar o projeto, pois o público-alvo tende a apresentar dificuldades no manuseio de tecnologias da informação e da comunicação.

É correto apenas o que se afirma em', N'Alternativa E.

Justificativa: Responsividade, protótipos e design participativo se encaixam no cenário. A I parte de uma generalização sobre o público que o texto não sustenta.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 20 (gabarito definitivo).', N'Questão oficial do ENADE 2021: UX/UI e Requisitos.', N'["A) I e II.","B) I e III.","C) II e IV.","D) I, III e IV.","E) II, III e IV."]', 4),
        (689, N'fase25', N'(ENADE 2021 · Questão 21 · Engenharia de Software) A Gestão de Configuração de Software estabelece um conjunto de atividades para gerenciar alterações durante todo o ciclo de vida de um software (Pressman).

Assinale a opção correta acerca das atividades de gestão de configuração de software.', N'Alternativa B.

Justificativa: São as cinco tarefas clássicas da gestão de configuração em Pressman: identificação, controle de versão, controle de alterações, auditoria e relatório de status.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 21 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) Identifica\u00E7\u00E3o de itens na configura\u00E7\u00E3o de software, gerenciamento de altera\u00E7\u00F5es, valida\u00E7\u00E3o de vers\u00F5es e controle de qualidade.","B) Identifica\u00E7\u00E3o de objetos na configura\u00E7\u00E3o de software, controle de vers\u00E3o, controle de altera\u00E7\u00F5es, auditoria de configura\u00E7\u00E3o e relat\u00F3rio de status.","C) Ger\u00EAncia de projeto, ger\u00EAncia de configura\u00E7\u00E3o de software, ciclo de vida do projeto, processo de software e evolu\u00E7\u00E3o das configura\u00E7\u00F5es.","D) Constru\u00E7\u00E3o de modelo de requisitos, m\u00E9tricas para modelo de projeto, m\u00E9tricas de controle de vers\u00E3o e relat\u00F3rio de manuten\u00E7\u00E3o.","E) Identifica\u00E7\u00E3o de altera\u00E7\u00F5es, controle de vers\u00E3o, mapeamento de altera\u00E7\u00E3o e notifica\u00E7\u00E3o da altera\u00E7\u00E3o aos envolvidos."]', 1),
        (690, N'fase25', N'(ENADE 2021 · Questão 22 · Engenharia de Software) Sobre o processo de Gerência de Configuração de Software (GCS), avalie as afirmações:
I. O controle de versão possibilita o compartilhamento de dados e a edição colaborativa, permitindo a gestão de diferentes ramos de desenvolvimento e a existência de diferentes versões de forma simultânea.
II. A auditoria de configuração é uma atividade de garantia de qualidade que tem por objetivo assegurar que a qualidade do software seja mantida quando feitas alterações requisitadas.
III. O relatório de status de configuração tem por objetivo manter o cliente informado sobre as alterações, e deve ser gerado ao final do processo.
IV. A GCS proporciona atividades de acompanhamento e controle de mudanças que se iniciam logo depois que o software for fornecido ao cliente e colocado em operação.

É correto apenas o que se afirma em', N'Alternativa A.

Justificativa: O relatório de status informa a equipe ao longo de todo o processo, não só no final. E a GCS começa junto com o projeto, não depois da entrega.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 22 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) I e II.","B) II e III.","C) III e IV.","D) I, II e IV.","E) I, III e IV."]', 0),
        (691, N'fase25', N'(ENADE 2021 · Questão 23 · Engenharia de Software) A evolução de sistemas legados se divide em manutenção, modernização e substituição. Um ERP já implantado integra todos os departamentos de uma empresa, e surgiu a necessidade de criar um relatório gerencial de comissão da equipe de vendas.

Nesse contexto, a manutenção a ser realizada é', N'Alternativa B.

Justificativa: Acrescentar uma funcionalidade nova (o relatório) é manutenção evolutiva. Corretiva conserta defeito e adaptativa ajusta o sistema a um ambiente novo.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 23 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) corretiva.","B) evolutiva.","C) funcional.","D) preventiva.","E) adaptativa."]', 1),
        (692, N'fase25', N'(ENADE 2021 · Questão 24 · Engenharia de Software) Num sistema web de delivery, o analista de teste descreveu:
01 – Verificar se o método "Finalizar Pedido" da classe "Pedido" está funcionando corretamente.
02 – Garantir que o sistema funcione corretamente em diferentes navegadores.
03 – O sistema deve passar por testes rigorosos na estrutura lógica interna do software.
04 – O sistema deve garantir, no mínimo, o registro de 100 pedidos simultâneos.
05 – O usuário deve testar o sistema em um ambiente controlado sob a supervisão dos desenvolvedores.

Avalie as afirmações:
I. A descrição 01 deve ser verificada com teste unitário.
II. A descrição 02 deve ser executada com a abordagem caixa-branca.
III. A descrição 03 deve ser executada com a abordagem caixa-preta.
IV. A descrição 04 deve ser verificada com teste de carga.
V. A descrição 05 deve ser classificada como teste alfa.

É correto apenas o que se afirma em', N'Alternativa D.

Justificativa: II e III estão trocadas: testar navegadores é caixa-preta (olha só o comportamento) e testar a lógica interna é caixa-branca.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 24 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) II e III.","B) I, II e IV.","C) I, III e V.","D) I, IV e V.","E) II, III, IV e V."]', 3),
        (693, N'fase25', N'(ENADE 2021 · Questão 25 · Engenharia de Software) Uma empresa de piscicultura pediu com extrema urgência um sistema para gerenciar a criação dos peixes, das fases de alevino e engorda até a venda, registrando mortandade e rações.

Avalie as afirmações sobre o processo de desenvolvimento a usar:
I. Deve ser adotado um processo baseado no modelo cascata, pois ele se adapta melhor a cenários com muitas mudanças.
II. Por se tratar de uma aplicação com escopo pequeno, o modelo espiral deverá ser utilizado, já que reduzirá riscos por meio da prototipação de cada fase dos peixes e diminuirá o tempo de entrega.
III. O modelo incremental deve ser utilizado, já que partes do sistema referentes à fase inicial dos peixes poderiam ser disponibilizadas, enquanto as demais estão nas etapas de concepção e desenvolvimento.
IV. Em razão da extrema urgência, a empresa deve elaborar seu processo utilizando o modelo RAD (Rapid Application Development).

É correto apenas o que se afirma em', N'Alternativa E.

Justificativa: Entregar por partes (incremental) e com rapidez (RAD) atende a urgência. O cascata é o modelo que pior lida com mudanças, e o espiral é indicado para projetos grandes e arriscados.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 25 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) I.","B) IV.","C) I e II.","D) II e III.","E) III e IV."]', 4),
        (694, N'fase25', N'(ENADE 2021 · Questão 26 · Cibersegurança e LGPD) Empreender em computação exige observar a legislação, como a Lei Geral de Proteção de Dados Pessoais (LGPD, Lei n. 13.709/2018).

Assinale os fundamentos da disciplina da proteção de dados pessoais, previstos no art. 2º da LGPD.', N'Alternativa E.

Justificativa: A alternativa E reproduz os sete incisos do art. 2º. As outras misturam fundamentos com direitos do titular, bases legais e obrigações.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 26 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Cibersegurança e LGPD.', N'["A) O direito ao usu\u00E1rio; as obriga\u00E7\u00F5es das organiza\u00E7\u00F5es nacionais ou estrangeiras; obrigatoriedade do consentimento; a livre iniciativa, a livre concorr\u00EAncia e a defesa do consumidor; os direitos humanos e a cidadania; e a regula\u00E7\u00E3o da ANPD.","B) O direito \u00E0 revoga\u00E7\u00E3o de um consentimento; a transfer\u00EAncia de dados para outro fornecedor; a solicita\u00E7\u00E3o de remo\u00E7\u00E3o de dados pessoais; a inviolabilidade da intimidade, da honra e da imagem; o desenvolvimento econ\u00F4mico e tecnol\u00F3gico e a inova\u00E7\u00E3o; a preserva\u00E7\u00E3o da vida e da integridade f\u00EDsica.","C) O respeito \u00E0 privacidade; obrigatoriedade do consentimento; os deveres dos usu\u00E1rios finais; os deveres das organiza\u00E7\u00F5es nacionais ou estrangeiras; o c\u00F3digo de defesa do consumidor; e a obrigatoriedade do respeito \u00E0 honra e \u00E0 imagem.","D) O direito ao anonimato; a liberdade de express\u00E3o; a inviolabilidade da intimidade; medidas preventivas de seguran\u00E7a; o direito ao recurso e revis\u00E3o; a administra\u00E7\u00E3o de riscos e falhas; os agentes de tratamento; e a regula\u00E7\u00E3o da ANPD.","E) O respeito \u00E0 privacidade; a autodetermina\u00E7\u00E3o informativa; a liberdade de express\u00E3o, de informa\u00E7\u00E3o, de comunica\u00E7\u00E3o e de opini\u00E3o; a inviolabilidade da intimidade, da honra e da imagem; o desenvolvimento econ\u00F4mico e tecnol\u00F3gico e a inova\u00E7\u00E3o; a livre iniciativa, a livre concorr\u00EAncia e a defesa do consumidor; e os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exerc\u00EDcio da cidadania."]', 4),
        (695, N'fase25', N'(ENADE 2021 · Questão 27 · Matemática e Lógica) Os profissionais de TI precisam converter números entre as bases binária (2), octal (8), decimal (10) e hexadecimal (16).

Fazendo a conversão da soma (1001)₂ + (15)₈ + (FF)₁₆, qual é o número equivalente na base decimal?', N'Alternativa C.

Justificativa: (1001)₂ = 9, (15)₈ = 1×8 + 5 = 13 e (FF)₁₆ = 15×16 + 15 = 255. Soma: 9 + 13 + 255 = 277.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 27 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Matemática e Lógica.', N'["A) (188)\u2081\u2080","B) (215)\u2081\u2080","C) (277)\u2081\u2080","D) (316)\u2081\u2080","E) (345)\u2081\u2080"]', 2),
        (696, N'fase25', N'(ENADE 2021 · Questão 28 · Sistemas Operacionais) O sistema operacional é um gerenciador de recursos. É uma péssima ideia permitir que os programas tenham acesso sem restrição à memória uns dos outros: um programa com defeito ou malicioso pode travar outro, produzir resultados incorretos ou afetar todo o sistema (Stuart, adaptado).

A atividade com que o sistema operacional garante essa proteção é', N'Alternativa B.

Justificativa: É o gerenciamento de memória que dá a cada processo o seu espaço de endereços e impede que um escreva na área do outro.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 28 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Sistemas Operacionais.', N'["A) o programa antiv\u00EDrus.","B) o gerenciamento de mem\u00F3ria.","C) o gerenciamento de arquivos.","D) o gerenciamento de processos.","E) o gerenciamento de entrada e sa\u00EDda."]', 1),
        (697, N'fase25', N'(ENADE 2021 · Questão 29 · Algoritmos e Estruturas de Dados) Considere o algoritmo:

mat[1..3][1..5] = {{1, 2, -1, 2, 3}, {1, -3, 4, 2, 0}, {-3, 5, 2, 3, 4}}
sl[1..3] = {0, 0, 0}
x <- 0
para i <- 1 até 3 faça
    para j <- 1 até 5 faça
        sl[i] <- sl[i] + mat[i][j]
    fimpara
    x <- x + sl[i]
fimpara
imprima x

No fim da execução, será exibido o valor', N'Alternativa D.

Justificativa: As somas das linhas são 7, 4 e 11. x acumula essas somas: 7 + 4 + 11 = 22.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 29 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Algoritmos e Estruturas de Dados.', N'["A) 4.","B) 7.","C) 11.","D) 22.","E) 30."]', 3),
        (698, N'fase25', N'(ENADE 2021 · Questão 30 · Redes e Sistemas Distribuídos) Na sala dos professores há 3 máquinas na rede:
PROFESSORES01: IP 175.16.10.200, máscara 255.255.255.0, gateway 175.16.1.1
PROFESSORES02: IP 175.16.20.200, máscara 255.255.0.0, gateway 175.16.1.1
PROFESSORES03: IP 175.16.30.200, máscara 255.255.0.0, gateway 175.16.1.1

A estação PROFESSORES01 não consegue imprimir na impressora compartilhada pela PROFESSORES03. Que alteração resolve o problema?', N'Alternativa C.

Justificativa: Com máscara 255.255.255.0, a PROFESSORES01 se vê na rede 175.16.10.0 e acha que a 03 está em outra rede. Com 255.255.0.0, todas ficam na 175.16.0.0.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 30 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Redes e Sistemas Distribuídos.', N'["A) Alterar o gateway da esta\u00E7\u00E3o PROFESSORES03 para 175.16.10.200.","B) Alterar o endere\u00E7o de IP da esta\u00E7\u00E3o PROFESSORES01 para 175.16.30.200.","C) Alterar a m\u00E1scara de sub-rede da esta\u00E7\u00E3o PROFESSORES01 para 255.255.0.0.","D) Alterar a m\u00E1scara de sub-rede da esta\u00E7\u00E3o PROFESSORES03 para 255.255.255.0.","E) Alterar o gateway da esta\u00E7\u00E3o PROFESSORES01 para o endere\u00E7o de IP 175.16.30.200."]', 2),
        (699, N'fase25', N'(ENADE 2021 · Questão 31 · Engenharia de Software) Um software de matrículas tem este diagrama de casos de uso: o ator Aluno se liga a "Realizar Matrícula"; "Realizar Matrícula Fora do Prazo" estende (<<extend>>) "Realizar Matrícula"; "Realizar Matrícula Fora do Prazo" inclui (<<include>>) "Validar Aluno"; e "Validar via Retina" e "Validar via Digital" são especializações de "Validar Aluno".

Avalie as afirmações:
I. O aluno poderá realizar a matrícula fora do prazo e as tratativas são as mesmas da matrícula feita dentro do prazo.
II. O aluno poderá, opcionalmente, realizar a matrícula fora do prazo.
III. O sistema, obrigatoriamente, deverá validar o aluno que realizar a matrícula fora do prazo.
IV. A validação do aluno deverá ser feita a partir da sua matrícula informada no sistema.
V. A validação do aluno, a ser feita por retina, é diferente da validação feita pela digital.

É correto apenas o que se afirma em', N'Alternativa D.

Justificativa: <<extend>> é opcional (II), <<include>> é obrigatório (III) e as especializações são formas diferentes de validar (V). A validação é por retina ou digital, não pela matrícula.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 31 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) I e IV.","B) I, II e IV.","C) I, III e V.","D) II, III e V.","E) II, III, IV e V."]', 3),
        (700, N'fase25', N'(ENADE 2021 · Questão 32 · Gestão e Empreendedorismo) O Canvas de Osterwalder divide o modelo de negócio em nove componentes: segmentos de clientes, proposta de valor, canais, relacionamento com cliente, fontes de receita, recursos principais, atividades-chave, parcerias principais e estrutura de custo. É muito usado por startups.

Diante deste contexto, conclui-se que as startups', N'Alternativa B.

Justificativa: O Canvas serve justamente para modelar e validar a ideia antes de investir, em qualquer segmento. Nenhum tipo de startup nasce validado ou pode ignorar um componente.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 32 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Gestão e Empreendedorismo.', N'["A) financeiras desenvolvem primeiro o plano de neg\u00F3cios, para em seguida partir para o Canvas.","B) de big data utilizam o Canvas para a modelagem da valida\u00E7\u00E3o da ideia de neg\u00F3cio, ou seja, do problema a ser resolvido.","C) de educa\u00E7\u00E3o dispensam a utiliza\u00E7\u00E3o do Canvas, ou seja, os modelos de neg\u00F3cios deste segmento j\u00E1 nascem validados.","D) de log\u00EDstica utilizam o plano de neg\u00F3cios ao inv\u00E9s do Canvas, ou seja, elas nascem a partir de um produto m\u00EDnimo vi\u00E1vel (MVP).","E) de impacto social podem desconsiderar o componente 1 (segmentos de clientes), pois possuem somente um segmento."]', 1);
    INSERT INTO flashcards (id, codigo_fase, frente, verso, dica, opcoes, correta) VALUES
        (701, N'fase25', N'(ENADE 2021 · Questão 33 · Engenharia de Software) O CMMI descreve práticas, processos e atividades de gestão que guiam a melhoria do processo de software até o nível mais alto de maturidade. Avalie as afirmações:
I. A maturidade implica no crescimento da capacidade e indica tanto a efetividade do processo de software quanto o grau de consistência com que este é aplicado nos diferentes projetos da organização.
II. A maturidade do processo de software implica melhorias contínuas com base em etapas evolutivas que se caracterizam pela capacidade de inovação e absorção de novas tecnologias.
III. A maturidade do processo de software implica na sua institucionalização por meio de políticas e padrões organizacionais, levando a uma cultura corporativa de métodos, práticas e procedimentos com efetividade plenamente reconhecida.
IV. Cada nível do CMMI implica na satisfação de um conjunto de metas de processo que estabilizam um componente importante do processo de software e representa o seu estágio de maturidade.

É correto apenas o que se afirma em', N'Alternativa D.

Justificativa: Pelo gabarito, a II é a falsa: as etapas evolutivas do CMMI são níveis de controle do processo, não de capacidade de inovação ou absorção de tecnologias.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 33 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Engenharia de Software.', N'["A) III.","B) I e II.","C) II e IV.","D) I, III e IV.","E) I, II, III e IV."]', 3),
        (702, N'fase25', N'(ENADE 2021 · Questão 34 · Inteligência Artificial) Um sistema especialista para diagnóstico de dengue usa a regra de produção:

Se ((temperatura > 38º) e (dores musculares intensas))
então (quadro de dengue, com 70% de chance);
senão (quadro de resfriado comum com 30% de chance);

Levando em conta essa regra, é correto afirmar que', N'Alternativa A.

Justificativa: A regra dá uma probabilidade para cada pessoa com os dois sintomas: 0,7. Ela não garante uma contagem exata (C) nem diz nada certo sobre quem tem só um sintoma.

Fonte: INEP, ENADE 2021, Tecnologia em Análise e Desenvolvimento de Sistemas, questão 34 (gabarito definitivo).', N'Questão oficial do ENADE 2021: Inteligência Artificial.', N'["A) cada pessoa que procura atendimento apresentando ambos os sintomas possui a probabilidade 0,7 de estar contaminada pela dengue.","B) se 50 pessoas procurarem o atendimento apresentando um dos dois sintomas, provavelmente 15 pessoas estar\u00E3o com resfriado comum.","C) se 100 pessoas procurarem o atendimento apresentando ambos os sintomas, a quantidade de pessoas com dengue ser\u00E1 igual a 70.","D) cada pessoa que chega apresentando um dos dois sintomas estar\u00E1 com resfriado comum.","E) a cada 100 pessoas que procuram atendimento, no m\u00E1ximo 30 estar\u00E3o doentes."]', 0);
    SET IDENTITY_INSERT flashcards OFF;
END;
GO

-- tb_areas_conhecimento: 12 registro(s)
IF NOT EXISTS (SELECT 1 FROM tb_areas_conhecimento)
BEGIN
    SET IDENTITY_INSERT tb_areas_conhecimento ON;
    INSERT INTO tb_areas_conhecimento (id_area, nome_area) VALUES
        (1, N'Matemática e Lógica'),
        (2, N'Banco de Dados'),
        (3, N'Engenharia de Software'),
        (4, N'Gestão de Projetos'),
        (5, N'Programação Orientada a Objetos'),
        (6, N'Redes e Sistemas Distribuídos'),
        (7, N'Sistemas Operacionais'),
        (8, N'Algoritmos e Estruturas de Dados'),
        (9, N'UX/UI e Requisitos'),
        (10, N'Cibersegurança e LGPD'),
        (11, N'Gestão e Empreendedorismo'),
        (12, N'Inteligência Artificial');
    SET IDENTITY_INSERT tb_areas_conhecimento OFF;
END;
GO

-- tb_provas: 2 registro(s)
IF NOT EXISTS (SELECT 1 FROM tb_provas)
BEGIN
    SET IDENTITY_INSERT tb_provas ON;
    INSERT INTO tb_provas (id_prova, ano, tipo) VALUES
        (1, 2017, N'ENADE'),
        (2, 2021, N'ENADE');
    SET IDENTITY_INSERT tb_provas OFF;
END;
GO

-- tb_questoes: 46 registro(s)
IF NOT EXISTS (SELECT 1 FROM tb_questoes)
BEGIN
    SET IDENTITY_INSERT tb_questoes ON;
    INSERT INTO tb_questoes (id_questao, id_area, enunciado, origem) VALUES
        (1, 1, N'A álgebra booleana possui o operador unário ~ (NÃO) e os operadores binários * (E) e + (OU). A tabela verdade da fórmula G, para as proposições p, q e r, é:

p q r | G
V V V | V
V V F | F
V F V | F
V F F | F
F V V | V
F V F | V
F F V | V
F F F | V

Considerando a ordem de precedência dos operadores booleanos, a fórmula G possui a mesma tabela verdade da proposição', N'ENADE 2017 - questão 10'),
        (2, 2, N'Num sistema para um clube recreativo, o diagrama de classes tem: Tipo_Associado (codigo, descricao, valorMensalidade) ligado a Associado com multiplicidade 1 para 0..*; e Associado (codigo, nome, endereco, telefone) ligado a Mensalidade (codigo, anomesreferencia, valormensalidade, datavencimento, valorpago, datapagamento) com multiplicidade 1 para 1..*.

Avalie as afirmações:
I. Haverá somente 12 mensalidades para cada associado, ou seja, elas não poderão ultrapassar os 12 meses do ano.
II. Não existem associados sem mensalidades, nem mensalidades sem associado a elas relacionado.
III. Alterando-se o valor da mensalidade definido para cada tipo de associado, o sistema automaticamente altera os valores das mensalidades geradas anteriormente.
IV. Poderão existir tipos de associados que não terão nenhum associado relacionado a eles.

É correto apenas o que se afirma em', N'ENADE 2017 - questão 11'),
        (3, 3, N'Considere os requisitos de um sistema acadêmico de uma universidade:
R1: o sistema deve permitir que cada professor realize o lançamento de notas das turmas nas quais lecionou;
R2: o sistema deverá ser desenvolvido de forma a possibilitar seu transporte para outro sistema operacional em, no máximo, sessenta dias;
R3: o sistema deve permitir que um estudante realize a sua matrícula nas disciplinas oferecidas em um semestre letivo;
R4: o sistema atualiza a nota do estudante, permitindo sua visualização, em até dois segundos depois do momento que o professor a registra;
R5: o sistema deve permitir que o auxiliar de serviços acadêmicos realize o cadastro de um estudante em não mais do que dez minutos de orientação.

Representam requisitos não funcionais apenas os requisitos', N'ENADE 2017 - questão 12'),
        (4, 3, N'Sobre o modelo CMMI, avalie as asserções e a relação proposta entre elas.

I. O CMMI fornece diretrizes para a melhoria dos processos e habilidades organizacionais, incluindo o ciclo de vida de produtos e serviços, que abrange as fases de concepção, desenvolvimento, aquisição, entrega e manutenção.

PORQUE

II. As empresas brasileiras estão aderindo a programas de fomento à melhoria da qualidade de software, por meio da aplicação do modelo de maturidade CMMI, que é mais direcionado às pequenas e médias empresas, apesar de também ser aplicável em grandes organizações.', N'ENADE 2017 - questão 13'),
        (5, 4, N'A tabela apresenta as atividades de um projeto (predecessora; duração em dias):
A (--; 3), B (A; 5), C (--; 12), D (--; 4), E (D; 2), F (D; 5), G (F; 7), H (E e G; 8), I (B; 11), J (C, H e I; 3).

Avalie as afirmações:
I. O caminho crítico é composto pelas atividades A, B, I e J.
II. O caminho crítico tem 27 dias.
III. A atividade H faz parte do caminho crítico.
IV. O projeto em pauta possui dois caminhos críticos.

É correto apenas o que se afirma em', N'ENADE 2017 - questão 14'),
        (6, 5, N'Um diagrama de classes modela a transferência de materiais entre funcionários. RequisicaoTransferencia (dataRequisicao: date) tem duas associações navegáveis para Funcionario (nome: string), com os papéis "origem" e "destino" e multiplicidade 1. RequisicaoTransferencia também tem uma composição (losango cheio do seu lado) com Material (descricao: string, preco: double), navegável para Material, com papel "material" e multiplicidade 0..1 do lado da requisição e 1..* do lado de Material.

Avalie as afirmações:
I. A classe Funcionario é abstrata.
II. Uma RequisicaoTransferencia só existe se estiver vinculada a um Material.
III. A classe Funcionario, em razão de sua associação, possui um atributo do tipo RequisicaoTransferencia.
IV. Em uma implementação da classe RequisicaoTransferencia, é necessário adicionar um atributo simples do tipo Material.

É correto o que se afirma em', N'ENADE 2017 - questão 16'),
        (7, 3, N'Considerando a etapa de manutenção no processo de desenvolvimento de software, avalie as afirmações:
I. A fase de manutenção é uma parte explícita do modelo em cascata do processo de desenvolvimento de software.
II. A atualização do sistema para inserir customizações é considerada um tipo de manutenção.
III. A depuração do programa é um processo específico da fase de desenvolvimento e um tipo de manutenção.
IV. O acréscimo de novas funções a um sistema existente, sem perturbar sua operação, é considerado um tipo de manutenção.
V. A manutenção do sistema está relacionada ao aumento do ciclo de vida do software.

É correto apenas o que se afirma em', N'ENADE 2017 - questão 17'),
        (8, 6, N'As redes de computadores estão por toda parte e compartilham recursos por meio de sistemas distribuídos, que comunicam e coordenam vários dispositivos.

Assinale a opção que apresenta exemplos atuais de sistemas distribuídos.', N'ENADE 2017 - questão 18'),
        (9, 7, N'Conceitualmente, cada processo tem sua própria CPU virtual. Na realidade, a CPU troca a execução, a todo momento, de um processo para outro, mas é muito mais fácil pensar em um conjunto de processos sendo executados (pseudo) paralelamente do que tentar controlar o modo como a CPU faz esses chaveamentos. (Tanenbaum, adaptado)

De acordo com o exposto, o conceito descrito denomina-se', N'ENADE 2017 - questão 19'),
        (10, 3, N'A respeito dos modelos de processo de software, avalie as afirmações:
I. São atividades do modelo incremental: especificação, desenvolvimento e validação.
II. No modelo espiral, a fase de modelagem é responsável, entre outras atividades, pela estimativa, cronograma e análise de risco.
III. O modelo cascata sugere uma abordagem sequencial e sistemática para o desenvolvimento de software, iniciando na especificação de requisitos e finalizando com a entrega do software concluído.

É correto o que se afirma em', N'ENADE 2017 - questão 21'),
        (11, 3, N'Um desenvolvedor recém-formado recebeu explicações sobre como a gerência de configuração funcionava. Avalie as afirmações:
I. Inicialmente, para ter acesso à base de desenvolvimento, o profissional deve realizar uma operação de checkout para baixar os arquivos do projeto que estão armazenados no servidor.
II. Quando mais de um desenvolvedor estiver modificando um mesmo documento, ao se tentar realizar um commit, pode ser necessário realizar uma operação de tag (release) para resolução do conflito entre a versão local e a versão mais recente no repositório.
III. No desenvolvimento de um novo caso de uso, em que diversos arquivos sejam modificados, é recomendada a criação de uma ramificação (branch).
IV. A versão estável é o ramo principal de desenvolvimento, que segue do começo do desenvolvimento até o momento presente.

É correto apenas o que se afirma em', N'ENADE 2017 - questão 22'),
        (12, 3, N'Verificações, validações e testes são fundamentais para certificar a qualidade do software. Avalie as afirmações:
I. O teste funcional certifica se o software desempenha as funções especificadas nos requisitos.
II. O teste de desempenho valida a conformidade da especificação do processo de desenvolvimento de software.
III. O teste de aceitação é realizado pelo cliente a fim de validar se aquilo que foi implementado é o que foi solicitado.
IV. O teste de instalação, invariavelmente, é executado no local determinado pelo cliente para instalação do software.
V. As técnicas de verificação e validação de software asseguram que o sistema que está sendo desenvolvido seja adequado ao seu propósito.

É correto apenas o que se afirma em', N'ENADE 2017 - questão 23'),
        (13, 3, N'Muitos sistemas corporativos das décadas de 1970 e 1980 foram feitos em Cobol, com ADABAS e arquivos ISAM e VSAM, produtos que estão sendo descontinuados. A reengenharia desses sistemas com linguagens e bancos mais modernos é uma oportunidade de negócio. Avalie as afirmações:
I. A dificuldade de reengenharia de sistemas antigos deve-se ao fato de que, na maioria das vezes, o desenvolvedor definia o sistema e esse já era o próprio processo da organização.
II. O custo de alteração para modernização de uma linha de código em Cobol é alto; por isso, fazer a manutenção desses sistemas é menos dispendioso.
III. Uma estratégia de conversão dos referidos sistemas para uma linguagem orientada a objetos é definir uma estrutura de classes e métodos e realizar o refatoramento do código.

É correto o que se afirma em', N'ENADE 2017 - questão 24'),
        (14, 8, N'O fragmento C++ a seguir insere um nó em uma árvore binária.

struct noArvore {
    int dado;
    noArvore *esquerda;
    noArvore *direita;
};

noArvore *insere(noArvore *arvore, int valor) {
    if (arvore == NULL) {
        arvore = new noArvore;
        arvore->esquerda = NULL;
        arvore->direita = NULL;
        arvore->dado = valor;
    } else if (valor < arvore->dado) {
        arvore->esquerda = insere(arvore->esquerda, valor);
    } else {
        arvore->direita = insere(arvore->direita, valor);
    }
    return arvore;
}

Assinale a opção que imprime os valores dos nós percorrendo a árvore em pré-ordem.', N'ENADE 2017 - questão 25'),
        (15, 5, N'Uma calculadora feita com MVC tem dois modos: comum e probabilista. A classe Calculadora guarda uma variável c do tipo CalculadoraController; o método multiplica(valores) apenas retorna c.multiplica(valores), e alteraModo() faz c = new ProbabilistaController() se modo == 1, senão c = new OrdinarioController(). ProbabilistaController e OrdinarioController herdam de CalculadoraController e implementam multiplica(valores: double[]): double, formando uma família de algoritmos intercambiáveis.

Avalie as afirmações:
I. A hierarquia exibida ilustra o uso do padrão de projetos Strategy.
II. O padrão composto MVC define a existência de um único controller e, portanto, a solução proposta não caracteriza o uso desse padrão.
III. O método multiplica da classe Calculadora chama o método multiplica de CalculadoraController, o que caracteriza uma conversão de interfaces e, portanto, o uso do padrão de projetos Adapter.

É correto o que se afirma em', N'ENADE 2017 - questão 26'),
        (16, 3, N'O processo de descobrir, analisar, documentar e verificar os serviços e restrições de um sistema é denominado engenharia de requisitos (Sommerville). Avalie as atribuições listadas, no que se refere à etapa de especificação de requisitos:
I. Identificar as expectativas e necessidades dos stakeholders com relação ao software a ser desenvolvido.
II. Distribuir os requisitos em categorias, explorar as relações entre eles e classificar sua importância para os stakeholders.
III. Produzir um documento de especificação de requisitos, de forma que todos os stakeholders possam entendê-lo.
IV. Examinar a especificação do software para assegurar que todos os requisitos foram definidos sem inconsistências.

São atribuições na etapa de especificação de requisitos os itens', N'ENADE 2017 - questão 28'),
        (17, 1, N'Uma pesquisa usa os conjuntos A ("possui ensino superior"), B ("possui pós-graduação") e C ("possui pelo menos 5 anos de experiência"). As expressões são:
Expressão 1: x ∈ A ∧ x ∉ (B ∪ C)
Expressão 2: x ∈ A − (B ∪ C)
Expressão 3: x ∈ A ∧ x ∈ B ∧ x ∈ C

Um programa em C usa a função contem(conjunto, p):
/* condição 1 */
if (contem(A, p) && !contem(B, p) && !contem(C, p)) { ... }
/* condição 2 */
else if (contem(A, p) || contem(B, p) || contem(C, p)) { ... }

Assinale a opção correta.', N'ENADE 2017 - questão 29'),
        (18, 5, N'Considere o código Java:

public abstract class Impressora {
    String nome;
    public void imprimir() {}
}
public class Laser extends Impressora {
    public void imprimir() { System.out.println("Imprimindo na Laser"); }
}
class Matricial extends Impressora {
    public void imprimir() { System.out.println("Imprimindo na Matricial"); }
}
public class JatoDeTinta extends Impressora {
    public void imprimir() { System.out.println("Imprimindo na Jato de tinta"); }
}
public class Main {
    public static void main(String args[]) {
        Impressora imp[] = new Impressora[3];
        imp[0] = new Laser();
        imp[1] = new JatoDeTinta();
        imp[2] = new Matricial();
        for (int i = imp.length - 1; i >= 0; i--) {
            imp[i].imprimir();
        }
    }
}

Avalie as afirmações:
I. A execução resulta em: Imprimindo na Laser / Imprimindo na Matricial / Imprimindo na Jato de tinta.
II. O código faz uso da técnica denominada polimorfismo.
III. O código não será compilado, pois o vetor imp foi instanciado por meio da classe abstrata Impressora.

É correto o que se afirma em', N'ENADE 2017 - questão 30'),
        (19, 9, N'À medida que o projeto de uma interface evolui, quatro questões quase sempre aparecem: tempo de resposta, recursos de ajuda, tratamento de erros e nomes de comandos (Pressman). Avalie as afirmações:
I. A análise de interfaces tem por objetivo identificar o perfil dos usuários e auxiliar na especificação do requisito não funcional de segurança pertinente ao perfil de acesso dos usuários.
II. O requisito não funcional de segurança descreve as características relacionadas a inteligibilidade, modo de usar ou operar o sistema.
III. O requisito não funcional de confiabilidade descreve as características relacionadas ao tempo de resposta para processamento de dados ou informações.
IV. O requisito não funcional de usabilidade descreve diretrizes de acessibilidade para pessoas com deficiência.

É correto apenas o que se afirma em', N'ENADE 2017 - questão 31'),
        (20, 2, N'Um banco guarda o resultado de uma eleição nas tabelas Partido (numero, nome, sigla), Candidato (numero, nome), em que o número do candidato é o número do seu partido, e Votacao (partido, votos, estado), com os votos de cada partido em cada estado.

Qual comando SQL seleciona os nomes dos candidatos, seus partidos e o total de votos de cada partido?', N'ENADE 2017 - questão 32'),
        (21, 8, N'Um programador implementou a ordenação por inserção para vetor[1..9], mas o algoritmo não funciona:

01 para i <- 2 até 9 faça
02    valor <- vetor[i]
03    j <- i - 1
04    enquanto ((j >= 1) e (valor < vetor[j])) faça
05       vetor[i] <- vetor[j]
06       j <- j - 1
07       se (j = 0) então
08          interrompa
09       fim se
10    fim enquanto
11    vetor[j + 1] <- valor
12 fim para

Qual linha e comando devem ser substituídos para que o algoritmo ordene o vetor de forma crescente?', N'ENADE 2017 - questão 33'),
        (22, 2, N'Inspirado no diálogo entre Chicó e João Grilo (Auto da Compadecida), um modelo de dados tem a entidade pessoa (codigo, que é o identificador; rg; cpf; nome) ligada pelo relacionamento possui à entidade cavalo (codigo, que é o identificador; raca; eBento?). A cardinalidade (1,1) aparece junto de pessoa e (0,1) junto de cavalo.

Avalie as afirmações:
I. O Chicó e a velha poderão ser cadastrados na entidade pessoa.
II. O Chicó e a velha poderão ter mais que um cavalo cadastrados.
III. O atributo rg da entidade pessoa pode ter a função de chave primária nessa entidade.
IV. O cavalo deverá ter no mínimo uma pessoa e uma pessoa poderá ser cadastrada sem a necessidade de ter um cavalo.

É correto apenas o que se afirma em', N'ENADE 2017 - questão 34'),
        (23, 9, N'Num site de venda de ingressos, os links para cada show são imagens. O web designer implementou cada link assim, para que usuários de leitores de tela recebam um texto informativo:

<a href="link-area-venda-ingresso">
    <img src="imagem-show.jpg" alt="identificação do show" />
</a>

Considerando o uso do atributo alt e a interação humano-computador, o web designer atendeu o requisito de', N'ENADE 2017 - questão 35'),
        (24, 3, N'A etapa de definição de requisitos estabelece quais funções são requeridas pelo sistema e as restrições sobre a operação e o desenvolvimento do software. Os requisitos podem ser funcionais ou não funcionais (Sommerville).

Assinale a alternativa em que o item é um requisito funcional.', N'ENADE 2021 - questão 9'),
        (25, 8, N'O código Java a seguir implementa uma Pilha encadeada.

public class No {
    public int dado;
    public No prox;
    public No(int dado) { this.dado = dado; }
}
public class PilhaEncadeada {
    private No topo;
    public int pop() {
        if (topo == null) return -1;
        No lixo = topo;
        topo = topo.prox;
        lixo.prox = null;
        return lixo.dado;
    }
    public int top() {
        if (topo == null) return -1;
        return topo.dado;
    }
}

Assinale a opção com a implementação correta do método push.', N'ENADE 2021 - questão 11'),
        (26, 3, N'Uma fábrica de software usa Scrum, eXtreme Programming (XP) e quadro Kanban. Avalie as afirmações:
I. Métodos ágeis são baseados em ciclos iterativos e incrementais que se concentram no desenvolvimento rápido e na flexibilidade às mudanças, com a participação do cliente no processo de software.
II. Uma forte característica da XP é a garantia da qualidade do código produzido e, para isso, os desenvolvedores produzem testes automatizados antes mesmo de codificar uma funcionalidade.
III. O planejamento no Scrum é baseado na elaboração dos itens do product backlog, que é uma lista de funcionalidades desejadas pelo cliente, sendo o Scrum Master o responsável por gerenciá-lo.
IV. O quadro Kanban permite monitorar a evolução das tarefas necessárias durante o processo ágil, possibilitando um acompanhamento visual das atividades em construção.

É correto apenas o que se afirma em', N'ENADE 2021 - questão 12'),
        (27, 8, N'As variáveis pilha e fila são uma Pilha e uma Fila. Um programador executou:

pilha.push(''A''); pilha.push(''B''); pilha.push(''C'');
fila.enqueue(pilha.top());
fila.enqueue(pilha.top());
fila.enqueue(''D'');
pilha.push(fila.dequeue());
fila.enqueue(fila.dequeue());
fila.enqueue(pilha.pop());
pilha.push(''E'');
fila.enqueue(''E'');
pilha.pop();

Ao imprimir o conteúdo de pilha e fila, respectivamente, seria exibido:', N'ENADE 2021 - questão 13'),
        (28, 4, N'Um projeto de integração de um ERP com um CRM não implementou todos os serviços esperados e há falhas nos já implementados. Uma auditoria identificou desentendimentos entre os membros da equipe; os membros da qualidade não compreendem o que deve ser avaliado; demandas de novos solicitantes aparecem constantemente; e o patrocinador demora muito a responder às solicitações. Tudo isso atrasou o projeto e estourou o orçamento.

O gerente de projeto deve priorizar o gerenciamento de', N'ENADE 2021 - questão 14'),
        (29, 2, N'Um banco de dados bancário tem, entre outras, as tabelas CLIENTE (COD_CLIENTE, NOM_CLIENTE, ...), CONTA (NUM_CONTA, COD_CLIENTE, ...) e HISTORICO_MOVIMENTACAO (COD_HISTORICO_MOVIMENTACAO, NUM_CONTA, VAL_MOVIMENTACAO, DTA_MOVIMENTACAO, ...).

Indique a consulta SQL que recupera o nome dos clientes e o valor médio movimentado por eles em sua conta até o momento, exibindo primeiro os clientes com maior média.', N'ENADE 2021 - questão 17'),
        (30, 3, N'A engenharia de requisitos tem quatro subprocessos: estudo de viabilidade, elicitação, especificação e validação (Sommerville). Uma equipe vai desenvolver um software de Suporte Técnico; o estudo de viabilidade já foi aprovado e ela seguirá os outros três subprocessos.

Quais artefatos podem ser usados nesses três subprocessos?', N'ENADE 2021 - questão 18'),
        (31, 3, N'A respeito dos estilos e padrões arquiteturais, avalie as afirmações:
I. Em arquiteturas orientadas a objetos, a comunicação entre os componentes do software é realizada por intermédio da troca de mensagens.
II. As arquiteturas monolíticas consistem de um sistema dividido em pequenas partes, possibilitando que estas tenham sua manutenção, execução e evolução individual.
III. No padrão MVC, a camada de Modelo armazena as interações realizadas no Controle, podendo ser apresentadas/manipuladas posteriormente na Visão.
IV. Nas arquiteturas de microsserviços, o software possui componentes altamente acoplados, dificultando a manutenção.

É correto apenas o que se afirma em', N'ENADE 2021 - questão 19'),
        (32, 9, N'Uma secretaria municipal vai criar um site para pessoas da terceira idade, com orientações de saúde, eventos esportivos e publicação de fotos que podem ser curtidas e comentadas. A maioria desse público acessa a internet pelo celular ou tablet, e uma parte prefere computadores.

Avalie as afirmações:
I. A segurança no uso é um fator crítico de usabilidade a ser considerado no projeto, tendo em vista que pessoas da terceira idade são temerosas quanto ao registro de dados pessoais e confidenciais em sites e aplicativos.
II. A responsividade, que pressupõe o uso de valores relativos para definir as dimensões de elementos na estilização de páginas HTML, deve ser considerada, tendo em vista o acesso por dispositivos com diferentes tamanhos de tela.
III. A construção de protótipos pode antecipar problemas de design de interação e minimizar custos, e é viável para uma comunicação mais objetiva com o público-alvo, possibilitando validar a usabilidade e a experiência do usuário.
IV. O design participativo é um processo de design de IHC viável para direcionar o projeto, pois o público-alvo tende a apresentar dificuldades no manuseio de tecnologias da informação e da comunicação.

É correto apenas o que se afirma em', N'ENADE 2021 - questão 20'),
        (33, 3, N'A Gestão de Configuração de Software estabelece um conjunto de atividades para gerenciar alterações durante todo o ciclo de vida de um software (Pressman).

Assinale a opção correta acerca das atividades de gestão de configuração de software.', N'ENADE 2021 - questão 21'),
        (34, 3, N'Sobre o processo de Gerência de Configuração de Software (GCS), avalie as afirmações:
I. O controle de versão possibilita o compartilhamento de dados e a edição colaborativa, permitindo a gestão de diferentes ramos de desenvolvimento e a existência de diferentes versões de forma simultânea.
II. A auditoria de configuração é uma atividade de garantia de qualidade que tem por objetivo assegurar que a qualidade do software seja mantida quando feitas alterações requisitadas.
III. O relatório de status de configuração tem por objetivo manter o cliente informado sobre as alterações, e deve ser gerado ao final do processo.
IV. A GCS proporciona atividades de acompanhamento e controle de mudanças que se iniciam logo depois que o software for fornecido ao cliente e colocado em operação.

É correto apenas o que se afirma em', N'ENADE 2021 - questão 22'),
        (35, 3, N'A evolução de sistemas legados se divide em manutenção, modernização e substituição. Um ERP já implantado integra todos os departamentos de uma empresa, e surgiu a necessidade de criar um relatório gerencial de comissão da equipe de vendas.

Nesse contexto, a manutenção a ser realizada é', N'ENADE 2021 - questão 23'),
        (36, 3, N'Num sistema web de delivery, o analista de teste descreveu:
01 – Verificar se o método "Finalizar Pedido" da classe "Pedido" está funcionando corretamente.
02 – Garantir que o sistema funcione corretamente em diferentes navegadores.
03 – O sistema deve passar por testes rigorosos na estrutura lógica interna do software.
04 – O sistema deve garantir, no mínimo, o registro de 100 pedidos simultâneos.
05 – O usuário deve testar o sistema em um ambiente controlado sob a supervisão dos desenvolvedores.

Avalie as afirmações:
I. A descrição 01 deve ser verificada com teste unitário.
II. A descrição 02 deve ser executada com a abordagem caixa-branca.
III. A descrição 03 deve ser executada com a abordagem caixa-preta.
IV. A descrição 04 deve ser verificada com teste de carga.
V. A descrição 05 deve ser classificada como teste alfa.

É correto apenas o que se afirma em', N'ENADE 2021 - questão 24'),
        (37, 3, N'Uma empresa de piscicultura pediu com extrema urgência um sistema para gerenciar a criação dos peixes, das fases de alevino e engorda até a venda, registrando mortandade e rações.

Avalie as afirmações sobre o processo de desenvolvimento a usar:
I. Deve ser adotado um processo baseado no modelo cascata, pois ele se adapta melhor a cenários com muitas mudanças.
II. Por se tratar de uma aplicação com escopo pequeno, o modelo espiral deverá ser utilizado, já que reduzirá riscos por meio da prototipação de cada fase dos peixes e diminuirá o tempo de entrega.
III. O modelo incremental deve ser utilizado, já que partes do sistema referentes à fase inicial dos peixes poderiam ser disponibilizadas, enquanto as demais estão nas etapas de concepção e desenvolvimento.
IV. Em razão da extrema urgência, a empresa deve elaborar seu processo utilizando o modelo RAD (Rapid Application Development).

É correto apenas o que se afirma em', N'ENADE 2021 - questão 25'),
        (38, 10, N'Empreender em computação exige observar a legislação, como a Lei Geral de Proteção de Dados Pessoais (LGPD, Lei n. 13.709/2018).

Assinale os fundamentos da disciplina da proteção de dados pessoais, previstos no art. 2º da LGPD.', N'ENADE 2021 - questão 26'),
        (39, 1, N'Os profissionais de TI precisam converter números entre as bases binária (2), octal (8), decimal (10) e hexadecimal (16).

Fazendo a conversão da soma (1001)₂ + (15)₈ + (FF)₁₆, qual é o número equivalente na base decimal?', N'ENADE 2021 - questão 27'),
        (40, 7, N'O sistema operacional é um gerenciador de recursos. É uma péssima ideia permitir que os programas tenham acesso sem restrição à memória uns dos outros: um programa com defeito ou malicioso pode travar outro, produzir resultados incorretos ou afetar todo o sistema (Stuart, adaptado).

A atividade com que o sistema operacional garante essa proteção é', N'ENADE 2021 - questão 28'),
        (41, 8, N'Considere o algoritmo:

mat[1..3][1..5] = {{1, 2, -1, 2, 3}, {1, -3, 4, 2, 0}, {-3, 5, 2, 3, 4}}
sl[1..3] = {0, 0, 0}
x <- 0
para i <- 1 até 3 faça
    para j <- 1 até 5 faça
        sl[i] <- sl[i] + mat[i][j]
    fimpara
    x <- x + sl[i]
fimpara
imprima x

No fim da execução, será exibido o valor', N'ENADE 2021 - questão 29'),
        (42, 6, N'Na sala dos professores há 3 máquinas na rede:
PROFESSORES01: IP 175.16.10.200, máscara 255.255.255.0, gateway 175.16.1.1
PROFESSORES02: IP 175.16.20.200, máscara 255.255.0.0, gateway 175.16.1.1
PROFESSORES03: IP 175.16.30.200, máscara 255.255.0.0, gateway 175.16.1.1

A estação PROFESSORES01 não consegue imprimir na impressora compartilhada pela PROFESSORES03. Que alteração resolve o problema?', N'ENADE 2021 - questão 30'),
        (43, 3, N'Um software de matrículas tem este diagrama de casos de uso: o ator Aluno se liga a "Realizar Matrícula"; "Realizar Matrícula Fora do Prazo" estende (<<extend>>) "Realizar Matrícula"; "Realizar Matrícula Fora do Prazo" inclui (<<include>>) "Validar Aluno"; e "Validar via Retina" e "Validar via Digital" são especializações de "Validar Aluno".

Avalie as afirmações:
I. O aluno poderá realizar a matrícula fora do prazo e as tratativas são as mesmas da matrícula feita dentro do prazo.
II. O aluno poderá, opcionalmente, realizar a matrícula fora do prazo.
III. O sistema, obrigatoriamente, deverá validar o aluno que realizar a matrícula fora do prazo.
IV. A validação do aluno deverá ser feita a partir da sua matrícula informada no sistema.
V. A validação do aluno, a ser feita por retina, é diferente da validação feita pela digital.

É correto apenas o que se afirma em', N'ENADE 2021 - questão 31'),
        (44, 11, N'O Canvas de Osterwalder divide o modelo de negócio em nove componentes: segmentos de clientes, proposta de valor, canais, relacionamento com cliente, fontes de receita, recursos principais, atividades-chave, parcerias principais e estrutura de custo. É muito usado por startups.

Diante deste contexto, conclui-se que as startups', N'ENADE 2021 - questão 32'),
        (45, 3, N'O CMMI descreve práticas, processos e atividades de gestão que guiam a melhoria do processo de software até o nível mais alto de maturidade. Avalie as afirmações:
I. A maturidade implica no crescimento da capacidade e indica tanto a efetividade do processo de software quanto o grau de consistência com que este é aplicado nos diferentes projetos da organização.
II. A maturidade do processo de software implica melhorias contínuas com base em etapas evolutivas que se caracterizam pela capacidade de inovação e absorção de novas tecnologias.
III. A maturidade do processo de software implica na sua institucionalização por meio de políticas e padrões organizacionais, levando a uma cultura corporativa de métodos, práticas e procedimentos com efetividade plenamente reconhecida.
IV. Cada nível do CMMI implica na satisfação de um conjunto de metas de processo que estabilizam um componente importante do processo de software e representa o seu estágio de maturidade.

É correto apenas o que se afirma em', N'ENADE 2021 - questão 33'),
        (46, 12, N'Um sistema especialista para diagnóstico de dengue usa a regra de produção:

Se ((temperatura > 38º) e (dores musculares intensas))
então (quadro de dengue, com 70% de chance);
senão (quadro de resfriado comum com 30% de chance);

Levando em conta essa regra, é correto afirmar que', N'ENADE 2021 - questão 34');
    SET IDENTITY_INSERT tb_questoes OFF;
END;
GO

-- tb_alternativas: 230 registro(s)
IF NOT EXISTS (SELECT 1 FROM tb_alternativas)
BEGIN
    SET IDENTITY_INSERT tb_alternativas ON;
    INSERT INTO tb_alternativas (id_alternativa, id_questao, texto, is_correta) VALUES
        (1, 1, N'p + ~q * r.', 0),
        (2, 1, N'p + q * ~r.', 0),
        (3, 1, N'~p + q * r.', 1),
        (4, 1, N'~p + ~q * r.', 0),
        (5, 1, N'~p + q * ~r.', 0),
        (6, 2, N'I e II.', 0),
        (7, 2, N'I e III.', 0),
        (8, 2, N'II e IV.', 1),
        (9, 2, N'I, III e IV.', 0),
        (10, 2, N'II, III e IV.', 0),
        (11, 3, N'R1, R2 e R3.', 0),
        (12, 3, N'R1, R2 e R5.', 0),
        (13, 3, N'R1, R3 e R4.', 0),
        (14, 3, N'R2, R4 e R5.', 1),
        (15, 3, N'R3, R4 e R5.', 0),
        (16, 4, N'As asserções I e II são verdadeiras, e a II é uma justificativa correta da I.', 0),
        (17, 4, N'As asserções I e II são verdadeiras, mas a II não é uma justificativa correta da I.', 0),
        (18, 4, N'A asserção I é verdadeira, e a II é falsa.', 1),
        (19, 4, N'A asserção I é falsa, e a II é verdadeira.', 0),
        (20, 4, N'As asserções I e II são falsas.', 0),
        (21, 5, N'I e II.', 0),
        (22, 5, N'I e IV.', 0),
        (23, 5, N'II e III.', 1),
        (24, 5, N'I, III e IV.', 0),
        (25, 5, N'II, III e IV.', 0),
        (26, 6, N'II, apenas.', 1),
        (27, 6, N'I e II, apenas.', 0),
        (28, 6, N'III e IV, apenas.', 0),
        (29, 6, N'I, III e IV, apenas.', 0),
        (30, 6, N'I, II, III e IV.', 0),
        (31, 7, N'I e III.', 0),
        (32, 7, N'IV e V.', 0),
        (33, 7, N'I, II e III.', 0),
        (34, 7, N'I, II, IV e V.', 1),
        (35, 7, N'II, III, IV e V.', 0),
        (36, 8, N'Pesquisa na web, jogos on-line, e-commerce e o banco de dados das agências bancárias.', 1),
        (37, 8, N'Jogos on-line, e-commerce, pesquisa no Windows e e-mails.', 0),
        (38, 8, N'E-commerce, jogos em mídia física, pesquisa no Windows e redes sociais.', 0),
        (39, 8, N'Pesquisa na web, jogos em mídia física, e-commerce e e-mails.', 0),
        (40, 8, N'Pesquisa no Windows, pesquisa na web, jogos on-line e o banco de dados das agências bancárias.', 0),
        (41, 9, N'thread.', 0),
        (42, 9, N'multiprocessador.', 0),
        (43, 9, N'multiprogramação.', 1),
        (44, 9, N'processo monothread.', 0),
        (45, 9, N'máquina de estados finitos.', 0),
        (46, 10, N'II, apenas.', 0),
        (47, 10, N'III, apenas.', 0),
        (48, 10, N'I e II, apenas.', 0),
        (49, 10, N'I e III, apenas.', 1),
        (50, 10, N'I, II e III.', 0),
        (51, 11, N'I e II.', 0),
        (52, 11, N'I e III.', 1),
        (53, 11, N'II e IV.', 0),
        (54, 11, N'I, III e IV.', 0),
        (55, 11, N'II, III e IV.', 0),
        (56, 12, N'I e IV.', 0),
        (57, 12, N'I, III e V.', 1),
        (58, 12, N'II, III e IV.', 0),
        (59, 12, N'II, IV e V.', 0),
        (60, 12, N'I, II, III e V.', 0),
        (61, 13, N'I, apenas.', 0),
        (62, 13, N'III, apenas.', 0),
        (63, 13, N'I e II, apenas.', 0),
        (64, 13, N'II e III, apenas.', 0),
        (65, 13, N'I, II e III.', 1),
        (66, 14, N'if (raiz != NULL) {
    cout << raiz->dado << " ";
    preorder(raiz->esquerda);
    preorder(raiz->direita);
}', 1),
        (67, 14, N'if (raiz != NULL) {
    preorder(raiz->direita);
    preorder(raiz->esquerda);
    cout << raiz->dado << " ";
}', 0),
        (68, 14, N'if (raiz != NULL) {
    preorder(raiz->esquerda);
    cout << raiz->dado << " ";
    preorder(raiz->direita);
}', 0),
        (69, 14, N'if (raiz != NULL) {
    preorder(raiz->esquerda);
    preorder(raiz->direita);
    cout << raiz->dado << " ";
}', 0),
        (70, 14, N'if (raiz != NULL) {
    preorder(raiz->direita);
    cout << raiz->dado << " ";
    preorder(raiz->esquerda);
}', 0),
        (71, 15, N'I, apenas.', 1),
        (72, 15, N'II, apenas.', 0),
        (73, 15, N'I e III, apenas.', 0),
        (74, 15, N'II e III, apenas.', 0),
        (75, 15, N'I, II e III.', 0),
        (76, 16, N'I e III, apenas.', 0),
        (77, 16, N'I e IV, apenas.', 0),
        (78, 16, N'II e III, apenas.', 0),
        (79, 16, N'II e IV, apenas.', 0),
        (80, 16, N'I, II, III e IV.', 1),
        (81, 17, N'A condição 2 do programa é equivalente à expressão 3.', 0),
        (82, 17, N'Pessoas com pós-graduação pertencem ao conjunto definido pela expressão 2.', 0),
        (83, 17, N'A condição 1 do programa é verdadeira para todas as pessoas com ensino superior.', 0),
        (84, 17, N'A condição 1 do programa e as expressões 1 e 2, que representam o mesmo subconjunto, são equivalentes.', 1),
        (85, 17, N'A condição 2 do programa define o conjunto de pessoas que tem ensino superior, pós-graduação e pelo menos cinco anos de experiência em sua área de atuação.', 0),
        (86, 18, N'II, apenas.', 1),
        (87, 18, N'III, apenas.', 0),
        (88, 18, N'I e II, apenas.', 0),
        (89, 18, N'I e III, apenas.', 0),
        (90, 18, N'I, II e III.', 0),
        (91, 19, N'I e III.', 0),
        (92, 19, N'I e IV.', 1),
        (93, 19, N'II e IV.', 0),
        (94, 19, N'I, II e III.', 0),
        (95, 19, N'II, III e IV.', 0),
        (96, 20, N'SELECT c.nome, p.nome, SUM(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero;', 0),
        (97, 20, N'SELECT c.nome, p.nome, COUNT(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome;', 0),
        (98, 20, N'SELECT c.nome, p.nome, SUM(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome;', 1),
        (99, 20, N'SELECT c.nome, p.nome, v.votos FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome, SUM(v.votos);', 0),
        (100, 20, N'SELECT c.nome, p.nome, COUNT(v.votos) FROM Partido p, Candidato c, Votacao v WHERE c.numero = p.numero and v.partido = c.numero GROUP BY c.nome, p.nome, v.votos;', 0);
    INSERT INTO tb_alternativas (id_alternativa, id_questao, texto, is_correta) VALUES
        (101, 21, N'Linha 01; para i <- 1 até 9 faça', 0),
        (102, 21, N'Linha 03; j <- i', 0),
        (103, 21, N'Linha 04; enquanto ((j >= 1) ou (valor < vetor[j])) faça', 0),
        (104, 21, N'Linha 05; vetor[j + 1] <- vetor[j]', 1),
        (105, 21, N'Linha 11; vetor[j] <- valor', 0),
        (106, 22, N'I e III.', 0),
        (107, 22, N'I e IV.', 1),
        (108, 22, N'II e III.', 0),
        (109, 22, N'I, II e IV.', 0),
        (110, 22, N'II, III e IV.', 0),
        (111, 23, N'segurança no uso, pois se uma imagem tiver baixa resolução, o texto associado possibilita identificar o conteúdo do link.', 0),
        (112, 23, N'facilidade de aprendizado, pois imagens aliadas a textos informativos ajudam o usuário a aprender os caminhos de navegação.', 0),
        (113, 23, N'acessibilidade, pois a possibilidade de acesso à página por pessoas com deficiência visual oferece condições de igualdade na interação com o sistema web.', 1),
        (114, 23, N'ergonomia, pois imagens em links causam cansaço visual em smartphones e o atributo alt substitui a imagem por texto.', 0),
        (115, 23, N'comunicabilidade, pois se uma imagem não comunica adequadamente a informação, o texto alternativo deve complementá-la.', 0),
        (116, 24, N'O software deve ser operacionalizado no sistema Linux.', 0),
        (117, 24, N'O tempo de desenvolvimento não deve ultrapassar seis meses.', 0),
        (118, 24, N'O software deve emitir relatórios de compras a cada quinze dias.', 1),
        (119, 24, N'O tempo de resposta do sistema não deve ultrapassar 30 segundos.', 0),
        (120, 24, N'A base de dados deve ser protegida para acesso apenas de usuários autorizados.', 0),
        (121, 25, N'No novo = new No(elemento);
if (topo == null) topo = novo;
else topo.prox = novo;', 0),
        (122, 25, N'No novo = new No(elemento);
topo = novo;', 0),
        (123, 25, N'topo.dado = elemento;', 0),
        (124, 25, N'No novo = new No(elemento);
while (topo != null) topo = topo.prox;
topo.prox = novo;', 0),
        (125, 25, N'No novo = new No(elemento);
novo.prox = topo;
topo = novo;', 1),
        (126, 26, N'II.', 0),
        (127, 26, N'I e III.', 0),
        (128, 26, N'I, II e IV.', 1),
        (129, 26, N'I, III e IV.', 0),
        (130, 26, N'II, III e IV.', 0),
        (131, 27, N'pilha: topo → C → A → E; fila: início → D → A → A → E', 0),
        (132, 27, N'pilha: topo → A; fila: início → D → B → C → E', 0),
        (133, 27, N'pilha: topo → C → B → A; fila: início → D → C → C → E', 1),
        (134, 27, N'pilha: topo → B → A; fila: início → D → B → C → E', 0),
        (135, 27, N'pilha: topo → C → B → A; fila: início → D → B → C → E', 0),
        (136, 28, N'custo.', 0),
        (137, 28, N'tempo.', 0),
        (138, 28, N'escopo.', 0),
        (139, 28, N'qualidade.', 0),
        (140, 28, N'partes interessadas.', 1),
        (141, 29, N'SELECT CL.NOME, HM.VAL_MOVIMENTADO FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA ORDER BY HM.VAL_MOVIMENTADO', 0),
        (142, 29, N'SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA ORDER BY HM.VAL_MOVIMENTADO DESC', 0),
        (143, 29, N'SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL INNER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE INNER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA GROUP BY CL.COD_CLIENTE, CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC', 1),
        (144, 29, N'SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL LEFT OUTER JOIN CONTA CO ON CL.COD_CLIENTE = CO.NUM_CONTA LEFT OUTER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.COD_HISTORICO_MOVIMENTACAO GROUP BY CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC', 0),
        (145, 29, N'SELECT CL.NOME, AVG(HM.VAL_MOVIMENTADO) FROM CLIENTE CL LEFT OUTER JOIN CONTA CO ON CL.COD_CLIENTE = CO.COD_CLIENTE LEFT OUTER JOIN HISTORICO_MOVIMENTACAO HM ON CO.NUM_CONTA = HM.NUM_CONTA GROUP BY CL.NOME ORDER BY AVG(HM.VAL_MOVIMENTADO) DESC', 0),
        (146, 30, N'Documento de entrevista com usuários; modelo de caso de uso para os requisitos funcionais; prototipação de telas.', 1),
        (147, 30, N'Documento de estudo de viabilidade; modelo de caso de uso para os requisitos funcionais; prototipação de telas.', 0),
        (148, 30, N'Matriz de rastreabilidade; modelo de caso de uso para os requisitos não-funcionais; prototipação de telas.', 0),
        (149, 30, N'Documento de entrevista com usuários; modelo de caso de uso para os requisitos não-funcionais; matriz de rastreabilidade.', 0),
        (150, 30, N'Documento de estudo de viabilidade; modelo de caso de uso para os requisitos funcionais; matriz de rastreabilidade.', 0),
        (151, 31, N'I e III.', 1),
        (152, 31, N'II e III.', 0),
        (153, 31, N'II e IV.', 0),
        (154, 31, N'I, II e IV.', 0),
        (155, 31, N'I, III e IV.', 0),
        (156, 32, N'I e II.', 0),
        (157, 32, N'I e III.', 0),
        (158, 32, N'II e IV.', 0),
        (159, 32, N'I, III e IV.', 0),
        (160, 32, N'II, III e IV.', 1),
        (161, 33, N'Identificação de itens na configuração de software, gerenciamento de alterações, validação de versões e controle de qualidade.', 0),
        (162, 33, N'Identificação de objetos na configuração de software, controle de versão, controle de alterações, auditoria de configuração e relatório de status.', 1),
        (163, 33, N'Gerência de projeto, gerência de configuração de software, ciclo de vida do projeto, processo de software e evolução das configurações.', 0),
        (164, 33, N'Construção de modelo de requisitos, métricas para modelo de projeto, métricas de controle de versão e relatório de manutenção.', 0),
        (165, 33, N'Identificação de alterações, controle de versão, mapeamento de alteração e notificação da alteração aos envolvidos.', 0),
        (166, 34, N'I e II.', 1),
        (167, 34, N'II e III.', 0),
        (168, 34, N'III e IV.', 0),
        (169, 34, N'I, II e IV.', 0),
        (170, 34, N'I, III e IV.', 0),
        (171, 35, N'corretiva.', 0),
        (172, 35, N'evolutiva.', 1),
        (173, 35, N'funcional.', 0),
        (174, 35, N'preventiva.', 0),
        (175, 35, N'adaptativa.', 0),
        (176, 36, N'II e III.', 0),
        (177, 36, N'I, II e IV.', 0),
        (178, 36, N'I, III e V.', 0),
        (179, 36, N'I, IV e V.', 1),
        (180, 36, N'II, III, IV e V.', 0),
        (181, 37, N'I.', 0),
        (182, 37, N'IV.', 0),
        (183, 37, N'I e II.', 0),
        (184, 37, N'II e III.', 0),
        (185, 37, N'III e IV.', 1),
        (186, 38, N'O direito ao usuário; as obrigações das organizações nacionais ou estrangeiras; obrigatoriedade do consentimento; a livre iniciativa, a livre concorrência e a defesa do consumidor; os direitos humanos e a cidadania; e a regulação da ANPD.', 0),
        (187, 38, N'O direito à revogação de um consentimento; a transferência de dados para outro fornecedor; a solicitação de remoção de dados pessoais; a inviolabilidade da intimidade, da honra e da imagem; o desenvolvimento econômico e tecnológico e a inovação; a preservação da vida e da integridade física.', 0),
        (188, 38, N'O respeito à privacidade; obrigatoriedade do consentimento; os deveres dos usuários finais; os deveres das organizações nacionais ou estrangeiras; o código de defesa do consumidor; e a obrigatoriedade do respeito à honra e à imagem.', 0),
        (189, 38, N'O direito ao anonimato; a liberdade de expressão; a inviolabilidade da intimidade; medidas preventivas de segurança; o direito ao recurso e revisão; a administração de riscos e falhas; os agentes de tratamento; e a regulação da ANPD.', 0),
        (190, 38, N'O respeito à privacidade; a autodeterminação informativa; a liberdade de expressão, de informação, de comunicação e de opinião; a inviolabilidade da intimidade, da honra e da imagem; o desenvolvimento econômico e tecnológico e a inovação; a livre iniciativa, a livre concorrência e a defesa do consumidor; e os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania.', 1),
        (191, 39, N'(188)₁₀', 0),
        (192, 39, N'(215)₁₀', 0),
        (193, 39, N'(277)₁₀', 1),
        (194, 39, N'(316)₁₀', 0),
        (195, 39, N'(345)₁₀', 0),
        (196, 40, N'o programa antivírus.', 0),
        (197, 40, N'o gerenciamento de memória.', 1),
        (198, 40, N'o gerenciamento de arquivos.', 0),
        (199, 40, N'o gerenciamento de processos.', 0),
        (200, 40, N'o gerenciamento de entrada e saída.', 0);
    INSERT INTO tb_alternativas (id_alternativa, id_questao, texto, is_correta) VALUES
        (201, 41, N'4.', 0),
        (202, 41, N'7.', 0),
        (203, 41, N'11.', 0),
        (204, 41, N'22.', 1),
        (205, 41, N'30.', 0),
        (206, 42, N'Alterar o gateway da estação PROFESSORES03 para 175.16.10.200.', 0),
        (207, 42, N'Alterar o endereço de IP da estação PROFESSORES01 para 175.16.30.200.', 0),
        (208, 42, N'Alterar a máscara de sub-rede da estação PROFESSORES01 para 255.255.0.0.', 1),
        (209, 42, N'Alterar a máscara de sub-rede da estação PROFESSORES03 para 255.255.255.0.', 0),
        (210, 42, N'Alterar o gateway da estação PROFESSORES01 para o endereço de IP 175.16.30.200.', 0),
        (211, 43, N'I e IV.', 0),
        (212, 43, N'I, II e IV.', 0),
        (213, 43, N'I, III e V.', 0),
        (214, 43, N'II, III e V.', 1),
        (215, 43, N'II, III, IV e V.', 0),
        (216, 44, N'financeiras desenvolvem primeiro o plano de negócios, para em seguida partir para o Canvas.', 0),
        (217, 44, N'de big data utilizam o Canvas para a modelagem da validação da ideia de negócio, ou seja, do problema a ser resolvido.', 1),
        (218, 44, N'de educação dispensam a utilização do Canvas, ou seja, os modelos de negócios deste segmento já nascem validados.', 0),
        (219, 44, N'de logística utilizam o plano de negócios ao invés do Canvas, ou seja, elas nascem a partir de um produto mínimo viável (MVP).', 0),
        (220, 44, N'de impacto social podem desconsiderar o componente 1 (segmentos de clientes), pois possuem somente um segmento.', 0),
        (221, 45, N'III.', 0),
        (222, 45, N'I e II.', 0),
        (223, 45, N'II e IV.', 0),
        (224, 45, N'I, III e IV.', 1),
        (225, 45, N'I, II, III e IV.', 0),
        (226, 46, N'cada pessoa que procura atendimento apresentando ambos os sintomas possui a probabilidade 0,7 de estar contaminada pela dengue.', 1),
        (227, 46, N'se 50 pessoas procurarem o atendimento apresentando um dos dois sintomas, provavelmente 15 pessoas estarão com resfriado comum.', 0),
        (228, 46, N'se 100 pessoas procurarem o atendimento apresentando ambos os sintomas, a quantidade de pessoas com dengue será igual a 70.', 0),
        (229, 46, N'cada pessoa que chega apresentando um dos dois sintomas estará com resfriado comum.', 0),
        (230, 46, N'a cada 100 pessoas que procuram atendimento, no máximo 30 estarão doentes.', 0);
    SET IDENTITY_INSERT tb_alternativas OFF;
END;
GO

-- tb_prova_questao: 46 registro(s)
IF NOT EXISTS (SELECT 1 FROM tb_prova_questao)
BEGIN
    INSERT INTO tb_prova_questao (id_prova, id_questao) VALUES
        (1, 1),
        (1, 2),
        (1, 3),
        (1, 4),
        (1, 5),
        (1, 6),
        (1, 7),
        (1, 8),
        (1, 9),
        (1, 10),
        (1, 11),
        (1, 12),
        (1, 13),
        (1, 14),
        (1, 15),
        (1, 16),
        (1, 17),
        (1, 18),
        (1, 19),
        (1, 20),
        (1, 21),
        (1, 22),
        (1, 23),
        (2, 24),
        (2, 25),
        (2, 26),
        (2, 27),
        (2, 28),
        (2, 29),
        (2, 30),
        (2, 31),
        (2, 32),
        (2, 33),
        (2, 34),
        (2, 35),
        (2, 36),
        (2, 37),
        (2, 38),
        (2, 39),
        (2, 40),
        (2, 41),
        (2, 42),
        (2, 43),
        (2, 44),
        (2, 45),
        (2, 46);
END;
GO
