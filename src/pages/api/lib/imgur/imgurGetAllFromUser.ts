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
    console.log('received')
    const user:userProps = await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          req.body.user
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
      console.log(responseData)
      res.json({responseData})
    }catch(e){
      res.status(403).end('invalid post')
    }
  }else{
    res.setHeader('allow','POST')
    res.status(405).end('Method not allowed')
  }
}