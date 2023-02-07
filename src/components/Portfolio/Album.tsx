import {Flex ,Text, Icon, Button, Input
  ,} from "@chakra-ui/react";
import {AiOutlineFolderOpen} from 'react-icons/ai'
import {BiTrash} from 'react-icons/bi'
import React, { Dispatch, SetStateAction, useState } from "react";

    
interface AlbumProps{
  albumName: string,
  albumRef: string
}
interface AlbumMapProps{
  album:AlbumProps,
  activeAlbum:string,
  setActiveAlbum:Dispatch<SetStateAction<string>>,
  onAlbumDrop:(event:any,album: any)=>void,
  deleteAlbum:(album:AlbumProps)=>void
};

export function Album({album,activeAlbum,setActiveAlbum,onAlbumDrop,deleteAlbum}:AlbumMapProps){
  const active = activeAlbum===album.albumRef
  const [isLoading,setIsLoading] = useState(false)
  const [isEditing,setIsEditing] = useState(false)
  function loadingIcon(){
    setIsLoading(true);
    setTimeout(()=>setIsLoading(false),760)
  }
  function onDeleteRequest(){
    deleteAlbum(album)
    loadingIcon()
    if(active){setActiveAlbum('any')} 
  }

  return(
      <Flex
        _hover={{
          zIndex:11,
          bg:'#20343d78',
          border: '1px solid #FCD635'}}
        border={'1px solid transparent'}
        onMouseUp={(e)=>{onAlbumDrop(e,album);loadingIcon()}}
        data-tooltip-content='Arraste
        para
        Adicionar'
        cursor={'pointer'}
        ml={0}
        w='100%'
        maxW={'250px'}
        mr='auto'
        borderRadius='5px'
        bg={active?'#20343D':''}
        flexDir='column'
        align="center">
        <Flex flexDir='row' align='center' w='100%'  > 
          <Flex
            onClick={()=>{active?setActiveAlbum('any'):setActiveAlbum(album.albumRef)}}
            w='100%'
            p='.2rem
            16px
            '
            align="center">
            <Button
              h={'1rem'}
              minW='1rem'
              color={active?'#FCD635':'#959595'}
              as={!!isLoading&&!!active?Button:AiOutlineFolderOpen}
              _hover={{bg:'none',cursor:'pointer'}}
              m='0
              .5rem
              0
              0'
              bg='none'
              p={'0 !important'} 
              isLoading={isLoading} />
            {!isEditing ||album.albumRef==='any'?
            <Text>{album.albumName}</Text>:
            <Input padding={0} m={0} h='1.5rem' border={'none'} _selected={{border:'none'}}  fontSize={'1rem'} type="text"/>}
          </Flex>
          {album.albumRef==='any'?'':<Icon onClick={onDeleteRequest} mr='.5rem' _hover={{color:'#FCD635'}} color={'#959595'} as={BiTrash} /> }
        </Flex>

    </Flex>
  )
};


  