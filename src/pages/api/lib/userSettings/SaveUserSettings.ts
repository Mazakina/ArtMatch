import { NextApiRequest, NextApiResponse } from 'next'
import {fauna} from '../../../../services/fauna'
import { query as q} from 'faunadb'
import { Api } from "../../../../services/api";  
import FormData from  'form-data'

interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}
interface allUsersProps{
  data:Array<any>
}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  if(req.method!=='POST'){return res.status(405) }
  const reqData = req.body 
  const section = req.body.section
  let newData;
  let avatar
  let banner 
  let bannerDeleteHash
  let avatarDeleteHash
  const allUsers:allUsersProps = await fauna.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("users"))),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )
  const user:userProps = await fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        req.body.user.email
      )
    )
  )
  let mappedUsers 


  switch(section){
    case'profile':
      mappedUsers= allUsers.data.map((users)=>{if(user.data.email!== users.data.email)return users.data.user})
      if(mappedUsers.includes(reqData.usuario)){
        return res.status(405).json({message:'usuario já existente'})
      }
      try{
        if(!!req.body.banner){
          deleteImgur(req.body.bannerDeleteHash)
            const newBannerData = await postImgur(req.body.banner)
            banner = newBannerData.data.data.link
            bannerDeleteHash =  newBannerData.data.data.deletehash
        }
        if(!!req.body.avatar){
          deleteImgur(req.body.avatarDeleteHash)
            const newAvatarData = await postImgur(req.body.avatar)
            avatar = newAvatarData.data.data.link
            avatarDeleteHash =  newAvatarData.data.data.deletehash
        }
        try{
          await fauna.query(
            q.Update(
              q.Select(
                'ref',
                q.Get(
                  q.Match(
                    q.Index('user_by_email'),
                    req.body.user.email
                  )
                )
              ),
              {
                data:{
                  user:reqData.usuario,
                  avatar:avatar,
                  banner:banner,
                }
              }
            ),
          )
        }catch(e){
          return  res.status(400)
        }
        newData = {
          usuario: reqData.usuario,
          biografia: reqData.biografia,
          habilidades: reqData.habilidades,
          cidade: reqData.cidade,
          endereco: reqData.endereco,
          numero: reqData.numero,
          avatar: avatar,
          banner: banner,
          bannerDeleteHash:bannerDeleteHash,
          avatarDeleteHash:avatarDeleteHash
        }
      }catch{}

    break;
    case'social':
      newData = {
        instagram:reqData.instagram,
        artstation:reqData.artstation,
        behance:reqData.behance,
        telefone:reqData.telefone,
      }
    break;
    case'seguranca':
      newData = {
        email:{
          email:reqData.user.email
        },
        nsfwAllow:reqData.nsfwAllow,
        allowToBeFound:reqData.allowToBeFound,
      };
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
                visible:reqData.allowToBeFound
              }
            }
          ),
        )
      }catch(e){
        res.status(400)
      }
  }

  try{ 
    await fauna.query(
      q.Update(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('settings_by_user_id'),
              user.ref
            )
          )
        ),
        {'data':{
          [section]:{
            ...newData
          }
        }}
      )
    ).then(response=>res.status(200).json({ok:true}))
  }catch(e){
    res.status(401)
  }
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}


export async function deleteImgur(deleteHash) {
 if(!!deleteHash){
  const formData = new FormData()
  var config = {
    method: 'delete',
    url: `https://api.imgur.com/3/image/${deleteHash}`,
    headers: { 
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
      Accept: 'application/json'
    },
    data : formData,
  };
  Api(config)
 }
}

export async function postImgur(image){
  const formData = new FormData()
  const imageData = image.substring(image.indexOf(",") + 1);
  formData.append('image',
   imageData
  )
  var config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: { 
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
      Accept: 'application/json'
    },
    data : formData,
    maxContentLength: 100000000,
    maxBodyLength: 100000000
  };
  let data = await Api(config)
  return(data)

}