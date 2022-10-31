import { Flex, Text, Box, GridItem, Grid, Icon} from "@chakra-ui/react";
import {AiFillStar, AiOutlineStar} from 'react-icons/Ai'

export default function Perfil(){
  return(
    <Flex margin='0 auto' maxWidth={'675px'} flexDir='column' >
    <Flex mt='75px' flexDir='column'>
      <Text fontSize='24px'>
        Resumo
      </Text >
      <Text fontSize='18px' mt='20px'>
        LA based freelance visual development artist and art director.
      </Text>
    </Flex>
    <Box p='20px' m='40px 0' pb='40px' bg='#121212'>
      <Text mb='8px' fontSize='24px' >Habilidades</Text>
      <Box w='100%' margin='0 auto 12px' borderBottom='1px solid #959595' />
    </Box>
    <Grid  templateAreas={`"projetos membro"
                        "avaliacoes membro"
    `} templateColumns='1fr 1fr' templateRows='1fr 1fr' >
      <GridItem area={'projetos'}>
       52 Projetos Finalizados
      </GridItem>
      <GridItem area='avaliacoes'>
        <Flex align='center'>
          <Text mr='26px'>32 Avaliações</Text>  <Icon color='#FCD635' as={AiFillStar} /><Icon color='#FCD635' as={AiFillStar} /><Icon color='#FCD635' as={AiFillStar} /><Icon color='#FCD635' as={AiFillStar} /> <AiOutlineStar/>
            
        </Flex>
      </GridItem>
      <GridItem area='membro'>
      <Text margin='0 0 0 50px'>Membro desde:<br/>
      02/12/2023</Text>
      </GridItem>
    </Grid>
  </Flex>
  )
}