import { NextApiRequest, NextApiResponse } from 'next'
import {fauna} from '../../../../services/fauna'
import { query as q} from 'faunadb'
interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  const reqData = req.body 
  const section = req.body.section
  let newData;


  const user:userProps = await fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        req.body.user
      )
    )
  )

  try{ 
    q.Update(
      q.Get(
        q.Match(
          q.Index('settings_by_user_id'),
          user.ref
        )
      ),
      {'data':{
        [section]:{
          newData
        }
      }}
    )
  }catch(e){

  }
}