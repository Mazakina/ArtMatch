import { User } from "../domain/user";

export abstract class UserRepository {
  createUser: (user: User) => Promise<void>;
  getUserByEmail: (email: string) => Promise<User | null>;
  updateUser: (userId: string, userData: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
}
