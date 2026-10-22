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

