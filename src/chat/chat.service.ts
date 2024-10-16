import { Dao } from "../database/dao";
import { Chat } from "./chat.model";
import { ChatRepository } from "./chat.repository";

export class ChatService {
  constructor(private chatRepo: ChatRepository) {}
  private static instance: ChatService | null;
  public static getInstance(): ChatService {
    if (!this.instance) {
      this.instance = new ChatService(Dao.getDao(ChatRepository));
    }

    return this.instance;
  }

  public async getChat(chatId: number): Promise<Chat> {
    return this.chatRepo.getOrCreateChat(chatId);
  }
}
