import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserChatRestriction } from "../restriction/user_chat_restriction.model";

@Entity({
  comment: "Regular bot's user.",
  name: "user",
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  @Index({ unique: true })
  telegramId: number;

  @OneToMany(
    () => UserChatRestriction,
    (userChatRestriction) => userChatRestriction.user
  )
  public userChatRestrictions: UserChatRestriction[];
}
