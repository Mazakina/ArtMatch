import { Avatar, Box, Button, Checkbox, Flex, Icon, Input, Text, Textarea } from "@chakra-ui/react";
import { AiOutlineHome, AiOutlineInstagram } from "react-icons/ai";
import {IoShareSocialOutline} from 'react-icons/io5'
import {MdOutlineSecurity} from 'react-icons/md'
import {BiBlock, BiSearchAlt, BiTrash} from 'react-icons/bi'
import { AvatarName } from "../../components/AvatarName";
import Division from "../../components/Division";
import Header from "../../components/Header";
import { SettingsNavOptions } from "../../components/Setting/SettingsNavOption";
import SocialOptions from "../../components/Setting/SocialOptions";

export default function User(){
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

        
        {/* <Flex flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
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
              <Input h='28px' borderRadius='2px'  maxWidth='490px'></Input>
            </Flex>
            <Flex mt='1rem' align=''>
              <Text w='20%' maxWidth='130px'>Biografia</Text>
              <Textarea h='28px' borderRadius='2px'  maxWidth='490px'></Textarea>
            </Flex>
            <Flex  mt='1rem' w='100%' align='center'>
              <Flex w='80%' justify='center' flexDir='column'>
                <Flex align='center'>
                  <Text width='130px'>Cidade</Text>
                  <Input h='28px' borderRadius='2px'  maxWidth='340px'></Input>
                </Flex>
                <Flex maxWidth='480px' w='100%'  mt='1rem' align='center'>
                  <Text  width='130px'>Endereço</Text>
                  <Input maxHeight='28px' borderRadius='2px'  maxWidth='250px'></Input>
                  <Text ml='1rem' >Nº</Text>
                  <Input ml='8px' h='28px'  borderRadius='2px'  maxWidth='46px'/>
                </Flex>
              </Flex>
              <Avatar mr='2rem !important' h='70px' width='70px' src='' />
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
        </Flex> */}

        {/* <Flex  flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
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
              <SocialOptions icon={AiOutlineInstagram} text='instagram' value='n' />
              <SocialOptions icon={AiOutlineInstagram} text='Artstation' value='n' />
              <SocialOptions icon={AiOutlineInstagram} text='BeHance' value='n' />
              <SocialOptions icon={AiOutlineInstagram} text='Telefone' value='n' />
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
        </Flex> */}

        {/* <Flex  flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
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
              <Input  fontSize='14px' w='70%' type='email' h='28px' borderRadius='2px'  maxWidth='490px'/>
            </Flex>

            <Division width='100%' bg='#323232'/>
            <Checkbox  fontSize='14px' >Mostrar conteúdo adulto</Checkbox>
            <Checkbox  fontSize='14px' mt='10px'>Permitir ser visto na secção de busca</Checkbox>

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
              <Input  fontSize='14px' w='70%' type='password' h='28px' borderRadius='2px'  maxWidth='490px'/>
            </Flex>
            <Flex  mt='21px' w='100% !important'  align='center'>
              <Text  fontSize='14px' w='20%' maxWidth='130px'>Nova senha</Text>
              <Input  fontSize='14px' w='70%' type='password' h='28px' borderRadius='2px'  maxWidth='490px'/>
            </Flex>
            <Flex  mt='21px' w='100% !important'  align='center'>
              <Text fontSize='14px' w='20%' maxWidth='130px'>Confirmar nova senha</Text>
              <Input  fontSize='14px' w='70%' type='password' h='28px' borderRadius='2px'  maxWidth='490px'/>
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
        </Flex> */}

        <Flex flexDir='column' w='60%' ml='40px' maxWidth='690px' id='config-content'>
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
                w='400px'
                borderRadius='2px'
                bg='#0B0B0B'
                color='#BEBEBE'
                position='relative'
                mr='12px'
                as='label'>
                <Input
                  h='29px'
                  bg='transparent'
                  w='400px'
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
              <Button 
                bg='none'
                w='140px'
                h='29px'
                mr='auto'
                border='1px solid #ffeb80'
                color='#ffeb80'
                borderRadius='2px'
                _hover={{
                  bg:'none',
                }}
                >Bloquear
              </Button>
            </Flex>
          <Division width='100%' bg='#323232'/>
{/* fazer Map dos usuarios bloqueados */}
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
        </Flex>
      </Flex>
    </>
  )
}