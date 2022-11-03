
import {AiFillFolderAdd, AiFillFolder, AiOutlineFolderOpen, AiOutlineFileText , AiOutlineFolder , AiFillFileAdd, AiOutlineReload} from 'react-icons/Ai'
import {IoIosArrowForward, IoIosArrowDown} from 'react-icons/io'
import {BiTrash} from 'react-icons/bi'
import {BsPlusSquare} from 'react-icons/bs'
import {Image , Avatar, Flex, Link, Box, Text, Icon, VStack, Button, AspectRatio, HStack, useDisclosure } from "@chakra-ui/react";

import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Header from "../../components/Header";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useRef, useState } from "react";
import { 
  canvasPreview, 
  base64StringtoFile, 
  useDebounceEffect,
  downloadBase64File, 
} from '../../components/Crop/reusableUtils';




export default function portfolio(){
  const imgRef = useRef()
  const { isOpen, onOpen, onClose } = useDisclosure();

  const imgInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [newImage, setNewImage] = useState(null);
  const [crop,setCrop] = useState<Crop>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  function handleOnChange(changeEvent){
    const reader = new FileReader()

    reader.onload = function (onLoadEvent){
      setNewImage(onLoadEvent.target.result)
    }
    reader.readAsDataURL(changeEvent.target.files[0]);
  }

 function handleDownloadClick(e){
  e.preventDefault()
  const canvasRef = previewCanvasRef.current
  const fileName = "previewFile"//          Adicionar variavel do nome da Publicaçao
  const imageData64 = canvasRef.toDataURL()

  console.log(imageData64)

  const myNewCroppedFile = base64StringtoFile( imageData64,fileName)
  const download = downloadBase64File( imageData64,fileName)
 }


  async function handleOnSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({name})=>name==='img');
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
      <Flex h='100vh' mt='-50px' pt='50px' justify="flex-start">

        <Flex id='left-nav' flexDir='column'>
          <Flex m='20px 20px 0 20px'>
            <Avatar src=''/>
            <Box ml='12px'>
              <Text>Juras Rodionovas</Text>
              <Link fontSize='12px' >jurasrodionovas@gmail.com</Link>
            </Box>
          </Flex>

          <Box margin='1rem auto' width='100%' height='1px' bg='#323232'/>
          < Flex  ml='20px' flexDir='column'>
            <Flex width='100%' justify='space-between' align='center' >
              <Text>Projetos</Text>
              
              <Flex align='center'>
                <Icon color='#D9D9D9' as={AiFillFolderAdd} />
                <Icon color='#D9D9D9' as={AiFillFileAdd} />
                <Icon color='#D9D9D9' as={AiOutlineReload} />
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
          <Flex ml='20px' flexDir='column' align='center' justify='flex-start' w='190px' overflow='hidden'  height='215px' border='1px solid #FFEB80' bgColor='#3A3A3A' borderRadius='5px'>
            <AspectRatio  w='190px' ratio={1}>
              <Image transform='brightness(0.6)' borderRadius='4px' w='101%' h='101%' objectFit='cover' src='/images/001.jpg' />
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
            <ModalHeader  width='100%'>Nova publicação</ModalHeader>
            <ModalCloseButton />
            <ModalBody position='relative' width='100%' >
            <form action="/action_page.php" method='post'
            onChange={handleOnChange}
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
                        setNewImage(event.target.files[0])                      
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
                
                <Flex ml='32px'  flexDir='column'>
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
                    <Button onClick={(e)=>handleDownloadClick(e)} >aquiii</Button>
                  </Box>
                </Flex>

              </Flex>
              
              <Box width='100%' h='1px' bg='#000'/>
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
