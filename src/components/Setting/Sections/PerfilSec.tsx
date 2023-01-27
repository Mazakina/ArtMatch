import { Avatar,Image, Button, Checkbox, Flex, FormControl, Icon, Input, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FormEvent, useCallback, useState } from "react";
import { AiFillEdit, AiOutlineEdit } from "react-icons/ai";
import { Api } from "../../../services/api";
import Division from "../../Division";
import SkillsTagSection from "../SkillsTagSection";
import Compress from 'compress.js'
import { useDropzone } from "react-dropzone";
import ModalTag from "../ModalTag";

interface PerfilSec{
  settingOpt:string,
  userSettings:any
}

export default function PerfilSec({settingOpt,userSettings,user}){
  const [usuario,setUsuario] = useState( userSettings.data.profile?.usuario)
  const [biografia,setBiografia] = useState( userSettings.data.profile?.biografia)
  const [skills, setSkills] = useState([
    {id:'digital-art',name:'Arte Digital',icon:''},
    {id:'tradicional-art',name:'Arte Tradicional',icon:''},
    {id:'graffite',name:'Graffite',icon:''},
    {id:'tattoo',name:'Tatuagem',icon:''},
    {id:'character-design',name:'Design de Personagem',icon:''},
    {id:'enviorement-design',name:'Design de Cenário',icon:''},
    {id:'modeling',name:'Modelagem',icon:''},
  ])
  const [resume,setResume] = useState( userSettings.data.profile?.resumo)
  const [cidade,setCidade] = useState( userSettings.data.profile?.cidade)
  const [endereco,setEndereco] = useState( userSettings.data.profile?.endereco)
  const [numero,setNumero] = useState( userSettings.data.profile?.numero)
  const [avatar, setAvatar] = useState<any>(userSettings.data.profile?.avatar)
  const [avatarDeleteHash, setAvatarDeleteHash] = useState<any>(userSettings.data.profile?.avatarDeleteHash)
  const [banner, setBanner] = useState<any>(userSettings.data.profile?.banner)
  const [bannerDeleteHash, setBannerDeleteHash] = useState<any>(userSettings.data.profile?.bannerDeleteHash)
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const { isOpen, onOpen, onClose } = useDisclosure();

  const valueNeedsUpdate = (value,current)=>{
    if(userSettings.data.profile[value]!==current){
        return current
    }else {return null}
  }

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

  const onDrop = useCallback( async acceptedFiles => {
    const reader = new FileReader()
    reader.onload = function (onLoadEvent){
      setBanner(onLoadEvent.target.result)
    }
    reader.readAsDataURL(acceptedFiles[0]);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

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

  let regex = /^[a-zA-Z0-9\s]*$/;

  return(
    <>
    <FormControl
      display={settingOpt=='perfil'?
      'initial':'none'}as={Flex}
      flexDir='column'
      w='60%'
      ml='40px'
      maxWidth='690px'
      id='config-content'>
      <Text mb='10px' fontSize='26px'>
        Perfil
      </Text>
      <Flex
        bg='#55555514'
        borderRadius='5px'
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
        mt='1rem'
        border='1px
        solid
        #959595'
        flexDir='column'
        w='100%'
        h='fit-content'
        align='flex-start'
        bg='#55555514'
        borderRadius={'5px'} 
      >
        <Flex p='1rem 1rem 0' align='center' justify={'space-between'} w='100%' >
          <Text >Habilidades</Text>
          <Icon
            onClick={onOpen}
            cursor={'pointer'}
            _hover={{color:'#FFEB80',border:'1px solid #FFEB80'}}
            fontSize={'1.9rem'}
            p='.2rem'
            borderRadius={'5px'}
            border='1px  solid #6e6e6e'
            as={AiOutlineEdit} />
        </Flex>
        <Division width='100%' bg='#6e6e6e' />
        <Flex mb='1rem'>
          <SkillsTagSection skills={skills}/>
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
    <ModalTag isOpen={isOpen} onClose={onClose} skills={skills} setSkills={setSkills} />
    </>
  )
}