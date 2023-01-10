import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

interface faunaPost{
  data: []
}
interface mapPostProps{
  data:{
    userId:string,
    posts: any
  }
}
export default async function imgurGetAllFeed(req:NextApiRequest,res:NextApiResponse){
  console.log('asdklajsdlka')
  const allPost:faunaPost = await fauna.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("collections"))),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  ).then(res=>console.log(res.data))
}