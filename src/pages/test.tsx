import { Button } from "@chakra-ui/react";
import Header from "../components/Header";
import { Api } from "../services/api";
import {useSession} from 'next-auth/react'
export default  function Test(){
  return(
    <>
      <Header/>
      <Button onClick={()=>{}}>test</Button>
    </>
  )  
}
