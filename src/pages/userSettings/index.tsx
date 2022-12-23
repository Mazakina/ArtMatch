import { Avatar,Image, Box, Button, Checkbox, Flex, FormControl, Icon, Input, Text, Textarea } from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import * as yup from 'yup'
import {useDropzone} from "react-dropzone";
import { AvatarName } from "../../components/AvatarName";
import Division from "../../components/Division";
import Header from "../../components/Header";
import { SettingsNavOptions } from "../../components/Setting/SettingsNavOption";
import SocialOptions from "../../components/Setting/SocialOptions";

import { AiOutlineHome, AiOutlineInstagram } from "react-icons/ai";
import {IoShareSocialOutline} from 'react-icons/io5'
import {MdOutlineSecurity} from 'react-icons/md'
import {FaBehanceSquare, FaArtstation } from 'react-icons/fa'
import {FiPhone } from 'react-icons/fi'
import {BiBlock, BiSearchAlt, BiTrash} from 'react-icons/bi'
import { Api } from "../../services/api";

interface importedDataProps{
  data:{
    profile:{
      usuario:string,
      biografia:string,
      cidade:string,
      endereco:string,
      numero:number| null,
      banner:any,
      avatar:string
    },
    social:{
      instagram:string,
      artstation:string,
      behance:string,
      telefone:string,
    },
    seguranca:{
      email:{
        email:string
      },
      nsfwAllow:boolean,
      allowToBeFound:boolean,
    },
    bloqueados:[]
  }
}

export default function User({userSettings,user}){
  const perfilSchema = yup.object().shape({
    biografia:yup.string(),
    cidade:yup.string(),
    endereço:yup.string(),
    number:yup.number()
  })
  const socialSchema = yup.object().shape({
    
  })
  const [settingOpt, setSettingOpt] = useState('perfil')
  const {data} = useSession()
  const [usuario,setUsuario] = useState( userSettings.data.profile?.usuario)
  const [biografia,setBiografia] = useState( userSettings.data.profile?.biografia)
  const [cidade,setCidade] = useState( userSettings.data.profile?.cidade)
  const [endereco,setEndereco] = useState( userSettings.data.profile?.endereco)
  const [numero,setNumero] = useState( userSettings.data.profile?.numero)
  const [email,setEmail] = useState( userSettings.data.seguranca?.email.email)
  const [nsfwAllow,setNsfwAllow] = useState( userSettings.data.seguranca?.nsfwAllow)
  const [allowToBeFound,setAllowToBeFound] = useState( userSettings.data.seguranca?.allowToBeFound)
  const [artstation, setArtstation] = useState(userSettings.data.social?.artstation)
  const [telefone, setTelefone] = useState(userSettings.data.social?.telefone)
  const [instagram, setInstagram] = useState(userSettings.data.social?.instagram)
  const [behance, setBehance] = useState(userSettings.data.social?.behance)
  
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const saveSettingsProfile = (event:FormEvent)=>{
    event.preventDefault()
    const requestData = {
      section:'profile',
      usuario:usuario,
      biografia:biografia,
      cidade:cidade,
      endereco:endereco,
      numero:numero,
      user:user
    }
    Api.post('/lib/userSettings/saveUserSettings',requestData)
  }

  const saveSettingsSocial = (event:FormEvent)=>{
    event.preventDefault()
    const requestData = {
      section:'social',
      instagram:instagram,
      artstation:artstation,
      behance:behance,
      telefone:telefone,
      user:user
    }
    Api.post('/lib/userSettings/saveUserSettings',requestData)
  }
  const saveSettingsSeguranca = (event:FormEvent)=>{
    event.preventDefault()
    const requestData = {
      section:'seguranca',
      email:{
        email:user.email
      },
      nsfwAllow:nsfwAllow,
      allowToBeFound:allowToBeFound,
      user:user
    }
    Api.post('/lib/userSettings/saveUserSettings',requestData)
  }
  
  return(
    <>
      <Header/>
      <Flex mt='60px' justify="center" >
        <Flex h='500px' borderRadius='2px' maxWidth='290px' border='1px solid #959595' p='1rem 0' w='100%' flexDir='column' id='left-nav'>
          <AvatarName avatar={user.image||''} email={user.email||''} name={user.name||''} />
          <Division width='95%' bg='#323232' />
          <SettingsNavOptions  onClick={() =>setSettingOpt('perfil')} icon={AiOutlineHome} active={settingOpt=='perfil'} ml='2rem'>
            Perfil
          </SettingsNavOptions>
          <SettingsNavOptions  onClick={() =>setSettingOpt('social')} icon={IoShareSocialOutline} active={settingOpt=='social'} ml='2rem'>
            Social
          </SettingsNavOptions>
          <Division width='95%' bg='#323232' />
          <SettingsNavOptions onClick={() =>setSettingOpt('segurança')} icon={MdOutlineSecurity} active={settingOpt=='segurança'} ml='2rem'>
            Segurança
          </SettingsNavOptions>
          <SettingsNavOptions onClick={() =>setSettingOpt('bloqueados')} icon={BiBlock} active={settingOpt=='bloqueados'} ml='2rem'>
            Bloqueados
          </SettingsNavOptions>
        </Flex>

        
        <FormControl display={settingOpt=='perfil'? 'initial':'none'}as={Flex} flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content' >
          <Text mb='10px' fontSize='26px'>
            Perfil
          </Text>
          <Flex
            borderRadius='2px'
            border='1px
            solid
            #959595'
            p='21px'
            w='100%'
            flexDir='column'
            id='left-nav'>   
            <Flex  align='center'>
              <Text w='20%' maxWidth='130px'>Usuário</Text>
              <Input h='28px' borderRadius='2px'  maxWidth='490px' onChange={(e)=>{setUsuario(e.target.value)}}  value={usuario}></Input>
            </Flex>
            <Flex mt='1rem' align=''>
              <Text w='20%' maxWidth='130px'>Biografia</Text>
              <Textarea h='28px' borderRadius='2px'  maxWidth='490px' onChange={(e)=>{setBiografia(e.target.value)}}  value={biografia}></Textarea>
            </Flex>
            <Flex  mt='1rem' w='100%' align='center'>
              <Flex w='80%' justify='center' flexDir='column'>
                <Flex align='center'>
                  <Text width='130px'>Cidade</Text>
                  <Input h='28px' borderRadius='2px'  maxWidth='340px' onChange={(e)=>{setCidade(e.target.value)}}  value={cidade}></Input>
                </Flex>
                <Flex maxWidth='480px' w='100%'  mt='1rem' align='center'>
                  <Text  width='130px'>Endereço</Text>
                  <Input maxHeight='28px' borderRadius='2px'  maxWidth='250px' onChange={(e)=>{setEndereco(e.target.value)}}  value={endereco}></Input> 
                  <Text ml='1rem' >Nº</Text>
                  <Input ml='8px' h='28px' p='2px'  borderRadius='2px'  maxWidth='46px'onChange={(e)=>{setNumero(e.target.value)}}  value={numero}/>
                </Flex>
              </Flex>
              <Avatar mr='2rem !important' h='70px' width='70px' src={user.image} />
            </Flex>
          </Flex>

        <Flex
          {...getRootProps()}
          mt='1rem'
          border='1px
          solid
          #959595'
          flexDir='column'
          w='100%'
          h='200px'
          align='center'
          justify='center'
          position={'relative'}
          overflow='hidden'
          cursor={'pointer'}
          > 
            <Image 
            src ='https://cdna.artstation.com/p/assets/images/images/054/556/294/4k/juras-rodionovas-juras-rodionovas-the-hunter-close-up.jpg?1664820930' 
            backgroundSize={'cover'}
            backgroundPosition='center'
            backgroundRepeat={'no-repeat'}
            position={'absolute'}
            filter='blur(2px) brightness(0.8)'
            />
            <input {...getInputProps()} />
            {
              isDragActive ?
              <Text zIndex={2}>Escolha uma imagem para seu Banner</Text> :
              <Text zIndex={2} >Arraste uma Imagem para seu Banner ou clique aqui para escolher</Text>
            }
          </Flex>

          <Button 
          onClick={(event)=>{saveSettingsProfile(event)}}
          type='submit'
          mt='2rem'
          bg='none'
          w='140px'
          border='1px solid #ffeb80'
          color='#ffeb80'
          borderRadius='2px'
          _hover={{
            bg:'none',
          }}
          ml='auto' >Salvar</Button>
        </FormControl>

        <FormControl as={Flex} display={settingOpt=='social'? 'initial':'none' } flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
          <Text mb='10px' fontSize='26px'>
            Social
          </Text>
          <Flex
          bg='#121212'
            mt='1rem'
            pb='1rem'
            border='1px
            solid
            #959595'
            flexDir='column'
            w='100%'
            align='center'
            justify='center'>
              <SocialOptions onChange={(e)=>{setInstagram(e.target.value)}}   icon={AiOutlineInstagram} placeholder={'Ex: @Fabiano'} text='Instagram' value={instagram} />
              <SocialOptions onChange={(e)=>{setArtstation(e.target.value)}}   icon={FaArtstation} text='Artstation' placeholder='seu usuário do Artstation' value={artstation} />
              <SocialOptions onChange={(e)=>{setBehance(e.target.value)}}  icon={FaBehanceSquare} text='BeHance' placeholder='seu usuário do Behance' value={behance} />
              <SocialOptions onChange={(e)=>{setTelefone(e.target.value)}}  icon={FiPhone} text='Telefone' placeholder='Ex: (11) 99999-9999' value={telefone} />
          </Flex>
          <Button 
          mt='2rem'
          bg='none'
          w='140px'
          border='1px solid #ffeb80'
          color='#ffeb80'
          borderRadius='2px'
          _hover={{
            bg:'none',
          }}
          ml='auto'
          onClick={(event)=>{saveSettingsSocial(event)}}
          >Salvar</Button>
        </FormControl> 

        <FormControl display={settingOpt=='segurança'? 'initial':'none'} as={Flex}  flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
          <Text mb='10px' fontSize='26px'>
            Conta
          </Text>
          <Flex
              bg='#121212'
              mt='1rem'
              p='1rem 5%'
              border='1px
              solid
              #959595'
              flexDir='column'
              justify='center'>
            <Flex  mt='21px' w='100% !important'  align='center'>
              <Text  fontSize='14px' w='20%' maxWidth='130px'>E-mail</Text>
              <Input disabled={true}  onChange={(e)=>{setEmail((e.target.value))}} value={email} fontSize='14px' w='70%' type='email' h='28px' borderRadius='2px'  maxWidth='490px'/>
            </Flex>

            <Division width='100%' bg='#323232'/>
            <Checkbox  fontSize='14px' onChange={(e)=>{setNsfwAllow(e.target.checked)}} isChecked={nsfwAllow} >Mostrar conteúdo adulto</Checkbox>
            <Checkbox  fontSize='14px'  onChange={(e)=>{setAllowToBeFound(e.target.checked)}} isChecked={allowToBeFound} mt='10px'>Permitir ser visto na secção de busca</Checkbox>

            <Division width='100%' bg='#323232'/>
            <Button 
              bg='none'
              w='140px'
              border='1px solid #ffeb80'
              color='#ffeb80'
              borderRadius='2px'
              _hover={{
                bg:'none',
              }}
              ml='auto' 
              onClick={(event)=>{saveSettingsSeguranca(event)}}
              >Salvar</Button>
          </Flex>

          <Flex
              bg='#121212'
              mt='1rem'
              p='1rem 5%'
              border='1px
              solid
              #959595'
              flexDir='column'
              justify='center'>
            <Text>Trocar senha</Text>
            <Flex  mt='21px' w='100% !important'  align='center'>
              <Text  fontSize='14px' w='20%' maxWidth='130px'>Senha atual</Text>
              <Input placeholder="*********" disabled={true} fontSize='14px' w='70%' type='password' h='28px' borderRadius='2px'  maxWidth='490px'/>
            </Flex>
            <Flex  mt='21px' w='100% !important'  align='center'>
              <Text  fontSize='14px' w='20%' maxWidth='130px'>Nova senha</Text>
              <Input  disabled={true} fontSize='14px' w='70%' type='password' h='28px' borderRadius='2px'  maxWidth='490px'/>
            </Flex>
            <Flex  mt='21px' w='100% !important'  align='center'>
              <Text fontSize='14px' w='20%' maxWidth='130px'>Confirmar nova senha</Text>
              <Input  disabled={true} fontSize='14px' w='70%' type='password' h='28px' borderRadius='2px'  maxWidth='490px'/>
            </Flex>
            <Button 
              bg='none'
              w='140px'
              mt='1rem'
              border='1px solid #ffeb80'
              color='#ffeb80'
              borderRadius='2px'
              _hover={{
                bg:'none',
              }}
              ml='auto'
              onClick={(event)=>{saveSettingsSeguranca(event)}}
              >Salvar</Button>
          </Flex>
        </FormControl>
        
        <FormControl display={settingOpt=='bloqueados'? 'initial':'none'} as={Flex} flexDir='column' w='90%' ml='40px' maxWidth='690px' id='config-content'>
          <Text mb='1rem' fontSize='24px'>Lista de Bloqueados</Text>
          <Flex
            borderRadius='2px'
            border='1px
            solid
            #959595'
            bg='#121212'
            p='21px'
            flexDir='column'
            w='100%'
            id='left-nav'>   
            <Flex>
              <Flex 
                align='center'
                h='29px'
                w='90%'
                borderRadius='2px'
                bg='#0B0B0B'
                color='#BEBEBE'
                position='relative'
                mr='12px'
                as='label'>
                <Input
                  h='29px'
                  bg='transparent'
                  w='100%'
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
            </Flex>
          <Division width='100%' bg='#323232'/>
          <Flex mt='.5rem' p='2px' bg='#0B0B0B' transition='all 0.2s ease-in-out' _hover={{bg:'#202020'}}  borderRadius='3px' width='100% !important' justify='space-between' align='center'>
            <Checkbox >
              <Text>Random Name 1</Text>
            </Checkbox>
            <Icon as={BiTrash}  />
          </Flex>
          <Flex mt='.5rem' p='2px' bg='#0B0B0B' transition='all 0.2s ease-in-out' _hover={{bg:'#202020'}}  borderRadius='3px' width='100% !important' justify='space-between' align='center'>
            <Checkbox >
              <Text>Random Name 2</Text>
            </Checkbox>
            <Icon as={BiTrash}  />
          </Flex>

          <Division width='100%' bg='#323232'/>
            
          </Flex>
        </FormControl>
      </Flex>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const response = await fetch('http://localhost:3000/api/lib/userSettings/getUserSettings',{
    method:'post',
    headers: {
      cookie: context.req.headers.cookie || "",
    },
    body:JSON.stringify({
      secret:process.env.NEXT_AUTH_JWT_KEY
    })
  })
  const userSettings = await response.json()

  return {
    props: {
      userSettings,
      user:session.user
    },
  }
}