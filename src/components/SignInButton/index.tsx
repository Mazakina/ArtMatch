import { Button, Flex, Link, Text, Avatar, HStack, Icon, Box, Image } from "@chakra-ui/react";
import {useSession, signIn, signOut} from 'next-auth/react'
import {IoMdArrowDropdown } from 'react-icons/io'
import NextLink from 'next/link'
import {BsFacebook} from 'react-icons/bs'
import { useState } from "react";
import Division from "../Division";


export function SignInButton() {
  const {data} = useSession()
  const [modal,setModal] = useState(false)
  const [loginModal,setLoginModal] = useState(false)
  return(
      <Flex
        zIndex={30}
        alignItems='center'
        padding='5px'
        border={data? '':('1px solid #FFEB80')}
        borderRadius='3px'
        direction='row'>
        {data? (
          <Flex flexDir='column' position={'relative'}>
            <Link
            onClick={()=>{setModal(!modal)}}
            _hover={{
              bg:'transparent',
              color:'#FFEB80',
            }} 
            align="center" flexDir='row'
            as={Flex}
            >
              <Avatar  height='20px' width='20px' ml='5px' mr='10px'  src={data.user.image} />
              <Text 
              fontSize='16px'
              mr='5px' 
              > 
                {data?.user?.name}
              </Text>
              <Icon role='button' aria-controls="sect1" aria-expanded='false' id='sectBtbn' margin={'auto 0 '} paddingTop='4px' as={IoMdArrowDropdown} fontSize='20px' />
            </Link>

            {modal?(
              <Flex role='navigation' id='sect1' aria-labelledby="sectBtbn" box-shadow={'10px 10px 5px lightblue'} width='170px' borderRadius='5px' p='16px' bg='#1d1d1d' zIndex='10' flexDir='column' mt='40px' position="absolute">
                <NextLink href={'/favorites'} passHref>
                  <Link _hover={{ color:'#FFEB80'}} onClick={()=>{setModal(false)}} fontSize='16px' >Meus favoritos</Link>
                </NextLink>
                <Box margin='.5rem auto' width={'100%'} height='1px' bg={'#BEBEBE'}/>
                
                <NextLink href='/portfolio' passHref>
                 <Link  _hover={{ color:'#FFEB80'}} onClick={()=>{setModal(false)}} fontSize='16px'>Minhas coleções</Link>
                </NextLink>

                <NextLink href='/userSettings' passHref>
                  <Link  _hover={{ color:'#FFEB80'}} onClick={()=>{setModal(false)}}  fontSize='16px'>Editar perfil</Link>
                </NextLink>
                
                {/* <NextLink href='/userSettings' passHref>
                  <Link  _hover={{ color:'#FFEB80'}}  fontSize='16px'>Bloqueados</Link>
                </NextLink> */}
                
                <Box margin='.5rem auto' width={'100%'} height='1px' bg={'#BEBEBE'}/>
                
                <Link onClick={()=>signOut()} _hover={{ color:'#FFEB80'}}  fontSize='16px'>Sair</Link>

              </Flex>
            ):''}

          </Flex>
        ):(
        <Flex position='relative'>
          <Button
            bg='tranparent'
            h='21px'
            fontSize='14px'
            pr='22px'
            borderRightWidth='1px'
            borderRadius='0'
            aria-expanded='false'
            aria-controls='login'
            id="loginbtn"
            onClick={()=>setLoginModal(!loginModal)}
            color={'white'}
            _hover={{
              bg:'transparent',
              color:'#FFEB80',
            }}
            borderRightColor='#BEBEBE'>
            Entrar  
          </Button>
          <Button
            bg='tranparent'
            h='21px'
            aria-expanded='false'
            aria-controls='login'
            fontSize='14px'
            id="loginbtn"
            onClick={()=>setLoginModal(!loginModal)}
            color={'white'}
            _hover={{
              bg:'transparent',
              color:'#FFEB80'
            }}
            >
            Cadastrar-se
          </Button>

          {loginModal?
            <Flex id='login' role='login-area' aria-labelledby="loginbtn" border='1px solid #7e7e7e' position='absolute' left='-70px' w='250px' width='320px'  borderRadius='5px' p='24px' bg='#1d1d1d' zIndex='10' flexDir='column' mt='40px' align='space-around' justify='space-around' >
             {/* <Button
                onClick={()=>signIn('facebook')}
                _hover={{bg:'#334b81'}}
                color='white'
                mb='20px'
                bg={'#3b5998'}><Icon
                fontSize='25px'
                ml='10px'
                mr='20px'
                as={BsFacebook}/>Fazer login com Facebook</Button> */}
              <Button
                onClick={()=>signIn('google')}
                color='black'
                bg={'white'}><Image
                w='50px'
                mr='10px'
                h='50px'
                alt='google logo'
                src={'images/google.svg'}
                />Fazer login com o Google</Button>
            </Flex>
          :''}

        </Flex>

        )}
      </Flex>
  )
}
