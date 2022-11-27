
import {AiFillFolderAdd, AiOutlineFolderOpen, AiOutlineFileText , AiOutlineFolder , AiFillFileAdd, AiOutlineReload} from 'react-icons/Ai'
import {IoIosArrowForward, IoIosArrowDown,IoIosArrowBack} from 'react-icons/io'
import {BiSearchAlt, BiTrash} from 'react-icons/bi'
import {BsPlusSquare} from 'react-icons/bs'
import {Image , Flex, Box, Text, Icon, VStack, Button, AspectRatio, HStack, useDisclosure, Input, Textarea, Select } from "@chakra-ui/react";

import { useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { 
  canvasPreview, 
  base64StringtoFile, 
  useDebounceEffect,
} from '../../components/Crop/reusableUtils';


import { AvatarName } from '../../components/AvatarName';
import Division from '../../components/Division';
import Header from "../../components/Header";
import { Api } from '../../services/api';
import {useSession} from 'next-auth/react'
import { saveImageOnGallery } from '../api/_lib/manageGallery';


export default function Portfolio(){
  const imgRef = useRef()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imgInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [newImage, setNewImage] = useState(null);
  const [crop,setCrop] = useState<Crop>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [formPart,setFormPart] = useState<Boolean>(true) 
  
  const {data} = useSession()
  //form data

  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  const [published,setPublished] = useState(true)
  const [midia,setMidia] = useState('')

  const tags =''
  //fazer os States das variaveis do Form
  
  function handleOnChange(changeEvent){
    const reader = new FileReader()

    reader.onload = function (onLoadEvent){
      setNewImage(onLoadEvent.target.result)
    }
    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  function handleUploadClick(e){
    e.preventDefault()
    const canvasRef = previewCanvasRef.current
    const fileName = "previewFile"//          Adicionar variavel do nome da Publicaçao
    const imageData64 = canvasRef.toDataURL()
    console.log(imageData64)

    const myNewCroppedFile = base64StringtoFile( imageData64,fileName)
    // const download = downloadBase64File( imageData64,fileName)
    setFormPart(!formPart)
  }

  async function handleOnSubmit(event) {
      const config ={
        headers:{
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      }}
      const data =   {
        image: newImage,
        name:name,
        title:name,
        description:description,
      }
      event.preventDefault();
      // const fileInput = Array.from(form.elements).find(({name})=>name==='img');
      Api.post('https://api.imgur.com/3/upload',data,config)
      .then((res)=>{
        console.log(res)
      }).catch((e)=>{
        console.log(e)})
      // Fazer o envio de todas as informaçoes //
      // console.log(event)
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
      <Button onClick={()=>{saveImageOnGallery(data.user.email)}} >'asd'</Button>

      <Flex h='100vh' mt='-50px' pt='50px' justify="flex-start">

        <Flex id='left-nav' flexDir='column'>
          <AvatarName />

          <Division  width={'100%'}  bg={'#323232'}/>
          < Flex  ml='20px' flexDir='column'>
            <Flex width='100%' justify='space-between' align='center' >
              <Text>Projetos</Text>
              
              <Flex align='center'>
                <Icon color='#D9D9D9' as={AiFillFolderAdd} />
                <Icon color='#D9D9D9' as={AiFillFileAdd} />
                <Icon transition='all 1s ease-in-out' _hover={{transform:'rotate(360deg)'}} color='#D9D9D9' as={AiOutlineReload} />
              </Flex>
            </Flex>
            <VStack fontSize='16px' mt='1rem' alignItems='flex-start' spacing='6px'>
              <Flex ml={0} flexDir='column' align="center">
                <Flex flexDir='column'  > 
                  <Flex bg='#20343D' p='0 24px 0 0' borderRadius='5px' align="center"> <Icon as={IoIosArrowDown} /> <Icon color='#FCD635' as={AiOutlineFolderOpen} /> <Text>Lorem</Text></Flex>
                  <Flex p='0 24px 0 0' ml='24px !important'  align="center"> <Icon color='#FCD635' as={AiOutlineFileText} /> <Text>Lorem</Text></Flex>
                  <Flex ml='24px !important'  align="center"> <Icon color='#959595' as={AiOutlineFileText} /> <Text>Lorem</Text></Flex>
                </Flex>
              </Flex>
              <Flex  align="center"><Icon as={IoIosArrowForward} /> <Icon color='#959595' as={AiOutlineFolder} /> <Text>Lorem</Text></Flex>
              <Flex align="center"><Icon as={IoIosArrowForward} /> <Icon color='#959595' as={AiOutlineFolder} /> <Text>Lorem</Text></Flex>
            </VStack>
          </Flex>

          <Flex as={Button} align='center' m='auto 1rem 3rem' border='1px solid #959595' _hover={{ bg:'none', color:'#FCD635', border: '1px solid #FCD635'}} bg='none'>
          <Icon as={BiTrash} /> <Text  mr='auto'>Lixeira</Text>
          </Flex>
        </Flex>

        <Box height='98%' m='auto 16px' w={'1px'} bg='#fff' />

        <Flex mt={'2rem'}>
          <Flex
            as={Button}
            _hover={{bg:'none'}}bg={'none'}
            cursor='pointer'
            onClick={onOpen}
            flexDir='column'
            align='center'
            justify='center'
            w='190px'
            height='190px'
            borderRadius='5px'
            border='1px
            dashed
            #fff'>
            <Icon fontSize='32px' as={BsPlusSquare}/>
            <Text fontSize='14px' mt='1rem'>Novo Projeto</Text>
          </Flex>
          {/* map de projetos */}
          <Flex
              ml='20px'
              flexDir='column'
              align='center'
              justify='flex-start'
              w='190px'
              overflow='hidden'
              height='215px'
              bgColor='#3A3A3A'
              border='1px
              solid
              #4d4d4d'
              borderRadius='5px'
              _hover={{
                border:'1px solid #FFEB80'
              }}>
            <AspectRatio  w='190px' ratio={1}>
             <Box position='relative'>

              <Image  position='absolute' transform='brightness(0.6)' borderRadius='4px' w='101%' h='101%' objectFit='cover' src='/images/001.jpg' />
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
                <Button _hover={{bg:'#FFE767'}} color='#000' bg='#FFE767'>Editar</Button>
              </Flex>
             </Box>
            </AspectRatio>
            <Flex m='auto 10px ' width='100%' justify='space-between'>
              <Text ml='10px' fontSize='10px'>Titulo</Text>
              <HStack mr='10px'>
                <Text fontSize='10px'>Publicado</Text>
                <Box width='30px' border='1px solid gray' borderRadius='10px' ><Box h='12px' w='12px' borderRadius='50%' bg='#FFEB80' /></Box>
              </HStack>
            </Flex>
          </Flex>

        </Flex>

        <Modal size={'1400px'} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay bg='#000000c0' />
          <ModalContent w='1200px !important' height='830px' bg='#373737' >
            <ModalHeader  width='100%'>
             <Flex justify="space-between" align='center'>
              <Icon onClick={()=>setFormPart(!formPart)} cursor='pointer' opacity={!formPart? '1':'0'} fontSize='24px' as={IoIosArrowBack} />
              <Text>Nova publicação</Text>
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
                  position="relative"
                  _hover={{bg:'none'}}bg={'none'}
                  cursor='pointer'
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
                    onChange={
                      (event)=>{
                        handleOnChange(event)           
                      }
                    }
                    type="file"
                    id="img"
                    name="img"
                    accept="image/*"
                    ref={imgInputRef} />
                  </Box>
                  <Box position="absolute">
                      <Image src={newImage}/>
                     
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
                          <Image ref={imgRef} src={newImage}/>
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
                  <Input onChange={(e)=>{setName(e.target.value)}} value={name} h='38px' borderRadius='2px' bg='#151515' border=' 1px solid #959595'  />
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
                    <Button width='35%' color='#D9D9D9' bg='#646464' border ='1px solid #D9D9D9' >Arquiva</Button>
                    <Button type='submit' width='35%' color='#000' bg='#FFE767' >Publicar</Button>
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
      </Flex>
      
    </>
  )
}