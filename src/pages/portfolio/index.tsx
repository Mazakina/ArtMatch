import {Image , Avatar, Flex, Link, Box, Text, Icon, VStack, Button, AspectRatio, HStack, useDisclosure } from "@chakra-ui/react";
import Header from "../../components/Header";
import {AiFillFolderAdd, AiFillFolder, AiOutlineFolderOpen, AiOutlineFileText , AiOutlineFolder , AiFillFileAdd, AiOutlineReload} from 'react-icons/Ai'
import {IoIosArrowForward, IoIosArrowDown} from 'react-icons/io'
import {BiTrash} from 'react-icons/bi'
import {BsPlusSquare} from 'react-icons/bs'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

export default function portfolio(){
  const { isOpen, onOpen, onClose } = useDisclosure()


  return(
    <>
      <Header/>
      <Flex h='100vh' mt='-50px' pt='50px' justify="flex-start">

        <Flex id='left-nav' flexDir='column'>
          <Flex m='20px 20px 0 20px'>
            <Avatar src=''/>
            <Box ml='12px'>
              <Text>Juras Rodionovas</Text>
              <Link fontSize='12px' >jurasrodionovas@gmail.com</Link>
            </Box>
          </Flex>

          <Box margin='1rem auto' width='100%' height='1px' bg='#323232'/>
          < Flex  ml='20px' flexDir='column'>
            <Flex width='100%' justify='space-between' align='center' >
              <Text>Projetos</Text>
              
              <Flex align='center'>
                <Icon color='#D9D9D9' as={AiFillFolderAdd} />
                <Icon color='#D9D9D9' as={AiFillFileAdd} />
                <Icon color='#D9D9D9' as={AiOutlineReload} />
              </Flex>
            </Flex>
            <VStack fontSize='16px' mt='1rem' alignItems='flex-start' spacing='6px'>
              <Flex ml={0} flexDir='column' align="center">
                <Flex flexDir='column'  > 
                  <Flex bg='#20343D' p='0 24px 0 0' borderRadius='5px' align="center"> <Icon as={IoIosArrowDown} /> <Icon color='#FCD635' as={AiOutlineFolderOpen} /> <Text>Lorem</Text></Flex>
                  <Flex p='0 24px 0 0' ml='24px !important'  align="center"> <Icon color='#FCD635' as={AiOutlineFileText} /> <Text>Lorem</Text></Flex>
                  <Flex ml='24px !important'  align="center"> <Icon color='#959595' as={AiOutlineFileText} /> <Text>Lorem</Text></Flex>
                </Flex>
              </Flex>
              <Flex  align="center"><Icon as={IoIosArrowForward} /> <Icon color='#959595' as={AiOutlineFolder} /> <Text>Lorem</Text></Flex>
              <Flex align="center"><Icon as={IoIosArrowForward} /> <Icon color='#959595' as={AiOutlineFolder} /> <Text>Lorem</Text></Flex>
            </VStack>
          </Flex>

          <Flex as={Button} align='center' m='auto 1rem 3rem' border='1px solid #959595' _hover={{ bg:'none', color:'#FCD635', border: '1px solid #FCD635'}} bg='none'>
          <Icon as={BiTrash} /> <Text  mr='auto'>Lixeira</Text>
          </Flex>
        </Flex>

        <Box height='98%' m='auto 16px' w={'1px'} bg='#fff' />

        <Flex mt={'2rem'}>
          <Flex as={Button} _hover={{bg:'none'}}bg={'none'} cursor='pointer' onClick={onOpen} flexDir='column' align='center' justify='center' w='190px' height='190px' borderRadius='5px' border='1px dashed #fff'>
            <Icon fontSize='32px' as={BsPlusSquare}/>
            <Text fontSize='14px' mt='1rem'>Novo Projeto</Text>
          </Flex>
          <Flex ml='20px' flexDir='column' align='center' justify='flex-start' w='190px' overflow='hidden'  height='215px' border='1px solid #FFEB80' bgColor='#3A3A3A' borderRadius='5px'>
            <AspectRatio  w='190px' ratio={1}>
              <Image transform='brightness(0.6)' borderRadius='4px' w='101%' h='101%' objectFit='cover' src='/images/001.jpg' />
            </AspectRatio>
            <Flex m='auto 10px ' width='100%' justify='space-between'>
              <Text ml='10px' fontSize='10px'>Titulo</Text>
              <HStack mr='10px'>
                <Text fontSize='10px'>Publicado</Text>
                <Box width='30px' border='1px solid gray' borderRadius='10px' ><Box h='12px' w='12px' borderRadius='50%' bg='#FFEB80' /></Box>
              </HStack>
            </Flex>
          </Flex>
        </Flex>

        <Modal  isOpen={isOpen} onClose={onClose}>
          <ModalOverlay bg='#000000c0' />
          <ModalContent bg='#373737' >
          <ModalHeader>Nova publicação</ModalHeader>
          <ModalCloseButton />
          </ModalContent>
        </Modal>
      </Flex>
    </>
  )
}