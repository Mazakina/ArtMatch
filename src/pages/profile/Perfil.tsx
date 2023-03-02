import { Flex, Text, Box, GridItem, Grid, Icon} from "@chakra-ui/react";
import {TiLocationOutline} from 'react-icons/ti'
import { useQuery } from "react-query";
import Division from "../../components/Division";
import SkillsTagSection from "../../components/Setting/SkillsTagSection";
import { Api } from "../../services/api";

export default function Perfil({habilidades,endereco,createdAt}){

  const {isLoading: queryIsLoading, data} = useQuery('skills', async ()=>{
    const response = await Api.get('/_lib/userSettings/getSkillsOptions');return response},{enabled: !!habilidades}
  )
  let skillList = data?.data
  const memberSince = new Date(createdAt/1000).toLocaleDateString()
  console.log('member:',memberSince)
  console.log(createdAt)
  return(
    <Flex margin='0 auto' maxWidth={'675px'} minWidth={'400px'} w='50vw' flexDir='column' >

      <Box p='1rem' m='40px 0' pb='40px' bg='#121212'>
        <Text mb='8px' ml='2rem' fontSize='24px' >Habilidades</Text>
        <Box w='100%' margin='0 auto 12px' borderBottom='1px solid #323232' />
        <Flex justify={'center'}>
          <SkillsTagSection habilidades={habilidades} skillList={skillList}/>
        </Flex>
      </Box>
      
      <Flex p='1rem' m='1rem 0' pb='40px' bg='#121212' flexDir={'column'}>
        <Text  ml='3rem' fontSize='24px'>Endereço</Text>
        <Division width={'100%'} bg='#323232' />
        <Flex align='center' mb='.5rem' justify='center'  >
          <Text m='0 1rem 0 auto'>{endereco || 'Não registrado'}</Text>  <Icon fontSize={'1.5rem'} mr='auto' color='#FFF' as={TiLocationOutline} />
        </Flex>
      </Flex>
      <Flex m='1rem auto'  flexDir={'row'}>
        <Text mb='8px' textAlign={'center'}  fontSize='24px'>Membro Desde: <br/>{memberSince}</Text>
      </Flex>


    </Flex>
  )
}