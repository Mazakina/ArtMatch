import { Box, BoxProps } from "@chakra-ui/react";

interface DivisionProps extends BoxProps {
  width:string,
  bg:string
}

export default function Division({width,bg,...rest}:DivisionProps){
  return(
    <Box margin='1rem auto' width={width} height='1px' bg={bg} {...rest}/>
  )
}