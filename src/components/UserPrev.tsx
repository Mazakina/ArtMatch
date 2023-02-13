import {Image, GridItem, Flex, Text , AspectRatio, Avatar } from "@chakra-ui/react";
import Link from "next/link";

interface UserProps{
  user:{
    user:string;
    banner:string;
    avatar:string
  }
}

export default function userPrev ({user}:UserProps){
  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return(
    <Flex   as={Link} href={`/profile/${user.user}`} passHref  mt='.5rem' border='1px solid #0000000' > 
     <Flex
        cursor='pointer'
        borderRadius='5px'
        overflow={'hidden'}
        w={{base:'33.33%',md:'25%',lg:'20%',xl:'12.5'}}
        maxWidth={'260px'}
        justify='center'
        position='relative'>
        <AspectRatio
          w={'100%'}
          h={'100%'}
          borderRadius='3px'
          margin='0
          !important'
          display='flex'
          bg='#969696'
          ratio={1}>
            <Image aria-label={`banner de ${user.user}` } transform='scale(1.01)' position='absolute' objectFit='cover' src={user.banner? user.banner:'images/banner.jpg'}/>
          </AspectRatio>
          <Flex
            w='100%'h='50%'cursor='pointer'
            transition={'all 0.3s ease-in-out'}
            align='center'
            bottom='0'
            justify='center'
            bg='#313131ea'
            borderRadius={'5px 5px 0 0'}
            position='absolute'>
              <Text>
                {capitalizeFirstLetter(user.user)}
              </Text>
          </Flex>
          <Flex w='100%' justify={'center'} align='center' h='100%' position='absolute'>
            <Avatar transition={'all ease-in-out .3s'} _hover={{transform:'scale(1.1)'}} w='4rem' h='4rem'  src={user.avatar} />
          </Flex>
        </Flex>
    </Flex> 
  )
}