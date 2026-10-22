using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexTI_API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AreaAdministrativa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "perfil",
                table: "usuarios",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Aluno");

            migrationBuilder.CreateTable(
                name: "cartas_moderadas",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    codigo_fase = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    frente = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    data_moderacao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_cartas_moderadas", x => x.id);
                });

            migrationBuilder.AddCheckConstraint(
                name: "ck_usuarios_perfil",
                table: "usuarios",
                sql: "perfil IN ('Aluno', 'Tutor', 'Admin')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cartas_moderadas");

            migrationBuilder.DropCheckConstraint(
                name: "ck_usuarios_perfil",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "perfil",
                table: "usuarios");
        }
    }
}
