import {Box, Button, Flex, HStack, Icon, Select, Stack} from '@chakra-ui/react'
import {BiSearchAlt} from 'react-icons/bi'
import {BsQuestionOctagon} from 'react-icons/bs'
import { Input } from './Form/Input'

export default function Header(){
  return( 
    <Flex w='100%' h='50px' pl='2rem' pr='2rem' bg='#2C2B2B' direction='row' justify='space-between' alignItems='center' >
      <Box color='gray.900'>Logo</Box>

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
        <Select
          h='29px'
          overflow='hidden'
          padding='2px'
          bg='#0B0B0B'
          border='none'
          focusBorderColor="#FFEB80"
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
            color='#dac761'>
            Cadastrar-se
          </Button>
        </Flex>
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