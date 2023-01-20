import { NextApiRequest, NextApiResponse } from "next"
import {fauna} from '../../../../services/fauna'
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

export default async function favoritePost(req:NextApiRequest,res:NextApiResponse){
  const data = req.body
  const userEmail = data.data.email 
  if(req.method=='POST'){
  }

  try{
    const user:userProps = await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          userEmail
        )
      )
    )
    
    const favoritePosts= await fauna.query( 
      q.Get(
        q.Match(
          q.Index('favorite_posts_by_user_id'),
          user.ref
        )
      )
    ).then(response=>res.status(200).json(favoritePosts))
  }catch(e){
    res.status(401)
  }
   

  if(req.method=='PATCH'){
    const user:userProps = 
    await fauna.query(
      q.Get(
          q.Match(
              q.Index('user_by_email'),
              userEmail
          )
        )
      )
    try{
      await fauna.query(
        q.If(
          q.Not(
              q.Exists(
                  q.Match(
                      q.Index('favorite_posts_by_user_id'),
                      user.ref
                  )
              )
          ),
          q.Create(
            q.Collection('favorite_posts'),
            {
              data: {
                userId:user.ref,
                posts:[req.body.id],
                }
            }
          ),
          q.Update(
            q.Select(
              'ref',
              q.Get(
                q.Match(
                  q.Index('favorite_posts_by_user_id'),
                  user.ref
                )
              )
            ),
            {
              data:{
                posts:
                q.Append(
                  [req.body.id],
                  q.Filter(
                    q.Select(
                      ["data",'posts'],
                      q.Get(
                        q.Match(
                          q.Index('favorite_posts_by_user_id'),
                          user.ref
                        )
                      )
                  ),
                    q.Lambda(
                      'i',
                      q.Equals(
                        q.Var('i'),
                        [req.body.id]
                      )
                    )
                  )
                )
              }
            }
          )
          ,
        )
      ).then(resonse => res.status(201).end('updated')).catch(err =>res.status(400))
    }catch(e){
      res.status(404)
    }
  }
  if(req.method=='DELETE'){
    const user:userProps = 
    await fauna.query(
      q.Get(
          q.Match(
              q.Index('user_by_email'),
              userEmail
          )
        )
      )
    try{
      await fauna.query(
        q.If(
          q.Not(
              q.Exists(
                  q.Match(
                      q.Index('favorite_posts_by_user_id'),
                      user.ref
                  )
              )
          ),
          q.Create(
            q.Collection('favorite_posts'),
            {
              data: {
                userId:user.ref,
                posts:[req.body.id],
                }
            }
          ),
          q.Update(
            q.Select(
              'ref',
              q.Get(
                q.Match(
                  q.Index('favorite_posts_by_user_id'),
                  user.ref
                )
              )
            ),
            {
              data:{
                posts:
                  q.Filter(
                    q.Select(
                      ["data",'posts'],
                      q.Get(
                        q.Match(
                          q.Index('favorite_posts_by_user_id'),
                          user.ref
                        )
                      )
                  ),
                    q.Lambda(
                      'i',
                      q.Equals(
                        q.Var('i'),
                        [req.body.id]
                      )
                    )
                  )
              }
            }
          )
          ,
        )
      ).then(resonse => res.status(202).end('deleted'))
    }catch(e){
      res.status(404)
    }
  }

}