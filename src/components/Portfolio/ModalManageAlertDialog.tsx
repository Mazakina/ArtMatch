import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useRef } from 'react'

interface ModalManageAlertDialogProps{
  onDeleteHandle:()=>void;
  isOpenAlert:boolean;
  onCloseAlert:()=>void;
}

export default function ModalManageAlertDialog({onDeleteHandle,isOpenAlert,onCloseAlert}:ModalManageAlertDialogProps){
  const cancelRef = useRef()
  function confirmDelete(){
    onCloseAlert()
    onDeleteHandle()
  }

  return (
      <AlertDialog
        motionPreset='slideInBottom'
        isOpen={isOpenAlert}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            w='fit-content'
            maxW='400px'
            bg={'blackAlpha.900'}
            maxH='80vh'
          >
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Deletar Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza? Não é possivel desfazer a ação.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button 
              _hover={{bg:'#FFE767', color:'black'}}
              color='#ffffff'
              bg='#00000081'
              aria-label='cancelar'
              _focus={{ boxShadow:'0px 0px 10px 2px rgba(255,232,103,    1)'}}
              border='1px solid #FFE767'
              ref={cancelRef} onClick={onCloseAlert}>
                Cancel
              </Button>
              <Button colorScheme='red' aria-label='deletar postagem' onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
  )
}