import { NextApiRequest, NextApiResponse } from 'next'
import {fauna} from '../../../../services/fauna'
import { query as q} from 'faunadb'
interface userProps{
  ref:string,
  ts:number|string,
  data:{
    email:string
  }
}

export default async (req:NextApiRequest,res:NextApiResponse)=>{
  const reqData = req.body 
  const section = req.body.section
  let newData;
  switch(section){
    case'profile':
      newData = {
        usuario: reqData.usuario,
        biografia: reqData.biografia,
        cidade: reqData.cidade,
        endereco: reqData.endereco,
        numero: reqData.numero,
      }
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
      }
  }
  const user:userProps = await fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        req.body.user.email
      )
    )
  )

  try{ 
    console.log(newData)
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
    )
    res.status(200)
  }catch(e){
    console.log(e)
    res.status(401)
  }
}