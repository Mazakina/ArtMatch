import { NextApiRequest, NextApiResponse } from "next";
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'


interface userProps {
  ref?:string,
  ts?:number|string,
  data?:{
    user:string,
    banner:string,
    avatar:string,
  }
}
interface ResponseData{
  id:string,
  title:string,
  description:string,
  timeStamp:number,
  vote:number|null,
  nsfw:boolean,
  url:string,
  deleteHash:string,
  posted: boolean,
  album: string,
  tags:string[],
  midia: string,

}

export default async function imgurGetAllFromUser( req:NextApiRequest, res:NextApiResponse) {
  if(req.method === 'GET'){
    const reqData = req.headers;
   
    let user;
    try{
      if(reqData.by_email == 'true'){
        user = await fauna.query(
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.LowerCase(reqData.user)
            )
          )
        )
      }else{
        user = await fauna.query(
          q.Get(
            q.Match(
              q.Index('user_by_usuario'),
              q.LowerCase(reqData.user)
            )
          )
        )
      }
    }catch{
      res.status(400).json({error:'User not found!'})
    }
    try{
      const responseData = await fauna.query(
        q.Select(
          ['data','posts'],
          q.Get(
            q.Match(
              q.Index('collections_by_user_id'),
              user.ref
            )
          )
        )
      )
      if(reqData.get_albums){
        const allAlbums = await fauna.query(
          q.Select(
            ['data','albums'],
            q.Get(
              q.Match(
                q.Index('albums_by_userId'),
                user.ref
              )
            )
          )
        )
        const responseToArray = Object.values(responseData)
        const postsArray  = responseToArray.map(post =>{
          return{
            ...post,...user.data
          }
        })
        return res.status(200).json( {posts:postsArray , albums:allAlbums })
      }else{
        const responseToArray = Object.values(responseData)
        const postsArray  = responseToArray.map(post =>{
          return{
            ...post,...user.data
          }
        })
        return res.status(200).json({posts:postsArray})
      }
    }catch(e){
      res.status(400).end('')
    }
  }else{
    res.setHeader('allow','GET')
    res.status(405).end('Method not allowed')
  }
}