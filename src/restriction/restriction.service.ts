import { Chat } from "../chat/chat.model";
import { Dao } from "../database/dao";
import { User } from "../user/user.model";
import { RestrictionRepository } from "./restriction.repository";
import {
  UserChatRestriction,
  UserRestrictionEnum,
} from "./user_chat_restriction.model";

export class RestrictionService {
  constructor(private readonly restrictionRepo: RestrictionRepository) {}
  private static instance: RestrictionService | null;
  public static getInstance(): RestrictionService {
    if (!this.instance) {
      this.instance = new RestrictionService(Dao.getDao(RestrictionRepository));
    }
    return this.instance;
  }

  public async restrictUser(
    user: User,
    chat: Chat,
    restrictionType: UserRestrictionEnum
  ): Promise<UserChatRestriction> {
    const restricts = await this.getUserRestrictions(user);
    if (restricts.some((x) => x.restriction === restrictionType)) {
      return restricts.find((x) => x.restriction === restrictionType)!;
    }
    
    return this.restrictionRepo.restrictUser(user, chat, restrictionType);
  }

  public getUserRestrictions(user: User): Promise<UserChatRestriction[]> {
    return this.restrictionRepo.getUserRestrictions(user);
  }
}
