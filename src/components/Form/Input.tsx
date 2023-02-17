import {FormControl, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps} from '@chakra-ui/react'

interface InputProps extends ChakraInputProps{
  name:string;
  label?:string;
}


export function Input({name, label, ...rest}:InputProps){
  return(
    <FormControl>
      { !!label && <FormLabel htmlFor={name}></FormLabel>}
      <ChakraInput {...rest}
        name={name}
        type ={name}
        focusBorderColor="cYellow.300"
        border='1px solid #cccccc'
        borderRadius='5px'
        variant ='filled'
        size='lg'
        {...rest}
        _hover={{
          bgColor: 'blackAlpha.700',
          border:'1px solid #dddddd'
        }}
        _focus={{
          bgColor:'blackAlpha.700'
        }}
      />
    </FormControl>
  )
}