import {Spinner, Flex ,Text, Icon, VStack, Tooltip, Button, Input ,
Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, 
DrawerContent, DrawerCloseButton, FlexProps, Box,} from "@chakra-ui/react";
import { useMediaQuery } from '@chakra-ui/react'
import { AvatarName } from "../AvatarName";
import Division from "../Division";
import {AiFillFolderAdd, AiOutlineFolderOpen, AiOutlineReload} from 'react-icons/ai'
import {BiTrash} from 'react-icons/bi'
import React, { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { Api } from "../../services/api";
import {useSession} from 'next-auth/react'
import { BsCheckLg } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { UserContext } from "../../services/hooks/UserContext";
import { Album } from "./Album";
import { NewAlbum } from "./NewAlbum";


interface AlbumProps{
  albumName: string,
  albumRef: string
}

interface SideBarProps {
  onMouseEnter: (event: any) => void,
  onMouseLeave: (event: any) => void,
  onDragDrop: (event: any) => void,
  albums:{
    albumsCollection:Array<AlbumProps>|null,
    setAlbumsCollection:Dispatch<SetStateAction<Array<any>>>
  }
  onAlbumDrop:(event: any,album: any) => void,
  setActAlbum:{
    activeAlbum:string|null,
    setActiveAlbum:Dispatch<SetStateAction<string>>
  }
}

const SidebarComponent= React.memo( function Sidebar({onMouseEnter,onMouseLeave,onDragDrop,albums,onAlbumDrop,setActAlbum}:SideBarProps){

  const useUser = useContext(UserContext)
  const {user} = useUser
  const {data} = useSession()
  const { activeAlbum,setActiveAlbum} = setActAlbum
  const {albumsCollection,setAlbumsCollection} = albums
  const [isCreatingNewAlbum,setIsCreatingNewAlbum]= useState(false)
  function deleteAlbum(album){
    try{
      Api.post('lib/imgur/manageAlbum',{
        album:album.albumRef,
        ...data,
        action:'delete'
      })
      let newAlbumArray = albumsCollection.filter(
        albumFilter=>albumFilter.albumRef!=album.albumRef
      )
      setAlbumsCollection(newAlbumArray)
    }catch(e){
    }
  }

  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return(
    
    <Flex  minWidth='240px' height='98%' id='left-nav' flexDir='column'  >
      <AvatarName  minH='50px' name={capitalizeFirstLetter(user.data.user)||data?.user.name} email={data?.user.email} avatar={user.data.avatar||data?.user.image} />
      <Division width={'100%'}  bg={'#323232'}/>
      <Flex minH='30%' maxH='70%' mb='.5rem' ml='20px' flexDir='column'>
        <Flex  width='100%' justify='space-between' align='center' >
          <Text>Albums</Text>
          <Flex align='center'>
            <Icon cursor={'pointer'} _hover={{ color:'#FCD635'}} margin='0 .5rem' onClick={()=>setIsCreatingNewAlbum(!isCreatingNewAlbum)} color='#D9D9D9' as={AiFillFolderAdd} />
            <Icon cursor={'pointer'} transition='all 1s ease-in-out' _hover={{transform:'rotate(360deg)'}} color='#D9D9D9' as={AiOutlineReload} />
          </Flex>
        </Flex>

        <AnimatePresence>
          <VStack overflow={'auto'}
            sx={
              { 
              '::-webkit-scrollbar':{
                width:'7px',
                backgroundColor: '#000000',
              },
              '::-webkit-scrollbar-thumb':{
                borderRadius: '10px',
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,.3)',
                backgroundColor: '#919191',
              },
              '::-webkit-scrollbar-track':{
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
                borderRadius: '10px',
                backgroundColor: '#2e2e2e',
              }
            }
          } 
          fontSize='16px' mt='1rem' justify={'flex-start'} alignItems='flex-start' spacing='6px'>
           <LayoutGroup>
              <Album deleteAlbum={deleteAlbum} onAlbumDrop={onAlbumDrop} setActiveAlbum={setActiveAlbum} activeAlbum={activeAlbum}album={{albumName:'Todos',albumRef:'any'}}/>
              
              {isCreatingNewAlbum? 
              <NewAlbum albumsCollection={albumsCollection} setAlbumsCollection={setAlbumsCollection}  setIsCreatingNewAlbum={setIsCreatingNewAlbum} data={data}/>:''}

              {albumsCollection.map(album=>{
                return(
                  <Album
                    key={album.albumRef}
                    deleteAlbum={deleteAlbum}
                    onAlbumDrop={onAlbumDrop}
                    setActiveAlbum={setActiveAlbum}
                    activeAlbum={activeAlbum}
                    album={album} />
                )
              })}
            </LayoutGroup>
          </VStack>
        </AnimatePresence>
      </Flex>

        <Tooltip placement='top' bg='#4e4e4e' label='Arraste aqui para deletar'>
          <Flex
            H='40px'
            id='lixeira'
            data-tooltip-content='Arraste para lixeira'
            onMouseEnter={event=>onMouseEnter(event)}
            onMouseLeave={event=>onMouseLeave(event)}
            onMouseUp={onDragDrop}
            zIndex={21}
            as={Button}
            align='center'
            m='auto 1rem 1rem'
            border='1px solid #959595'
            _hover={{bg:'none',color:'#FCD635',border:'1px solid #FCD635'}} 
            bg='none'>
            <Icon as={BiTrash} /> <Text  mr='auto'>Lixeira</Text>
          </Flex>
        </Tooltip>
    </Flex>
  )
});

export default SidebarComponent;
