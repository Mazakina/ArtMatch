import { ListIcon, ListItem, UnorderedList, Text, Image, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { BiSearchAlt } from "react-icons/bi";

interface itemProps{
  avatar?:string,
  title?:string,
  id?:string,
  cropped?:string,
  user?:string
}

const  SearchComponent = React.memo<any>( function SearchComp({searchItems=[],isActive=''}) {
  const display = isActive.length>2
  function capitalizeFirstLetter(str) {
   if(str){
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
   }
   return
  }
  console.log(searchItems)
  return(
    <UnorderedList  display={isActive?'initial':'none'} w={'100%'} m='0' boxShadow= '5px 5px 28px 0px rgba(0,0,0,0.75);' bg='#292929' color='white' p='.3rem' borderRadius={'5px'} top='35px' position='absolute'>
    {searchItems[0]?

      searchItems.map((item:itemProps) =>{
        return(
          <ListItem key={item.id||item.user} as={Link} href={`./posts/${item.id||item.user}`} cursor='pointer ' mb='.3rem'  borderBottom='1px solid #c5c5c5'pb={'.3rem'} display={'flex'} alignItems={'center'} fontSize='1rem'>
            <Flex cursor='pointer '  alignItems={'center'}>
              <Image src={item.cropped||item.avatar} m='.2rem .5rem' borderRadius={'50%'} height='2.5rem' width='2.5rem' />
              {capitalizeFirstLetter(item.title) || capitalizeFirstLetter(item.user)}
              <ListIcon ml='auto' as={BiSearchAlt} color='white' />
            </Flex>
          </ListItem>
        )
      }):
      (
      <ListItem cursor="default"  mb='.3rem'  borderBottom='1px solid #c5c5c5'pb={'.3rem'} display={'flex'} alignItems={'center'} fontSize='1rem'>
        <Flex h='2.5rem' color={'#c5c5c5'} alignItems={'center'}>
          <Text>Nenhum resultado encontrado</Text>
        </Flex>
      </ListItem>
      )
    }
    </UnorderedList>  
  )
})

export default SearchComponent;