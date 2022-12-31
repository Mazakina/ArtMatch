import { NextApiRequest, NextApiResponse } from "next";
import {fauna} from '../../../../services/fauna'
import {query as q} from 'faunadb'
export default async function manageAlbum (req:NextApiRequest,res:NextApiResponse){
  if(req.method='POST'){
    switch(req.body.action){
      case'delete':
      const user= await fauna.query(
        q.Get(
          q.Match(
            q.Index('users_by_email'),
            req.body.user.email
          )
        )
      )
            
      break;
    }
  }
}