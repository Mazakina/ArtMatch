import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../../../services/fauna";
import {query as q } from  'faunadb'

interface userProps {
  ref:string,
  ts:number|string,
  data:{
    user:string,
    banner:string,
    avatar:string,
  }
}

export default async function favoriteUser(req:NextApiRequest, res:NextApiResponse){

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
  async function getPostOwner(){
    const postOwner:userProps = await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_usuario'),
          req.body.postOwnerName
        )
      )
    )
    return postOwner
  }

  if(req.method==='POST'){
    return
  }

  if(req.method==='PATCH'){
    const user = await getUser()
    const postOwner = await getPostOwner()

    try{
      await fauna.query(
        q.If(
          q.Not(
              q.Exists(
                  q.Match(
                      q.Index('favorite_users_by_user_id'),
                      user.ref
                  )
              )
          ),
          q.Create(
            q.Collection('favorite_users'),
            {
              data: {
                userId:user.ref,
                favoritedUsers:[postOwner.ref],
                }
            }
          ),
          q.Update(
            q.Select(
              'ref',
              q.Get(
                q.Match(
                  q.Index('favorite_users_by_user_id'),
                  user.ref
                )
              )
            ),
            {
              data:{
                favoritedUsers:
                q.Append(
                  [postOwner.ref],
                  q.Filter(
                    q.Select(
                      ["data",'favoritedUsers'],
                      q.Get(
                        q.Match(
                          q.Index('favorite_users_by_user_id'),
                          user.ref
                        )
                      )
                  ),
                    q.Lambda(
                      'i',
                      q.Not(
                        q.Equals(
                          q.Var('i'),
                          postOwner.ref
                        )
                      )
                    )
                  )
                )
              }
            }
          )
          ,
        )
      ).then(resonse => res.status(201).end('updated'))
      .catch(err =>res.status(400))
    }catch(e){
      res.status(404)
    }
    return
  }
  if(req.method==='DELETE'){
    const user = await getUser()
    const postOwner = await getPostOwner()



    await fauna.query(
      q.Update(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('favorite_users_by_user_id'),
              user.ref
            )
          )
        ),
        {
          data:{
            favoritedUsers:
              q.Filter(
                q.Select(
                  ["data",'favoritedUsers'],
                  q.Get(
                    q.Match(
                      q.Index('favorite_users_by_user_id'),
                      user.ref
                    )
                  )
                )
              ,
                q.Lambda(
                  'i',
                  q.Not(
                    q.Equals(
                      q.Var('i'),
                      postOwner.ref
                    )
                  )
                )
              )
          }
        }
      )
  ).then(resonse => res.status(202).end('deleted'))
    .catch(err=>res.status(404).end('collection not found'))
    return
  }

  return res.status(405).end('Invalid Method')

}