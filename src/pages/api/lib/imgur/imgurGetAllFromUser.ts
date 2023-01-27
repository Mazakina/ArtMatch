import { NextApiRequest, NextApiResponse } from "next";
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'


interface userProps {
  ref?:string,
  ts?:number|string,
  data?:{
    user:string,
    banner:string,
    avatar:string,
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
    let reqData;
    if(typeof req.body==='string'){
      reqData =  JSON.parse(req.body)}else{
    reqData= req.body}

    let user:userProps
    
    if(reqData.byEmail == true){
      user = await fauna.query(
        q.Get(
          q.Match(
            q.Index('user_by_email'),
            q.LowerCase(reqData.user)
          )
        )
      )
    }else{
      user = await fauna.query(
        q.Get(
          q.Match(
            q.Index('user_by_usuario'),
            q.LowerCase(reqData.user)
          )
        )
      )
    }
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
      if(reqData.getAlbums){
        const allAlbums = await fauna.query(
          q.Select(
            ['data','albums'],
            q.Get(
              q.Match(
                q.Index('albums_by_userId'),
                user.ref
              )
            )
          )
        )
        const responseToArray = Object.values(responseData)
        res.json({posts:responseToArray,albums:allAlbums})
      }else{
        const responseToArray = Object.values(responseData)
        res.json({posts:responseToArray})
      }
    }catch(e){
      res.status(401).end('')
    }
  }else{
    res.setHeader('allow','POST')
    res.status(405).end('Method not allowed')
  }
}