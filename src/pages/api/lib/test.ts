import {fauna} from "../../../services/fauna"
import {query as q} from 'faunadb'
import { NextApiRequest, NextApiResponse } from "next"
import { Api } from "../../../services/api"
import { authOptions } from '../../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth";
import { getSession } from "next-auth/react"
import FormData from  'form-data'
interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}
import { getToken } from "next-auth/jwt"


export default async(req:NextApiRequest,res:NextApiResponse)=>{
  const token = await getSession({req})
  console.log(token)
  res.status(200).json({ok:true})
}
