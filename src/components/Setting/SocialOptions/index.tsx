import { Flex, Icon, Input,Text } from "@chakra-ui/react";
import { Dispatch, MutableRefObject, ReactElement } from "react";
import { IconType } from "react-icons/lib";

interface SocialOptionsProps{
  icon:IconType,
  text:string,
  value?:string,
  onChange: Dispatch<any>;
  placeholder:string,
  defaultValue?:string | number,
}

export default function SocialOptions({icon, text, value,placeholder, onChange,defaultValue = ''}:SocialOptionsProps){
  function handleChange(event){
    let regex = /^\S*$/;
    if(regex.test(event.target.value)){
      onChange(event.target.value)
    }
  }
  return(
    <Flex width="100%" align={{base:'flex-start',md:"center"}} justify='center' flexDir={{base:'column',md:'row'}} m='25px 1rem 0 2rem'>
      <Flex align="center"  p='.3rem' borderRadius='5px' mb={{base:'.5rem',md:'none'}}  w='130px' bg={{base:'',md:'#1B1B1B'}}>
        <Icon  as={icon} />
        <Text fontSize="14px" ml='5px'>{text}</Text>
      </Flex>
      <Input
        type={text.toLowerCase()=='telefone'?
        'number':
        'text'}
        onChange={(event)=>{handleChange(event)}}
        placeholder={placeholder}
        fontSize="14px"
        h='28px'
        w={{base:'90%',md:'50%'}}
        ml={{base:'1rem',md:'35px'}}
        borderRadius='2px'
        bg='#0B0B0B'
        border='1px solid #BEBEBE'
        value={value}
        defaultValue={defaultValue} />
    </Flex>
  )
}