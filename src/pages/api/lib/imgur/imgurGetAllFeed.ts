import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

interface faunaPost{
  data: []
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
  console.log('triggered')
  let allPost = []
  let data;
  await fauna.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("collections"))),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  ).then(async response=>{
     response.data.map(async collection=>{
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
    })
    console.log(data)

   }).catch(e=>console.log(e))

  
}