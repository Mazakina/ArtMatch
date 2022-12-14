import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../../../services/fauna";
import {query as q} from 'faunadb'
interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}
export default async function(req:NextApiRequest,res:NextApiResponse){
  if(req.method==='POST'){
    console.log(req.body)
    const reqData = req.body
    console.log( {
      [reqData.id]:{
        album:reqData.albumRef
      }
    })
    const user:userProps = 
    await fauna.query(
      q.Get(
        q.Match(
            q.Index('user_by_email'),
            req.body.user.email
        )
      )
    )  
    try{
      await fauna.query(
        q.Update(
          q.Select(
            'ref',
            q.Get(
              q.Match(
                q.Index('collections_by_user_id'),
                user.ref
              ) 
            )
          ),
          {
            data:{
              posts:{
                [reqData.id]:{
                  album:reqData.albumRef
                }
              }
          }}
        )
      )
      res.status(200).json({ok:true})
    }catch(e){
      console.log(e)
      res.status(401).end('unauthorized')
    }
  }else{
    res.setHeader('allow','POST')
    res.status(405).end('Method not allowed')
  }
}