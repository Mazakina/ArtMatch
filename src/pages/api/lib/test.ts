import {fauna} from "../../../services/fauna"
import {query as q} from 'faunadb'
import { NextApiRequest, NextApiResponse } from "next"
import { Api } from "../../../services/api"
import FormData from  'form-data'
interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}

export default async(req:NextApiRequest,res:NextApiResponse)=>{
  const newArray = {
    "userId": "users 349624657101455953",
    "posts": [
      {
        "id": "Y4a74wT",
        "title": "dasdasda",
        "description": "asda",
        "deleteHash": "tqDsFYBwynw2dIg",
        "url": "https://i.imgur.com/Y4a74wT.png"
      }
    ],
    "visible": "true"
    }
    const dataProperties =['title','description','album','tags','midia']
    const formData = new FormData()
    const reqData = req.body
    const deleteHash = newArray.posts[0].deleteHash
    const userEmail = reqData.user
    var newData =  {

    }
    if(reqData.title){ newData["title"]= reqData.title
    formData.append('title', reqData.title)}

    if(reqData.description){newData["description"]= reqData.description;
    formData.append('description', reqData.description)}

    reqData.album? newData["album"]= reqData.album : ''
    reqData.tags? newData["tags"]= reqData.tags : ''
    reqData.midia? newData["midia"]= reqData.midia : ''
    // ---------------------------
    var config = {
      method: 'post',
      url: `https://api.imgur.com/3/image/${deleteHash}`,
      headers: { 
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
        'content-type': 'multipart/form-data'
      },
      data : formData,
    };
    Api(config).
    then(async (response)=>{
      res.status(200)
      console.log(JSON.stringify(response.data));
      // const user:userProps = 
      //   await fauna.query(
      //     q.Get(
      //       q.Match(
      //           q.Index('user_by_email'),
      //           userEmail
      //       )
      //     )
      //   )  
      // try{
      //   await fauna.query(
      //     q.Update(
      //       q.Select(
      //         'ref',
      //         q.Get(
      //           q.Match(
      //             q.Index('collections_by_user_id'),
      //             user.ref
      //           )
      //         )
      //       ),
      //       {
      //         data:{
      //           posts:
      //             q.Filter(
      //               q.Select(
      //                 ["data",'posts'],
      //                 q.Get(
      //                   q.Match(
      //                     q.Index('collections_by_user_id'),
      //                     user.ref
      //                   )
      //                 )
      //               ),
      //               q.Lambda(
      //                 'post',
      //                 q.Not(
      //                   q.Equals(deleteHash,
      //                     q.Select('deleteHash',q.Var('post'))
      //                   )
      //                 )
      //               )
      //             )
      //         }
      //       }
      //     )
      //   )
      //   res.status(200).json({ok:true})
      // }catch(e){
      //   console.log(e)
      //   res.status(401).end('unauthorized')
      // }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
