using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class aaaa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Portfolios",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("16ea936c-7a28-4c30-86a2-9a9704b6115e"),
                column: "ConcurrencyStamp",
                value: "bc6a951b-3a47-49ec-980f-48442a1041d3");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("7cb750cf-3612-4fb4-9f7d-a38ba8f16bf4"),
                column: "ConcurrencyStamp",
                value: "d049517a-27e9-491a-b2d9-742646721265");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("edf6c246-41d8-475f-8d92-41dddac3aefb"),
                column: "ConcurrencyStamp",
                value: "7f272c02-8369-43d4-b987-0c10952faaa4");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("3aa42229-1c0f-4630-8c1a-db879ecd0427"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5d7fb838-2ccb-4378-94c0-1e1cb8097ef8", "AQAAAAIAAYagAAAAEFTYkmL6s5nNvY/GaA3mFmSdY2OQlf67OaqUcm7ZvdsfJz1fs9sC1L38T4jkA+TMWA==", "6a96fb62-f8ea-488c-bf59-ac3b907153c6" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("cb94223b-ccb8-4f2f-93d7-0df96a7f065c"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "54257eb1-1c86-46bb-9d39-e46736abecd6", "AQAAAAIAAYagAAAAEJ7/v7Svf4BGTEthzh2A3MAyiIKRODDEex+CLPgFQgJrgz8wAWGoVYmWuHqxn247bQ==", "d01f79cb-8d0b-4ce2-8894-234bbb5f4062" });

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: new Guid("d16a6ec7-8c50-4ab0-89a5-02b9a551f0fa"),
                column: "CreatedDate",
                value: new DateTime(2024, 8, 6, 4, 37, 10, 938, DateTimeKind.Utc).AddTicks(3014));

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: new Guid("f71f4b9a-aa60-461d-b398-de31001bf214"),
                column: "CreatedDate",
                value: new DateTime(2024, 8, 6, 4, 37, 10, 938, DateTimeKind.Utc).AddTicks(3010));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Portfolios");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("16ea936c-7a28-4c30-86a2-9a9704b6115e"),
                column: "ConcurrencyStamp",
                value: "6d5ef03b-4400-4927-9837-000e4a318500");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("7cb750cf-3612-4fb4-9f7d-a38ba8f16bf4"),
                column: "ConcurrencyStamp",
                value: "375fa066-2c4a-4ad2-ae28-3b88b7cd3a83");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("edf6c246-41d8-475f-8d92-41dddac3aefb"),
                column: "ConcurrencyStamp",
                value: "21373a9c-8290-427c-939d-610c6764bc61");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("3aa42229-1c0f-4630-8c1a-db879ecd0427"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8076e97b-e5c4-4f46-a139-837493c4c684", "AQAAAAIAAYagAAAAEOeAr8EyaKKjaxBUn22WxwiI1dJ4IxDpeWRfktky1adWI5rWF734cOHwguIaEVxdcA==", "812e00f5-5411-4ded-b892-632627355c5e" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("cb94223b-ccb8-4f2f-93d7-0df96a7f065c"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "f16300c3-6f27-4e3c-aa74-bacd44f9f961", "AQAAAAIAAYagAAAAEHiTbQH2Z7OrgsE2Rt+Cm1Ikf9BNrZJGP5bapCF3njATuOkn8qdhZS0o9CnbbK11MQ==", "425babf5-7a43-42f6-8957-d804b5039b02" });

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: new Guid("d16a6ec7-8c50-4ab0-89a5-02b9a551f0fa"),
                column: "CreatedDate",
                value: new DateTime(2024, 8, 5, 20, 57, 52, 69, DateTimeKind.Utc).AddTicks(2112));

            migrationBuilder.UpdateData(
                table: "Images",
                keyColumn: "Id",
                keyValue: new Guid("f71f4b9a-aa60-461d-b398-de31001bf214"),
                column: "CreatedDate",
                value: new DateTime(2024, 8, 5, 20, 57, 52, 69, DateTimeKind.Utc).AddTicks(2107));
        }
    }
}
