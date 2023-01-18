import { NextApiRequest, NextApiResponse } from "next";
import {fauna} from "../../../../services/fauna";
import {query as q} from 'faunadb'

interface userProps {
  ref:string,
  ts:number|string,
  data:{
    user:string,
    banner:string,
    avatar:string,
  }
}

export default async function likePost (req:NextApiRequest,res:NextApiResponse){
  const data = req.body
  const postId = req.body.postId
  const user:userProps = 
  await fauna.query(
    q.Get(
        q.Match(
            q.Index('user_by_email'),
            req.body.user.email
        )
      )
    )

  const postOwner:userProps = await fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_usuario'),
        req.body.postOwnerName
      )
    )
  )
  if(req.method=="POST"){

  }

  if(req.method=="PATCH"){
    await fauna.query(
      q.Update(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('collections_by_user_id'),
              postOwner.ref
            ) 
          )
        ),
        {
          data:{
            posts:{
              [postId]:{
                likes:
                q.Append(
                  [user.ref],
                  q.Filter(
                    q.Select(
                      ["data",'posts',postId],
                      q.Get(
                        q.Match(
                          q.Index('collections_by_user_id'),
                          postOwner.ref
                        )
                      )
                  ),
                    q.Lambda(
                      'i',
                      q.Equals(
                        q.Var('i'),
                        [user.ref]
                      )
                    )
                  )
                )
              }
            }
        }}
      )
    )
  }

  if(req.method=="DELETE"){

  }
}