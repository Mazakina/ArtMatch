import { Flex, Icon, Text } from "@chakra-ui/react";
import {IoIosArrowForward,} from 'react-icons/io'

export function SettingsNavOptions ({icon, children, active, ...rest}){
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
      borderRadius='5px 0 0 5px'
      {...rest}>
      <Flex m='3px 0'  align="center">
        <Icon fontSize='16px' ml='12px' as={icon}/>
        <Text fontSize='16px' ml='25px'>{children}</Text>  
      </Flex> 
      {active && <Icon mr='15px' as={IoIosArrowForward} /> }
    </Flex>
  )
}