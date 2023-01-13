import { Button } from "@chakra-ui/react";
import Header from "../components/Header";
import { Api } from "../services/api";
import {useSession} from 'next-auth/react'
import { useState } from "react";
import { searchEngine } from "./api/lib/sarchEngine";


export default  function Test(){
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  let data;
  Api.post('/lib/imgur/imgurGetAllFeed',{})
  .then(response=>
    data = response.data.map(collection=>{

      return{
        user:collection.data.userId,
        posts:[Object.values(collection.data.posts)]
      }
    }))
  const handleSearch = async () => {
    const result = await searchEngine(data, searchTerm);
    setSearchResults(result);
  };
  return(
    <>
      <Header/>
      <Button onClick={()=>{console.log(data)}}>onClick</Button>
    </>
  )  
}