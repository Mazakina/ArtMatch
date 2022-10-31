import {cloneElement, ReactElement, } from 'react'
import {Box, Text, BoxProps} from '@chakra-ui/react'


interface ActiveLinkProps extends BoxProps{
  children:ReactElement|string,
  currentActive:string,
  id:string,
  setCurrentActive:(id:string)=>void,
}

export function ActiveLink({children,id,currentActive,setCurrentActive,...rest}:ActiveLinkProps){
  let isActive = false;

  if(id==currentActive){
    isActive = true;
  }else{
    isActive = false;
  }


  return(
    <Box onClick={()=>{setCurrentActive(id)}} {...rest}>
      <Text
        _hover={{ 
          color: '#fff'
        }}
        cursor='pointer'
        fontSize='24px'
        marginTop='15px'
        paddingBottom='11px'
        marginRight='24px' 
        color={isActive? '#fff' : '#969696'}
        borderBottom= {isActive? '2px solid #FFE767' : '2px solid transparent' }
        >
        {children}
      </Text>  
    </Box>
  ) 
}