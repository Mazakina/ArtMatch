import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../services/api";  
import FormData from  'form-data'
import {fauna} from "../../../services/fauna"
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
  const image = req.body.image
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
  console.log(JSON.stringify(response.data));
  const newData = {
    id:response.data.data.id,
    title: req.body.title,
    description: req.body.description,
    deleteHash:response.data.data.deletehash,
    url:response.data.data.link,
    posted: req.body.posted||true
    // album: req.body.title,
    // tags:[...req.body.tags],
    // midia: req.body.midia,
  }
  console.log('Post Data:',newData)
  const reqUser = req.body.user
// ---------------------------
  const userEmail = reqUser.email
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
              posts:[newData],
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
                q.Append(
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
        )
      )
    )
    console.log('workeeed')
    res.status(200).json({ok:true})
  }catch(e){
    console.log(e)
    res.status(401).end('unauthorized')
  }
})
.catch(function (error) {
  console.log(error);
})
}

// {"data":{"id":"8G0y2Ii","title":null,"description":null,"datetime":1670089476,"type":"image/png","animated":false,"width":1912,
// "height":480,"size":58017,"views":0,"bandwidth":0,"vote":null,"favorite":false,"nsfw":null,"section":null,"account_url":null,
// "account_id":0,"is_ad":false,"in_most_viral":false,"has_sound":false,"tags":[],"ad_type":0,"ad_url":"","edited":"0","in_gallery":false,
// "deletehash":"MTiK7sPY4FsZ8O7","name":"","link":"https://i.imgur.com/8G0y2Ii.png"},"success":true,"status":200}