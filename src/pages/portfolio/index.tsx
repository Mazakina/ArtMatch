
import { unstable_getServerSession } from "next-auth/next"
import {BiChevronLeft, BiChevronRight} from 'react-icons/bi'
import {BsPlusSquare} from 'react-icons/bs'
import {Flex, Box, Text, Icon, Button, useDisclosure, Grid, GridItem } from "@chakra-ui/react";
import { AnimatePresence, LayoutGroup, motion} from "framer-motion"
import { useCallback, useEffect, useRef, useState  } from "react";
import 'react-image-crop/dist/ReactCrop.css'


import Header from "../../components/Header";
import { Api } from '../../services/api';
import {useSession} from 'next-auth/react'
import { authOptions } from "../api/auth/[...nextauth]"
import { GetServerSideProps } from "next"
import Sidebar from "../../components/Portfolio/SidebarComponent"
import ModalForm from "../../components/Portfolio/ModalForm";
import {Posts} from "../../components/Portfolio/Posts";

interface idsProps{
  id?:string,
  deleteHash?:string
}

interface AlbumProps{
    albumName: string,
    albumRef: string
}

export default function Portfolio({posts,albums}){
  // user Data
  const {data} = useSession()
  //Framer Motion Variants
  const container = {
    hidden: { opacity: 0, scale:0 },
    show: {
      scale:1,
      opacity: 1,
      transition: {
        delay:0.3,
        when:'beforeChildren',
        staggerChildren: 0.2,
        type:'spring',
        bounce: 0.2
      }
    }
  }
  const item = {
    hidden: { opacity: 0,scale:0 },
    show: {opacity: 1,scale:1 }
  }
  // Posts and Albums from Fauna
  const [postsCollection,setPostsCollection] = useState<Array<any>>(posts)
  const [albumsCollection,setAlbumsCollection] = useState<Array<AlbumProps>>(albums)
  useEffect(()=>{
    setPostsCollection(posts.filter(post => post.id))
  },[posts])
  //image refs and states

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isNewFile, setIsNewFile] = useState<boolean>(false)
  const [title,setTitle] = useState<string>('')
  const [description,setDescription] = useState<string>('')
  const [published,setPublished] = useState<boolean>(true)
  const [midia,setMidia] = useState<string>('')
  const [tags, setTags] = useState([])
  const [newImage, setNewImage] = useState(null);
  const [deleteHash,setDeleteHash] = useState<string>('')
  const [croppedImage,setCroppedImage] = useState<any>()
  const [currentPostId, setCurrentPostId] = useState<string>()
  //drag variables
  const [ids,setIds] = useState<idsProps>({})
  const [onDragSnap,setOnDragSnap] = useState<string>(()=>ids.id)

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

  var regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/
  function updateGrid(){
    const gridHeight = gridRef.current?.clientHeight
    const gridWidth = gridRef.current?.clientWidth
    const gridChildrenWidth = 190
    const gapValue = 16
    const gridRows= Math.floor(gridHeight/230)
    setGridLength((Math.floor(gridWidth/(gridChildrenWidth+gapValue))*gridRows))
  }


  const deltaCountCallback= useCallback((delta)=>{
    if(delta>0){
      setDeltaCount(1)
      setTimeout(()=>{setDeltaCount(0)},500)
    }
    if(delta<0){
      setDeltaCount(-1)
      setTimeout(()=>{setDeltaCount(0)},500)
    }
  },[])

  // adding eventListeners after window mount
  useEffect(()=>{updateGrid()},[gridCount])
  useEffect(()=>{
    window.addEventListener('resize',()=>{
      setGridCount(new Date)
      setInitialSlice(0)
    })
    setGridCount(new Date)
    gridContainerRef.current.addEventListener("wheel",(event)=>{
      deltaCountCallback(event.deltaY)
    })
  },[])
  useEffect(()=>{
    if(deltaCount==0){return}
    if(initialSlice+deltaCount>= 0 &&
      (gridLastPostOnDisplay<= postsCollection.length ||
      gridLastPostOnDisplay<= postsCollection.length-deltaCount)){
      setInitialSlice(initialSlice+deltaCount)
    }
  },[deltaCount])

  const onMouseEnter = (event) =>{
    setOnDragSnap(ids?.id)
  }
  const onMouseLeave = (event) =>{
    setOnDragSnap('')
  }

  const onAlbumDrop = async(event,album)=>{
    if(!!ids?.id){
      const newPostsArray = postsCollection.map(post =>{if(post.id===ids.id){
          console.log(post)
          return({...post,albumRef:album.albumRef})
        }else{
          return post
        }
      })
      setPostsCollection([...newPostsArray])
      await Api.patch('/lib/imgur/imageSetAlbum',{
        ...album,
        id:ids.id,
        user:data.user
      })
    }
  }

  const onDragDrop = async (event)=>{
    if(!!ids){
      const newPostsArray = postsCollection.filter((post)=>post.id!==ids.id && post.id)
      if(initialSlice !==0){setInitialSlice(initialSlice-1)}
      setPostsCollection([...newPostsArray])
      await Api.delete('/lib/imgur/imgurDelete',{
        data:{
        ...ids,
        user:data.user
        }
      }).then(response=>setOnDragSnap(''))
    }
  }

  return(
    <>
      <Header/>
      <Flex overflow={'hidden'} h='98vh' mt='-50px' pt='50px' justify="flex-start">
        <Sidebar setActAlbum={{activeAlbum,setActiveAlbum}} albums={{albumsCollection,setAlbumsCollection}} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onDragDrop={onDragDrop} onAlbumDrop={onAlbumDrop} />

        <Box  height='95%' m='auto 1rem auto 1rem' w={'1px'} bg='#fff' />
        <Flex zIndex={10} ref={gridContainerRef} flexDir={'column'} h='100%' width='100%'>
          <Box    w='100%' height='99%'>
              <AnimatePresence >   
                <Grid autoFlow={'unset'} ref={gridRef} as={motion.div} height='95%' listStyleType={'none'} variants={container} templateColumns={`repeat(${'auto-fit'},190px)`}  autoRows={'230px'} justifyContent={'flex-start'} gap={'1rem'} initial="hidden" animate="show" w='100%'  m='1rem auto auto'>
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
                      postsCollection
                      .filter((post)=>{
                        return (post.albumRef===activeAlbum|| activeAlbum==='any')
                      })
                      .map((post,index)=>{
                        return(
                          <Posts setCurrentPostId={setCurrentPostId}  setDeleteHash={setDeleteHash} dragSnap={onDragSnap} variant={item} key={post.id} setIds={setIds} first={initialSlice}  last={gridLength-1} post={post} index={index} onOpen={onOpen} setPublished={setPublished} setImage={setNewImage} setTitle={setTitle} setDescription={setDescription} setMidia={setMidia} setTags={setTags} setCroppedImage={setCroppedImage} setIsNewFile={setIsNewFile}/>
                        )
                      })
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
      <ModalForm setCroppedImage={setCroppedImage} croppedImage={croppedImage} currentPostId={currentPostId} isOpen={isOpen} onClose={onClose} deleteHash={deleteHash} isNewFile={isNewFile} setPostsCollection={setPostsCollection} postsCollection={postsCollection} title={title} setTitle={setTitle} description={description} setDescription={setDescription} setPublished={setPublished} midia={midia} setMidia={setMidia} tags={tags} setTags={setTags} newImage={newImage} setNewImage={setNewImage} data={data} />
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
  try{
    await response.json().then(response => {posts = response.posts; albums = [...response.albums]})
  }
  catch(e){
    return {
      notFound: true,
    }
  }
  return {
    props: {
      posts,
      albums,
    },
  }
}