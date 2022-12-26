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
  console.log('here')
  const formData = new FormData()
  const reqData = req.body
  const image = reqData.image
  const imageData = image.substring(image.indexOf(",") + 1);
  formData.append('image',
   imageData
   )


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
  res.status(200)
  const resData = response.data.data
  const resDataId = response.data.data.id
  console.log(JSON.stringify(response.data));
  const newData ={
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
    }
  };

  console.log('Post Data:',newData)
  
 // ---------------------------
  const userEmail = reqData.user.email
  console.log('user email:',userEmail)
  const user:userProps = 
  await fauna.query(
    q.Get(
        q.Match(
            q.Index('user_by_email'),
            userEmail
        )
      )
    )
  console.log('user:',user)

  try{
    await fauna.query(
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
    console.log('workeeed')
    res.status(201).json({ok:true})
  }catch(e){
    console.log(e)
    res.status(401).end('unauthorized')
  }
})
.catch(function (error) {
  console.log(error);
})
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}