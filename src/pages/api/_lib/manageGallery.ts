import {fauna} from "../../../services/fauna"
import {query as q} from 'faunadb'
import { NextApiRequest, NextApiResponse } from "next"

interface userProps{
    ref:string,
    ts:number|string,
    data:{
      email:string
    }
}


export default async (req:NextApiRequest,res:NextApiResponse
)=>{
  if(req.method === 'POST'){
    const newData = [1]
    // req.body.newUrl
    const userEmail = req.body.user.email
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
    res.status(200).json({ok:true})}catch(e){
      res.status(401).end('unauthorized')
    }
    }else{
      res.setHeader('allow','POST')
      res.status(405).end('Method not allowed')
    }
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








// import {fauna} from "../../../services/fauna"
// import {query as q} from 'faunadb'
// import { NextApiRequest, NextApiResponse } from "next"

// export default async (req:NextApiRequest,res:NextApiResponse
// )=>{
//   if(req.method === 'POST'){
//     const userEmail = req.body.user.email
//     const userRef = 
//     await fauna.query(
//       q.Select(
//         "ref",
//         q.Get(
//             q.Match(
//                 q.Index('user_by_email'),
//                 userEmail
//             )
//           )
//         )
//       )

//         await fauna.query(
//           q.If(
//             q.Not(
//                 q.Exists(
//                     q.Match(
//                         q.Index('collections_by_user_id'),
//                         userRef
//                     )
//                 )
//             ),
//           q.Create(
//             q.Collection('collections'),
//             {
//               data: {
//                 userId:userRef,
//                 posts:[],
//                 visible:'true'
//                 }
//             }
//           ),
//           q.Update(
//             q.Get(
//               q.Match(
//                 q.Index('collections_by_user_id'),
//                 userRef
//               )
//             ),{
//               data:{
                
//               }
//             }
//           )
//         )
//     console.log(userRef)
//     res.status(200).json({ok:true})
//   }else{
//     res.setHeader('allow','POST')
//     res.status(405).end('Method not allowed')
//   }
//   // const userCollection = await fauna.query(
//   //   q.Select(
//   //     "data",
//   //     q.Get(
//   //       q.Match(
//   //         q.Index('collections_by_user_id'),
//   //         userRef
//   //       )
//   //     )
//   //   )
//   // )
//   // const collectionData = [
//   //   { 
//   //     userId: userRef,  
//   //     posts:[
//   //     ],
//   //     visible: true
//   //   },
//   // ]
//   // await fauna.query(
//   //   q.Create(
//   //     q.Collection('collections'),
//   //     {data:collectionData}
//   //   )
//   // )
// }
