import { Repository } from "typeorm";
import { Chat } from "./chat.model";
import { dataSource } from "../database/data_source";

export class ChatRepository {
  private repo: Repository<Chat>;
  constructor() {
    this.repo = dataSource.getRepository(Chat);
  }
  public async getOrCreateChat(chatId: number): Promise<Chat> {
    const chat = await this.repo.findOneBy({ chatId });
    if (!chat) {
      const chat = this.repo.create({ chatId });
      return await this.repo.save(chat);
    }

    return chat;
  }
}
