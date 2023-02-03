import { AspectRatio, Box, Button, Flex, HStack, Text, Image  } from "@chakra-ui/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {motion, useDragControls } from "framer-motion"

interface PostsProps{
  post:{
    id: string,
    title: string,
    description: string,
    deleteHash: string,
    url: string,
    posted: boolean,
    midia:string, 
    cropped:string,
    tag:Array<string>
  },
  onOpen:()=>void,
  setImage:Dispatch<SetStateAction<string>>,
  setTitle:Dispatch<SetStateAction<string>>,
  setDescription:Dispatch<SetStateAction<string>>,
  setMidia:Dispatch<SetStateAction<string>>,
  setTags:Dispatch<SetStateAction<Array<string>>>,
  setPublished:Dispatch<SetStateAction<Boolean>>,
  setIds:Dispatch<SetStateAction<any>>,
  setCroppedImage:Dispatch<SetStateAction<string>>,
  setIsNewFile:Dispatch<SetStateAction<boolean>>,
  setCurrentPostId:Dispatch<SetStateAction<string>>,
  setDeleteHash:Dispatch<SetStateAction<string>>,
  variant:any,
  dragSnap:string,
  index:number,
  first:number,
  last:number
  isLg:boolean,
  onOpenDrawer:any,
}



export function Posts({
  post,onOpen,setImage,setTitle,
  setDescription,setMidia,setTags,setIsNewFile,setCurrentPostId,
  setPublished,setIds, variant,setCroppedImage,setDeleteHash,isLg,onOpenDrawer,
  dragSnap,index,first,last}:PostsProps){
  const [posted,setPosted] = useState(post.posted)

  const setModalProperties = (post) => {
    setImage(post.url)
    setTitle(post.title);
    setDescription(post.description);
    setMidia(post.midia);
    setTags(post.tags||[]);
    setCroppedImage(post.cropped)
    setIsNewFile(false)
    setDeleteHash(post.deleteHash)
    setCurrentPostId(post.id)
    setPosted(post.posted)
    onOpen()
  }

  const controls = useDragControls()
  useEffect(()=>{
    setPosted(post.posted)
  },[post.posted])
  
  function dragStarted(e,id){
    e.preventDefault();
    if(!isLg){
      onOpenDrawer()
    }
    setIds({
      id:post.id,
      deleteHash:post.deleteHash
    })
  }
  function dragEnded(){
    setTimeout(()=>{setIds('')},300)
    if(!isLg){
      onOpenDrawer()
    }
  }
  function isOnDisplay (){
    if(index>=first && index<first+last ){return true}else{return false}}
  

  let display = isOnDisplay()
  if(display){
  return(
  <motion.div
    style={display?
      {
        display:'flex',
        maxHeight:'230px',
        maxWidth:'200px',
      }:{
        display:'none',
        maxHeight:'230px',
        maxWidth:'200px',
      }
    }
    layout
    exit={{
      opacity:0,scale:0}}
    variants={variant}
    transition={{type: 'spring', bounce:0.20}}
    whileTap={{ scale: 1, }}
    whileDrag={{scale:0.55,zIndex:2401,opacity:1,
      pointerEvents:'none',filter:'brightness(.7)'
      ,
    }}
    dragControls={controls}
    drag={true}
    onDragStart={(e)=>{dragStarted(e,1)}}
    onDragEnd={dragEnded}
    dragSnapToOrigin={dragSnap==post.id? false : true}
    >
      <Flex
      flexDir='column'
      align='center'
      justify='flex-start'
      w='100%'
      overflow='hidden'
      maxHeight='225px'
      bgColor='#3A3A3A'
      border='1px
      solid
      #4d4d4d'
      borderRadius='2px'
      _hover={{
        border:'1px solid #FFEB80'
      }}>
        <AspectRatio  w='100%' maxWidth={'200px'} ratio={1}>
          <Box position='relative'>
            <Image transition={'.2s all ease-in-out'} align={'50% 50%'} alt='' position='absolute' transform='brightness(0.6)' borderRadius='2px' w='101%' h='101%' objectFit='cover' src={post.cropped} />
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
              <Button
                onClick={()=>setModalProperties(post)}
                _hover={{bg:'#FFE767'}}
                color='#000'
                borderRadius={'2px'}
                transform={'scale(0.9)'}
                bg='#FFE767'>Editar
              </Button>
            </Flex>
          </Box>
        </AspectRatio>
        <Flex m='auto 10px ' h='1.5rem' width='100%' justify='space-between'>
          <Text  mt='auto' mb='auto' ml='10px' fontSize='10px'>{post.title}</Text>
          <HStack  mr='10px'>
            <Text fontSize='10px'>Publicado</Text>
            <Box  onClick={()=>setPosted(!posted)} width='30px' border='1px solid gray' borderRadius='10px' ><Box transition={'margin .2s ease-in-out'} ml={posted?'18px':'0'} h='12px' w='12px' borderRadius='50%' bg={posted?'#FFEB80':'#727272'} /></Box>
          </HStack>
        </Flex>
      </Flex>
    </motion.div>
  )}else{
    return(
      <></>
    )
  }
}