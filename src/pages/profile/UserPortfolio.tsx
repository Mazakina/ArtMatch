import {Image, Box, Flex, Text, Grid, GridItem, AspectRatio, Select } from '@chakra-ui/react'
import { useState } from 'react'
import Link from 'next/link'
import { ProfilePostData } from '../../components/ProfilePostData'


export default function UserPortfolio({name,avatar,albums, posts=[]}){

  const [midiaFilter,setMidiaFilter] = useState('')
  const [albumFilter,setALbumFilter] = useState('')

  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  const filterFunction = (post)=>{
    console.log(post)
    let isMidiaOk = post.midia===midiaFilter || midiaFilter ==''
    let isAlbumOk = post.albumName==albumFilter || albumFilter ==''
    if(isMidiaOk && isAlbumOk){
      return true
    }
    return false
  }
  let newPostsArray = posts.filter(post=>filterFunction(post))

  return(
    <Box w='100%' id='portfolio'>
      <Flex >
        <Text
        mt='25px'
        ml='6vw'
        h='29px'
        >
          Filtre por:
        </Text>
        <Select
          h='29px'
          w='200px'
          m='25px 12px 0 1rem'
          overflow='hidden'
          border='none'
          focusBorderColor="#FFEB80"
          padding='2px'
          bg='#0B0B0B'
          borderRadius='5px'
          color='#BEBEBE'
          placeholder='Midia'
          cursor='pointer'
          onChange={(event)=>{setMidiaFilter(event.target.value)}}
          value={midiaFilter}
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
          placeholder='Albums'
          cursor='pointer'
          onChange={(event)=>{setALbumFilter(event.target.value)}}
          value={albumFilter}
          >
          {albums.map((album)=>{
            return(
              <option key={album.albumRef} value={album.AlbumName}>{album.albumName}</option>
            )
          })}
        </Select>
      </Flex>
      <Box  mt='16px' id='image-container' >
        <Grid  height='95%'   templateColumns={`repeat(${'auto-fit'},240px)`}>
        { newPostsArray.map((post)=>{
            return(
              <GridItem as={Link} href={`/posts/${post.id}`}  mt='.5rem' border='1px solid #0000000' maxWidth={'300px'} key={post.id}   > 
                <Flex  justify='center' position='relative'>
                  <AspectRatio  w={'100%'} h={'100%'} borderRadius='3px' margin='0 !important' display='flex' bg='#969696'  ratio={1} >
                    <Image position='absolute' objectFit='cover' src={post.cropped}/>
                    
                  </AspectRatio>
                  <Flex _hover={{
                    opacity:'1'
                  }} w='100%'h='100%'cursor='pointer' transition={'all 0.3s ease-in-out'} opacity='0' align='flex-end' bottom='0' justify='flex-start' bg='linear-gradient(0deg, #000000 0%, #14141487 25%, rgba(0,0,0,0) 50%)' position='absolute'>
                    <ProfilePostData  post={post} avatar={avatar} name={capitalizeFirstLetter(name)}/>
                  </Flex>
                </Flex>
              </GridItem> 
            )
          })}
        </Grid >
      </Box>
    </Box>
  )
}

