import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'
interface UserProps {
  ref:string,
  ts:number|string,
  data:{
    user:string,
    banner:string,
    avatar:string,
  }
}

// interface NewDataProps{
//  id:string,
//  title:string,
//  description:string,
//  deleteHash:string,
//  url:string,
//  posted:boolean,
//  tags:string[],
//  midia:string,
//  cropped:string,
//  likes:string[]
// }

export default async function imgurPost (req:NextApiRequest, res:NextApiResponse){
  const reqData = req.body
  const image = reqData.image
 
  let newData;
  var config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: { 
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
      Accept: 'application/json'
    },
    data : {
      image: image.split(',')[1],
      type: 'base64'
    },
    maxContentLength: 100000000,
    maxBodyLength: 100000000
  };
  Api(config).then( async (response)=> {
    config={
      ...config,
      data: {
        image:reqData.croppedImage.split(',')[1],
        type: 'base64'
      }
    }
    Api(config).then(async (cropResponse)=> {
      res.status(200)
      const resData = response.data.data
      const resDataId = response.data.data.id
      newData ={
        [resDataId]:{
        id:resData.id,
        title: reqData.title,
        description: reqData.description,
        deleteHash:resData.deletehash,
        url:resData.link,
        posted: reqData.posted,
        tags:[...reqData.tags],
        midia: reqData.midia,
        cropped:cropResponse.data.data.link,
        likes:[],
        createdAt:resData.datetime
      }
    }
  
 // ---------------------------
  const userEmail = reqData.user.email
  const user:UserProps = 
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
                    q.Index('collections_by_user_id'),
                    user.ref
                )
            )
        ),
        q.Create(
          q.Collection('collections'),
          {
            data: {
              userId:user.ref,
              posts:newData,
              visible:'true'
              }
          }
        ),
        q.Update(
          q.Select(
            'ref',
            q.Get(
              q.Match(
                q.Index('collections_by_user_id'),
                user.ref
              )
            )
          ),
          {
            data:{
              posts:
              q.Merge(
                newData,
                  q.Select(
                    ["data",'posts'],
                    q.Get(
                      q.Match(
                        q.Index('collections_by_user_id'),
                        user.ref
                      )
                    )
                )
              )
            }
          }
        ),
      )
    )
    res.status(201).json({...newData[resDataId]})
  }catch(e){
    res.status(401).end('unauthorized')
  }
})})
.catch(function (error) {
  res.status(404)
})
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}
