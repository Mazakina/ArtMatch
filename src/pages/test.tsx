import { Button } from "@chakra-ui/react";
import Header from "../components/Header";
import { Api } from "../services/api";
import {useSession} from 'next-auth/react'
export default function Test(){
  function testing(){
    Api.post('/lib/imgurGetAllFromUser',{
      title: 'new',
      description: 'updated',
      album:'updated',
      user: data.user.email,
      id:'fHEmhY5',
      deleteHash:'tqDsFYBwynw2dIg',
      posted: true,
      link:"https://i.imgur.com/fHEmhY5.png",
    }).then(res=>{console.log(res.data)})
  }
  const {data} = useSession()
  console.log(data)
  return(
    <>
      <Header/>
      <Button onClick={()=>{testing()}}>test</Button>
    </>

  )  
}
