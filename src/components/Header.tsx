import {Box, Button, Flex, HStack, Icon, Link, Select, Stack} from '@chakra-ui/react'
import { memo } from 'react'
import {BiSearchAlt} from 'react-icons/bi'
import {BsQuestionOctagon} from 'react-icons/bs'
import { Input } from './Form/Input'
import { SignInButton } from './SignInButton'
import NextLink from 'next/link'
function Header(){
  return( 
    <Flex zIndex={30} w='100%' h='50px' pl='2rem' pr='2rem' bg='#272727' direction='row' justify='space-between' alignItems='center' >
      <NextLink passHref href='/'>
      <Link ><Box color='gray.900'>Logo</Box></Link>
      </NextLink>
      <Flex direction='row' align='center'>
        <Flex 
          align='center'
          h='29px'
          w='500px'
          borderRadius='5px'
          bg='#0B0B0B'
          alignSelf='center'
          color='#BEBEBE'
          position='relative'
          mr='12px'
          as='label'>
          <Input
            h='29px'
            bg='transparent'
            w='500px'
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

        <Select
          h='29px'
          mr='12px'
          overflow='hidden'
          border='none'
          focusBorderColor="#FFEB80"
          padding='2px'
          bg='#0B0B0B'
          borderRadius='5px'
          color='#BEBEBE'
          placeholder='Midia'
          cursor='pointer'
          >
          <option style={{ color: 'black' }} value="pinturaDigital">Pintura digital</option>
          <option style={{ color: 'black' }} value="pinturaTradicional">Pintura tradicional</option>
          <option style={{ color: 'black' }} value="tatuagem">Tatuagem</option>
          <option style={{ color: 'black' }} value="graffite">Graffite</option>
        </Select>
      </Flex>

      <Flex alignItems='center'>
        <SignInButton/>
        <Button
          bg='transparent'
          _hover={{
            bg:'transparent',
            color:'#FFEB80'
          }}
          pl='1rem'>
          <Icon   as={BsQuestionOctagon}/>
        </Button>
      </Flex>
    </Flex>
  )
}

export default memo(Header)