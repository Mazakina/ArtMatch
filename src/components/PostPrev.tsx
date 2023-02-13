import {Image, GridItem, Flex, AspectRatio } from "@chakra-ui/react";
import Link from "next/link";
import { ProfilePostData } from "./ProfilePostData";

export default function PostPrev ({post,isFlex=false}){
  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return(
    <Flex
      as={Link}
      border='1px solid #0000000'
      href={`/posts/${post.id}`}
      w={'100%'}
      justify='center'
      position='relative'>
      <AspectRatio
        maxW='260px'
        maxH='260px'
        w={isFlex?{base:'33.33%',md:'25%',lg:'20%',xl:'12.5'}:'100%'}
        borderRadius='3px'
        margin='0
        !important'
        display='flex'
        bg='#969696'
        ratio={1}>
        <Flex>
          <Image aria-label={`preview: ${post.title}`} w='100%' h={'100%'} position='absolute' objectFit='cover' src={post.cropped}/>
          <Flex
            _hover={{
            opacity:'1'
            }}
            w='100%'h='100%'cursor='pointer'
            transition={'all 0.3s ease-in-out'}
            opacity='0'
            align='flex-end'
            bottom='0'
            justify='flex-start'
            bg='linear-gradient(0deg, #000000 0%, #14141487 25%, rgba(0,0,0,0) 50%)'
            position='absolute'>
            <ProfilePostData  post={post} avatar={post.avatar} name={capitalizeFirstLetter(post.user)}/>
          </Flex>
        </Flex>
      </AspectRatio>
    </Flex>
  )
}
