import { fauna } from "../../../services/fauna";
import {query as q} from 'faunadb'
import { Api } from "../../../services/api";
import { useSession } from "next-auth/react";
interface PostInterfaces{
  title:string,
  url:string,
  previewUrl:string,
  description:string,
  published:boolean,
  tags:Array<string>,
}
export async function saveImageOnGallery(
  // imageId:string,
  // imageUrl:string
  userEmail:string
){
  console.log(userEmail)
  const userRef = await fauna.query(
    q.Select(
        "ref",
        q.Get(
            q.Match(
                q.Index('users_by_email'),
                userEmail
            )
        )
    )
  ).then((response)=>{console.log(response)}).catch((err)=>{console.log(err)})
  // const userCollection = await fauna.query(
  //   q.Select(
  //     "data",
  //     q.Get(
  //       q.Match(
  //         q.Index('collections_by_user_id'),
  //         userRef
  //       )
  //     )
  //   )
  // )
  // console.log(userRef,userCollection)
  // const collectionData = [
  //   { 
  //     userId: userRef,  
  //     posts:[
  //     ],
  //     visible: true
  //   },
  // ]
  // await fauna.query(
  //   q.Create(
  //     q.Collection('collections'),
  //     {data:collectionData}
  //   )
  // )
}