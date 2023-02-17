import {Image, Box, Text ,Flex, Avatar, Link, Icon, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {useSession} from 'next-auth/react'
import { Api } from "../../services/api";
import UserPortfolio from "./UserPortfolio";
import Perfil from "./Perfil";
import {FaBehanceSquare, FaArtstation } from 'react-icons/fa'
import {FiPhone } from 'react-icons/fi'
import { Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Profile({profile,social,createdAt}){
  let [currentActive,setCurrentActive] = useState('portfolio')
  const {data} = useSession()
  const router = useRouter()
  const {slug} = router.query
  const [posts,setPosts] = useState<any>([])
  const [albums,setAlbums] = useState<any>([])
  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  useEffect(()=>{
      if(data){
        const reqData ={
          user:slug,
          getAlbums:true
        }
        Api.post('/lib/imgur/imgurGetAllFromUser',reqData).then(response => {setPosts(response.data.posts);setAlbums(response.data.albums)})
      }
  },[data])
  return(
    <>
      <Flex position='relative' flexDir='column' justifyContent='center'  w='100%'>
        <Image zIndex='1'
          objectFit='cover'
          src={profile.banner==''?'https://i.imgur.com/Wwn5QKf.jpg':profile.banner}
          filter={profile.banner? "":'brightness(.4)'}
          aria-label='Banner'
          top='0px' 
          position='absolute' 
          width='100%' 
          height={{base:'330px',lg:'430px'}}/>
        <Flex mt='86px' flexDir='column' justifyContent='center' alignItems='center'>
          <Avatar  zIndex='2' width='120px' height='120px'  src={profile.avatar }/>
          <Text textShadow={'-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;'} zIndex='2' color='#ffffff' mt='24px'fontSize='42px' >{capitalizeFirstLetter(profile.usuario)}</Text>
        </Flex>

        <Box mt={{base:'0',lg:"40px"}} zIndex='5' w='100%'>
          <Flex flexDir={{base:'column',lg:'row'}}  w='70%' minH='240px' h='fit-content' maxH='300px' bg='#1D1D1D' border='15px solid #181818' margin='0 auto'borderRadius='5'>
            <Text  m='20px auto auto'>{profile.biografia || capitalizeFirstLetter(profile.usuario)+` ainda não nos contou muito sobre ele. ` }
            </Text>
            <Flex w={{base:'100%',lg:'fit-content'}}>
              <Box w={{base:'100%',lg:'80px'}} h='100%'  m={{base:'auto 0',lg:'auto  1rem auto 40px'}}>
                <Flex w='100%' h={{base:'70px',lg:'100%'}} m=' 0' borderRadius='5px' bg='#121212' >
                  <Flex
                    justify='space-around'
                    align='center'
                    flexDir={{base:'row',lg:'column'}}
                    w={{base:'90%',lg:'70px'}}
                    h={{base:'50px',lg:'90%'}}
                    m='auto auto'
                    borderTop={{base:'1px solid #ECD147',lg:'none'}}
                    borderBottom={{base:'1px solid #ECD147',lg:'none'}}
                    borderLeft={{base:'none',lg:'1px solid #ECD147'}}
                    borderRight={{base:'none',lg:'1px solid #ECD147'}}>
                    <SocialLink
                      icon={FaBehanceSquare}
                      link ={`https://www.behance.net/${social.behance}`}
                      prop = {social.behance}
                      color='#053eff
                      ' />
                    <SocialLink
                      icon={FaArtstation}
                      link
                      ={'https://www.artstation.com/'+social.artstation}
                      prop={social.artstation}
                      color='#059BEB
                      ' />
                    <Link
                      cursor={social.instagram?'pointer':'not-allowed'}
                      aria-disabled="true"
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      href={social.instagram?'https://www.instagram.com/'+social.instagram:''}
                      target={'_blank'}>
                      <Image overflow={'hidden'} filter={social.instagram?'':'grayscale(100%);'} src='/images/instagram.svg'  h='2rem' w='2rem'  />
                    </Link>
                    <Flex>
                    <Tooltip placement='top' label={social.number||'não adicionado'}>
                      <Button bg='none' w='1rem' _hover={{bg:'none'}}>
                        <Icon  fontSize='1.5rem' as={FiPhone}/>
                      </Button>
                    </Tooltip >
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Box>
       
      </Flex>

      <Flex align="center" margin='0 auto 2rem' flexDir='column' >
        <Flex margin='15px auto' color='white'>
          <Link _hover={{}} onClick={()=>{setCurrentActive('portfolio')}}  position="relative" pb='5px' _after={(currentActive=='portfolio')?
            {
              transition:'all ease-in-out .3s',
              content:'""',
              position:'absolute',
              bottom:0,
              left:0,
              width:'100%',
              height:'1px',
              background:' #FFE767'
            }:{
              transition:'all ease-in-out .3s',
              content:'""',
              position:'absolute',
              bottom:0,
              left:0,
              width:'0%',
              height:'1px',
              background:' #FFE767'
            }
          } fontSize='18px' margin='0 1rem'>Portfolio</Link>
          <Link _hover={{}} position="relative" onClick={()=>{setCurrentActive('perfil')}} fontSize='18px' margin='0 1rem'  _after={(currentActive=='perfil')?
            {
              transition:'all ease-in-out .3s',
              content:'""',
              position:'absolute',
              bottom:0,
              left:0,
              width:'100%',
              height:'1px',
              background:' #FFE767'
            }:{
              transition:'all ease-in-out .3s',
              content:'""',
              position:'absolute',
              bottom:0,
              left:0,
              width:'0%',
              height:'1px',
              background:' #FFE767'
            }
          }
            >Perfil</Link>
        </Flex>
      </Flex>
      <Flex align="flex-start" margin='0 auto 100px' flexDir='column' >
        <Box w='90%' margin='0 auto' borderBottom='1px solid #959595' />
        {currentActive=='portfolio'?
          <UserPortfolio name={profile.usuario} avatar={profile.avatar} albums={albums} posts={posts}/>:
          <Perfil createdAt={createdAt} habilidades = {profile.habilidades} endereco={profile.endereco}/>
        }
      </Flex>
    </>
  )
}


export async function getServerSideProps(context) {
  var id = context.query
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lib/userSettings/getUserProfile`,{
    method:'post',
    headers: {
      cookie: context.req.headers.cookie || "",
      Accept: 'application/json, text/plain, */*',
    },
    body:JSON.stringify({
      user:id
    })
  })
  if(response.status === 404){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const userProfile = await response.json()

  if(userProfile.data.seguranca.allowToBeFound==false){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let profile = userProfile.data.profile 
  let social = userProfile.data.social 
  let createdAt = userProfile.ts
  return {
    props: {
      profile:profile,
      social:social,
      createdAt:createdAt
    },
  }
}



export function SocialLink ({icon,link,color,prop}){
  const active = !!prop
  return(
    <Link 
      cursor={active?'pointer':'not-allowed'} 
      aria-disabled="true" 
      display='flex' 
      alignItems='center' 
      justifyContent='center' 
      href={active? link :''} 
      target={'_blank'} 
      isExternal
      >
      <Icon  as={icon}  fontSize='1.5rem'  color={active? color:'#7c7c7c'} />
    </Link>
  )
}
