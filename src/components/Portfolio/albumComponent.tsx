import { Flex , Icon, Text} from "@chakra-ui/react";
import { AiOutlineFolder } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";

interface albumComponentProps{
  album:{
    albumName: string,
    albumRef: string
  },
  currentAlbum:string
}

export default function albumComponent({album,currentAlbum}:albumComponentProps){
  const active = album.albumName===currentAlbum
  return(
    <Flex  bg={active?'#20343D': ''} w='100%' align="center"><Icon as={IoIosArrowForward} /> <Icon color={active? '#FCD635':'#959595'} as={AiOutlineFolder} /> <Text>{album.albumName}</Text></Flex>
  )
}