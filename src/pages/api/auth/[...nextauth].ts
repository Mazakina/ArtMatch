import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { fauna } from "../../../services/fauna";

import {query as q} from 'faunadb'

export const authOptions = {
  // Configure one or more authentication providers
  domain:'db.fauna.com',
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // ...add more providers here
  ],
  secret:'iAmHandsome',
  jwt: {
    secret:process.env.NEXT_AUTH_JWT_KEY,
    refetchInterval:60*60 ,
    maxAge: 60 * 60 * 24 ,
  },
  callbacks: {
    async signIn({ user, account, profile}) {
      const {email} = user
      console.log('account:',account)
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
            [
              q.Create(
                q.Collection('users'),
                { data: {email}}
              ),
              q.Create(
                q.Collection('settings'),
                {data:{
                  userId:
                  q.Select(
                    'ref',
                    q.Get(
                      q.Match(
                          q.Index('user_by_email'),
                          q.Casefold(user.email)
                      )
                    )
                  )
                  ,
                  profile:{
                    usuario:'',
                    biografia:'',
                    cidade:'',
                    endereco:'',
                    numero:'',
                    banner:'',
                    avatar:user.image
                  },
                  social:{
                    instagram:'',
                    artstation:'',
                    behance:'',
                    telefone:'',
                  },
                  seguranca:{
                    email:{email},
                    nsfwAllow:false,
                    allowToBeFound:true,
                  },
                  bloqueados:[]
                }}
              ),
              q.Create(
                q.Collection('collections'),
                {
                  data: {
                    userId:user.ref,
                    posts:[],
                    visible:'true'
                    }
                }
              )
            ],
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
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.user.id = token.id
      
      return session
    }
  },
  // secret: 'skldjaklsdhasdja',
}
export default NextAuth(authOptions)
