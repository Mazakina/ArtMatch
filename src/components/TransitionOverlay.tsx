import { Spinner, Flex ,Image,   defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { motion } from "framer-motion";

// interface TransitionProps extends 


export default function TransitionOverlay({controls}){
 
  return(
    <motion.div
      style={{opacity:'0',zIndex:0,position:'absolute',
      height:'100vh',width:'0%',background:'#2c2c2c',
      display:'flex',justifyContent:'center',alignItems:'center'}}
      animate={controls}>
        <Flex position='relative'>
          <Image aria-label="logo para transição" w='100px' h='100px' mr='.5rem' src='/images/pixil-gif-drawing.gif'/>
        </Flex>
    </motion.div>
  )
}


