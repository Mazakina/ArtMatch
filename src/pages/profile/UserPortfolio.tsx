import {Image, Box, Flex, Text, Grid, GridItem, AspectRatio, Select } from '@chakra-ui/react'
import { useState } from 'react'
import Link from 'next/link'
import { ProfilePostData } from '../../components/ProfilePostData'
import PostPrev from '../../components/PostPrev'


export default function UserPortfolio({name,avatar,albums, posts=[]}){

  const [midiaFilter,setMidiaFilter] = useState('')
  const [albumFilter,setALbumFilter] = useState('')


  
  const filterFunction = (post)=>{
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
          {albums? albums.map((album)=>{
            return(
              <option key={album.albumRef} value={album.AlbumName}>{album.albumName}</option>
            )
          }):''}
        </Select>
      </Flex>
      <Box m='16px auto'  id='image-container' >
        <Flex  flexWrap={'wrap'} w='100%'>
          {newPostsArray && newPostsArray.map((post)=>{
            return(
              <PostPrev post={post} isFlex={true} key={post.id} />
            )
          })}
        </Flex >
      </Box>
    </Box>
  )
}
// aria-label={`post: ${post.title}`}
