import "reflect-metadata";
import { Config } from "./config/config";
import { BotService } from "./bot/bot.service";

class App {
  private readonly config: Config;
  constructor() {
    this.config = new Config();
  }

  private async initBot() {
    const bot = new BotService(this.config);
    await bot.start();
  }

  public main() {
    this.initBot();
  }
}

new App().main();
