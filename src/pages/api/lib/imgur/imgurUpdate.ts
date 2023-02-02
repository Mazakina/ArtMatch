import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import FormData from  'form-data'
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

interface ResponseProps{
  data:any
}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  if(req.method==='PUT'){
    const formData = new FormData()
    const reqData = req.body
    const userEmail = reqData.user.email
    const deleteHash = reqData.deleteHash
    const newAppendFunction = (value)=>{
      if(reqData[value]){ 
        // newData[value]= reqData[value]
      formData.append(value, reqData[value])}
    }
    const newUpdateFaunaValue = (value)=>{
      reqData[value]? newData[value]= reqData[value] : ''
    }
    const newData ={
      [reqData.id]:{
      id:reqData.id,
      title: reqData.title,
      description: reqData.description,
      deleteHash:reqData.deleteHash,
      url:reqData.image,
      posted: reqData.posted,
      tags:[...reqData.tags],
      midia: reqData.midia,
      }
    };
    newAppendFunction('title')
    newAppendFunction('description')

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
    then(async (firstResponse)=>{
      res.status(200)
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
                      q.Select(
                        ["data",'posts'],
                        q.Get(
                          q.Match(
                            q.Index('collections_by_user_id'),
                            user.ref
                          )
                        )
                    )
                    ,newData
                  )
                }
              }
            ),
          ).then((response:ResponseProps)=>{
            res.status(200).json(response.data.posts[reqData.id])})
          
        }
      catch(e){
        res.status(401).end('unauthorized')
      }
    })
    .catch((error)=>{
      res.status(404)
      console.log(error);
    })
  }
  else{
    res.setHeader('allow','POST')
    res.status(405).end('Method not allowed')
  }
}