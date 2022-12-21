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
  let newData = {
    usuario: reqData.usuario,
    biografia: reqData.biografia,
    cidade: reqData.cidade,
    endereco: reqData.endereco,
    numero: reqData.numero,
  };

  const user:userProps = await fauna.query(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        req.body.user.email
      )
    )
  )

  try{ 
    console.log(user.ref)
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
    ).then(response =>res.status(200))
  }catch(e){
    console.log(e)
    res.status(401)
  }
}