import { Dao } from "../database/dao";
import { User } from "./user.model";
import { UserRepository } from "./user.repository";

export class UserService {
  private static instance: UserService | null;
  constructor(private repository: UserRepository) {}

  public static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService(Dao.getDao(UserRepository));
    }

    return this.instance;
  }

  public async getUser(telegramId: number): Promise<User> {
    return this.repository.getOrCreateUser({ telegramId });
  }
}
