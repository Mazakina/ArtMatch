import {Select, Text, Image, Modal, ModalOverlay, ModalContent, ModalHeader, Flex, Icon, ModalCloseButton, ModalBody, FormControl, Button, VStack, FormLabel, Input, FormErrorMessage, Textarea, Box, useDisclosure, InputGroup, InputLeftElement, InputRightElement, Checkbox, HStack } from "@chakra-ui/react";


export default function ModalTag({isOpen,onClose,skillList=[],habilidades=[],setHabilidades}){
  function handleOnSkillChange(e){
    e.preventDefault();
    if(e.target.checked ===true ){
      setHabilidades([...habilidades,e.target.value])
    }
    if(e.target.checked ===false ){
      const newArray = habilidades.filter(h =>{return(h!==e.target.value)})
      setHabilidades(newArray)
    }
  }

  return(
    <Modal  isOpen={isOpen} onClose={onClose}>
    <ModalOverlay bg='#000000c0' />
    <ModalContent m='auto' borderRadius={'5px'} w='400px !important' height='fit-content' bg='#373737' >
      <ModalHeader borderBottom={'1px solid #6e6e6e '}  width='100%'>
      <Flex justify="space-between" align='center'>
        <Text>Habilidades</Text>
        <ModalCloseButton display='flex' _hover={{ background:'#1f1f1f',border:'1px solid #FFEB80',color:'#FFEB80'}} position='unset' />
      </Flex>
      </ModalHeader>
      <ModalBody pb='1rem' position='relative' width='100%' >
        <VStack as={FormControl} pt='.3rem' gap={'.2rem'} align={'flex-start'}>
          {skillList.map(skill=>{
            return(
              <Checkbox key={skill.id} isChecked={habilidades.includes(skill.id)} value={skill.id} onChange={(e)=>handleOnSkillChange(e)} _checked={{color:'#FFEB80',border:'1px solid #FFEB80'}} _hover={{color:'#FFEB80',border:'1px solid #FFEB80'}} border={'1px solid white'} w='100%' p='.5rem' borderRadius={'5px'} >
                {skill.name}
              </Checkbox>
            )
          })}
          <Button border={'1px solid #FFEB80'} _hover={{color: '#000',background:'#FFEB80'}}color='#FFEB80' bg='none' w='100%' p='.5rem' borderRadius={'3px'}>
            Confirmar
          </Button>
        </VStack>
      </ModalBody>

</ModalContent>
</Modal>
  )
}