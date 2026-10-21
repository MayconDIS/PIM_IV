using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexTI_API.Data.Migrations
{
    /// <inheritdoc />
    public partial class InicialAzureSql : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "fases",
                columns: table => new
                {
                    codigo_fase = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    descricao = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fases", x => x.codigo_fase);
                });

            migrationBuilder.CreateTable(
                name: "tb_areas_conhecimento",
                columns: table => new
                {
                    id_area = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nome_area = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tb_areas_conhecimento", x => x.id_area);
                });

            migrationBuilder.CreateTable(
                name: "tb_provas",
                columns: table => new
                {
                    id_prova = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ano = table.Column<int>(type: "int", nullable: false),
                    tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tb_provas", x => x.id_prova);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    senha_hash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    nivel = table.Column<int>(type: "int", nullable: false),
                    xp = table.Column<int>(type: "int", nullable: false),
                    moedas = table.Column<int>(type: "int", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_usuarios", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "flashcards",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    codigo_fase = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    frente = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    verso = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dica = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    opcoes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    correta = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_flashcards", x => x.id);
                    table.ForeignKey(
                        name: "fk_flashcards_fases_codigo_fase",
                        column: x => x.codigo_fase,
                        principalTable: "fases",
                        principalColumn: "codigo_fase",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tb_questoes",
                columns: table => new
                {
                    id_questao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_area = table.Column<int>(type: "int", nullable: false),
                    enunciado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    origem = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tb_questoes", x => x.id_questao);
                    table.ForeignKey(
                        name: "fk_tb_questoes_tb_areas_conhecimento_id_area",
                        column: x => x.id_area,
                        principalTable: "tb_areas_conhecimento",
                        principalColumn: "id_area",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "progresso_flashcards",
                columns: table => new
                {
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    flashcard_id = table.Column<int>(type: "int", nullable: false),
                    repeticoes = table.Column<int>(type: "int", nullable: false),
                    intervalo_dias = table.Column<double>(type: "float", nullable: false),
                    fator_facilidade = table.Column<double>(type: "float", nullable: false),
                    data_proxima_revisao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_progresso_flashcards", x => new { x.usuario_id, x.flashcard_id });
                    table.ForeignKey(
                        name: "fk_progresso_flashcards_flashcards_flashcard_id",
                        column: x => x.flashcard_id,
                        principalTable: "flashcards",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_progresso_flashcards_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tb_alternativas",
                columns: table => new
                {
                    id_alternativa = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_questao = table.Column<int>(type: "int", nullable: false),
                    texto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_correta = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tb_alternativas", x => x.id_alternativa);
                    table.ForeignKey(
                        name: "fk_tb_alternativas_tb_questoes_id_questao",
                        column: x => x.id_questao,
                        principalTable: "tb_questoes",
                        principalColumn: "id_questao",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tb_prova_questao",
                columns: table => new
                {
                    id_prova = table.Column<int>(type: "int", nullable: false),
                    id_questao = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tb_prova_questao", x => new { x.id_prova, x.id_questao });
                    table.ForeignKey(
                        name: "fk_tb_prova_questao_tb_provas_id_prova",
                        column: x => x.id_prova,
                        principalTable: "tb_provas",
                        principalColumn: "id_prova",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_tb_prova_questao_tb_questoes_id_questao",
                        column: x => x.id_questao,
                        principalTable: "tb_questoes",
                        principalColumn: "id_questao",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_flashcards_codigo_fase",
                table: "flashcards",
                column: "codigo_fase");

            migrationBuilder.CreateIndex(
                name: "ix_progresso_flashcards_flashcard_id",
                table: "progresso_flashcards",
                column: "flashcard_id");

            migrationBuilder.CreateIndex(
                name: "ix_tb_alternativas_id_questao",
                table: "tb_alternativas",
                column: "id_questao");

            migrationBuilder.CreateIndex(
                name: "ix_tb_prova_questao_id_questao",
                table: "tb_prova_questao",
                column: "id_questao");

            migrationBuilder.CreateIndex(
                name: "ix_tb_questoes_id_area",
                table: "tb_questoes",
                column: "id_area");

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_email",
                table: "usuarios",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_username",
                table: "usuarios",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "progresso_flashcards");

            migrationBuilder.DropTable(
                name: "tb_alternativas");

            migrationBuilder.DropTable(
                name: "tb_prova_questao");

            migrationBuilder.DropTable(
                name: "flashcards");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "tb_provas");

            migrationBuilder.DropTable(
                name: "tb_questoes");

            migrationBuilder.DropTable(
                name: "fases");

            migrationBuilder.DropTable(
                name: "tb_areas_conhecimento");
        }
    }
}
