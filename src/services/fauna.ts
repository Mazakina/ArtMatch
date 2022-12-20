import { Client } from 'faunadb'
import NextAuth from "next-auth"
import { FaunaAdapter } from "@next-auth/fauna-adapter"

export var fauna = new Client({
    secret: process.env.FAUNA_KEY,
    endpoint: 'https://db.fauna.com/',
    scheme: 'https',
    
})

export default NextAuth({
    // https://next-auth.js.org/providers/overview
    providers: [],
    adapter: FaunaAdapter(fauna)
  })