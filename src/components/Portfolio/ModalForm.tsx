import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import {useDropzone} from "react-dropzone";
import { Api } from "../../services/api";
import { canvasPreview,  useDebounceEffect, toBase64} from '../../utils/Crop/reusableUtils';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { AxiosResponse } from "axios";
import Compress from 'compress.js'
import {Select, Text, Image, Modal, ModalOverlay, ModalContent, ModalHeader, Flex, Icon, ModalCloseButton, ModalBody, FormControl, Button, VStack, FormLabel, Input, FormErrorMessage, Textarea, Box } from "@chakra-ui/react";
import { BiSearchAlt } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import ModalTagList from "./ModalTagList";

interface resPostProps extends AxiosResponse{
    id: string,
    title: string,
    description: string,
    deleteHash: string,
    url: string,
    posted: boolean,
    midia:string, 
    cropped:string,
    tag:Array<string>
}

interface ModalFormProps{
  croppedImage:string|any,
  isOpen:boolean,
  onClose:()=>void,
  deleteHash:string,
  isNewFile:boolean,
  postsCollection:Array<any>,
  title:string,
  setTitle:Dispatch<SetStateAction<string>>,
  description:string,
  published:boolean,
  midia:string,
  setMidia:Dispatch<SetStateAction<string>>,
  tags:string[],
  newImage:string,
  setTags:Dispatch<SetStateAction<Array<string>>>,
  setNewImage:Dispatch<SetStateAction<any>>,
  setPostsCollection:Dispatch<SetStateAction<Array<any>>>,
  setCroppedImage:Dispatch<SetStateAction<any>>,
  setDescription:Dispatch<SetStateAction<string>>,
  setPublished:Dispatch<SetStateAction<boolean>>,
  currentPostId:string,
  data:any
}

export default function ModalForm({croppedImage,setCroppedImage,isOpen,onClose,deleteHash
  ,isNewFile,setPostsCollection,postsCollection,title,setTitle,
  description,setDescription,published,setPublished,midia,setMidia,
  tags,setTags,newImage,setNewImage,currentPostId,data}:ModalFormProps){

  const imgRef = useRef()
  const tagsRef = useRef<HTMLInputElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [formPart,setFormPart] = useState<boolean>(true) 
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [crop,setCrop] = useState<Crop>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const onDrop = useCallback( async acceptedFiles => {
    const imgDropTo64 = await toBase64(acceptedFiles[0])
    setNewImage(imgDropTo64)
    const reader = new FileReader()

    reader.onload = function (onLoadEvent){
      setNewImage(onLoadEvent.target.result)
    }
    reader.readAsDataURL(acceptedFiles[0]);
  }
  , [])

  let isDisabled = (!isNewFile || formPart== false )
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, disabled: isDisabled})

  function handleKeyPress(event){
    const currentTag = tagsRef.current?.value;
    if(event?.key==='Enter'
    && !tags.includes(currentTag)
    ){
      event.preventDefault()
      setTags([...tags,currentTag])
      tagsRef.current.value = ''
    }
  }

  const compress = new Compress()

  async function  handleUploadClick(e){
    e.preventDefault()
    const canvasRef = previewCanvasRef.current
    const imageData = canvasRef.toDataURL('')
    const blob = await (await fetch(imageData)).blob(); 
    let resizedImage = await compress.compress([blob],{
      size:2,
      quality:1,
      maxWidth:230,
      maxHeight:230,
      resize:true
    })
    const img = resizedImage[0];
    const base64str = img.data
    const imgExt = 'webp'
    const resizedFile = Compress.convertBase64ToFile(base64str, imgExt)
    console.log(resizedFile)
    const reader = new FileReader()

    reader.onload = (onLoadEvent)=>{
      setCroppedImage(onLoadEvent.target.result)
    }
    reader.readAsDataURL(resizedFile);
    setFormPart(!formPart)
  }
  function cleanPostData(){
    setCrop(null),
    setNewImage('')
    setTitle(''),
    setDescription('')
    setMidia(''),
    setTags([]),
    setPublished(false)
    setFormPart(true)
    setIsLoading(false)
    onClose()
  }
  async function handleOnSubmit(event) {
    event.preventDefault();
    setIsLoading(true)
    const postData =   {
      image:newImage,
      name:title,
      title:title,
      description:description,
      user: data.user,
      midia: midia,
      tags:tags,
      croppedImage:croppedImage,
      deleteHash:deleteHash,
      id:currentPostId,
      posted:published
    }
    if(isNewFile ===true){
      Api({
        method: 'post',
        url: '/_lib/imgur/imgurPost',
        data: postData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        maxContentLength: 1000000,
        maxBodyLength: 10000000,
      }).then(
        res=> {
          setPostsCollection([...postsCollection,res.data])
          cleanPostData()  
        })
    }else{
      Api({
        method: 'PUT',
        url: '/_lib/imgur/imgurUpdate',
        data: postData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        maxContentLength: 1000000,
        maxBodyLength: 10000000,
      }).then(res=>{
        const newArray =postsCollection.map(post=>{if(post.id===res.data.id){return res.data}else{return post}})
        setPostsCollection(newArray)
        cleanPostData()
      })
    }
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
    <Modal useInert onCloseComplete={cleanPostData} size={'1400px'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg='#000000c0' />
      <ModalContent
        w={{base:'95vw',lg:'1200px !important'}}
        height={{base:'fit-content',lg:'830px'}}
        bg='#373737'>
        <ModalHeader  width='100%'>
        <Flex justify="space-between" align='center'>
          <Icon
            onClick={()=>{setFormPart(!formPart)}}
            cursor='pointer'
            opacity={!formPart?
            '1':'0'}
            fontSize='24px'
            as={IoIosArrowBack} />
          <Text>{isNewFile? 'Nova':'Editar'} publicação</Text>
          <Box/>
          <ModalCloseButton onClick={()=>{onClose()}} />
        </Flex>
        </ModalHeader>
        <ModalBody   position='relative' width='100%' >
        <form 
          onSubmit={(e)=>handleOnSubmit(e)}
          action="/action_page.php" method='post'
        >
          <Flex h='100%'
          flexDir={{base:'column',lg:'row'}}
          >
            <Flex
              transition={'background 0.3s ease-in-out'}
              {...getRootProps()}
              position="relative"
              cursor={isDisabled?'no-drop':'pointer'}
              bg='#1f1f1f'
              sx={{aspectRatio:'1'}}
              flexDir='column'
              height={{base:'40vh',lg:'720px'}}
              align='center'
              justify='center'
              minH='200px'
              borderRadius='0px'
              border='1px dashed #fff'
              >
              <FormControl as={Flex} justify='center'  position="absolute">
                <input
                {...getInputProps()}
                id="img"
                name="img"
                accept="image/*"
                />
                {!newImage && <Text m='0 1rem' zIndex={2} >Arraste uma Imagem ou clique aqui para escolher</Text>}
              </FormControl >
              <Box h='inherit' width='inherit' position="absolute">
                  <Image
                    transform={'scale(.99)'}
                    h='inherit'
                    width='inherit'
                    alt=''
                    src={newImage} />
              </Box>
            </Flex>
            
          {formPart &&  
          <Flex ml='16px'   maxWidth='420px' width='100%' flexDir='column'>
              <Text w='90%' mt='18px' fontSize="18px">
                Thumbnail
              </Text>
              <Text
                w='90%'
                color='#BEBEBE'
                mt='14px'
                fontSize='12px'>
                  Ajuste a previa de sua publicação
                </Text>
              <Box mt='10px' width='280px' height='280px'>
                <ReactCrop
                    aspect={1}
                    crop={crop}
                    onComplete={(c) => setCompletedCrop(c)}
                    onChange={(c)=>{setCrop(c)}}>
                      {newImage &&<Image alt='preview da imagem recortada' ref={imgRef} src={newImage}/>}
                </ReactCrop>
                  <canvas
                  ref={previewCanvasRef}
                  style={{
                    display:'none',
                    marginTop:'.5rem',
                    width: '200px',
                    height: '200px',
                    objectFit: 'contain',
                  }}
                  />
              </Box>
              <Flex
                mt='auto
                !important'
                p='0 3rem !important' 
                justify='space-between'
                w='100%'>
                <Button
                  isDisabled={crop||!isNewFile?false:true}
                  type='button'
                  width='35%'
                  m='1rem 1rem 1rem auto'
                  color='#000'
                  bg='#FFE767'
                  aria-label='próxima página do formulário'
                  onClick={(e)=>{handleUploadClick(e)}}>
                    Continuar
                  </Button>
              </Flex>
            </Flex>}
            {!formPart &&
            
            <VStack
              mt='1rem'
              ml={{base:0,lg:'16px'}}
              w='100%'
              align='flex-start'
              maxWidth='420px'
              gap='8px'>

              <FormControl isRequired  w='100%'>
                <FormLabel>
                  Titulo da Obra:
                </FormLabel>
                <Input
                  aria-label='titulo'
                  onChange={(e)=>{setTitle(e.target.value)}}
                  value={title}
                  h='38px'
                  borderRadius='2px'
                  bg='#151515'
                  border='1px solid#959595' />
                <FormErrorMessage>
                  Necessário Título.
                </FormErrorMessage>
              </FormControl >

              <FormControl isRequired  w='100%'>
                <FormLabel>
                  Descrição:
                </FormLabel>
                <Textarea
                  onChange={(e)=>{setDescription(e.target.value)}}
                  value={description}
                  aria-label='descriçao'
                  mb='6px
                  !important'
                  height='70%'
                  borderRadius='2px'
                  bg='#151515'
                  border=' 1px solid #959595' />
                  <FormErrorMessage>
                    Necessário Título.
                  </FormErrorMessage>
              </FormControl>

              <FormControl isRequired  w='100%'>
                  <Select
                    mt='1rem'
                    onChange={(e)=>{setMidia(e.target.value)}} 
                    value={midia}
                    h='38px'
                    overflow='hidden'
                    aria-label='midia na qual foi feita'
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
              </FormControl>

              <Box w='100%'>
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
                    aria-lable='digite tags relacionadas'
                    ref={tagsRef}
                    onKeyPress={(e)=>handleKeyPress(e)}
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
              </Box>
              <ModalTagList setTags={setTags} tags={tags}/>

              <Flex mt='auto !important'  p='0 3rem !important'mb='1rem !important' justify='space-between' w='100%'> 
                <Button
                  onClick={()=>setPublished(false)}
                  isLoading={isLoading}
                  type='submit'
                  width='35%'
                  color='#D9D9D9'
                  bg='#646464'
                  border ='1px solid #D9D9D9'
                  aria-label='arquivar publicação'
                  >Arquivar</Button>
                <Button
                  onClick={()=>setPublished(true)}
                  isLoading={isLoading}
                  type='submit'
                  width='35%'
                  color='#000'
                  aria-label='Publicar'
                  bg='#FFE767'
                  >Publicar</Button>
              </Flex>
            </VStack>}
          </Flex>
        </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

