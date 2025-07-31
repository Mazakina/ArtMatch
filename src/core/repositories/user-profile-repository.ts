import { UserProfile } from "../domain/userProfile";

export abstract class UserProfileRepository {
  createUserProfile: (profile: UserProfile) => Promise<void>;
  getUserByID: (id: string) => Promise<UserProfile | null>;
  updateUserProfile: (userId: string, userData: any) => Promise<void>;
}
