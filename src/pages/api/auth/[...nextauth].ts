import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { generateFromEmail, generateUsername } from "unique-username-generator";
import prisma from "../../../services/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  jwt: {
    secret: process.env.NEXT_AUTH_JWT_KEY,
    refetchInterval: 60 * 60,
    maxAge: 60 * 60 * 24,
  },
  adapter: PrismaAdapter(prisma),
  events: {
    async createUser({ user }) {
      // Generate a unique username (based on name or email)
      let base = user.name?.replace(/\s+/g, "").toLowerCase() || "user";
      let username = base;
      let exists = await prisma.user.findUnique({ where: { username } });
      let suffix = 1;
      while (exists) {
        username = `${base}${suffix}`;
        exists = await prisma.user.findUnique({ where: { username } });
        suffix++;
      }

      // Update user with username and create default user settings
      await prisma.user.update({
        where: { id: user.id },
        data: { username },
      });

      await prisma.userSettings.create({
        data: {
          userId: user.id,
          contactEmail: user.email,
          nsfwAllow: false,
          allowToBeFound: true,
        },
      });

      // await prisma.userSocialLinks.create({
      //   data: {
      //     userId: user.id,
      //   },
      // });
      // await prisma.userProfile.create({
      //   data: {
      //     userId: user.id,
      //   },
      // });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session?.user && token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
export default NextAuth(authOptions);
