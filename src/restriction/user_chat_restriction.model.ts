import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { User } from "../user/user.model";
import { Chat } from "../chat/chat.model";

export enum UserRestrictionEnum {
  NoPremiumEmojis = "NO_PREMIUM_EMOJIS",
}

@Entity()
export class UserChatRestriction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userChatRestrictions)
  public user: User;

  @ManyToOne(() => Chat, (chat) => chat.userChatRestrictions)
  public chat: Chat;

  @Column({
    type: "simple-enum",
    enum: UserRestrictionEnum,
  })
  public restriction: UserRestrictionEnum;

  public getString(): string {
    switch (this.restriction) {
      case UserRestrictionEnum.NoPremiumEmojis:
        return "ПРЕМИУМ ЭМОДЗИ";
    }
  }
}
