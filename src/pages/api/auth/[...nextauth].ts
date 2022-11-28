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
      try{
        await fauna.query(
          q.If(
            q.Not(
                q.Exists(
                    q.Match(
                        q.Index('user_by_email'),
                        q.Casefold(user.email)
                    )
                )
            ),
            q.Create(
                q.Collection('users'),
                { data: { email}}
            ),
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(user.email)
                )
            )
        ))
        
      return true

      }catch(e){
        console.log(e)
        return false
      }
    }
  },
  secret: 'skldjaklsdhasdja',
}
export default NextAuth(authOptions)
