import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
  Link,
  Select,
  Image,
  useDisclosure,
} from '@chakra-ui/react'
import { memo, useEffect, useRef, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { BsQuestionOctagon } from 'react-icons/bs'
import { Input } from '../Form/Input'
import { SignInButton } from '../SignInButton'
import NextLink from 'next/link'
import { searchEngine } from '../../pages/api/_lib/sarchEngine'
import { Api } from '../../services/api'
import SearchComponent from './SearchComponent'
import { SearchDrawer } from './SearchDrawer'

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialData, setInitialData] = useState()
  const [searchResults, setSearchResults] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState('byPosts')
  // const [midiaFilter, setMidiaFilter] = useState('')
  const btnRef = useRef()
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 2) {
        onChangeEvent()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    Api.get('/_lib/imgur/imgurGetAllFeed').then((response) => {
      setInitialData(response.data)
    })
  }, [])

  const handleSearch = async () => {
    const result = await searchEngine(initialData, searchTerm, searchBy)
    setSearchResults(result)
  }
  function onChangeEvent() {
    handleSearch()
  }

  return (
    <>
      <Flex
        role="header"
        zIndex={30}
        position="fixed"
        w="100%"
        h="50px"
        p={{ base: '0 1rem', lg: '0 2rem' }}
        bg="#272727"
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <IconButton
          icon={<Icon fontSize={'1.5rem'} as={BiSearchAlt} />}
          bg="none"
          ref={btnRef}
          justifyContent="center !important"
          alignItems="center !important"
          _hover={{ bg: 'none', border: '1px solid #FFEB80' }}
          display={{ base: 'flex', md: 'none' }}
          border="1px solid #323232"
          borderRadius={'5px'}
          onClick={onOpen}
          aria-label="menu"
        />

        <NextLink id="logo" passHref href="/">
          <Link>
            <Flex
              fontFamily={'Plaster'}
              fontSize="1rem"
              align={'center'}
              color="#FFEB80"
            >
              <Image
                aria-label="icone da Logo"
                w="2.3rem"
                h="2.3rem"
                mr=".5rem"
                src="/images/pixil-gif-drawing.gif"
              />
              Ink Trail
            </Flex>
          </Link>
        </NextLink>
        <Flex
          display={{ base: 'none', md: 'flex' }}
          direction="row"
          align="center"
        >
          <Select
            h="29px"
            m=" 0 12px"
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
          <Flex justify={'center'} position="relative">
            <InputGroup
              as={Flex}
              align="center"
              h="29px"
              maxW="500px"
              width={{ base: '30vw', lg: '40vw' }}
              borderRadius="5px"
              bg="#0B0B0B"
              alignSelf="center"
              color="#BEBEBE"
            >
              <Input
                h="29px"
                bg="transparent"
                name={'search'}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                }}
                placeholder={'Buscar'}
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
              setSearchTerm={setSearchTerm}
            />
          </Flex>
          <Select
            disabled={searchBy !== 'byPosts'}
            h="29px"
            mr="12px"
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
              Pintura digital
            </option>
            <option style={{ color: 'black' }} value="pinturaTradicional">
              Pintura tradicional
            </option>
            <option style={{ color: 'black' }} value="tatuagem">
              Tatuagem
            </option>
            <option style={{ color: 'black' }} value="graffite">
              Graffite
            </option>
          </Select>
        </Flex>

        <Flex alignItems="center">
          <SignInButton />
          <Button
            aria-label="Video informativo"
            display={{ base: 'none', md: 'initial' }}
            bg="transparent"
            _hover={{
              bg: 'transparent',
              color: '#FFEB80',
            }}
            pl="1rem"
          >
            <Icon as={BsQuestionOctagon} />
          </Button>
        </Flex>
      </Flex>
      <Box h="50px" />
      <SearchDrawer
        isOpen={isOpen}
        onClose={onClose}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        searchResults={searchResults}
        btnRef={btnRef}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
      />
    </>
  )
}

export default memo(Header)
