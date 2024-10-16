import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserChatRestriction } from "../restriction/user_chat_restriction.model";

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column({ type: "int" })
  @Index({ unique: true })
  public chatId: number;

  @OneToMany(
    () => UserChatRestriction,
    (userChatRestriction) => userChatRestriction.chat
  )
  public userChatRestrictions: UserChatRestriction[];
}
