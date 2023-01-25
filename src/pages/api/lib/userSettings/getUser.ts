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
interface FavoritedUsers{
  ref:string,
  data:{
    userId:string,
    favoritedUsers:{
      id:number
    }[]
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

      const getfavoritedUsers:FavoritedUsers = await fauna.query(
        q.Get(
          q.Match(
            q.Index('favorite_users_by_user_id'),
            user.ref
          )
        )
      )
      const favoritedUsers = getfavoritedUsers.data.favoritedUsers.map((user)=>{return user.id})
      try{
        console.log(favoritedUsers[0])
      }catch{}
      res.status(200).json({user,favoritedPosts,favoritedUsers})
    }catch(e){
      res.status(404).end('user not Found')
    }
  }
}