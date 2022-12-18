import { NextApiRequest, NextApiResponse } from "next"
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}


export default async(req:NextApiRequest,res:NextApiResponse)=>{
  const reqData = req.body
  const blockedUser = reqData.blockedUser
  const user:userProps = 
  await fauna.query(
    q.Get(
        q.Match(
            q.Index('user_by_email'),
            reqData.user.email
        )
      )
    )

  if(reqData.type ==='add'){
    try{
      await fauna.query(
        q.If(
          q.Intersection(
            q.Select(
              ['data','bloqueados'],
              q.Get(
                q.Match(
                  q.Index('settings_by_user_id'),
                  user.ref
                )
              )
            ),
            [blockedUser]
          ),
          res.status(400).end('user already blocked'),
          q.Prepend(
            q.Select(
              ['data','bloqueados'],
              q.Get(
                q.Match(
                  q.Index('settings_by_user_id'),
                  user.ref
                )
              )
            ),
            blockedUser
          )
        )
      )
    }catch(err){
      res.status(400).end('invalid user')
    }
  }
  if(reqData.type ==='remove'){
    try{
      await fauna.query(
        q.Update(
          q.Select(
            ['data','bloqueados'],
            q.Get(
              q.Match(
                q.Index('settings_by_user_id'),
                user.ref
              )
            )
          ),
          q.Filter(
            q.Select(
              ['data','bloqueados'],
              q.Get(
                q.Match(
                  q.Index('settings_by_user_id'),
                  user.ref
                )
              )
            ),
            q.Lambda(
              'value',
              q.Not(
                q.Equals(
                  q.Var('value'),
                  blockedUser
                )
              )
            )  
          )
        )
      )
    }catch(err){

    }
  }
}