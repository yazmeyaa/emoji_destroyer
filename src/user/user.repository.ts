import { Repository } from "typeorm";
import { dataSource } from "../database/data_source";
import { User } from "./user.model";

export type CreateUserType = Pick<User, "telegramId">;

export class UserRepository {
  private userRepo: Repository<User>;
  constructor() {
    this.userRepo = dataSource.getRepository(User);
  }

  public async getOrCreateUser(data: CreateUserType): Promise<User> {
    const user = await this.userRepo.findOneBy({ telegramId: data.telegramId });
    if (!user) {
      const user = this.userRepo.create({ telegramId: data.telegramId });
      return await this.userRepo.save(user);
    }

    return user;
  }
}
