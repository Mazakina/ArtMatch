import {Flex ,Text, Icon, Button, Input, Checkbox, Radio
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
  onAlbumDrop:(event:any,album: any)=>void,
};

export default function ModalAlbum({album,onAlbumDrop}:AlbumMapProps){
  return(
    <Radio  
      value={album.albumRef}
      _hover={{ zIndex:11, bg:'#20343d78', border: '1px solid #FCD635'}}
      border={'1px solid transparent'}
      bg={ '#20343d78'}
      cursor={'pointer'}   w='100%' maxW={'250px'} m={ '0 auto 1rem 0'}
      borderRadius='5px'
      onChange={(event)=>{onAlbumDrop(event,album);}}
      >
        <Text w='100%' color={'white'}  as={Flex} alignItems='center' justifyContent='center'> 
          {album.albumName}
        </Text>
    </Radio >
  )
}