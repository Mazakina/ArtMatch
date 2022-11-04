import { Avatar, Box, Text , Link, Flex } from "@chakra-ui/react"

export function AvatarName(){
  return(
  <Flex m='20px 20px 0 20px'>
    <Avatar src=''/>
    <Box ml='12px'>
      <Text>Juras Rodionovas</Text>
      <Link fontSize='12px' >jurasrodionovas@gmail.com</Link>
    </Box>
  </Flex>
  )
}