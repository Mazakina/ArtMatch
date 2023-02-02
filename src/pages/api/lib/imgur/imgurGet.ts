import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'
import { userAgent } from "next/server";

interface userProps extends NextApiResponse{
  ref:string,
  ts:number|string,
  data:{
    email:string,
    banner:string,
    avatar:string,
    user:string,
  }
}
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
  likes:string[],
  user:{
    name:string,
    avatar:string,
    banner:string,
    userId?:string,
    ref:string
  }|string
}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  if(req.method ==='POST'){
    const prepareJSONData = async (data) =>{
      if(typeof data==='string'){
        return JSON.parse(data)
      }else{
        return data
      }
    }

    let otherPosts 
    let reqData = await prepareJSONData(req.body)
    let id;
    let post;
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
      user:'',
      likes:[]
    }

    const hash = reqData.id

    try{
      const allPost:faunaPost = await fauna.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("collections"))),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      )

      allPost.data.map((posts:mapPostProps)=>{
        if(posts.data.posts[hash]?.posted===true){
          id = (posts.data.userId)
          otherPosts = Object.values(posts.data.posts).filter(post=>post!= posts.data.posts[hash])
          post = posts.data.posts[hash]
        }
        return
      })

      if(!post){
        return res.status(404).end('Not Found')
      }

      await fauna.query(
        q.Get(id)
      ).then((response:userProps)=>{
        responseData.user = {
          userId:id,
          avatar:response.data.avatar,
          banner:response.data.banner,
          name:response.data.user,
          ref:response.ref
        }
      }).catch(
        (error)=> {
          return res.status(404).end('Not Found')}
      )

      responseData.id= post.id
      responseData.title= post.title
      responseData.description= post.id
      responseData.nsfw=post.nsfw
      responseData.URL= post.url
      responseData.deleteHash = post.deleteHash
      responseData.posted = post.posted
      responseData.album = post.album
      responseData.likes = post.likes

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
        res.status(202).json({...responseData,otherPosts})
      })
      .catch(function (error) {
        console.log(error)
        return res.status(500).end('Server error')
      });
    }catch(e){
      return res.status(404).end('Not Found')
    }
  }else{
    res.setHeader('allow','GET')
    return res.status(405).end('Method not allowed')
  }
}