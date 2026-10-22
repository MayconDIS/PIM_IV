using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexTI_API.Data.Migrations
{
    /// <summary>
    /// Etapa 7 do PIM IV (Programação de Banco de Dados): histórico de revisões,
    /// triggers, funções, views e procedures do Nex_TI. Cada objeto vai num
    /// comando separado porque CREATE PROCEDURE/FUNCTION/VIEW/TRIGGER precisa
    /// ser o primeiro comando do lote.
    /// </summary>
    public partial class ObjetosDoBanco : Migration
    {
        /// <summary>
        /// Cria procedure/função/view/trigger via EXEC: assim o comando continua
        /// válido dentro do bloco IF que o script idempotente (dotnet ef migrations
        /// script --idempotent) coloca em volta de cada migration.
        /// </summary>
        private static void CriarObjeto(MigrationBuilder migrationBuilder, string sql) =>
            migrationBuilder.Sql($"EXEC(N'{sql.Trim().Replace("'", "''")}');");

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // --- Tabela de histórico: uma linha por resposta do aluno a uma carta ---
            migrationBuilder.Sql(@"
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
);");
            migrationBuilder.Sql("CREATE INDEX ix_historico_usuario_data ON tb_historico_revisoes (usuario_id, data_revisao);");

            // --- Trigger 1: toda resposta gravada pela API entra no histórico ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER TRIGGER tg_progresso_historico
ON progresso_flashcards
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO tb_historico_revisoes
        (usuario_id, flashcard_id, repeticoes, intervalo_dias, fator_facilidade, data_proxima_revisao)
    SELECT usuario_id, flashcard_id, repeticoes, intervalo_dias, fator_facilidade, data_proxima_revisao
    FROM inserted;
END;");

            // --- Trigger 2: XP e nível nunca diminuem, nem por fora da API ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER TRIGGER tg_usuarios_protege_gamificacao
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
        THROW 50001, 'XP e nível do aluno não podem diminuir.', 1;
END;");

            // --- Função escalar: o mesmo nível que o site calcula pelo XP ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER FUNCTION fn_nivel_por_xp (@xp INT)
RETURNS INT
AS
BEGIN
    RETURN CASE
        WHEN @xp >= 300 THEN 6   -- Expert
        WHEN @xp >= 100 THEN 3   -- Intermediário
        ELSE 1                   -- Ingressante
    END;
END;");

            // --- Função de tabela: cartas que o aluno precisa revisar até uma data ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER FUNCTION fn_cartas_devidas (@usuario_id INT, @data DATE)
RETURNS TABLE
AS
RETURN (
    SELECT p.flashcard_id, f.codigo_fase, f.frente, p.data_proxima_revisao, p.fator_facilidade
    FROM progresso_flashcards p
    JOIN flashcards f ON f.id = p.flashcard_id
    WHERE p.usuario_id = @usuario_id
      AND CAST(p.data_proxima_revisao AS DATE) <= @data
);");

            // --- View 1: ranking dos alunos por XP ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER VIEW vw_ranking_alunos
AS
SELECT
    RANK() OVER (ORDER BY u.xp DESC) AS posicao,
    u.username,
    u.xp,
    u.nivel,
    u.moedas
FROM usuarios u;");

            // --- View 2: desempenho por fase (cartas, alunos estudando e facilidade média) ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER VIEW vw_desempenho_por_fase
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
GROUP BY fa.codigo_fase, fa.descricao;");

            // --- Procedure 1: os N primeiros do ranking ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER PROCEDURE sp_ranking_alunos (@top INT = 5)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT TOP (@top) posicao, username, xp, nivel, moedas
    FROM vw_ranking_alunos
    ORDER BY posicao, username;
END;");

            // --- Procedure 2: os mesmos números da rota /stats-detalhadas ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER PROCEDURE sp_estatisticas_aluno (@username NVARCHAR(50))
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @id INT = (SELECT id FROM usuarios WHERE username = @username);
    IF @id IS NULL
        THROW 50002, 'Usuário não encontrado.', 1;

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
END;");

            // --- Procedure 3: cadastra uma carta com as mesmas regras do ConteudoService ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER PROCEDURE sp_cadastrar_flashcard (
    @codigo_fase NVARCHAR(20),
    @frente      NVARCHAR(MAX),
    @verso       NVARCHAR(MAX),
    @dica        NVARCHAR(255) = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    SET @codigo_fase = LOWER(LTRIM(RTRIM(@codigo_fase)));
    IF NULLIF(LTRIM(RTRIM(@frente)), '') IS NULL OR NULLIF(LTRIM(RTRIM(@verso)), '') IS NULL
        THROW 50003, 'Frente e verso são obrigatórios.', 1;
    IF NOT EXISTS (SELECT 1 FROM fases WHERE codigo_fase = @codigo_fase)
        THROW 50004, 'Fase não encontrada.', 1;

    INSERT INTO flashcards (codigo_fase, frente, verso, dica)
    VALUES (@codigo_fase, LTRIM(RTRIM(@frente)), LTRIM(RTRIM(@verso)),
            NULLIF(LTRIM(RTRIM(@dica)), ''));

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS id;
END;");

            // --- Procedure 4: histórico de revisões de um aluno ---
            CriarObjeto(migrationBuilder, @"
CREATE OR ALTER PROCEDURE sp_historico_revisoes (@username NVARCHAR(50), @ultimas INT = 20)
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
END;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_historico_revisoes;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_cadastrar_flashcard;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_estatisticas_aluno;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_ranking_alunos;");
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_desempenho_por_fase;");
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_ranking_alunos;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_cartas_devidas;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_nivel_por_xp;");
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS tg_usuarios_protege_gamificacao;");
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS tg_progresso_historico;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS tb_historico_revisoes;");
        }
    }
}
