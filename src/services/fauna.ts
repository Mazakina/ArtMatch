import { Client } from 'faunadb'

export var fauna = new Client({
    secret: process.env.FAUNA_KEY,
    endpoint: 'https://db.fauna.com/',
    scheme: 'https',
    
})