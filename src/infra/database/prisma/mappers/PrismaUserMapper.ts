import { User } from "../../../../core/domain/user";
import { User as PrismaUser } from "@prisma/client";
export default class PrismaUserMapper {
  static toPersistance(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      image: user.image,
    };
  }

  static toDomain(raw: PrismaUser): User {
    const user = User.create(
      {
        name: raw.name,
        email: raw.email,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        avatar: raw.avatarUrl,
        emailVerified: raw.emailVerified,
        image: raw.image,
      },
      raw.id
    );
    return user;
  }
}
