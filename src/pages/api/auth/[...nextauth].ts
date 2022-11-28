import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { fauna } from "../../../services/fauna";

import {query as q} from 'faunadb'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code"
      //   }
      // }
    })
    // ...add more providers here
  ],
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    signingKey: process.env.NEXT_AUTH_JWT_KEY,
    verificationOptions: {
      algorithms: ["HS256"]
    }
  },
  callbacks: {
    async signIn({ user, account, profile, }) {
      const {email} = user
        await fauna.query(
          q.Create(
            q.Collection('users'),
            { data: { email}}
          )
        )
      return true
      
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
export default NextAuth(authOptions)
