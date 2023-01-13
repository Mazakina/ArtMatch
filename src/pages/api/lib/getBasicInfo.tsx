import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../../services/fauna";
import {query as q} from 'faunadb'


export default async function(req:NextApiRequest,res:NextApiResponse){
  const userName = req.body.user

  const data = await fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_usuario'),
        userName
      )
    )
  ).then((response)=> res.status(200).json(response.data))
  
}