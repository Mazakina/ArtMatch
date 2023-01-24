import {Image, GridItem, Flex, AspectRatio } from "@chakra-ui/react";
import Link from "next/link";
import { ProfilePostData } from "./ProfilePostData";

export default function PostPrev ({post}){
  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return(
    <GridItem as={Link} href={`/posts/${post.id}`}  mt='.5rem' border='1px solid #0000000' maxWidth={'300px'} key={post.id}   > 
      <Flex  justify='center' position='relative'>
        <AspectRatio  w={'100%'} h={'100%'} borderRadius='3px' margin='0 !important' display='flex' bg='#969696'  ratio={1} >
          <Image position='absolute' objectFit='cover' src={post.cropped}/>
          
        </AspectRatio>
        <Flex _hover={{
          opacity:'1'
        }} w='100%'h='100%'cursor='pointer' transition={'all 0.3s ease-in-out'} opacity='0' align='flex-end' bottom='0' justify='flex-start' bg='linear-gradient(0deg, #000000 0%, #14141487 25%, rgba(0,0,0,0) 50%)' position='absolute'>
          <ProfilePostData  post={post} avatar={post.avatar} name={capitalizeFirstLetter(post.user)}/>
        </Flex>
      </Flex>
    </GridItem> 
  )
}