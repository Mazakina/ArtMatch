import { Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import {IoIosArrowForward,} from 'react-icons/io'
import { IconType } from "react-icons/lib";

interface SettingsNavOptionsProps extends FlexProps{
  icon: string|IconType;
  children:ReactNode;
  active:boolean
}

export function SettingsNavOptions ({icon, children, active, ...rest}:SettingsNavOptionsProps){
  return(
    <Flex
      mt='6px'
      mb='6px'
      cursor='pointer'
      bg={active?
      '#20343D'
      :''
      }
      justify="space-between"
      align="center"
      borderRadius={{base:'5px',lg:'5px 0 0 5px'}}
      border={{base:'1px solid white',lg:'none'}}
      minW={{base:'20%',lg:'fit-content',}}
      {...rest}>
      <Flex  m={{base:'3px auto',lg:'3px 0'}}  align="center">
        <Icon display={{base:'none',lg:'initial',}} fontSize='16px' ml='12px' as={icon}/>
        <Text fontSize='16px' ml={{base:'5px',md:'25px'}} mr={{base:'5px',md:'25px'}}>{children}</Text>  
      </Flex> 
      {active && <Icon mr='15px' as={IoIosArrowForward} /> }
    </Flex>
  )
}