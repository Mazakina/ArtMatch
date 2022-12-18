import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import FormData from  'form-data'
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

interface newDataProps{
  title?:string,
  description?:string,
  album?:string,
  tags?:string[],
  midia?:string,
  // cropImage:any
}

interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  if(req.method==='POST'){
    const formData = new FormData()
    const reqData = req.body
    const userEmail = reqData.user
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
      url:reqData.link,
      posted: reqData.posted||true
      // album: reqData.title,
      // tags:[...reqData.tags],
      // midia: reqData.midia,
      }
    };
    newAppendFunction('title')
    newAppendFunction('description')
    console.log(newData)
    // newUpdateFaunaValue('album')
    // newUpdateFaunaValue('tags')
    // newUpdateFaunaValue('midia')
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
                    ),
                    newData
                  )
                }
              }
            )
          )
          res.status(200).json({ok:true})
        }
      catch(e){
        console.log(e)
        res.status(401).end('unauthorized')
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
  else{
    res.setHeader('allow','POST')
    res.status(405).end('Method not allowed')
  }
}