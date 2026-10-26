using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexTI_API.Data.Migrations
{
    /// <inheritdoc />
    public partial class DiagnosticoPorModulo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "diagnostico_json",
                table: "usuarios",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "diagnostico_json",
                table: "usuarios");
        }
    }
}
