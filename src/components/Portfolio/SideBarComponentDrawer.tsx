import {Spinner, Flex ,Text, Icon, VStack, Tooltip, Button, Input ,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, 
  DrawerContent, DrawerCloseButton,} from "@chakra-ui/react";
  import { useMediaQuery } from '@chakra-ui/react'
  import { AvatarName } from "../AvatarName";
  import Division from "../Division";
  import {AiFillFolderAdd, AiOutlineFolderOpen, AiOutlineReload} from 'react-icons/ai'
  import {BiTrash} from 'react-icons/bi'
  import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
  import { Api } from "../../services/api";
  import {useSession} from 'next-auth/react'
  import { BsCheckLg, BsPlusSquare } from "react-icons/bs";
  import { IoClose } from "react-icons/io5";
  import { AnimatePresence, LayoutGroup } from "framer-motion";
  import { UserContext } from "../../services/hooks/UserContext";
import { Album } from "./Album";
import { NewAlbum } from "./NewAlbum";
  
  
  interface AlbumProps{
    albumName: string,
    albumRef: string
  }
  
  interface SideBarProps{
    albums:{
      albumsCollection:Array<AlbumProps>|null,
      setAlbumsCollection:Dispatch<SetStateAction<Array<any>>>
    }
    onAlbumDrop:(event: any,album: any) => void,
    setActAlbum:{
      activeAlbum:string|null,
      setActiveAlbum:Dispatch<SetStateAction<string>>
    },
    isOpen:boolean,
    onOpenNewPost:() => void,
    onClose:() => void,
    setIsNewFile:Dispatch<SetStateAction<boolean>>
    // btnRef:any,
  }
  
  const SideBarComponentDrawer= React.memo( 
    function SideBar({albums,onOpenNewPost,onAlbumDrop,setIsNewFile,setActAlbum,isOpen,onClose}:SideBarProps)
    {

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
    useEffect(()=>{
      onClose()
    }, [activeAlbum])
    function capitalizeFirstLetter(str) {
      return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return(
      <Drawer
      isOpen={isOpen}
      placement='left'
      onClose={onClose}
      >
      <DrawerOverlay zIndex={10} />
      <DrawerContent zIndex={10} bg='blackAlpha.800'>
        <DrawerCloseButton />
        <DrawerHeader>
          <AvatarName
            display={{base:'none',md:'flex'}}
            name={capitalizeFirstLetter(user.data.user)||data?.user.name}
            email={data?.user.email}
            avatar={user.data.avatar||data?.user.image} />
        </DrawerHeader>
        <DrawerBody zIndex={10}>
          <Flex  minWidth='240px' height='98%' id='left-nav' flexDir='column'>
            <Division display={{base:'none',md:'flex'}} m={'0.2rem'} width={'100%'}  bg={'#323232'}/>
            <Flex  maxH='74%' mb='.5rem' ml='20px' flexDir='column'>
              <Flex  width='100%' justify='space-between' align='center' >
                <Text>Albums</Text>
                <Flex align='center'>
                  <Icon cursor={'pointer'} _hover={{ color:'#FCD635'}} margin='0 .5rem' onClick={()=>setIsCreatingNewAlbum(!isCreatingNewAlbum)} color='#D9D9D9' as={AiFillFolderAdd} />
                  <Icon cursor={'pointer'} transition='all 1s ease-in-out' _hover={{transform:'rotate(360deg)'}} color='#D9D9D9' as={AiOutlineReload} />
                </Flex>
              </Flex>
      
              <AnimatePresence>
                <VStack  zIndex='1' overflow={'auto'}
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
                fontSize='16px' maxH='80%' mt='1rem' justify={'flex-start'} alignItems='flex-start' spacing='6px'>
                <LayoutGroup>
                    <Album deleteAlbum={deleteAlbum} onAlbumDrop={onAlbumDrop} setActiveAlbum={setActiveAlbum} activeAlbum={activeAlbum}album={{albumName:'Todos',albumRef:'any'}}/>
                    
                    {isCreatingNewAlbum &&
                   <NewAlbum
                      albumsCollection={albumsCollection}
                      setAlbumsCollection={setAlbumsCollection}
                      setIsCreatingNewAlbum={setIsCreatingNewAlbum}
                      data={data} />}
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
      
            <Tooltip  placement='auto' bg='#4e4e4e' label='Arraste aqui para deletar'>
             <Button
                id='new-post'
                data-tooltip-content='Criar nova postagem'
                zIndex={21}
                onClick={()=>{onOpenNewPost(),setIsNewFile(true)}}
                alignItems='center'
                m='auto 1rem 3rem'
                border='1px
                solid
                #959595'
                _hover={{ bg:'none', color:'#FCD635', border:'1px solid #FCD635'}}
                bg='none'>
                 <Text ml='1em'  mr='auto'>Novo projeto</Text><Icon as={BsPlusSquare} fontSize='1.5rem' />
              </Button>
            </Tooltip>
      
          </Flex>
      </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
});

  
  export default SideBarComponentDrawer;
  
 