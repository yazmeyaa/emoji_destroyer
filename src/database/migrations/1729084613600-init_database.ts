import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1729084613600 implements MigrationInterface {
    name = 'InitDatabase1729084613600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "telegramId" integer NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6758e6c1db84e6f7e711f8021f" ON "user" ("telegramId") `);
        await queryRunner.query(`CREATE TABLE "user_chat_restriction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restriction" varchar CHECK( "restriction" IN ('NO_PREMIUM_EMOJIS') ) NOT NULL, "userId" integer, "chatId" integer)`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "chatId" integer NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3af41a2b44ec75589b7213a05e" ON "chat" ("chatId") `);
        await queryRunner.query(`CREATE TABLE "temporary_user_chat_restriction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restriction" varchar CHECK( "restriction" IN ('NO_PREMIUM_EMOJIS') ) NOT NULL, "userId" integer, "chatId" integer, CONSTRAINT "FK_a1abb7ff20a4463015f58dcef84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2dc4070879ff1b1cf4eca3aa53e" FOREIGN KEY ("chatId") REFERENCES "chat" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_chat_restriction"("id", "restriction", "userId", "chatId") SELECT "id", "restriction", "userId", "chatId" FROM "user_chat_restriction"`);
        await queryRunner.query(`DROP TABLE "user_chat_restriction"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_chat_restriction" RENAME TO "user_chat_restriction"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_chat_restriction" RENAME TO "temporary_user_chat_restriction"`);
        await queryRunner.query(`CREATE TABLE "user_chat_restriction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "restriction" varchar CHECK( "restriction" IN ('NO_PREMIUM_EMOJIS') ) NOT NULL, "userId" integer, "chatId" integer)`);
        await queryRunner.query(`INSERT INTO "user_chat_restriction"("id", "restriction", "userId", "chatId") SELECT "id", "restriction", "userId", "chatId" FROM "temporary_user_chat_restriction"`);
        await queryRunner.query(`DROP TABLE "temporary_user_chat_restriction"`);
        await queryRunner.query(`DROP INDEX "IDX_3af41a2b44ec75589b7213a05e"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "user_chat_restriction"`);
        await queryRunner.query(`DROP INDEX "IDX_6758e6c1db84e6f7e711f8021f"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
