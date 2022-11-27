import {Image, Avatar, Box, Flex, Text, Icon, Grid, GridItem, AspectRatio, Select } from '@chakra-ui/react'


export default function Portfolio({grid, b}){
  const i = b
  console.log(i)

  return(
    <Box id='portfolio'>
    <Flex>
      <Select
        h='29px'
        w='200px'
        m='25px 12px 0 6vw'
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
        w='200px'
        m='25px 12px 0 0'
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
    <Box mt='16px' id='image-container' >
      <Grid templateColumns={`repeat(${grid}, 1fr)`} width='100%'>
      { i.map((is)=>{
          return(
            <GridItem key={is}  colSpan={1} display='inline !important' > 
              <AspectRatio borderRadius='3px' margin='0 !important' display='flex' bg='#969696' border='1px solid black' ratio={1} >
                <Box></Box>
              </AspectRatio>
            </GridItem> 
          )
        })}
      </Grid>
    </Box>
  </Box>
  )
}