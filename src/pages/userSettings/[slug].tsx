import { Flex } from "@chakra-ui/react";
import { AiOutlineHome } from "react-icons/Ai";
import {IoShareSocialOutline} from 'react-icons/io5'
import {MdOutlineSecurity} from 'react-icons/Md'
import {BiBlock} from 'react-icons/bi'
import { AvatarName } from "../../components/AvatarName";
import Division from "../../components/Division";
import Header from "../../components/Header";
import { SettingsNavOptions } from "../../components/SettingsNavOption";

export default function user(){
  return(
    <>
      <Header/>
      <Flex mt='60px' justify="center">
        <Flex borderRadius='2px' maxWidth='290px' border='1px solid #959595' p='1rem 0' w='100%' flexDir='column' id='left-nav'>
          <AvatarName />
          <Division width='95%' bg='#323232' />
          <SettingsNavOptions icon={AiOutlineHome} active={true} ml='2rem'>
            Perfil
          </SettingsNavOptions>
          <SettingsNavOptions icon={IoShareSocialOutline} active={false} ml='2rem'>
            Social
          </SettingsNavOptions>
          <Division width='95%' bg='#323232' />
          <SettingsNavOptions icon={MdOutlineSecurity} active={false} ml='2rem'>
            Segurança
          </SettingsNavOptions>
          <SettingsNavOptions icon={BiBlock} active={false} ml='2rem'>
            Bloqueados
          </SettingsNavOptions>

        </Flex>
        <Flex w='60%' maxWidth='690px' id='config-content'>

        </Flex>
      </Flex>
    </>
  )
}