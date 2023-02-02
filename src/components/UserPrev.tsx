import {Image, GridItem, Flex, Text , AspectRatio, Avatar } from "@chakra-ui/react";
import Link from "next/link";

export default function userPrev ({user}){
  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return(
    <GridItem   as={Link} href={`/profile/${user.user}`}  mt='.5rem' border='1px solid #0000000' maxWidth={'300px'}  > 
        <Flex cursor='pointer' borderBottom={'2px solid #181818ea'} overflow={'hidden'} borderRadius={'5px'} justify='center' position='relative'>
          <AspectRatio  w={'100%'} h={'100%'} borderRadius='3px' margin='0 !important' display='flex' bg='#969696'  ratio={1} >
            <Image  position='absolute' objectFit='cover' src={user.banner? user.banner:'images/banner.jpg'}/>
          </AspectRatio>
          <Flex
            w='100%'h='50%'cursor='pointer'
            transition={'all 0.3s ease-in-out'}
            align='center'
            bottom='0'
            justify='center'
            bg='#181818ea'
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
    </GridItem> 
  )
}