import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../../services/fauna";
import {query as q} from 'faunadb'

interface responseProps{
  data:any
}
export default async function getBasicInfo(req:NextApiRequest,res:NextApiResponse){
  const userName = req.body.user

  await fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_usuario'),
        userName
      )
    )
  ).then((response:responseProps)=>{ 
    res.status(200).json(
      {user:{
        user:response.data.user,
        avatar:response.data.avatar,
        banner:response.data.banner
      }
    })
    }
  )
}