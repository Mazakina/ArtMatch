import {Spinner, Flex ,Text, Icon, VStack, Tooltip, Button, Input} from "@chakra-ui/react";
import { AvatarName } from "../AvatarName";
import Division from "../Division";
import {GrFormClose} from 'react-icons/gr'
import {AiFillFolderAdd, AiOutlineFolderOpen, AiOutlineFolder , AiOutlineReload} from 'react-icons/ai'
import {BiTrash} from 'react-icons/bi'
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Api } from "../../services/api";
import {useSession} from 'next-auth/react'
import { Session } from "next-auth";
import { BsCheckLg } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, LayoutGroup } from "framer-motion";


interface AlbumProps{
  albumName: string,
  albumRef: string
}

interface SideBarProps{
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

export default function Sidebar({onMouseEnter,onMouseLeave,onDragDrop,albums,onAlbumDrop,setActAlbum}:SideBarProps){

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
      }).then(response=>console.log(response))
      let newAlbumArray = albumsCollection.filter(
        albumFilter=>albumFilter.albumRef!=album.albumRef
      )
      setAlbumsCollection(newAlbumArray)
    }catch(e){
    }
  }

  return(
    <Flex  minWidth='240px' height='98%' id='left-nav' flexDir='column'>
    <AvatarName name={data?.user.name} email={data?.user.email} avatar={data?.user.image} />

    <Division width={'100%'}  bg={'#323232'}/>
      <Flex  maxH='74%' mb='.5rem' ml='20px' flexDir='column'>
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
                  <Album  deleteAlbum={deleteAlbum} onAlbumDrop={onAlbumDrop} setActiveAlbum={setActiveAlbum} activeAlbum={activeAlbum} album={album}/>
                )
              })}
            </LayoutGroup>
          </VStack>
        </AnimatePresence>
      </Flex>
      <Tooltip bg='#4e4e4e' label='Arraste aqui para deletar'>
        <Flex id='lixeira' data-tooltip-content='Arraste para lixeira' onMouseEnter={event=>onMouseEnter(event)} onMouseLeave={event=>onMouseLeave(event)} onMouseUp={(e)=>onDragDrop(e)} zIndex={21} as={Button} align='center' m='auto 1rem 3rem' border='1px solid #959595' _hover={{ bg:'none', color:'#FCD635', border: '1px solid #FCD635'}} bg='none'>
          <Icon as={BiTrash} /> <Text  mr='auto'>Lixeira</Text>
        </Flex>
      </Tooltip>
    </Flex>
  )
}

interface AlbumMapProps{
  album:AlbumProps,
  activeAlbum:string,
  setActiveAlbum:Dispatch<SetStateAction<string>>,
  onAlbumDrop:(event:any,album: any)=>void,
  deleteAlbum:(album:AlbumProps)=>void
}

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
      _hover={{ zIndex:11, bg:'#20343d78', border: '1px solid #FCD635'}}
      border={'1px solid transparent'} onMouseUp={(e)=>{onAlbumDrop(e,album);loadingIcon()}}
      data-tooltip-content='Arraste para Adicionar' cursor={'pointer'} ml={0}  w='100%' maxW={'250px'} mr='auto' 
      borderRadius='5px' bg={active?'#20343D':''}
      flexDir='column' align="center"
    >
        <Flex flexDir='row' align='center' w='100%'  > 
          <Flex onClick={()=>{active?setActiveAlbum('any'):setActiveAlbum(album.albumRef)}}  w='100%' p='.2rem 16px  ' align="center"
          > 
            <Button h={'1rem'} minW='1rem'  color={active?'#FCD635':'#959595'}  as={!!isLoading&&!!active?Button:AiOutlineFolderOpen} _hover={{bg:'none',cursor:'pointer'}} m='0 .5rem 0 0' bg='none' p={'0 !important'} isLoading={isLoading} />
            {!isEditing ||album.albumRef==='any'?
            <Text>{album.albumName}</Text>:
            <Input padding={0} m={0} h='1.5rem' border={'none'} _selected={{border:'none'}}  fontSize={'1rem'} type="text"/>}
          </Flex>
          {album.albumRef==='any'?'':<Icon onClick={onDeleteRequest} mr='.5rem' _hover={{color:'#FCD635'}} color={'#959595'} as={BiTrash} /> }
        </Flex>

    </Flex>
  )
}


export function NewAlbum({albumsCollection,setAlbumsCollection,data,setIsCreatingNewAlbum}){
  const albumNameRef = useRef<HTMLInputElement>(null)
  const [isLoading,setIsloading]= useState(false)
  function cancel(){
    albumNameRef.current.value = ''
    setIsCreatingNewAlbum(false)
  }
  let loading = false;
  async function createAlbum(){ 
    const albumName = albumNameRef.current.value
    if(albumName){
      setIsloading(true)
      await Api.post('/lib/imgur/manageAlbum',{
        ...data,
        albumRef:"",
        albumName:albumName,
        action:'create'
      }).then(response =>setAlbumsCollection([...albumsCollection,response.data]))
      setIsCreatingNewAlbum(false)
      setIsloading(false)
      albumNameRef.current.value = ''
    }
  }
  const handleKeyUp = (event)=>{
    if(event?.key==='Escape'){
      cancel()
    }
  }
  const handleKeyPress =(event)=>{
    if(event?.key==='Enter'){
      createAlbum()
    }
  }
  return(
    <Flex 
      _hover={{ zIndex:11, bg:'#20343d78', border: '1px solid #FCD635'}}
      border={'1px solid #FCD635'}
      data-tooltip-content='Arraste para Adicionar' cursor={'pointer'} ml={0}  w='100%' maxW={'250px'} mr='auto' 
      borderRadius='5px' 
      flexDir='column' align="center"
    >
      <Flex flexDir='row' align='center' w='100%'  > 
        <Flex onClick={()=>{}}  w='100%' p='.2rem 16px  ' align="center"
        > 
          <Input autoFocus id='newAlbumInput' onKeyUp={(event)=>{handleKeyUp(event)}} onKeyPress={(e)=>handleKeyPress(e)} disabled={isLoading} ref={albumNameRef} padding={0} m={0} h='1.5rem' border={'none'} _selected={{border:'none'}}  fontSize={'1rem'} type="text"/>
          {isLoading? <Spinner size='sm'/>:''}
        </Flex>
        {!isLoading?
        <><Icon onClick={()=>{createAlbum()}} mr='.5rem'fontSize={'1rem'}  _hover={{color:'#FCD635'}} color={'#959595'} as={BsCheckLg} /> 
        <Icon onClick={()=>{cancel()}} mr='.5rem' fontSize={'1.3rem'} _hover={{color:'#FCD635'}} color={'#959595'}  as={IoClose} /></>:'' }
      </Flex>

    </Flex>
  )
}
