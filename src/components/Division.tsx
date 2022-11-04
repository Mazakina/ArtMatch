import { Box } from "@chakra-ui/react";

interface DivisionProps{
  width:string,
  bg:string
}

export default function Division({width,bg}:DivisionProps){
  return(
    <Box margin='1rem auto' width={width} height='1px' bg={bg}/>
  )
}