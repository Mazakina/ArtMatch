import { AspectRatio, Box, Button, Flex, HStack, Text, Image } from "@chakra-ui/react"
import { useState } from "react"

export default function({post,onOpen,setImage,setTitle,setDescription,setMidia,setTags,setPublished}){
  const [posted,setPosted] = useState(()=>{post.posted})
  const [modal,setModal] = useState()
  const setModalProperties = (post) => {
    setImage(post.url)
    setTitle(post.title);
    setDescription(post.description);
    setMidia(post.midia);
    setTags(post.tags);
    onOpen()
  }
  return(
    <Flex
    ml='20px'
    flexDir='column'
    align='center'
    justify='flex-start'
    w='190px'
    overflow='hidden'
    height='215px'
    bgColor='#3A3A3A'
    border='1px
    solid
    #4d4d4d'
    borderRadius='5px'
    _hover={{
      border:'1px solid #FFEB80'
    }}>
      <AspectRatio  w='190px' ratio={1}>
      <Box position='relative'>
        <Image align={'50% 50%'} alt='' position='absolute' transform='brightness(0.6)' borderRadius='4px' w='101%' h='101%' objectFit='cover' src={post.url} />
        <Flex
          height='100%'
          position='absolute'
          opacity='0.01'
          w='100%'
          align='center'
          justify='center'
          bgColor='#14141473'
          _hover={{opacity:1}}
          transition='all 0.3s ease-in-out'
          >
          <Button onClick={()=>setModalProperties(post)} _hover={{bg:'#FFE767'}} color='#000' bg='#FFE767'>Editar</Button>
        </Flex>
      </Box>
      </AspectRatio>
      <Flex m='auto 10px ' width='100%' justify='space-between'>
        <Text ml='10px' fontSize='10px'>{post.title}</Text>
        <HStack mr='10px'>
          <Text fontSize='10px'>Publicado</Text>
          <Box width='30px' border='1px solid gray' borderRadius='10px' ><Box ml={'auto'} h='12px' w='12px' borderRadius='50%' bg='#FFEB80' /></Box>
        </HStack>
      </Flex>
    </Flex>
  )
}