import {Image, Box, Text ,Flex, Avatar, Link, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import {useSession} from 'next-auth/react'
import { Api } from "../../services/api";
import UserPortfolio from "./UserPortfolio";
import Perfil from "./Perfil";
import {FaBehanceSquare, FaArtstation, FaInstagramSquare } from 'react-icons/fa'
import {FiPhone } from 'react-icons/fi'
import { Tooltip } from '@chakra-ui/react'

export default function Profile({profile,social}){
  let [currentActive,setCurrentActive] = useState('portfolio')
  console.log(profile)
  const {data} = useSession()
  const [posts,setPosts] = useState<any>([])
  const [albums,setAlbums] = useState<any>([])
  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  useEffect(()=>{
      if(data){
        const reqData ={
          user:data.user.email,
          getAlbums:true
        }
        Api.post('/lib/imgur/imgurGetAllFromUser',reqData).then(response => {setPosts(response.data.posts);setAlbums(response.data.albums)})
      }
  },[data])
  return(
    <>
      <Header/>
      <Flex position='relative' flexDir='column' justifyContent='center'  w='100%'>
        <Image zIndex='1'
        objectFit='cover'
        src={profile.banner}
        top='0px' position='absolute' width='100%' height='430px'/>
        <Flex mt='86px' flexDir='column' justifyContent='center' alignItems='center'>
          <Avatar  zIndex='2' width='120px' height='120px'  src={profile.avatar }/>
          <Text textShadow={'-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;'} zIndex='2' color='#ffffff' mt='24px'fontSize='42px' >{capitalizeFirstLetter(profile.usuario)}</Text>
        </Flex>

        <Box mt='40px' zIndex='5' w='100%'>
          <Flex   w='70%' h='240px' bg='#1D1D1D' border='15px solid #181818' margin='0 auto'borderRadius='5'>
            <Text w='100%' m='20px'>{profile.biografia || capitalizeFirstLetter(profile.usuario)+` ainda não nos contou muito sobre ele. ` }
            </Text>
            <Flex>
              <Box w='280px' m='auto  40px'>
                <Flex w='100%' h='110px' m=' 0' borderRadius='5px' bg='#121212' >
                  <Flex justify='space-around' align='center' w='90%' h='70px' m='auto auto' borderTop='1px solid #ECD147' borderBottom='1px solid #ECD147'>
                    <SocialLink icon={FaBehanceSquare} link ={`https://www.behance.net/${social.behance}`} prop={social.behance} color='#053eff '/>
                    <SocialLink icon={FaArtstation} link ={'https://www.artstation.com/'+social.artstation} prop={social.artstation} color='#059BEB '/>
                    <Link cursor={social.instagram?'pointer':'not-allowed'} aria-disabled="true" display='flex' alignItems='center' justifyContent='center' href={social.instagram?'https://www.behance.net/'+social.instagram :''} target=
                    {'_blank'} >
                      <Image overflow={'hidden'} filter={social.instagram?'':'grayscale(100%);'} src='/images/instagram.svg'  h='2rem' w='2rem'  />
                    </Link>
                    <Tooltip  label={social.number}>
                      <Icon cursor={social.number?'pointer':'not-allowed'} target={'_blank'} fontSize='1.5rem' as={FiPhone}/>
                    </Tooltip >
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
        {currentActive=='portfolio'?<UserPortfolio name={profile.usuario} avatar={profile.avatar} albums={albums} posts={posts}/>:
        <Perfil/>
        }
      </Flex>

    </>
  )
}


export async function getServerSideProps(context) {
  var id = context.query
  let response =  await fetch(`${process.env.BASE_URL}/api/lib/userSettings/getUserProfile`,{
      method:'post',
      headers: {
        cookie: context.req.headers.cookie || "",
      },
      body:JSON.stringify({
        user:id
      })
    })
  
  let userProfile= await response.json()
  if (userProfile.data===undefined){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  console.log(userProfile)
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

  return {
    props: {
      profile:profile,
      social:social
    },
  }
}



export function SocialLink ({icon,link,color,prop}){
  const active = !!prop
  return(
    <Link cursor={active?'pointer':'not-allowed'} aria-disabled="true" display='flex' alignItems='center' justifyContent='center' href={
      active?'https://www.behance.net/'+link :''
    
    } target=
    {'_blank'} >
      <Icon  as={icon}  fontSize='1.5rem'  color={active? color:'#7c7c7c'} />
    </Link>
)
}

{/* <Box width={'675px'}  m='70px 0' pb='40px' bg='#121212'>
  <Text  m='10px 30px'fontSize='24px' >Reviews</Text>
  <Box w='100%' margin='0 auto 12px' borderBottom='1px solid #ECD147' />

  <Flex ml='40px'>
    <Avatar  src='https://cdna.artstation.com/p/assets/images/images/054/556/294/4k/juras-rodionovas-juras-rodionovas-the-hunter-close-up.jpg?1664820930' />
    <Flex ml='26px' flexDir="column">
      <Text  fontSize="18px">Jeff Van V</Text>
      <Text mt='8px' fontSize="16px" fontWeight="Bold">Illustração digital</Text>
      <Text mt='8px' fontSize="16px">Juras fez um otimo trabalho, e saiu melhor do que eu havia imaginado,  excedeu minhas expectativas!!</Text>
    </Flex>
  </Flex>
</Box> */}