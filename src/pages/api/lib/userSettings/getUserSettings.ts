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
  console.log('infinito essa merda?')
  const token = await getSession({req})
  // const session = await unstable_getServerSession(req,res, authOptions)
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
  res.status(200)
  res.json({
    data
  })
 }catch(e){
  res.status(404)
 }
}