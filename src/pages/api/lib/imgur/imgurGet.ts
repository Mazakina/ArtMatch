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
  // tags:[...reqData.tags],
  midia: string,
  user:string
}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  if(req.method ==='POST'){
    let otherPosts 
    const hash = req.body.id
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
      user:''
    }
    try{
      const allPost:faunaPost = await fauna.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("collections"))),
          q.Lambda("X", q.Get(q.Var("X")))
        )
      )
      let post = allPost.data.map((posts:mapPostProps)=>{
        if(posts.data.posts[hash]?.posted===true){
          responseData.user = (posts.data.userId)
          otherPosts = posts.data.posts.filter(post=>post!= posts.data.posts[hash])
          return posts.data.posts[hash]
        }
        return
      })
      if(!post){
        res.status(404)
      }else{
        responseData.id= post[0].id
        responseData.title= post[0].title
        responseData.description= post[0].id
        responseData.nsfw=post[0].nsfw
        responseData.URL= post[0].url
        responseData.deleteHash = post[0].deleteHash
        responseData.posted = post[0].posted
        responseData.album = post[0].album
        var config = {
          method: 'get',
          url: `https://api.imgur.com/3/image/${hash}`,
          headers: { 
            'Authorization':`Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
          },
        };
        console.log(responseData.user)
        
        Api(config)
        .then(function (response) {
          const data = response.data.data;
          responseData.timeStamp = data.datetime;
          responseData.vote = data.vote;
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }catch(e){console.log(e)}
    res.status(200).json({...responseData})
  }else{
    res.setHeader('allow','POST')
    res.status(405).end('Method not allowed')
  }
}