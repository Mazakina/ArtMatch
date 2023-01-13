import { Avatar,Image, Button, Checkbox, Flex, FormControl, Icon, Input, Text, Textarea } from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import Compress from 'compress.js'
import {useDropzone} from "react-dropzone";
import { AvatarName } from "../../components/AvatarName";
import Division from "../../components/Division";
import Header from "../../components/Header";
import { SettingsNavOptions } from "../../components/Setting/SettingsNavOption";
import SocialOptions from "../../components/Setting/SocialOptions";

import { AiFillEdit, AiOutlineHome, AiOutlineInstagram } from "react-icons/ai";
import {IoShareSocialOutline} from 'react-icons/io5'
import {MdOutlineSecurity} from 'react-icons/md'
import {FaBehanceSquare, FaArtstation } from 'react-icons/fa'
import {FiPhone } from 'react-icons/fi'
import {BiBlock, BiSearchAlt, BiTrash} from 'react-icons/bi'
import { Api } from "../../services/api";
import { motion } from "framer-motion";

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
  const [settingOpt, setSettingOpt] = useState('perfil')
  const {data} = useSession()
  const [usuario,setUsuario] = useState( userSettings.data.profile?.usuario)
  const [biografia,setBiografia] = useState( userSettings.data.profile?.biografia)
  const [cidade,setCidade] = useState( userSettings.data.profile?.cidade)
  const [endereco,setEndereco] = useState( userSettings.data.profile?.endereco)
  const [numero,setNumero] = useState( userSettings.data.profile?.numero)
  const [avatar, setAvatar] = useState<any>(userSettings.data.profile?.avatar)
  const [avatarDeleteHash, setAvatarDeleteHash] = useState<any>(userSettings.data.profile?.avatarDeleteHash)
  const [banner, setBanner] = useState<any>(userSettings.data.profile?.banner)
  const [bannerDeleteHash, setBannerDeleteHash] = useState<any>(userSettings.data.profile?.bannerDeleteHash)
  const [email,setEmail] = useState( userSettings.data.seguranca?.email.email)
  const [nsfwAllow,setNsfwAllow] = useState( userSettings.data.seguranca?.nsfwAllow)
  const [allowToBeFound,setAllowToBeFound] = useState( userSettings.data.seguranca?.allowToBeFound)
  const [artstation, setArtstation] = useState(userSettings.data.social?.artstation)
  const [telefone, setTelefone] = useState(userSettings.data.social?.telefone)
  const [instagram, setInstagram] = useState(userSettings.data.social?.instagram)
  const [behance, setBehance] = useState(userSettings.data.social?.behance)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const compress = new Compress()

  async function handleChange(e) {
    let resizedImage = await compress.compress([e.target.files[0]],{
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
      setAvatar(onLoadEvent.target.result)
    }
      reader.readAsDataURL(resizedFile);

  }

  let regex = /^[a-zA-Z0-9\s]*$/;

  const onDrop = useCallback( async acceptedFiles => {

    const reader = new FileReader()

    reader.onload = function (onLoadEvent){
      setBanner(onLoadEvent.target.result)
    }
    reader.readAsDataURL(acceptedFiles[0]);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const valueNeedsUpdate = (value,current)=>{
    if(userSettings.data.profile[value]!==current){
        return current
    }else {return null}
  }

  const saveSettingsProfile = (event:FormEvent)=>{
    setIsLoading(true)
    event.preventDefault()
    let usuarioForRequest

    const requestData = {
      section:'profile',
      usuario:usuario.replace(/\s+/g, ' ').toLowerCase(),
      biografia:biografia,
      cidade:cidade,
      endereco:endereco,
      numero:numero,
      banner:valueNeedsUpdate('banner',banner),
      bannerDeleteHash:bannerDeleteHash,
      avatar:valueNeedsUpdate('avatar',avatar),
      avatarDeleteHash:avatarDeleteHash,
      user:user
    }
    Api.post('/lib/userSettings/saveUserSettings',requestData).then(()=>
    setIsLoading(false)
    ).catch((err)=>{if(err.response.data.message==='usuario já existente'){alert(err.response.data.message)};
      setIsLoading(false)
    })
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
    Api.post('/lib/userSettings/saveUserSettings',requestData).then(()=>
    setIsLoading(false)
    ).catch((err)=>{
      setIsLoading(false)
    })
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
    Api.post('/lib/userSettings/saveUserSettings',requestData).then(()=>
    setIsLoading(false)
    ).catch((err)=>{
      setIsLoading(false)
    })
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
              <Input h='28px' borderRadius='2px' border={`1px solid white !important`}  maxWidth='490px' onChange={(e)=>{if(regex.test(e.target.value)){setUsuario(e.target.value)}}}  value={usuario}></Input>
            </Flex>
            <Flex mt='1rem' align=''>
              <Text w='20%' maxWidth='130px'>Biografia</Text>
              <Textarea h='28px' border={`1px solid white  !important`} borderRadius='2px'  maxWidth='490px' onChange={(e)=>{setBiografia(e.target.value)}}  value={biografia}></Textarea>
            </Flex>
            <Flex  mt='1rem' w='100%' align='center'>
              <Flex w='80%' justify='center' flexDir='column'>
                <Flex align='center'>
                  <Text width='130px'>Cidade</Text>
                  <Input h='28px' borderRadius='2px' border={`1px solid white !important`}  maxWidth='340px' onChange={(e)=>{setCidade(e.target.value)}}  value={cidade}></Input>
                </Flex>
                <Flex maxWidth='480px' w='100%'  mt='1rem' align='center'>
                  <Text  width='130px'>Endereço</Text>
                  <Input maxHeight='28px' borderRadius='2px' border={`1px solid white !important`}  maxWidth='250px' onChange={(e)=>{setEndereco(e.target.value)}}  value={endereco}></Input> 
                  <Text ml='1rem' >Nº</Text>
                  <Input ml='8px' h='28px' p='2px' border={`1px solid white !important`} borderRadius='2px'  maxWidth='46px'onChange={(e)=>{setNumero(e.target.value)}}  value={numero}/>
                </Flex>
              </Flex>
              <label htmlFor="file-input" >
                <Flex cursor={'pointer'} as={motion.div} whileTap={{ scale: 0.95 }}  h='70px' width='70px' borderRadius={'50%'}>
                  <Avatar position='absolute' mr='2rem !important' h='70px' width='70px' src={avatar} />
                  <Flex transition='all 1 ease-in-out' align='center' justify='center' opacity={'0'}  _hover={{opacity:'1',bg:'#636363'}} color={'white'} transform={'scale(0.9)'} border='2px solid white' backdropFilter={'blur(2px) '} position='absolute' borderRadius={'50%'} h='70px' width='70px'>
                    <Icon  p='auto' w='35px' h='35px' as={AiFillEdit} />
                  </Flex>
                </Flex>
              </label>
              <input
                accept="image/png, image/gif, image/jpeg"
                id="file-input"
                type="file"
                onChange={(e)=>handleChange(e)}
                style={{ display: 'none' }}
              />
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
            h='100%'
            src ={banner}
            backgroundSize={'cover'}
            backgroundPosition='center'
            backgroundRepeat={'no-repeat'}
            objectFit={'cover'}
            _hover={{filter:'brightness(0.8)'}}
            position={'absolute'}
            filter='blur(2px) brightness(0.3)'
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
          ml='auto' isLoading={isLoading} >Salvar</Button>
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
              <SocialOptions  onChange={setInstagram}   icon={AiOutlineInstagram} placeholder={'Ex: @Fabiano'} text='Instagram' value={instagram} />
              <SocialOptions  onChange={setArtstation}   icon={FaArtstation} text='Artstation' placeholder='seu usuário do Artstation' value={artstation} />
              <SocialOptions  onChange={setBehance}  icon={FaBehanceSquare} text='BeHance' placeholder='seu usuário do Behance' value={behance} />
              <SocialOptions onChange={setTelefone}  icon={FiPhone} text='Telefone' placeholder='Ex: (11) 99999-9999' value={telefone} />
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
          isLoading={isLoading} 
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
              <Input disabled={true}  onChange={(e)=>{setEmail((e.target.value))}} border={`1px solid white !important`} value={email} fontSize='14px' w='70%' type='email' h='28px' borderRadius='2px'  maxWidth='490px'/>
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
              isLoading={isLoading} 
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
              isLoading={isLoading} 
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

  const response = await fetch(`${process.env.BASE_URL}/api/lib/userSettings/getUserSettings`,{
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