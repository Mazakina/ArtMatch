import { ListIcon, ListItem, UnorderedList, Text, Image, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { BiSearchAlt } from "react-icons/bi";

interface itemProps{
  avatar:string,
  title:string,
  id:string,
}

const  SearchComponent = React.memo<any>( function SearchComp({searchItems=[],isActive=''}) {
  const display = isActive.length>2
  return(
    <UnorderedList display={isActive?'initial':'none'} w={'100%'} m='0' boxShadow= '5px 5px 28px 0px rgba(0,0,0,0.75);' bg='#292929' color='white' p='.3rem' borderRadius={'5px'} top='35px' position='absolute'>
    {searchItems?
      searchItems.map((item:itemProps) =>{
        return(
          <ListItem key={item.id} as={Link} href={`./posts/${item.id}`} cursor='pointer !important' mb='.3rem'  borderBottom='1px solid #c5c5c5'pb={'.3rem'} display={'flex'} alignItems={'center'} fontSize='1rem'>
            <Flex alignItems={'center'}>
              <Image src={item.avatar} m='.2rem .5rem' borderRadius={'50%'} height='2.5rem' width='2.5rem' />
              {item.title}
              <ListIcon ml='auto' as={BiSearchAlt} color='white' />
            </Flex>
          </ListItem>
        )
      }):''
    }
    </UnorderedList>  
  )
})

export default SearchComponent;