import {cloneElement, ReactElement, } from 'react'
import {Box, Text} from '@chakra-ui/react'
interface ActiveLinkProps{
  children:ReactElement,
  currentActive:string,
  id:string,
  onClick:()=>void,
}

export function ActiveLink({children,id,currentActive,onClick,...rest}:ActiveLinkProps){
  let isActive = false;

  if(id==currentActive){
    isActive = true;
  }else{
    isActive = false;
  }

  return(
    <Box onClick={onClick} {...rest}>
      {cloneElement(children,{
        color: isActive? '#fff' : '#969696'
      })}
    </Box>
  ) 
}