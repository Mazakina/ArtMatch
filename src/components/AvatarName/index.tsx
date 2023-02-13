import { Avatar, Box, Text , Link, Flex, FlexProps } from "@chakra-ui/react"

interface AvatarNameProps extends FlexProps{
  name:string,
  email:string,
  avatar:string,
}

export function AvatarName({name,email,avatar,...rest}:AvatarNameProps){

  return(
  <Flex  overflow={'hidden'} maxW={'250px'}  m='20px 0px 0 20px' {...rest}>
    <Avatar aria-label="Avatar do usuário" src={avatar}/>
    <Box ml='12px'>
      <Text>{name}</Text>
      <Link fontSize='12px'>{email}</Link>
    </Box>
  </Flex>
  )
}