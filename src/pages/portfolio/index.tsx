
import { unstable_getServerSession } from "next-auth/next"
import {IoIosArrowBack} from 'react-icons/io'
import {BiSearchAlt, BiChevronLeft, BiChevronRight} from 'react-icons/bi'
import {BsPlusSquare} from 'react-icons/bs'
import {Image , Flex, Box, Text, Icon, VStack, Button, useDisclosure, Input, Textarea, Select, Grid, GridItem } from "@chakra-ui/react";

import { AnimatePresence, LayoutGroup, motion} from "framer-motion"
import {useDropzone} from "react-dropzone";
import { useCallback, useEffect, useRef, useState  } from "react";
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton,} from '@chakra-ui/react'
import { canvasPreview,  base64StringtoFile, useDebounceEffect, toBase64} from '../../components/Crop/reusableUtils';

import Header from "../../components/Header";
import { Api } from '../../services/api';
import {useSession} from 'next-auth/react'
import { authOptions } from "../api/auth/[...nextauth]"
import { GetServerSideProps } from "next"
import Posts from "../../components/Posts"
import Sidebar from "../../components/Portfolio/sidebar"

interface idsProps{
  id?:string,
  deleteHash?:string
}

export default function Portfolio({posts,albums}){
  const container = {
    hidden: { opacity: 0, scale:0 },
    show: {
      scale:1,
      opacity: 1,
      transition: {
        delay:0.3,
        when:'beforeChildren',
        staggerChildren: 0.3,
        type:'spring',
        bounce: 0.2
      }
    }
  }
  const item = {
    hidden: { opacity: 0,scale:0 },
    show: {opacity: 1,scale:1 }
  }

  const {data} = useSession()

  //image refs and states
  const [postsCollection,setPostsCollection] = useState(posts)
  useEffect(()=>{
    setPostsCollection(posts.filter(post => post.id))
  },[posts])
  const imgRef = useRef()
  const imgInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [crop,setCrop] = useState<Crop>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [formPart,setFormPart] = useState<Boolean>(true) 
  const [imgTest, setImgTest] = useState<any>()

  //form data
  const [isNewFile, setIsNewFile] = useState(false)
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [published,setPublished] = useState(true)
  const [midia,setMidia] = useState('')
  const [tags, setTags] = useState([])
  const [deleteHash,setDeleteHash] = useState('')
  const [newImage, setNewImage] = useState(null);

  //drag variables
  const [ids,setIds] = useState<idsProps>({})
  const [onDragSnap,setOnDragSnap] = useState(()=>ids.id)

  //Grid Layout variables
  
  const gridRef = useRef<any>();
  const gridContainerRef = useRef<HTMLDivElement>()
  const [ activeAlbum,setActiveAlbum] = useState<string>('any')
  const [initialSlice,setInitialSlice] = useState<number>(0)
  const [gridLength,setGridLength] = useState<number>(30)
  const [rows,setRows] = useState<number>(1)
  const [deltaCount,setDeltaCount] = useState<number>(0)
  const [gridCount,setGridCount] = useState<Date>(new Date)
  let gridLastPostOnDisplay = initialSlice+gridLength

  function updateGrid(){
    const gridHeight = gridRef.current.clientHeight
    const gridWidth = gridRef.current?.clientWidth
    const gridChildrenWidth = 190
    const gapValue = 16
    const gridRows= Math.floor(gridHeight/230)
    setGridLength((Math.floor(gridWidth/(gridChildrenWidth+gapValue))*gridRows))
  }


  function deltaCountCallback(delta){
    if(delta>0){
      setDeltaCount(1)
      setTimeout(()=>{setDeltaCount(0)},500)
    }
    if(delta<0){
      setDeltaCount(-1)
      setTimeout(()=>{setDeltaCount(0)},500)
    }
  }


  useEffect(()=>{updateGrid()},[gridCount])
  // adding eventListeners after window mount
  useEffect(()=>{
    window.addEventListener('resize',()=>{
      setGridCount(new Date)
    })
    setGridCount(new Date)
    gridContainerRef.current.addEventListener("wheel",(event)=>{
      deltaCountCallback(event.deltaY)
    })
  },[])

  useEffect(()=>{
    if(deltaCount==0){return}
    if(initialSlice+deltaCount>= 0 &&
      (gridLastPostOnDisplay< postsCollection.length 
      || gridLastPostOnDisplay< postsCollection.length-deltaCount)){
      setInitialSlice(initialSlice+deltaCount)
    }
  },[deltaCount])

  //dropZone events

  const onDrop = useCallback( async acceptedFiles => {
    const test = await toBase64(acceptedFiles[0])
    setImgTest(test)
    const reader = new FileReader()

    reader.onload = function (onLoadEvent){
      setNewImage(onLoadEvent.target.result)
    }
    reader.readAsDataURL(acceptedFiles[0]);
  }, [])
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, disabled: !isNewFile})

  const onMouseEnter = (event) =>{
    setOnDragSnap(ids?.id)
  }
  const onMouseLeave = (event) =>{
    setOnDragSnap('')
  }

  async function onAlbumDrop(event,album){
    if(!!ids){
      const newPostsArray = postsCollection.map(post =>{if(post.id===ids.id){
        return({...post,album:album.albumRef})
      }else{return post}})
      setPostsCollection([...newPostsArray])
      await Api.post('/lib/imgur/imageSetAlbum',{
        ...album,
        id:ids.id,
        user:data.user
      }).then(response =>console.log(response))
    }
  }

  const onDragDrop = async (event)=>{
    if(!!ids){
      const newPostsArray = postsCollection.filter((post)=>post.id!==ids.id && post.id)
      if(initialSlice !==0){setInitialSlice(initialSlice-1)}
      setPostsCollection([...newPostsArray])
      await Api.post('/lib/imgur/imgurDelete',{
        ...ids,
        user:data.user
      }).then(response=>setOnDragSnap(''))
    }
  }

 // submit events
  function handleUploadClick(e){
    e.preventDefault()
    const canvasRef = previewCanvasRef.current
    const fileName = "previewFile"//          Adicionar variavel do nome da Publicaçao
    const imageData64 = canvasRef.toDataURL()
    const myNewCroppedFile = base64StringtoFile( imageData64,fileName)
    // const download = downloadBase64File( imageData64,fileName)
    setFormPart(!formPart)
  }
  async function handleOnSubmit(event) {
      event.preventDefault();
      const postData =   {
        image:imgTest,
        name:title,
        title:title,
        description:description,
        user: data.user,
        midia: midia,
        tags:tags
      }
      if(isNewFile ===true){
        Api({
          method: 'post',
          url: '/lib/imgur/imgurPost',
          data: postData,
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          maxContentLength: 100000000,
          maxBodyLength: 1000000000,
        }).then(
          res=> setPostsCollection([...postsCollection,res.data])
          )
      }else{
        Api({
          method: 'post',
          url: '/lib/imgur/imgurUpdate',
          data: postData,
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          maxContentLength: 100000000,
          maxBodyLength: 1000000000,
        })
      }
      // postData.image = fileToBase64(postData.image)
  }
  async function deleteRequest(){
    Api.post('/lib/imgurDelete',{
      deleteHash:deleteHash,
      user:data.user.email,
      id:''
    })
  }
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
        )
      }
    },
    100,
    [completedCrop],
  )


  return(
    <>
      <Header/>
      <Flex overflow={'hidden'} h='98vh' mt='-50px' pt='50px' justify="flex-start">
        <Sidebar setAlbum={{activeAlbum,setActiveAlbum}} albums={albums} data={data} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onDragDrop={onDragDrop} onAlbumDrop={onAlbumDrop} />

        <Box  height='95%' m='auto 1rem auto 1rem' w={'1px'} bg='#fff' />
        <Flex zIndex={10} ref={gridContainerRef} flexDir={'column'} h='100%' width='100%'>
          <Box    w='100%' height='99%'>
              <AnimatePresence >   
                <Grid autoFlow={'unset'} ref={gridRef} as={motion.div} maxHeight='95%' listStyleType={'none'} variants={container} templateColumns={`repeat(${'auto-fit'},190px)`}  autoRows={'230px'} justifyContent={'flex-start'} gap={'1rem'} initial="hidden" animate="show" w='100%'  m='1rem auto auto'>
                  <GridItem
                    transition={'all .3s ease-in-out'}
                    gridArea={'1fr,1fr'}
                    as={Button}
                    _hover={{bg:'none'}}
                    cursor='pointer'
                    onClick={()=>{onOpen();setIsNewFile(true)}}
                    flexDir='column'
                    align='center'
                    justify='center'
                    w='190px'
                    height='190px'
                    borderRadius={'5px'}
                    border='1px
                    dashed
                    #fff'
                    bg={'none'}
                    
                    color={'#eeeeee'}
                    >
                    <Flex  gap={'.7rem'}>
                      <Icon  fontSize='42px' as={BsPlusSquare}/>

                    </Flex>
                    <Text fontSize='16px' mt='1rem'>Novo Projeto</Text>
                  </GridItem>
                    <LayoutGroup>
                    {
                      postsCollection.map((post,index)=>{
                        if(post.album===activeAlbum || activeAlbum==='any'){
                        return(
                          <Posts dragSnap={onDragSnap} variant={item} key={post.id} setIds={setIds} first={initialSlice}  last={gridLength-1} post={post} index={index} onOpen={onOpen} setPublished={setPublished} setImage={setNewImage} setTitle={setTitle} setDescription={setDescription} setMidia={setMidia} setTags={setTags} />
                        )
                      }})
                    }
                    </LayoutGroup>
                </Grid>
              </AnimatePresence>
          </Box>
          <Flex   align='center' justify='center'>
            <Icon cursor={'pointer'} onClick={()=>{deltaCountCallback(-1)}} transition={'all .3s ease-in-out'} fontSize='2rem' opacity={initialSlice>0?'initial':'0'}   as={BiChevronLeft}/>
            <Box cursor={'row-resize'} bg={'white'} width={'1rem'} height={'1rem'} borderRadius={'50%'}/>
            <Icon cursor={'pointer'} onClick={()=>{deltaCountCallback(1)}} fontSize='2rem' opacity={(gridLastPostOnDisplay<posts.length)?'initial':'0'}  as={BiChevronRight}/>
          </Flex>
        </Flex>

      </Flex>

      
      <Modal size={'1400px'} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay bg='#000000c0' />
          <ModalContent w='1200px !important' height='830px' bg='#373737' >
            <ModalHeader  width='100%'>
             <Flex justify="space-between" align='center'>
              <Icon onClick={()=>{setFormPart(!formPart)}} cursor='pointer' opacity={!formPart? '1':'0'} fontSize='24px' as={IoIosArrowBack} />
              <Text>{isNewFile? 'Nova':'Editar'} publicação</Text>
              <Box/>
              <ModalCloseButton />
             </Flex>
            </ModalHeader>
            <ModalBody position='relative' width='100%' >
            <form 
              onSubmit={(e)=>handleOnSubmit(e)}
              action="/action_page.php" method='post'
            >
              <Flex>
                <Flex
                  // as={Button}
                  transition={'background 0.3s ease-in-out'}
                  {...getRootProps()}
                  
                  position="relative"
                  _hover={{bg:'#1a1a1a'}}
                  cursor='pointer'
                  bg='#1f1f1f'
                  flexDir='column'
                  align='center'
                  justify='center'
                  w='720px'
                  height='720px'
                  borderRadius='0px'
                  border='1px dashed #fff'
                  >
                  <Box position="absolute">
                    <input
                     {...getInputProps()}
              
                    type="file"
                    id="img"
                    name="img"
                    accept="image/*"
                    ref={imgInputRef} />
                    <Text zIndex={2} >Arraste uma Imagem clique aqui para escolher</Text>
                  </Box>
                  <Box position="absolute">
                      <Image  alt='' src={newImage}/>
                     
                  </Box>
                </Flex>
                
               {formPart &&  
               <Flex ml='16px' maxWidth='420px' width='100%' flexDir='column'>
                  <Text mt='18px' fontSize="18px">Thumbnail</Text>
                  <Text color='#BEBEBE' mt='14px' fontSize='12px'>Ajuste a previa de sua publicação</Text>
                  <Box mt='10px' width='280px' height='280px'>
                    <ReactCrop
                        aspect={1}
                        crop={crop}
                        onComplete={(c) => setCompletedCrop(c)}
                        onChange={(c)=>{setCrop(c)}}>
                          <Image  alt='' ref={imgRef} src={newImage}/>
                    </ReactCrop>
                    {/* <Button onClick={(e)=>handleUploadClick(e)} >aquiii</Button> */}
                  </Box>
                  <Flex mt='auto !important'  p='0 3rem !important'mb='1rem !important' justify='space-between' w='100%'> 
                    <></> 
                    <Button
                      width='35%'
                      ml='auto !important'
                      color='#000'
                      bg='#FFE767'
                      onClick={()=>setFormPart(!formPart)}
                      >Continuar</Button>
                  </Flex>
                </Flex>}
                {!formPart &&
                
                <VStack ml='16px' w='100%' align='flex-start' maxWidth='420px' gap='8px'>
                  <Text>Titulo da Obra:</Text>
                  <Input onChange={(e)=>{setTitle(e.target.value)}} value={title} h='38px' borderRadius='2px' bg='#151515' border=' 1px solid #959595'  />
                  <Text>Descrição:</Text>
                  <Textarea onChange={(e)=>{setDescription(e.target.value)}} value={description} mb='6px !important' height='30%' borderRadius='2px' bg='#151515'  border=' 1px solid #959595'   />
                  <Select
                    onChange={(e)=>{setMidia(e.target.value)}} 
                    value={midia}
                    h='38px'
                    overflow='hidden'
                    focusBorderColor="#FFEB80"
                    bg='#151515'
                    borderRadius='2px'
                    color='#BEBEBE'
                    placeholder='Midia'
                    cursor='pointer'
                    border=' 1px solid #959595'  
                    >
                    <option style={{ color: 'black' }} value="pinturaDigital">Pintura digital</option>
                    <option style={{ color: 'black' }} value="pinturaTradicional">Pintura tradicional</option>
                    <option style={{ color: 'black' }} value="tatuagem">Tatuagem</option>
                    <option style={{ color: 'black' }} value="graffite">Graffite</option>
                  </Select>
                
                  <Text>Tags:</Text>
                  <Flex 
                    align='center'
                    h='38px'
                    w='100%'
                    borderRadius='2px'
                    bg='#151515'
                    alignSelf='center'
                    color='#BEBEBE'
                    position='relative'
                    as='label'>
                    <Input
                      h='38px'
                      bg='transparent'
                      borderRadius='2px'
                      name={'search'}
                      />
                    <Icon
                      position='absolute'
                      right='2'
                      zIndex='2'
                      as={BiSearchAlt}
                      _hover={{ 
                        cursor:'pointer'
                      }}
                      fontSize='20' />
                  </Flex>
                  <Flex mt='auto !important'  p='0 3rem !important'mb='1rem !important' justify='space-between' w='100%'> 
                    <Button onClick={()=>setPublished(false)} type='submit' width='35%' color='#D9D9D9' bg='#646464' border ='1px solid #D9D9D9' >Arquivar</Button>
                    <Button onClick={()=>setPublished(true)} type='submit' width='35%' color='#000' bg='#FFE767' >Publicar</Button>
                  </Flex>
                </VStack>}
              </Flex>
              
              {!!crop && 
                <canvas
                ref={previewCanvasRef}
                style={{
                  display:'none',
                  width: crop.width,
                  height: crop.height,
                  objectFit: 'contain',
                }}
                />
              }
            </form>

            </ModalBody>

          </ModalContent>
      </Modal>
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) =>  {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const reqData={
    user:session.user.email,
    getAlbums:true
  }
  const response = await fetch(`${process.env.BASE_URL}/api/lib/imgur/imgurGetAllFromUser`,{
    method:'post',
    headers: {
      cookie: context.req.headers.cookie || "",
    },
    body:JSON.stringify(
    reqData)
  })
  let posts;
  let albums;
  await response.json().then(response => {posts = response.posts; albums = [...response.albums]})
  return {
    props: {
      posts,
      albums,
    },
  }
}
