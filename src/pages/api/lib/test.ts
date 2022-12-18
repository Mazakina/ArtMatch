import {fauna} from "../../../services/fauna"
import {query as q} from 'faunadb'
import { NextApiRequest, NextApiResponse } from "next"
import { Api } from "../../../services/api"
import FormData from  'form-data'
interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}

export default async(req:NextApiRequest,res:NextApiResponse)=>{
  const newData = {
    "testing": {
      "id": "lq6Aa3S",
      "title": "as",
      "description": "asd",
      "deleteHash": "wPT16TF2w62M3Yk",
      "url": "https://i.imgur.com/lq6Aa3S.png",
      "posted": true
    }
  }

  let newArray = {
  "posts": 
    {
      "lq6Aa3S": {
        "id": "lq6Aa3S",
        "title": "as",
        "description": "asd",
        "deleteHash": "wPT16TF2w62M3Yk",
        "url": "https://i.imgur.com/lq6Aa3S.png",
        "posted": true
      },
      "lq6Aa3": {
        "id": "lq6Aa3S",
        "title": "as",
        "description": "asd",
        "deleteHash": "wPT16TF2w62M3Yk",
        "url": "https://i.imgur.com/lq6Aa3S.png",
        "posted": true
      }
    },
  }
    let test = 
    await fauna.query(
      q.Update(
        newArray,
        {posts: 
        q.ToArray(
          q.Select('posts',newArray)
        )
        }
      )
    )
    // await fauna.query(
    //   q.Update(
    //    newArray,
    //   {
    //     posts:
    //       q.Append(
    //         newData,
    //           q.Select(
    //           'posts',
    //           newArray
    //         )
    //       )
    //     }
    //   )
    // )
  console.log(test)
}
