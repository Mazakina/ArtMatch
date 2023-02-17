import { Avatar,Image, Button, Checkbox, Flex, FormControl, Icon, Input, Text, Textarea } from "@chakra-ui/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Api } from "../../../services/api";
import Division from "../../Division";

interface SecuritySec{
  settingOpt:string,
  userSettings:{
    data:{
      seguranca:{
        email:{
          email:string
        }
        nsfwAllow:boolean,
        allowToBeFound:boolean
      }
    }
  }
  user:{
    email:string,
  },
  isLoading:boolean,
  setIsLoading:Dispatch<SetStateAction<boolean>>
}
export default function SecuritySec({settingOpt,userSettings,user,isLoading,setIsLoading}:SecuritySec){
  const [email,setEmail] = useState( userSettings.data.seguranca?.email.email)
  const [nsfwAllow,setNsfwAllow] = useState( userSettings.data.seguranca?.nsfwAllow)
  const [allowToBeFound,setAllowToBeFound] = useState( userSettings.data.seguranca?.allowToBeFound)

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
    <FormControl
      display={settingOpt=='seguranca'?
      'initial':'none'}
      as={Flex}
      flexDir='column'
      w={{base:'90%',lg:'60%'}}
      m={{base:'0 auto',lg:' 0 0 0 40px'}}
      maxWidth='690px'
      id='config-content'>
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
          <Input
            disabled={true}
            onChange={(e)=>{setEmail((e.target.value))}}
            border={`1px
            solid
            white
            !important`}
            value={email}
            fontSize='14px'
            w='70%'
            type='email'
            h='28px'
            borderRadius='2px'
            maxWidth='490px' />
        </Flex>

        <Division width='100%' bg='cGray.900'/>
        <Checkbox
          fontSize='14px'
          onChange={(e)=>{setNsfwAllow(e.target.checked)}}
          aria-label='mostrar conteudo adulto'
          isChecked={nsfwAllow}>
          Mostrar conteúdo adulto
        </Checkbox>
        <Checkbox
          fontSize='14px'
          aria-label='permitir ser encontrado na secção de busca '
          onChange={(e)=>{setAllowToBeFound(e.target.checked)}}
          isChecked={allowToBeFound}
          mt='10px'>
          Permitir ser visto na secção de busca
        </Checkbox>

        <Division width='100%' bg='cGray.900'/>
        <Button 
          bg='none'
          w='140px'
          border='1px solid cYellow.300'
          color='cYellow.300'
          borderRadius='2px'
          _hover={{
            bg:'none',
          }}
          ml='auto' 
          aria-label='salvar configurações'
          isLoading={isLoading} 
          onClick={(event)=>{saveSettingsSeguranca(event)}}
          >Salvar</Button>
      </Flex>

      <Flex
          bg='#121212'
          mt='1rem'
          p='1rem 5%'
          aria-disabled='true'
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
          border='1px solid cYellow.300'
          color='cYellow.300'
          borderRadius='2px'
          _hover={{
            bg:'none',
          }}
          ml='auto'
          isDisabled
          aria-disabled='true'
          onClick={(event)=>{saveSettingsSeguranca(event)}}
          isLoading={isLoading} 
          >Salvar</Button>
      </Flex>
    </FormControl>
  )
}