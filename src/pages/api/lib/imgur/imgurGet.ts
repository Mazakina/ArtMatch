import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'
import { userAgent } from "next/server";

interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string,
    banner:string,
    avatar:string,
    user:string
  }
}

// interface postProps{
//   id:string,
//   title:string,
//   description:string,
//   nsfw:boolean,
//   URL:string,
//   posted: boolean,
//   album: string,
//   midia: string,
//   deleteHash:string,
// }
interface mapPostProps{
  data:{
    userId:string,
    posts: any
  }
}
interface faunaPost{
  data: []
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
  tags:Array<string>,
  midia: string,
  user:{
    name:string,
    avatar:string,
    banner:string
  }|string
}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  if(req.method ==='POST'){
    let otherPosts 
    let reqData;
    if(typeof req.body==='string'){
      reqData =  JSON.parse(req.body)}else{
    reqData= req.body}
    const hash = reqData.id
    
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
      tags:[],
      vote:null,
      midia: '',
      user:''
    }
    try{
      const allPost:faunaPost = await fauna.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("collections"))),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      )
      let post
      allPost.data.map((posts:mapPostProps)=>{
        if(posts.data.posts[hash]?.posted===true){
          responseData.user = (posts.data.userId)
          otherPosts = Object.values(posts.data.posts).filter(post=>post!= posts.data.posts[hash])
          post = posts.data.posts[hash]

        }
        return
      })
      if(!post){
        res.status(404)
      }else{
        await fauna.query(
          q.Get(responseData.user)
        ).then((response:userProps)=>
          responseData.user = {
            avatar:response.data.avatar,
            banner:response.data.banner,
            name:response.data.user
        })
        responseData.id= post.id
        responseData.title= post.title
        responseData.description= post.id
        responseData.nsfw=post.nsfw
        responseData.URL= post.url
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
          const data = response.data.data;
          responseData.timeStamp = data.datetime;
          responseData.vote = data.vote;
          res.status(200).json({...responseData,otherPosts})
        })
        .catch(function (error) {
          res.status(500)
          ;
        });
      }
    }catch(e){
      res.status(400)
    }
  }else{
    res.setHeader('allow','GET')
    res.status(405).end('Method not allowed')
  }
}