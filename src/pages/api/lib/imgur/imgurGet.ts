import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}
interface faunaPost{
  id:string,
  title:string,
  description:string,
  nsfw:boolean,
  URL:string,
  posted: boolean,
  album: string,
  midia: string,
  deleteHash:string,
}
interface ResponseDataProps{
  id:string,
  title:string,
  description:string,
  timeStamp:number,
  vote:number|null,
  nsfw:boolean,
  URL:string,
  deleteHash:string,
  posted: boolean,
  album: string,
  // tags:[...reqData.tags],
  midia: string,

}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  if(req.method ==='POST'){
    const hash = req.body.id
    const user:userProps = await fauna.query(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          req.body.user
        )
      )
    )
    let responseData:ResponseDataProps={
      id:'',
      title:'',
      description:'',
      nsfw:false,
      URL:'',
      deleteHash:'',
      posted:true,
      album:'',
      timeStamp:0,
      vote:null,
      midia: '',

    }
    try{
     const post:faunaPost = await fauna.query(
        q.Select(
          ['data','posts',req.body.id],
          q.Get(
            q.Match(
              q.Index('collections_by_user_id'),
              user.ref
            )
          )
        )
      )
      responseData.id= post.id
      responseData.title= post.title
      responseData.description= post.id
      responseData.nsfw=post.nsfw
      responseData.URL= post.URL
      responseData.deleteHash = post.deleteHash
      responseData.posted = post.posted
      responseData.album = post.album
      
        var config = {
          method: 'get',
          url: `https://api.imgur.com/3/image/${hash}`,
          headers: { 
            'Authorization':`Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
          },
        };
        
        Api(config)
        .then(function (response) {
          const data = response.data.data

          responseData.timeStamp = data.datetime
          responseData.vote = data.vote
          res.json({responseData})
        })
        .catch(function (error) {
          console.log(error);
        });

    }catch(e){console.log(e)}
    // console.log(imgurRes)
  }else{
    res.setHeader('allow','POST')
    res.status(405).end('Method not allowed')
  }
}