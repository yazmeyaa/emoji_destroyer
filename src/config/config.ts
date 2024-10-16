import 'dotenv/config'

export class TelegramConfig {
  constructor(public readonly token: string) {}
}

export class Config {
  public readonly telegram: TelegramConfig;

  constructor() {
    const token = process.env["TELEGRAM_BOT_TOKEN"];
    this.telegram = new TelegramConfig(token);
  }
}
