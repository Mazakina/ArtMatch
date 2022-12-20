import { Avatar, Box, Button, Checkbox, Flex, FormControl, Icon, Input, Text, Textarea } from "@chakra-ui/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import * as yup from 'yup'

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

export default function User(){
  const perfilSchema = yup.object().shape({
    biografia:yup.string(),
    cidade:yup.string(),
    endereço:yup.string(),
    number:yup.number()
  })
  const socialSchema = yup.object().shape({
    
  })
  const [settingOpt, setSettingOpt] = useState('perfil')
  const [artstation, setArtstation] = useState('')
  const [telefone, setTelefone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [behance, setBehance] = useState('')
  const {data} = useSession()
  const [importedData,setImportedData] = useState<importedDataProps>(
  {  data:{
      profile:{
        usuario:'',
        biografia:'',
        cidade:'',
        endereco:'',
        numero:null,
        banner:'',
        avatar:''
      },
      social:{
        instagram:'',
        artstation:'',
        behance:'',
        telefone:'',
      },
      seguranca:{
        email:{
          email:data?.user.email
        },
        nsfwAllow:false,
        allowToBeFound:true,
      },
      bloqueados:[]
    }}
  )


  const [usuario,setUsuario] = useState('')
  const [biografia,setBiografia] = useState('')
  const [cidade,setCidade] =  useState('')
  const [endereco,setEndereco] = useState('')
  const [numero,setNumero] = useState(0)
  const [email,setEmail] = useState('')
  const [nsfwAllow,setNsfwAllow] = useState(true)
  const [allowToBeFound,setAllowToBeFound] = useState(true)
  useEffect(()=>{
    if(data){
      Api.post('/lib/userSettings/getUserSettings',data).then(response => setImportedData(response.data))
      const {profile,seguranca,social,bloqueados} = importedData.data
      setUsuario(profile.usuario)
      setBiografia(profile.biografia)
      setCidade(profile.cidade)
      setEndereco(profile.endereco)
      setNumero(profile.numero)
      setNsfwAllow(seguranca.nsfwAllow)
      setAllowToBeFound(seguranca.allowToBeFound)
      setInstagram(social.instagram)
      setArtstation(social.artstation)
      setBehance(social.behance)
      setTelefone(social.telefone)
    }
  },[data])
  const saveSettingsProfile = (event:FormEvent)=>{
    event.preventDefault()
    const requestData = {
      section:'profile',
      usuario:usuario,
      biografia:biografia,
      cidade:cidade,
      endereco:endereco,
      numero:numero,
      user:data.user
    }
    console.log(requestData)
    Api.post('/lib/userSettings/saveUserSettings',requestData)
  }
  return(
    <>
      <Header/>
      <Flex mt='60px' justify="center">
        <Flex h='500px' borderRadius='2px' maxWidth='290px' border='1px solid #959595' p='1rem 0' w='100%' flexDir='column' id='left-nav'>
          <AvatarName avatar={data?.user.image||''} email={data?.user.email||''} name={data?.user.name||''} />
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

        {settingOpt== 'perfil'?(

        <FormControl as={Flex} flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
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
              <Input h='28px' borderRadius='2px'  maxWidth='490px' onChange={(e)=>{e.target.value}}  value={usuario}></Input>
            </Flex>
            <Flex mt='1rem' align=''>
              <Text w='20%' maxWidth='130px'>Biografia</Text>
              <Textarea h='28px' borderRadius='2px'  maxWidth='490px' onChange={(e)=>{e.target.value}}  value={biografia}></Textarea>
            </Flex>
            <Flex  mt='1rem' w='100%' align='center'>
              <Flex w='80%' justify='center' flexDir='column'>
                <Flex align='center'>
                  <Text width='130px'>Cidade</Text>
                  <Input h='28px' borderRadius='2px'  maxWidth='340px' onChange={(e)=>{e.target.value}}  value={cidade}></Input>
                </Flex>
                <Flex maxWidth='480px' w='100%'  mt='1rem' align='center'>
                  <Text  width='130px'>Endereço</Text>
                  <Input maxHeight='28px' borderRadius='2px'  maxWidth='250px' onChange={(e)=>{e.target.value}}  value={endereco}></Input> 
                  <Text ml='1rem' >Nº</Text>
                  <Input ml='8px' h='28px'  borderRadius='2px'  maxWidth='46px'onChange={(e)=>{e.target.value}}  value={numero}/>
                </Flex>
              </Flex>
              <Avatar mr='2rem !important' h='70px' width='70px' src={data?.user.image} />
            </Flex>
          </Flex>

         <Flex
          mt='1rem'
           border='1px
           solid
           #959595'
           flexDir='column'
           w='100%'
           align='center'
           justify='center'>
            <Text>Escolha uma imagem para seu Banner</Text>
            <Box>
              Fazer o Dropzone
            </Box>
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

        ):''}
        
        {settingOpt== 'social'?(

        <FormControl as={Flex}  flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
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
              <SocialOptions onChange={(e)=>setInstagram(e.target.value)}  icon={AiOutlineInstagram} placeholder={'Ex: @Fabiano'} text='Instagram' value={instagram} />
              <SocialOptions onChange={(e)=>setArtstation(e.target.value)}  icon={FaArtstation} text='Artstation' placeholder='seu usuário do Artstation' value={artstation} />
              <SocialOptions onChange={(e)=>setBehance(e.target.value)} icon={FaBehanceSquare} text='BeHance' placeholder='seu usuário do Behance' value={behance} />
              <SocialOptions onChange={(e)=>setTelefone(e.target.value)} icon={FiPhone} text='Telefone' placeholder='Ex: (11) 99999-9999' value={telefone} />
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
          ml='auto' >Salvar</Button>
        </FormControl> ):""}
        
        {settingOpt== 'segurança'?(

        <FormControl as={Flex}  flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
          <Text>Conta</Text>
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
              <Input disabled={true}  onChange={(e)=>{setEmail(e.target.value)}} value={email} fontSize='14px' w='70%' type='email' h='28px' borderRadius='2px'  maxWidth='490px'/>
            </Flex>

            <Division width='100%' bg='#323232'/>
            <Checkbox  fontSize='14px' onChange={(e)=>{setNsfwAllow(e.target.checked)}} checked={nsfwAllow} >Mostrar conteúdo adulto</Checkbox>
            <Checkbox  fontSize='14px'  onChange={(e)=>{setAllowToBeFound(e.target.checked)}} checked={allowToBeFound} mt='10px'>Permitir ser visto na secção de busca</Checkbox>

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
              ml='auto' >Salvar</Button>
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
              ml='auto' >Salvar</Button>
          </Flex>
        </FormControl>): ''}

        {settingOpt== 'bloqueados'?(
        
        <FormControl as={Flex} flexDir='column' w='90%' ml='40px' maxWidth='690px' id='config-content'>
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
         //fazer Map dos usuarios bloqueados 
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
        </FormControl>): ""}
      </Flex>
    </>
  )
}
