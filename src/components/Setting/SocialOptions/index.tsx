import { Flex, Icon, Input,Text } from "@chakra-ui/react";

interface SocialOptionsProps{
  icon:JSX.Element,
  text:string,
  value?:string,
  onChange: ()=>void;
  placeholder:string,
}

export default function SocialOptions<SocialOptionsProps>({icon, text, value,placeholder, onChange}){
   const getValue = (changeEvent)=>{onChange(changeEvent.target.value)} 
  return(
    <Flex width="100%" align="center" justify='center'  mt='25px'>
      <Flex align="center" p='.3rem' borderRadius='5px'  w='130px' bg='#1B1B1B'>
        <Icon  as={icon} />
        <Text fontSize="14px" ml='5px'>{text}</Text>
      </Flex>
      <Input type={text.toLowerCase()=='telefone'? 'number': 'text'} onChange={(event)=>{getValue(event)}} placeholder={placeholder} fontSize="14px" h='28px' w='50%' ml='35px' borderRadius='2px' bg='#0B0B0B' border='1px solid #BEBEBE' value={value} />
    </Flex>
  )
}