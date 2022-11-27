import {Image, Box, Text ,Flex, Avatar, Container, Button, Link, Grid, GridItem, AspectRatio, Select, Icon } from "@chakra-ui/react";
import { useState } from "react";
import Header from "../../components/Header";
import Portfolio from "./Portfolio";
import {AiFillStar, AiOutlineStar} from 'react-icons/ai'
import Perfil from "./Perfil";
export default function Profile(){
  const [grid,setGrid] = useState(7)
  const value=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
  return(
    <>
      <Header/>
      <Flex position='relative' flexDir='column' justifyContent='center'  w='100%'>
        <Image zIndex='1'
        objectFit='cover'
        src='https://cdna.artstation.com/p/assets/images/images/054/556/294/4k/juras-rodionovas-juras-rodionovas-the-hunter-close-up.jpg?1664820930'
        top='0px' position='absolute' width='100%' height='430px'/>
        <Flex mt='86px' flexDir='column' justifyContent='center' alignItems='center'>
          <Avatar  zIndex='2' width='120px' height='120px'  src='https://bit.ly/kent-c-dodds'/>
          <Text zIndex='2' color='white' mt='24px'fontSize='28px' >Juras Rodionovas</Text>
        </Flex>

        <Box mt='40px' zIndex='5' w='100%'>
          <Flex   w='70%' h='240px' bg='#1D1D1D' border='15px solid #181818' margin='0 auto'borderRadius='5'>
            <Text m='20px'>
              LA based freelance visual development artist and art director. Clients include Disney, Dreamworks Animation, Sony Pictures Animation, MARVEL Studios.
            </Text>
            <Flex>
              <Box w='280px' m='0  40px'>
                <Flex w='100%' h='110px' m='16px 0 0' borderRadius='5px' bg='#121212' >
                  <Flex w='90%' h='70px' m='auto auto' borderTop='1px solid #ECD147' borderBottom='1px solid #ECD147'>
                    {/* 
                    Fazer o Map de Tools que o Usuario sabe
                    */}
                  </Flex>
                </Flex>
                <Button
                  h='34px'
                  w='100%'
                  m='16px
                  0'
                  borderRadius='3px'
                  _hover={{
                    background:'#fdee9a'
                  }}
                  bg='#dac761'>
                  <Text color='black'>
                    Entre em contato
                  </Text>
                </Button>
              </Box>
            </Flex>
          </Flex>
        </Box>
       
      </Flex>

      <Flex align="center" margin='0 auto 100px' flexDir='column' >
        <Flex margin='15px auto' color='white'>
          <Link _hover={{}} pb='5px' borderBottom='1px solid #FFE767' fontSize='18px' margin='0 1rem'>Portfolio</Link>
          <Link _hover={{}} fontSize='18px' margin='0 1rem'>Perfil</Link>
          <Link _hover={{}} fontSize='18px' margin='0 1rem'>Reviews</Link>
        </Flex>
        <Box w='90%' margin='0 auto' borderBottom='1px solid #959595' />
        {/* <Portfolio grid={grid} b = {value} /> */}
                  
        {/* <Perfil/> */}
                  
        <Box width={'675px'}  m='70px 0' pb='40px' bg='#121212'>
          <Text  m='10px 30px'fontSize='24px' >Reviews</Text>
          <Box w='100%' margin='0 auto 12px' borderBottom='1px solid #ECD147' />

          <Flex ml='40px'>
            <Avatar  src='https://cdna.artstation.com/p/assets/images/images/054/556/294/4k/juras-rodionovas-juras-rodionovas-the-hunter-close-up.jpg?1664820930' />
            <Flex ml='26px' flexDir="column">
              <Text  fontSize="18px">Jeff Van V</Text>
              <Text mt='8px' fontSize="16px" fontWeight="Bold">Illustração digital</Text>
              <Text mt='8px' fontSize="16px">Juras fez um otimo trabalho, e saiu melhor do que eu havia imaginado,  excedeu minhas expectativas!!</Text>
            </Flex>
          </Flex>
        </Box>

      </Flex>
    </>
  )
}