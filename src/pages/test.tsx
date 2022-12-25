import { Button } from "@chakra-ui/react";
import Header from "../components/Header";
import { Api } from "../services/api";
import {useSession} from 'next-auth/react'
import { useState } from "react";

export default  function Test(){
  const[value,setValue] = useState<any>()
  async function testing(){ 
    await Api.post('/lib/imgur/imgurGet',{
      id:'aZizQUA'
    }).then(response =>console.log(response))
  }
  return(
    <>
      <Header/>
      <Button onClick={()=>{testing()}}>test</Button>
    </>
  )  
}
