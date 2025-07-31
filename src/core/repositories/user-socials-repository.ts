export abstract class UserSocialsRepository {
  createUserSocials: (userId: string, socials: any) => Promise<void>;
  getUserSocialsByUserId: (userId: string) => Promise<any | null>;
  updateUserSocials: (userId: string, socialsData: any) => Promise<void>;
}
