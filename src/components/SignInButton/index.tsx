import { Button, Flex } from "@chakra-ui/react";
import {useSession, signIn, signOut} from 'next-auth/react'


export function SignInButton() {
  const {data} = useSession()
  return(
    <Flex
      alignItems='center'
      padding='5px'
      border='1px
      solid
      #FFEB80'
      borderRadius='3px'
      direction='row'>
      <Button
        bg='tranparent'
        h='21px'
        fontSize='14px'
        pr='22px'
        borderRightWidth='1px'
        borderRadius='0'
        _hover={{
          bg:'transparent',
          color:'#FFEB80',
        }}
        onClick={()=>signIn('facebook')}
        borderRightColor='#BEBEBE'>
        Entrar  
      </Button>
      <Button
        bg='tranparent'
        h='21px'
        fontSize='14px'
        _hover={{
          bg:'transparent',
          color:'#FFEB80'
        }}
        onClick={()=>signOut()}
        color='#dac761'>
          {`${data?.user?.email}`}
        Cadastrar-se
      </Button>
     

    </Flex>
  )
}
