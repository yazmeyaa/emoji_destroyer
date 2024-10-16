import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { DataSource } from "typeorm";
import { Chat } from "../chat/chat.model";
import { User } from "../user/user.model";
import { UserChatRestriction } from "../restriction/user_chat_restriction.model";
import { InitDatabase1729084613600 } from "./migrations/1729084613600-init_database";

const { NODE_ENV } = process.env;

const dbDir = join(homedir(), "emoji_destroyer");
const dbFile = join(dbDir, "db.sqlite");

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const dataSource = new DataSource({
  type: "better-sqlite3",
  database: dbFile,
  synchronize: false,
  logging: NODE_ENV === "development",
  entities: [Chat, User, UserChatRestriction],
  migrations: [InitDatabase1729084613600],
});

dataSource
  .initialize()
  .then(() => {
    console.log("[DataSource][init] Data Source has been initialized!");
  })
  .catch((err) => {
    console.error(
      "[DataSource][init] Error during Data Source initialization",
      err
    );
  });

export { dataSource };
