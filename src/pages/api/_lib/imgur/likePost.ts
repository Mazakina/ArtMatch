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
  const postId = req.body.id
  async function getUser(){
    const user:userProps = await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          req.body.data.email
        )
      )
    )
    return user;
  }

  const postOwner:userProps = await fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_usuario'),
        req.body.postOwnerName
      )
    )
  )
  if(req.method=="PATCH"){
    const user = await getUser()

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
                      ["data",'posts',postId,'likes'],
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
    ).then(response=>res.status(202)).catch(err=>res.status(404).end('collection not found'))
    return
  }

  if(req.method=="DELETE"){
    const user = await getUser()

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
                  q.Filter(
                    q.Select(
                      ["data",'posts',postId,'likes'],
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
              }
            }
        }}
      )
    ).then(response=>res.status(202)).catch(err=>res.status(404).end('collection not found'))
    return
  }
  res.status(405).end('Method not Allowed')
}
