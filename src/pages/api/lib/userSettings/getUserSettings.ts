import { NextApiRequest, NextApiResponse } from "next";
import {fauna} from '../../../../services/fauna'
import {query as q} from 'faunadb'
import { getSession } from "next-auth/react"

interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}
interface userSettingsProps{
  data:object,
  ref:object,
  ts:number
}
export default async(req:NextApiRequest,res:NextApiResponse)=>{
  const token = await getSession({req})
  try{
    const user:userProps = await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          token.user?.email
        )
      )
    )
    const userSettings:userSettingsProps = 
    await fauna.query(
      q.Get(
        q.Match(
          q.Index('settings_by_user_id'),
          user.ref
        )
      )
    )
    const {data} = userSettings
    res.status(200).json({
      data
    })
  }catch(e){
    res.status(404)
  }
}