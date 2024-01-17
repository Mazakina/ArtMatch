import { Avatar, Box, Text, Flex } from '@chakra-ui/react'

interface AvatarNameProps {
  name: string
  post: any
  avatar: string
}

export function ProfilePostData({ name, post, avatar }: AvatarNameProps) {
  const type = (value) => {
    switch (value) {
      case 'pinturaDigital':
        return 'Pintura D.'
      case 'pinturaTradicional':
        return 'Pintura Tradicional'
      case 'graffite':
        return 'Graffite'
      case 'tatuagem':
        return 'Tatuagem'
    }
  }
  return (
    <Flex align={'center'} overflow={'hidden'} m="20px 0px 1rem 20px">
      <Avatar aria-label="avatar" src={avatar} />
      <Box ml="12px">
        <Text fontSize={'1rem'}>{post.title}</Text>
        <Text fontSize=".8rem">{type(post.midia)}</Text>
        <Text fontSize=".8rem">{name}</Text>
      </Box>
    </Flex>
  )
}
