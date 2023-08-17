using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APIkino.Migrations
{
    /// <inheritdoc />
    public partial class photos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "photoId",
                table: "movies",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "photos",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_photos", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_movies_photoId",
                table: "movies",
                column: "photoId");

            migrationBuilder.AddForeignKey(
                name: "FK_movies_photos_photoId",
                table: "movies",
                column: "photoId",
                principalTable: "photos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_movies_photos_photoId",
                table: "movies");

            migrationBuilder.DropTable(
                name: "photos");

            migrationBuilder.DropIndex(
                name: "IX_movies_photoId",
                table: "movies");

            migrationBuilder.DropColumn(
                name: "photoId",
                table: "movies");
        }
    }
}
