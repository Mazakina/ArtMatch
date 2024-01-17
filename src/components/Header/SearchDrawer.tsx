import {
  Button,
  Flex,
  Icon,
  InputGroup,
  InputRightElement,
  Select,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { BiSearchAlt } from 'react-icons/bi'
import { Input } from '../Form/Input'
import SearchComponent from './SearchComponent'

export function SearchDrawer({
  isOpen,
  onClose,
  btnRef,
  setSearchBy,
  searchBy,
  searchTerm,
  setSearchTerm,
  searchResults,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent bg="#272727">
        <DrawerCloseButton />
        <DrawerHeader>Busque</DrawerHeader>

        <DrawerBody>
          <Flex direction="column" align="center">
            <Flex direction="row">
              <Select
                h="29px"
                m=" 0 0 12px 0"
                overflow="hidden"
                border="none"
                focusBorderColor="#FFEB80"
                padding="2px"
                bg="#0B0B0B"
                borderRadius="5px"
                color="#BEBEBE"
                placeholder="Procurar por"
                cursor="pointer"
                defaultValue={'byPosts'}
                onChange={(e) => {
                  setSearchBy(e.target.value)
                }}
              >
                <option style={{ color: 'black' }} value="byPosts">
                  Por Arte
                </option>
                <option style={{ color: 'black' }} value="byUser">
                  Por Artista
                </option>
              </Select>
              <Select
                disabled={searchBy !== 'byPosts'}
                h="29px"
                ml="12px"
                overflow="hidden"
                border="none"
                focusBorderColor="#FFEB80"
                padding="2px"
                bg="#0B0B0B"
                borderRadius="5px"
                color="#BEBEBE"
                placeholder="Midia"
                cursor="pointer"
              >
                <option style={{ color: 'black' }} value="pinturaDigital">
                  Arte digital
                </option>
                <option style={{ color: 'black' }} value="pinturaTradicional">
                  Arte tradicional
                </option>
                <option style={{ color: 'black' }} value="tatuagem">
                  Tatuagem
                </option>
                <option style={{ color: 'black' }} value="graffite">
                  Graffite
                </option>
              </Select>
            </Flex>
            <Flex w="100%" justify={'center'} position="relative">
              <InputGroup
                as={Flex}
                align="center"
                h="29px"
                maxW="500px"
                width={'100%'}
                borderRadius="5px"
                bg="#0B0B0B"
                alignSelf="center"
                color="#BEBEBE"
                // initialFocusRef=""
              >
                <Input
                  h="29px"
                  bg="transparent"
                  name={'search'}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
                  value={searchTerm}
                  autoComplete="off"
                />
                <InputRightElement h="100%">
                  <Icon
                    as={BiSearchAlt}
                    _hover={{ cursor: 'pointer' }}
                    fontSize="20"
                  />
                </InputRightElement>
              </InputGroup>

              <SearchComponent
                searchItems={searchResults}
                isActive={searchTerm}
              />
            </Flex>
          </Flex>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
