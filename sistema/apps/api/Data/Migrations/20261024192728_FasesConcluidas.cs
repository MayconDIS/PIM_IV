using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexTI_API.Data.Migrations
{
    /// <inheritdoc />
    public partial class FasesConcluidas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "fases_concluidas",
                columns: table => new
                {
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    codigo_fase = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    data_conclusao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fases_concluidas", x => new { x.usuario_id, x.codigo_fase });
                    table.ForeignKey(
                        name: "fk_fases_concluidas_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fases_concluidas");
        }
    }
}
