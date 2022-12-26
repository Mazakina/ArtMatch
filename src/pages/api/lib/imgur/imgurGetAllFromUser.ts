import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}

interface ResponseData{
  id:string,
  title:string,
  description:string,
  timeStamp:number,
  vote:number|null,
  nsfw:boolean,
  url:string,
  deleteHash:string,
  posted: boolean,
  album: string,
  tags:string[],
  midia: string,

}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  if(req.method ==='POST'){
    const user:userProps = await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          req.body
        )
      )
    )

    try{
      const responseData = await fauna.query(
        q.Select(
          ['data','posts'],
          q.Get(
            q.Match(
              q.Index('collections_by_user_id'),
              user.ref
            )
          )
        )
      )
      const responseToArray = Object.values(responseData)
      res.json(responseToArray)
    }catch(e){
      res.status(401)
    }
  }else{
    res.setHeader('allow','POST')
    res.status(405).end('Method not allowed')
  }
}