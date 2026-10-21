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

