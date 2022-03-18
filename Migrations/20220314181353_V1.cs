using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Library.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Biblioteka",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Biblioteka", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Citalac",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ImeRoditelja = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    BrojTelefona = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    BibliotekaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Citalac", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Citalac_Biblioteka_BibliotekaID",
                        column: x => x.BibliotekaID,
                        principalTable: "Biblioteka",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Knjiga",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naslov = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ImePisca = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    BibliotekaID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Knjiga", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Knjiga_Biblioteka_BibliotekaID",
                        column: x => x.BibliotekaID,
                        principalTable: "Biblioteka",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pozajmljuje",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CitalacID = table.Column<int>(type: "int", nullable: true),
                    KnjigaID = table.Column<int>(type: "int", nullable: true),
                    DatumVracanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BibliotekaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pozajmljuje", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Pozajmljuje_Biblioteka_BibliotekaID",
                        column: x => x.BibliotekaID,
                        principalTable: "Biblioteka",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pozajmljuje_Citalac_CitalacID",
                        column: x => x.CitalacID,
                        principalTable: "Citalac",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pozajmljuje_Knjiga_KnjigaID",
                        column: x => x.KnjigaID,
                        principalTable: "Knjiga",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Citalac_BibliotekaID",
                table: "Citalac",
                column: "BibliotekaID");

            migrationBuilder.CreateIndex(
                name: "IX_Knjiga_BibliotekaID",
                table: "Knjiga",
                column: "BibliotekaID");

            migrationBuilder.CreateIndex(
                name: "IX_Pozajmljuje_BibliotekaID",
                table: "Pozajmljuje",
                column: "BibliotekaID");

            migrationBuilder.CreateIndex(
                name: "IX_Pozajmljuje_CitalacID",
                table: "Pozajmljuje",
                column: "CitalacID");

            migrationBuilder.CreateIndex(
                name: "IX_Pozajmljuje_KnjigaID",
                table: "Pozajmljuje",
                column: "KnjigaID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pozajmljuje");

            migrationBuilder.DropTable(
                name: "Citalac");

            migrationBuilder.DropTable(
                name: "Knjiga");

            migrationBuilder.DropTable(
                name: "Biblioteka");
        }
    }
}
