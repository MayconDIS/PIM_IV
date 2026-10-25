using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexTI.Desktop.Infraestrutura.Dados.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Fases",
                columns: table => new
                {
                    Codigo = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Ordem = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fases", x => x.Codigo);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nickname = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TipoDeUsuario = table.Column<string>(type: "TEXT", maxLength: 8, nullable: false),
                    Xp = table.Column<int>(type: "INTEGER", nullable: true),
                    Moedas = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Flashcards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CodigoFase = table.Column<string>(type: "TEXT", nullable: false),
                    Frente = table.Column<string>(type: "TEXT", nullable: false),
                    Verso = table.Column<string>(type: "TEXT", nullable: false),
                    Dica = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flashcards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Flashcards_Fases_CodigoFase",
                        column: x => x.CodigoFase,
                        principalTable: "Fases",
                        principalColumn: "Codigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FasesConcluidas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AlunoId = table.Column<int>(type: "INTEGER", nullable: false),
                    CodigoFase = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    DataConclusao = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FasesConcluidas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FasesConcluidas_Fases_CodigoFase",
                        column: x => x.CodigoFase,
                        principalTable: "Fases",
                        principalColumn: "Codigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FasesConcluidas_Usuarios_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Revisoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AlunoId = table.Column<int>(type: "INTEGER", nullable: false),
                    FlashcardId = table.Column<int>(type: "INTEGER", nullable: false),
                    Repeticoes = table.Column<int>(type: "INTEGER", nullable: false),
                    IntervaloDias = table.Column<double>(type: "REAL", nullable: false),
                    FatorFacilidade = table.Column<double>(type: "REAL", nullable: false),
                    ProximaRevisao = table.Column<DateOnly>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Revisoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Revisoes_Flashcards_FlashcardId",
                        column: x => x.FlashcardId,
                        principalTable: "Flashcards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Revisoes_Usuarios_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FasesConcluidas_AlunoId_CodigoFase",
                table: "FasesConcluidas",
                columns: new[] { "AlunoId", "CodigoFase" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FasesConcluidas_CodigoFase",
                table: "FasesConcluidas",
                column: "CodigoFase");

            migrationBuilder.CreateIndex(
                name: "IX_Flashcards_CodigoFase",
                table: "Flashcards",
                column: "CodigoFase");

            migrationBuilder.CreateIndex(
                name: "IX_Revisoes_AlunoId_FlashcardId",
                table: "Revisoes",
                columns: new[] { "AlunoId", "FlashcardId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Revisoes_FlashcardId",
                table: "Revisoes",
                column: "FlashcardId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Nickname",
                table: "Usuarios",
                column: "Nickname",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FasesConcluidas");

            migrationBuilder.DropTable(
                name: "Revisoes");

            migrationBuilder.DropTable(
                name: "Flashcards");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Fases");
        }
    }
}
