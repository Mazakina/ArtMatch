import { Flex ,Text, Icon, VStack, Tooltip, Button} from "@chakra-ui/react";
import { AvatarName } from "../AvatarName";
import Division from "../Division";

import {AiFillFolderAdd, AiOutlineFolderOpen, AiOutlineFolder , AiOutlineReload} from 'react-icons/ai'
import {BiTrash} from 'react-icons/bi'
import { useState } from "react";
import { Api } from "../../services/api";
import {useSession} from 'next-auth/react'

interface albumProps{
  album:{
    albumName: string,
    albumRef: string
  },
  activeAlbum:string,
  setActiveAlbum:Promise<void>
}

export default function Sidebar({data,onMouseEnter,onMouseLeave,onDragDrop,albums=[],onAlbumDrop,setAlbum}){
  const { activeAlbum,setActiveAlbum} = setAlbum
  return(
    <Flex  minWidth='240px' height='98%' id='left-nav' flexDir='column'>
    <AvatarName name={data?.user.name} email={data?.user.email} avatar={data?.user.image} />

    <Division  width={'100%'}  bg={'#323232'}/>
      <Flex ml='20px' flexDir='column'>
        <Flex width='100%' justify='space-between' align='center' >
          <Text>Albums</Text>
          
          <Flex align='center'>
            <Icon cursor={'pointer'} color='#D9D9D9' as={AiFillFolderAdd} />
            <Icon cursor={'pointer'} transition='all 1s ease-in-out' _hover={{transform:'rotate(360deg)'}} color='#D9D9D9' as={AiOutlineReload} />
          </Flex>
        </Flex>
        <VStack fontSize='16px' mt='1rem' justify={'flex-start'} alignItems='flex-start' spacing='6px'>
            {albums.map(album=>{
              return(
                <Album onAlbumDrop={onAlbumDrop} setActiveAlbum={setActiveAlbum} activeAlbum={activeAlbum}album={album}/>
              )
            })}
        </VStack>
      </Flex>
      <Tooltip bg='#4e4e4e' label='Arraste aqui para deletar'>
        <Flex id='lixeira' data-tooltip-content='Arraste para lixeira' onMouseEnter={event=>onMouseEnter(event)} onMouseLeave={event=>onMouseLeave(event)} onMouseUp={(e)=>onDragDrop(e)} zIndex={21} as={Button} align='center' m='auto 1rem 3rem' border='1px solid #959595' _hover={{ bg:'none', color:'#FCD635', border: '1px solid #FCD635'}} bg='none'>
          <Icon as={BiTrash} /> <Text  mr='auto'>Lixeira</Text>
        </Flex>
      </Tooltip>
    </Flex>
  )
}


export function Album({album,activeAlbum,setActiveAlbum,onAlbumDrop}){
  const {data} = useSession()
  const active = activeAlbum===album.albumRef
  return(
    <Flex 
    _hover={{ zIndex:11, bg:'#20343d78', border: '1px solid #FCD635'}}
    border={'1px solid transparent'} onMouseUp={(e)=>onAlbumDrop(e,album)}
    data-tooltip-content='Arraste para Adicionar' cursor={'pointer'} ml={0} w='100%' mr='auto' 
    borderRadius='5px' bg={active?'#20343D':''}
    flexDir='column' align="center">
      <Flex flexDir='column' w='100%'  > 
        <Flex onClick={()=>{active?setActiveAlbum('any'):setActiveAlbum(album.albumRef)}}  w='100%' p='.2rem 16px  '  align="center"> 
          <Icon mr='.5rem' color={active?'#FCD635':'#959595'} as={AiOutlineFolderOpen} /> 
          <Text>{album.albumName}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

