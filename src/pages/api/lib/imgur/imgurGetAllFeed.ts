import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

interface faunaPost{
  data: []
}

interface responseProps{
  data:any
}

interface userProps {
  data:{
    user:string,
    banner:string,
    avatar:string,
  }
}
interface mapPostProps{
  data:{
    userId:string,
    posts: any
  }
}
export default async function imgurGetAllFeed(req:NextApiRequest,res:NextApiResponse){
  let allPost = []
  let data;
  await fauna.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("collections"))),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  ).then(async (response:responseProps)=>{
    data = await Promise.all(response.data.map(async collection=>{
      if(collection.data.visible==false){return}
      let user:userProps = await fauna.query(
        q.Get(
          collection.data.userId
        )
      )
      return{
        user:{
          user:user.data.user,
          avatar:user.data.avatar,
          banner:user.data.banner
        },
        posts:[Object.values(collection.data.posts)]
      }
    }))
    res.json(data)
   }).catch(e=>console.log(e))

  
}