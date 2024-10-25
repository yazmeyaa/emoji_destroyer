import { Chat } from "../chat/chat.model";
import { User } from "../user/user.model";
import { Repository } from "typeorm";
import {
  UserChatRestriction,
  UserRestrictionEnum,
} from "./user_chat_restriction.model";
import { dataSource } from "../database/data_source";

export class RestrictionRepository {
  private userChatRestrctionRepo: Repository<UserChatRestriction>;

  constructor() {
    this.userChatRestrctionRepo = dataSource.getRepository(UserChatRestriction);
  }
  public async restrictUser(
    user: User,
    chat: Chat,
    restriction: UserRestrictionEnum
  ): Promise<UserChatRestriction> {
    const chatRestriction = UserChatRestriction.create();
    chatRestriction.user = user;
    chatRestriction.chat = chat;
    chatRestriction.restriction = restriction;

    return await chatRestriction.save();
  }

  public async removeRestriction(
    user: User,
    chat: Chat,
    restriction: UserRestrictionEnum
  ): Promise<void> {
    const chatRestriction = await this.userChatRestrctionRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        chat: {
          id: chat.id,
        },
        restriction: restriction
      },
    });

    if(!chatRestriction) return;

    await chatRestriction.remove();
  }

  public async getUserRestrictions(user: User): Promise<UserChatRestriction[]> {
    const restrictions = await this.userChatRestrctionRepo.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        user: true,
        chat: true,
      },
    });

    return restrictions;
  }
}
