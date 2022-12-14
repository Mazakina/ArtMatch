import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import FormData from  'form-data'
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}



export default async (req:NextApiRequest,res:NextApiResponse)=>{
  const formData = new FormData()
  const croppedFormData = new FormData()
  const reqData = req.body
  const image = reqData.image
  const imageData = image.substring(image.indexOf(",") + 1);
  formData.append('image',
   imageData
   )
  const cropData = reqData.croppedImage.substring(image.indexOf(",") + 1);
  croppedFormData.append('image',
    cropData
  )
  
  let newData;
  var config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: { 
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
      Accept: 'application/json'
    },
    data : formData,
    maxContentLength: 100000000,
    maxBodyLength: 100000000
  };
  Api(config).then( async (response)=> {
    config={
      ...config,
      data: croppedFormData
    }
    Api(config).then(async (cropResponse)=> {
      res.status(200)
      const resData = response.data.data
      const resDataId = response.data.data.id
      console.log(JSON.stringify(response.data));
      newData ={
        [resDataId]:{
        id:resData.id,
        title: reqData.title,
        description: reqData.description,
        deleteHash:resData.deletehash,
        url:resData.link,
        posted: reqData.posted||true,
        // album: reqData.title,
        // tags:[...reqData.tags],
        midia: reqData.midia,
        cropped:cropResponse.data.data.link
      }
    }
  

  
 // ---------------------------
  const userEmail = reqData.user.email
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