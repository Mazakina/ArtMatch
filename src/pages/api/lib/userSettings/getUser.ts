import { NextApiRequest, NextApiResponse } from "next";
import {fauna} from "../../../../services/fauna";
import {query as q} from 'faunadb'
interface UserProps {
  ref:string,
  ts:number|string,
  data:{
    user:string,
    banner:string,
    avatar:string,
  }
}
export default async function getUser(req:NextApiRequest,res:NextApiResponse){
  if(req.method=='POST'){
    try{
      const user:UserProps = await fauna.query(
        q.Get(
          q.Match(
            q.Index('user_by_email'),
            req.body.data.user.email
          )
        )
      )
      const favoritedPosts = await fauna.query(
        q.Get(
          q.Match(
            q.Index('favorite_posts_by_user_id'),
            user.ref
          )
        )
      )

      res.status(200).json({user,favoritedPosts})
    }catch(e){
      res.status(404).end('user not Found')
    }
  }
}