import { Avatar, Box, Text , Link, Flex } from "@chakra-ui/react"
import { Api } from "../../services/api";

interface AvatarNameProps{
  name:string,
  post:any,
  avatar:string,
}

export function ProfilePostData({name,post,avatar}:AvatarNameProps){
  const type = (value)=>{
    switch(value){
      case'pinturaDigital':
        return 'Pintura D.'
      break;
      case'pinturaTradicional':
        return 'Pintura Tradicional'
      break;
      case'graffite':
        return 'Graffite'
      break;
      case'tatuagem':
        return 'Tatuagem'
      break;
    }
  }
  return(
  <Flex  align={'center'} overflow={'hidden'}  m='20px 0px 1rem 20px'>
    <Avatar src={avatar}/>
    <Box ml='12px'>
      <Text fontSize={'1rem'} >{post.title}</Text>
      <Text fontSize='.8rem'>{type(post.midia)}</Text>
      <Text fontSize='.8rem'>{name}</Text>
    </Box>
  </Flex>
  )
}