import { ChatRepository } from "../chat/chat.repository";
import { RestrictionRepository } from "../restriction/restriction.repository";
import { UserRepository } from "../user/user.repository";

export type DaoType =
  | typeof UserRepository
  | typeof ChatRepository
  | typeof RestrictionRepository;

export abstract class Dao {
  public static getDao<T extends DaoType, R = new () => T>(type: T): R {
    switch (type) {
      case UserRepository:
        return new UserRepository() as R;
      case ChatRepository:
        return new ChatRepository() as R;
      case RestrictionRepository:
        return new RestrictionRepository() as R;
      default:
        throw new Error("Unknown type of Repository");
    }
  }
}
