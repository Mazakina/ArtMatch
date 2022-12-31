import { Avatar, Box, Text , Link, Flex } from "@chakra-ui/react"

interface AvatarNameProps{
  name:string,
  email:string,
  avatar:string,
}

export function AvatarName({name,email,avatar}:AvatarNameProps){
  return(
  <Flex  overflow={'hidden'} maxW={'250px'} m='20px 0px 0 20px'>
    <Avatar src={avatar}/>
    <Box ml='12px'>
      <Text>{name}</Text>
      <Link fontSize='12px'>{email}</Link>
    </Box>
  </Flex>
  )
}