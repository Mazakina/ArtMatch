import { Button } from "@chakra-ui/react";
import Header from "../components/Header";
import { Api } from "../services/api";
import {useSession} from 'next-auth/react'
import { useState } from "react";

export default  function Test(){
  const {data} = useSession()
  const[value,setValue] = useState<any>()
  async function testing(){ 
    await Api.post('/lib/imgur/manageAlbum',{
      ...data,
      albumRef:"Mon Jan 02 2023 05:53:07 GMT-0300 (Horário Padrão de Brasília) testing",
      albumName:'new',
      action:'create'
    }).then(response =>console.log(response))
  }
  return(
    <>
      <Header/>
      <Button onClick={()=>{testing()}}>test</Button>
    </>
  )  
}


//   userId: Ref(Collection("users"), "352256374264037965"),
//   posts: {
//     aiBjE6k: {
//       id: "aiBjE6k",
//       title: "xzxczx",
//       description: "zxczxczxcz",
//       deleteHash: "jMMk9X2fwp1yZ7D",
//       url: "https://i.imgur.com/aiBjE6k.png",
//       posted: true,
//       midia: "pinturaTradicional"
//     },
//     XzOj1Jr: {
//       id: "XzOj1Jr",
//       title: "adfas",
//       description: "adfasdf",
//       deleteHash: "uE1tZKck5ilgU1x",
//       url: "https://i.imgur.com/XzOj1Jr.png",
//       posted: true,
//       midia: "pinturaTradicional"
//     },
//     VYOkFWC: {
//       id: "VYOkFWC",
//       title: "zxczx",
//       description: "zxcvzx",
//       deleteHash: "qJhYs6AitWW9UVC",
//       url: "https://i.imgur.com/VYOkFWC.png",
//       posted: true,
//       midia: "pinturaDigital"
//     },
//     "9K4G9a7": {
//       id: "9K4G9a7",
//       title: "adfas",
//       description: "adfasdf",
//       deleteHash: "Gseit30Mo9nnewb",
//       url: "https://i.imgur.com/9K4G9a7.png",
//       posted: true,
//       midia: "pinturaTradicional"
//     },
//     "1HmVMAR": {
//       id: "1HmVMAR",
//       title: "zxczx",
//       description: "zxcvzx",
//       deleteHash: "G3TJTGhtTrw1oLW",
//       url: "https://i.imgur.com/1HmVMAR.png",
//       posted: true,
//       midia: "pinturaDigital"
//     },
//     OVzVnnC: {
//       id: "OVzVnnC",
//       title: "adfas",
//       description: "adfasdf",
//       deleteHash: "f30Is5JpOXCF9KS",
//       url: "https://i.imgur.com/OVzVnnC.png",
//       posted: true,
//       midia: "pinturaTradicional"
//     },
//     jLDEjId: {
//       id: "jLDEjId",
//       title: "xzxczx",
//       description: "zxczxczxcz",
//       deleteHash: "CkyWm5tDwBL8xWR",
//       url: "https://i.imgur.com/jLDEjId.png",
//       posted: true,
//       midia: "pinturaTradicional"
//     },
//     GYdHF2z: {
//       id: "GYdHF2z",
//       title: "zxczx",
//       description: "zxcvzx",
//       deleteHash: "fDnwHCr9jbULuHC",
//       url: "https://i.imgur.com/GYdHF2z.png",
//       posted: true,
//       midia: "pinturaDigital"
//     },
//     BZYAUpQ: {
//       id: "BZYAUpQ",
//       title: "zxczx",
//       description: "zxcvzx",
//       deleteHash: "pROll0Ec2TbgE00",
//       url: "https://i.imgur.com/BZYAUpQ.png",
//       posted: true,
//       midia: "pinturaDigital"
//     },
//     yifc6hT: {
//       id: "yifc6hT",
//       title: "adfas",
//       description: "adfasdf",
//       deleteHash: "IMMeU0M3JuUxGba",
//       url: "https://i.imgur.com/yifc6hT.png",
//       posted: true,
//       midia: "pinturaTradicional"
//     }
//   }
// }