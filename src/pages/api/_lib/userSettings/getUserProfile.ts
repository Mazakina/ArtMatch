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
export default async function getUserProfile(req:NextApiRequest, res:NextApiResponse) {
  const reqData = JSON.parse(req.body)
  const userName = reqData.user.slug.replace(/_/g,' ')
 try{
  let user:userProps;
  try{
    user = await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_usuario'),
          q.LowerCase(userName)
        )
      )
    )
  }catch(e){
    console.log('user fetch error')
    res.status(404).json({ok:false})  
  }
  
  const userSettings:userSettingsProps = 
  await fauna.query(
    q.Get(
      q.Match(
        q.Index('settings_by_user_id'),
        user.ref
      )
    )
  )
  const ts = userSettings.ts
  const {data} = userSettings

  return res.status(200).json({data,ts})
 }catch(e){
  res.status(404).end('User not found')
 }
}