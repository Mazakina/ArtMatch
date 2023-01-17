import { Button } from "@chakra-ui/react";
import Header from "../components/Header";
import { Api } from "../services/api";
import {useSession} from 'next-auth/react'
import { useEffect, useState } from "react";
import { searchEngine } from "./api/lib/sarchEngine";


export default  function Test(){
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = async () => {
    const result = await searchEngine(data, searchTerm,'byPosts');
    setSearchResults(result);
  };
  let data;
  useEffect(()=>{    
    Api.post('/lib/imgur/imgurGetAllFeed')
    .then(response=>{
      data = response.data;
      }
    )
  },[])

  function onClickHandle (e){
    e.preventDefault();
    setSearchTerm('samurai')
    handleSearch()
  }

  return(
    <>
      <Header/>
      <Button onClick={(e)=>{onClickHandle(e)}}>onClick</Button>
    </>
  )  
}