import { Button } from "@chakra-ui/react";
import Header from "../components/Header";
import { Api } from "../services/api";

export default function Test(){
  function testing(){
    Api.post('/lib/test',{
      title: 'new',
    })
  }
  return(
    <>
      <Header/>
      <Button onClick={()=>{testing()}}>test</Button>
    </>

  )  
}