import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Button,
  RadioGroup,
  useDisclosure,
} from '@chakra-ui/react'       
import { Dispatch, SetStateAction, useState } from 'react'
import { Album } from './Album'
import ModalAlbum from './ModalAlbum'
import ModalManageAlertDialog from './ModalManageAlertDialog'

interface AlbumProps{
  albumRef:string,
  albumName:string
}

interface ModalManageProps{
  isOpen: boolean,
  onClose: () => void,
  onAlbumDrop:(event:Event,album:AlbumProps) =>void,
  onDragDrop:()=> Promise<void>,
  setIds:Dispatch<SetStateAction<any>>,
  setCurrentAlbum:Dispatch<SetStateAction<AlbumProps>>,
  albums:Array<AlbumProps>,
  currentAlbum:AlbumProps
}


export default function ModalManage({
  isOpen,onClose,
  onAlbumDrop,
  onDragDrop,
  setIds,
  setCurrentAlbum,
  albums=[]
  ,currentAlbum={albumRef:'',albumName:''}
}:ModalManageProps){
  const {isOpen:isOpenAlert,onClose:onCloseAlert, onOpen:onOpenAlert} = useDisclosure()
  const [value,setValue] = useState(null)
  function onCloseHandler(){
    setCurrentAlbum({albumRef:'',albumName:''});
    setIds({});
    setValue(null)
  }

  function onDeleteHandle(){
    onDragDrop();
    onClose();
  }
  return(
    <>
      <Modal useInert onCloseComplete={onCloseHandler} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          w='fit-content'
          maxW='400px'
          bg={'blackAlpha.800'}
          maxH='80vh'
          >
          <ModalHeader m='0 1rem' p='.5rem'>Gerir/Deletar</ModalHeader>
          <ModalCloseButton />
          <ModalBody borderTop='1px solid #888888'  borderBottom='1px solid #888888'  p='0' w='100%'>
            <Text m='1rem 1rem 0.5rem'  mt='.5rem'>Adicionar ao Album</Text>

            <RadioGroup
              m='0rem 1rem'
              maxH='80%'
              value={value||currentAlbum.albumRef}
              onChange={setValue}
              flexDir={'column'}>
              {albums.map(album =>{
                return (
                  <ModalAlbum key={album.albumRef} album={album} onAlbumDrop={onAlbumDrop} />
                )
              })}
            </RadioGroup >
          </ModalBody>

          <ModalFooter m='0 1rem 2rem' p='0' flexDir={'column'}>
            <Button mt='1rem' onClick={onOpenAlert} border='1px solid #db1919' _hover={{background:'#d84747', color:'black'}} variant='ghost'>Excluir Publicação</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ModalManageAlertDialog onDeleteHandle={onDeleteHandle} isOpenAlert={isOpenAlert} onCloseAlert={onCloseAlert} />
    </>
  )
}