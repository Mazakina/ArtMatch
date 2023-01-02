import { Flex ,Text, Icon, VStack, Tooltip, Button} from "@chakra-ui/react";
import { AvatarName } from "../AvatarName";
import Division from "../Division";

import {AiFillFolderAdd, AiOutlineFolderOpen, AiOutlineFileText , AiOutlineFolder , AiFillFileAdd, AiOutlineReload} from 'react-icons/ai'
import {IoIosArrowForward, IoIosArrowDown} from 'react-icons/io'
import {BiTrash} from 'react-icons/bi'


export default function Sidebar({data,onMouseEnter,onMouseLeave,onDragDrop}){
  return(
    <Flex  minWidth='240px'zIndex={11}   height='98%' id='left-nav' flexDir='column'>
    <AvatarName name={data?.user.name} email={data?.user.email} avatar={data?.user.image} />

    <Division  width={'100%'}  bg={'#323232'}/>
      <Flex zIndex={2} ml='20px' flexDir='column'>
        <Flex width='100%' justify='space-between' align='center' >
          <Text>Projetos</Text>
          
          <Flex align='center'>
            <Icon color='#D9D9D9' as={AiFillFolderAdd} />
            <Icon color='#D9D9D9' as={AiFillFileAdd} />
            <Icon transition='all 1s ease-in-out' _hover={{transform:'rotate(360deg)'}} color='#D9D9D9' as={AiOutlineReload} />
          </Flex>
        </Flex>
        <VStack fontSize='16px' mt='1rem' justify={'flex-start'} alignItems='flex-start' spacing='6px'>
          <Flex ml={0} w='100%' mr='auto' flexDir='column' align="center">
            <Flex flexDir='column' w='100%'  > 
              <Flex bg='#20343D' w='100%' p='0 24px 0 0' borderRadius='5px' align="center"> <Icon as={IoIosArrowDown} /> <Icon mr='.5rem' color='#FCD635' as={AiOutlineFolderOpen} /> <Text>Lorem</Text></Flex>
              <Flex p='0 24px 0 0' ml='24px !important'  align="center"> <Icon color='#FCD635' as={AiOutlineFileText} /> <Text>Lorem</Text></Flex>
              <Flex ml='24px !important'  align="center"> <Icon color='#959595' as={AiOutlineFileText} /> <Text>Lorem</Text></Flex>
            </Flex>
          </Flex>
          <Flex  align="center"><Icon as={IoIosArrowForward} /> <Icon color='#959595' as={AiOutlineFolder} /> <Text>Lorem</Text></Flex>
          <Flex align="center"><Icon as={IoIosArrowForward} /> <Icon color='#959595' as={AiOutlineFolder} /> <Text>Lorem</Text></Flex>
        </VStack>
      </Flex>
      <Tooltip bg='#4e4e4e' label='Arraste aqui para deletar'>
        <Flex id='lixeira' data-tooltip-content='Arraste para lixeira' onMouseEnter={event=>onMouseEnter(event)} onMouseLeave={event=>onMouseLeave(event)} onMouseUp={(e)=>onDragDrop(e)} zIndex={11} as={Button} align='center' m='auto 1rem 3rem' border='1px solid #959595' _hover={{ bg:'none', color:'#FCD635', border: '1px solid #FCD635'}} bg='none'>
          <Icon as={BiTrash} /> <Text  mr='auto'>Lixeira</Text>
        </Flex>
      </Tooltip>
    </Flex>
  )
}