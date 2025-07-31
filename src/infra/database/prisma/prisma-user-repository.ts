import { PrismaClient } from "@prisma/client";
import { User } from "../../../core/domain/user";
import { UserRepository } from "../../../core/repositories/user-repository";
import PrismaUserMapper from "./mappers/PrismaUserMapper";
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistance(user);
    this.prisma.user.create({
      data: {
        ...data,
        settings: {
          create: {}, // Assuming settings is a nested object
        },
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const response = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!response) {
      return null;
    }
    const user = PrismaUserMapper.toDomain(response);
    return user;
  }

  async updateUser(userId: string, userData: any): Promise<void> {
    const data = PrismaUserMapper.toPersistance(userData);
    await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
  async getAllUsers({ skip = 0, take = 10 } = {}): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      include: {
        settings: true, // Assuming you want to include settings
      },
    });
    return users.map((raw) => {
      if (!raw.settings.allowToBeFound) {
        return PrismaUserMapper.toDomain(raw);
      }
    });
  }
}
