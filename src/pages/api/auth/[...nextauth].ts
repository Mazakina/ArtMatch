import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { fauna } from "../../../services/fauna";
import { generateFromEmail, generateUsername } from "unique-username-generator";
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
      const username = generateFromEmail(
        email,
        8
      );
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
              { data: {
                email:email,
                user:username,
                avatar:user.image
              },  
            }
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
                  usuario:username,
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
                    userId:
                    q.Select(
                      'ref',
                      q.Get(
                        q.Match(
                            q.Index('user_by_email'),
                            q.Casefold(user.email)
                        )
                      )
                    ),
                    posts:[],
                    visible:'true'
                  }
                }
              ),
              q.Create(
                q.Collection('albums'),
                {
                  data: {
                    userId:
                    q.Select(
                      'ref',
                      q.Get(
                        q.Match(
                            q.Index('user_by_email'),
                            q.Casefold(user.email)
                        )
                      )
                    ),
                    albums:[],
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
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
      }
      return token
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.user.id = token.id
      
      return session
    }
  },
}
export default NextAuth(authOptions)
