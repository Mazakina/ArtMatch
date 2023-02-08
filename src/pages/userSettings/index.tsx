import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { AvatarName } from "../../components/AvatarName";
import Division from "../../components/Division";
import Header from "../../components/Header";
import { SettingsNavOptions } from "../../components/Setting/SettingsNavOption";

import { AiOutlineHome } from "react-icons/ai";
import {IoShareSocialOutline} from 'react-icons/io5'
import {MdOutlineSecurity} from 'react-icons/md'
import PerfilSec from "../../components/Setting/Sections/PerfilSec";
import SocialSec from "../../components/Setting/Sections/SocialSec";
import SecuritySec from "../../components/Setting/Sections/SecuritySec";

interface importedDataProps{
  data:{
    profile:{
      usuario: string,
      biografia: string,
      habilidades: string[],
      cidade: string,
      endereco: string,
      avatar: string,
      avatarDeleteHash: string,
      banner: string,
      bannerDeleteHash: string,
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

interface UserSettingsProps{
  userSettings:importedDataProps,
  user:{
    email:string,
    name:string,
    image:string,
  }
}
export default function User({userSettings,user}:UserSettingsProps){
  const [settingOpt, setSettingOpt] = useState('perfil')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  return(
    <Flex flexDir={{base:'column',lg:'row'}} mt={{base:'1rem',lg:'60px'}}  justify="center" >
      <Flex
        h={{base:'fit-content',lg:'500px'}}
        borderRadius='2px'
        maxWidth={{base:'90%',lg:'290px'}}
        border={{base:'none',lg:'1px solid #959595'}}
        p='1rem 0'
        m={{base:'0 auto',lg:'0'}}
        w='100%'
        justify={{base:'space-around',lg:'flex-start'}}
        flexDir={{base:'row',lg:'column'}}
        id='left-nav'>
        <AvatarName display={{base:'none',lg:'flex'}} avatar={user.image||''} email={user.email||''} name={user.name||''} />
        <Division display={{base:'none',lg:'initial'}}  width='95%' bg='#323232' />
        <SettingsNavOptions  onClick={() =>setSettingOpt('perfil')} icon={AiOutlineHome} active={settingOpt=='perfil'} ml={{base:'0',lg:'2rem'}}>
          Perfil
        </SettingsNavOptions>
        <SettingsNavOptions  onClick={() =>setSettingOpt('social')} icon={IoShareSocialOutline} active={settingOpt=='social'} ml={{base:'0',lg:'2rem'}}>
          Social
        </SettingsNavOptions>
        <Division display={{base:'none',lg:'initial'}}  width='95%' bg='#323232' />
        <SettingsNavOptions onClick={() =>setSettingOpt('seguranca')} icon={MdOutlineSecurity} active={settingOpt=='seguranca'} ml={{base:'0',lg:'2rem'}}>
          Segurança
        </SettingsNavOptions>
      </Flex>
      
      
      <PerfilSec settingOpt={settingOpt} user={user} userSettings={userSettings}/>
      <SocialSec isLoading={isLoading} settingOpt={settingOpt} userSettings={userSettings} user={user} setIsLoading={setIsLoading} />
      <SecuritySec  isLoading={isLoading} settingOpt={settingOpt} userSettings={userSettings} user={user} setIsLoading={setIsLoading} />

              
      {/*<FormControl display={settingOpt=='bloqueados'? 'initial':'none'} as={Flex} flexDir='column' w='90%' ml='40px' maxWidth='690px' id='config-content'>
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
      </FormControl> */}
    </Flex>
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lib/userSettings/getUserSettings`,{
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