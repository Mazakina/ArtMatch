import {Box, Button, Flex, HStack, Icon, Link, ListIcon, ListItem, Select, Stack, UnorderedList} from '@chakra-ui/react'
import { memo, useEffect, useState } from 'react'
import {BiSearchAlt} from 'react-icons/bi'
import {BsQuestionOctagon} from 'react-icons/bs'
import { Input } from '../Form/Input'
import { SignInButton } from '../SignInButton'
import NextLink from 'next/link'
import { searchEngine } from '../../pages/api/lib/sarchEngine'
import { Api } from '../../services/api'
import { SearchComponent } from './SearchComponent'

function Header(){
  const [initalData,setInitialData ]= useState()
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [data,setData] = useState()
  const [searchBy,setSearchBy]=useState('arte')
  const [midiaFilter,setMidiaFilter]=useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      if(searchTerm.length>2){onChangeEvent()}
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])



  useEffect(()=>{    
    Api.get('/lib/imgur/imgurGetAllFeed')
    .then(response=>{
      setInitialData(response.data);
      }
    )
  },[])

  const handleSearch = async () => {
    const result = await searchEngine(initalData, searchTerm,'byPosts');
    setSearchResults(result);
  };
  function onChangeEvent (){
    handleSearch()
  }


  return( 
    <>
    <Flex zIndex={30} position='fixed'  w='100%' h='50px' pl='2rem' pr='2rem' bg='#272727' direction='row' justify='space-between' alignItems='center' >
      <NextLink passHref href='/'>
      <Link ><Box color='gray.900'>Logo</Box></Link>
      </NextLink>
      <Flex direction='row' align='center'>
        <Select
          h='29px'
          mr='12px'
          ml='12px'
          overflow='hidden'
          border='none'
          focusBorderColor="#FFEB80"
          padding='2px'
          bg='#0B0B0B'
          borderRadius='5px'
          color='#BEBEBE'
          placeholder='Procurar por'
          cursor='pointer'
          defaultValue={'arte'}
          onChange={(e)=>{setSearchBy(e.target.value)}}
          >
          <option selected style={{ color: 'black' }}  value="arte">Por Arte</option>
          <option style={{ color: 'black' }} value="artista">Por Artista</option>
        </Select>
        <Flex justify={'center'} position='relative'>          
          <Flex 
            align='center'
            h='29px'
            w='500px'
            borderRadius='5px'
            bg='#0B0B0B'
            alignSelf='center'
            color='#BEBEBE'
            position='relative'
            as='label'>
            <Input
              h='29px'
              bg='transparent'
              w='500px'
              name={'search'}
              onChange={(e)=>{setSearchTerm(e.target.value)}}
              autoComplete="off"
              />
            <Icon
              position='absolute'
              right='2'
              zIndex='2'
              as={BiSearchAlt}
              _hover={{ 
                cursor:'pointer'
              }}
              fontSize='20' />
          </Flex>
          <SearchComponent searchItems={searchResults} isActive={searchTerm} />
        </Flex>
        <Select
          disabled={searchBy=='arte'? false: true}
          h='29px'
          mr='12px'
          ml='12px'
          overflow='hidden'
          border='none'
          focusBorderColor="#FFEB80"
          padding='2px'
          bg='#0B0B0B'
          borderRadius='5px'
          color='#BEBEBE'
          placeholder='Midia'
          cursor='pointer'
          >
          <option style={{ color: 'black' }} value="pinturaDigital">Pintura digital</option>
          <option style={{ color: 'black' }} value="pinturaTradicional">Pintura tradicional</option>
          <option style={{ color: 'black' }} value="tatuagem">Tatuagem</option>
          <option style={{ color: 'black' }} value="graffite">Graffite</option>
        </Select>
      </Flex>

      <Flex alignItems='center'>
        <SignInButton/>
        <Button
          bg='transparent'
          _hover={{
            bg:'transparent',
            color:'#FFEB80'
          }}
          pl='1rem'>
          <Icon   as={BsQuestionOctagon}/>
        </Button>
      </Flex>
    </Flex>
    <Box h='50px' />
    </>
  )
}

export default memo(Header)