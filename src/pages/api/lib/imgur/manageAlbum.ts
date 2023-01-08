import { NextApiRequest, NextApiResponse } from "next";
import {fauna} from '../../../../services/fauna'
import {query as q} from 'faunadb'
interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}

export default async function manageAlbum (req:NextApiRequest,res:NextApiResponse){
  if(req.method='POST'){
    const albumName = req.body.albumName
    const user:userProps= await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          req.body.user.email
        )
      )
    )
    console.log(user)
    switch(req.body.action){
      case'delete':
      const albumRef = req.body.album
        await fauna.query(
          q.Update(
            q.Select(
              'ref',
              q.Get(
                q.Match(
                  q.Index('albums_by_userId'),
                  user.ref
                )
              )
            ),
            {
              data:{
                albums:
                q.Filter(
                  q.Select(
                    ["data",'albums'],
                    q.Get(
                      q.Match(
                        q.Index('albums_by_userId'),
                        user.ref
                      )
                    )
                  ),
                  q.Lambda(
                    'i',
                    q.Not(
                      q.Equals((albumRef),q.Select('albumRef',q.Var('i')))
                    ),
                  )
                )
              }
            }
          )
          )
      break;
      case 'create':
        try{
          const newAlbum = {albumName:albumName,
            albumRef:new Date+' '+albumName
            }
          await fauna.query(
            q.Update(
              q.Select(
                'ref',
                q.Get(
                  q.Match(
                    q.Index('albums_by_userId'),
                    user.ref
                  )
                )
              ),{
              data:{
                albums:
                  q.Append(
                    q.Select(
                      ['data','albums'],
                      q.Get(
                        q.Match(
                          q.Index('albums_by_userId'),
                          user.ref
                        )
                      )
                    ),
                    [newAlbum]
                  )
                }
              }
            )        
          ).then(
           (response)=>{
            res.status(200).json(newAlbum)
           }
          )
        }catch(e){res.status(404)}
      break;
      case'update':
        await fauna.query(
          q.Update(
            q.Get(
              q.Match(
                q.Index('albums_by_userId'),
                user.ref
              )
            ),{
            data:
              {album:[q.Map(
                q.Select(
                  ['data','albums'],
                  q.Get(
                    q.Match(
                      q.Index('albums_by_userId'),
                      user.ref
                    )
                  )
                ),q.Lambda('i',
                q.If(
                  q.Select('albumRef',q.Var('i'))=== req.body.albumRef,
                  {albumName:albumName,albumRef:req.body.albumRef},
                  'not this one'
                )
                )
              )]}
            }
          )
        )
      break;
      case'get':
        q.Select(
          ['data','albums'],
          q.Get(
            q.Match(
              q.Index('albums_by_userId'),
              user.ref
            )
          )
        )
      break;
    }
  }
}