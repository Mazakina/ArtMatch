
import { useCallback, useRef, useState } from "react";
import {useDropzone} from "react-dropzone";
import { Api } from "../../services/api";
import { canvasPreview,  useDebounceEffect, toBase64} from '../Crop/reusableUtils';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { AxiosResponse } from "axios";
import Compress from 'compress.js'
import {Select, Text, Image, Modal, ModalOverlay, ModalContent, ModalHeader, Flex, Icon, ModalCloseButton, ModalBody, FormControl, Button, VStack, FormLabel, Input, FormErrorMessage, Textarea, Box } from "@chakra-ui/react";
import { BiSearchAlt } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { ModalTagList } from "./ModalTagList";

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

export default function ModalForm({isOpen,onClose,deleteHash,isNewFile,setPostsCollection,postsCollection,title,setTitle,description,setDescription,setPublished,midia,setMidia,tags,setTags,newImage,setNewImage,currentPostId,data}){
  const imgInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef()
  const tagsRef = useRef<HTMLInputElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [formPart,setFormPart] = useState<Boolean>(true) 
  const [imgDrop, setImgDrop] = useState<any>()
  const [croppedImage,setCroppedImage] = useState<any>()

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
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, disabled: !isNewFile})

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
    console.log(blob)
    let resizedImage = await compress.compress([blob],{
      size:2,
      quality:1,
      maxWidth:300,
      maxHeight:300,
      resize:true
    })
    const img = resizedImage[0];
    const base64str = img.data
    const imgExt = img.ext
    const resizedFile = Compress.convertBase64ToFile(base64str, imgExt)

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
    if(isOpen==='true'){
      isOpen=false
    }
  }
  async function handleOnSubmit(event) {
    event.preventDefault();
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
      id:currentPostId
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
        res=> {setPostsCollection([...postsCollection,res.data])
        })
    }else{
      Api({
        method: 'post',
        url: '/lib/imgur/imgurUpdate',
        data: postData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        maxContentLength: 100000000,
        maxBodyLength: 1000000000,
      }).then(res=>{
        const newArray =postsCollection.map(post=>{if(post.id===res.data.id){return res.data}else{return post}})
        setPostsCollection(newArray)
      })
    }
    // postData.image = fileToBase64(postData.image)
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
    
    <Modal size={'1400px'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg='#000000c0' />
      <ModalContent w='1200px !important' height='830px' bg='#373737' >
        <ModalHeader  width='100%'>
        <Flex justify="space-between" align='center'>
          <Icon onClick={()=>{setFormPart(!formPart)}} cursor='pointer' opacity={!formPart? '1':'0'} fontSize='24px' as={IoIosArrowBack} />
          <Text>{isNewFile? 'Nova':'Editar'} publicação</Text>
          <Box/>
          <ModalCloseButton onClick={()=>{cleanPostData()}} />
        </Flex>
        </ModalHeader>
        <ModalBody position='relative' width='100%' >
        <form 
          onSubmit={(e)=>handleOnSubmit(e)}
          action="/action_page.php" method='post'
        >
          <Flex>
            <Flex
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
              <FormControl as={Flex} justify='center'  position="absolute">
                <input
                {...getInputProps()}
          
                type="file"
                id="img"
                name="img"
                accept="image/*"
                ref={imgInputRef}
                />
                {
                  !newImage?<Text zIndex={2} >Arraste uma Imagem ou clique aqui para escolher</Text>:''
                }
              </FormControl >
              <Box position="absolute">
                  <Image  alt='' src={newImage}/>
                
              </Box>
            </Flex>
            
          {formPart &&  
          <Flex ml='16px' maxWidth='420px' width='100%' flexDir='column'>
              <Text w='90%' mt='18px' fontSize="18px">Thumbnail</Text>
              <Text w='90%' color='#BEBEBE' mt='14px' fontSize='12px'>Ajuste a previa de sua publicação</Text>
              <Box mt='10px' width='280px' height='280px'>
                <ReactCrop
                    aspect={1}
                    crop={crop}
                    onComplete={(c) => setCompletedCrop(c)}
                    onChange={(c)=>{setCrop(c)}}>
                      <Image  alt='' ref={imgRef} src={newImage}/>
                </ReactCrop>
                  <canvas
                  ref={previewCanvasRef}
                  style={{
                    marginTop:'.5rem',
                    width: '200px',
                    height: '200px',
                    objectFit: 'contain',
                  }}
                  />
              </Box>
              <Flex mt='auto !important'  p='0 3rem !important'mb='1rem !important' justify='space-between' w='100%'> 
                <></> 
                <Button
                  disabled={crop||!isNewFile?false:true}
                  width='35%'
                  ml='auto !important'
                  color='#000'
                  bg='#FFE767'
                  onClick={(e)=>{handleUploadClick(e)}}
                  >Continuar</Button>
              </Flex>
            </Flex>}
            {!formPart &&
            
            <VStack ml='16px' w='100%' align='flex-start' maxWidth='420px' gap='8px'>
              <FormControl isRequired  w='100%'>
                <FormLabel>Titulo da Obra:</FormLabel>
                <Input  onChange={(e)=>{setTitle(e.target.value)}} 
                value={title}
                h='38px' borderRadius='2px' bg='#151515' border=' 1px solid #959595' 
                />
                <FormErrorMessage>Necessario Título.</FormErrorMessage>
              </FormControl >
              <FormControl isRequired  w='100%'>
                <FormLabel>Descrição:</FormLabel>
                <Textarea onChange={(e)=>{setDescription(e.target.value)}} 
                value={description}
                mb='6px !important' height='70%' borderRadius='2px' bg='#151515'  border=' 1px solid #959595'
                    />
                  <FormErrorMessage>Necessario Título.</FormErrorMessage>
              </FormControl>
              <FormControl isRequired  w='100%'>
                  <Select
                    mt='1rem'
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
                    // {...register('midia')} 
                    
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
                <Button onClick={()=>setPublished(false)} type='submit' width='35%' color='#D9D9D9' bg='#646464' border ='1px solid #D9D9D9' >Arquivar</Button>
                <Button onClick={()=>setPublished(true)} type='submit' width='35%' color='#000' bg='#FFE767' >Publicar</Button>
              </Flex>
            </VStack>}
          </Flex>
          
    
        </form>

        </ModalBody>

      </ModalContent>
    </Modal>
  )
}

