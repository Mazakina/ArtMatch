import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../../services/api";  
import {fauna} from "../../../../services/fauna"
import {query as q} from 'faunadb'

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
class ResponseDataProps{
  id:string;
  title:string;
  description:string;
  timeStamp:number;
  vote:number|null;
  nsfw:boolean;
  URL:string;
  deleteHash:string;
  posted: boolean;
  album: string;
  tags:Array<string>;
  midia: string;
  likes:string[];
  user:{
    name:string,
    avatar:string,
    banner:string,
    userId?:string,
    ref:string
  }|string
}

export default async function imgurGet(req:NextApiRequest,res:NextApiResponse){
  if(req.method ==='GET'){
    let otherPosts ;
    let userId;
    let post;
    let responseData = new ResponseDataProps();
    Object.assign(responseData,{
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
    })

    const hash = req.headers.id as string

    try{
      const allPost:faunaPost = await fauna.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("collections"))),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      )

      allPost.data.map((posts:mapPostProps)=>{
        if(posts.data.posts[hash]?.posted===true){
          userId = (posts.data.userId)
          otherPosts = Object.values(posts.data.posts).filter(post=>post!= posts.data.posts[hash])
          post = posts.data.posts[hash]
        }
        return
      })

      if(!post){
        return res.status(400).end('Post not Found')
      }

      await fauna.query(
        q.Get(userId)
      ).then((response:userProps)=>{
        responseData.user = {
          userId:userId,
          avatar:response.data.avatar,
          banner:response.data.banner,
          name:response.data.user,
          ref:response.ref
        }
      }).catch(
        (error)=> {
          return res.status(400).end('User not Found')}
      )

      Object.assign(responseData,{
        id : post.id,
        title : post.title,
        description : post.id,
        nsfw : post.nsfw,
        URL : post.url,
        deleteHash : post.deleteHash,
        posted : post.posted,
        album : post.album,
        likes : post.likes,
      })

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
      return res.status(400).end('User not Found')
    }
  }else{
    res.setHeader('allow','GET')
    return res.status(405).end('Method not allowed')
  }
}