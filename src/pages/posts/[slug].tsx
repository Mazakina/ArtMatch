import {Image, Avatar, Box, Flex, Text, Icon, Grid, GridItem, AspectRatio, Tooltip, Button,Link as ChakraLink } from '@chakra-ui/react'
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai'
import {BsBookmarkHeartFill, BsBookmarkPlus} from 'react-icons/bs'
import Header from "../../components/Header"
import { useContext, useEffect, useState } from 'react'
import { Api } from '../../services/api'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { UserContext } from '../../services/hooks/UserContext'
import { MdOutlineAddBox } from 'react-icons/md'

interface PostDataProps{
URL: string,
deleteHash:string,
description: string,
id: string,
midia: string,
otherPosts: Array<any>,
posted: boolean,
tags: Array<string>,
timeStamp: number,
title: string,
likes:Array<string>,
user: {
  name:string,
  avatar:string,
  banner:string,
  ref:object
},
vote: null|number
}
interface PostsProps{
  postData:PostDataProps,
  slug:string
}

export default function Posts({postData,slug}:PostsProps){
  const [currentPost,setCurrentPost] = useState<PostDataProps>(postData)
  const [favoritedPost,setFavoritedPost] = useState(false)
  const [favoritedUser,setFavoriteduser] = useState(false)
  const [liked,setLiked] = useState([])
  const useUser = useContext(UserContext)
  const userRefId = Object.values(currentPost.user.ref)[0].id
  const {user,favoritePosts,setFavoritePosts,favoriteUsers,setFavoriteUsers} = useUser 

  useEffect(()=>{
    if(user){
      setLiked(
        currentPost.likes.filter((like)=>like.toString()==user.ref.toString())
      )
    }
  },[user,currentPost.likes])

  useEffect(()=>{
      if(user){
      setFavoriteduser(favoriteUsers.includes(userRefId))
    }
  },[user,currentPost.id,favoriteUsers])
  
  useEffect(()=>{
    setCurrentPost(postData)
  },[postData])

  useEffect(()=>{
      setFavoritedPost(favoritePosts.includes(slug))
  },[favoritePosts,currentPost.id,user])

  const handleLikeButton = (e)=>{
    e.preventDefault();
    if(!user){
      return
    }
    if(!liked[0]){
      likeFunctions.like(user,slug,postData.user.name)
      setCurrentPost({...currentPost,likes:[...currentPost.likes,user.ref]})
    }
    if(liked[0]){
      likeFunctions.dislike(user,slug,postData.user.name)
      const filteredLikes = currentPost.likes.filter(f=> f.toString() !=user.ref.toString())
      setCurrentPost({...currentPost,likes:[...filteredLikes]})
    }
  }
  const handleFavoritePostButton= (e)=>{
    e.preventDefault();
    if(!useUser){
      return
    }
    if(!favoritedPost){
      favPostFunctions.push(user,postData.id)
      setFavoritePosts([...favoritePosts,postData.id])
    }
    if(favoritedPost){
      favPostFunctions.delete(user,postData.id)
      const filteredFavorites = favoritePosts.filter(f=> f!=postData.id)
      setFavoritePosts(filteredFavorites)
    }
  }

  const handleFavoriteUserButton = (e:React.MouseEvent<HTMLElement>)=>{
    e.preventDefault();
    if(!useUser){
      return
    }
    if(!favoritedUser){
      favUserFunctions.push(user,postData.user.name)
      setFavoriteUsers([...favoriteUsers,userRefId])
    }
    if(favoritedUser){
      favUserFunctions.delete(user,postData.user.name)
      const filteredFavorites = favoriteUsers.filter(f=> f!=userRefId)
      setFavoriteUsers(filteredFavorites)
    }
  }

  function capitalizeFirstLetter(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }


  return(
    <Box>
      <Flex w='100vw' flexDir={{base:'column',lg:'row'}} p='50px 0 0' margin='-50px 0 0' h='100vh'>
        <Flex align='center' justify='center' p='1rem' id='post-image' h='calc(100vh-50px)' bg='#0a0a0a' width='100%' >
          <Image alt=''  maxH='94%' src={currentPost?.URL} />
        </Flex>

        <Flex pl='18px' pr='18px' paddingTop={'1rem '} id='details-section' flexDir='column' bg='#272727' width={{base:'100vw',lg:'450px'}}>
          <ChakraLink
            as={Link}
            href={process.env.NEXT_PUBLIC_BASE_URL+'/profile/'+currentPost.user.name}
            mt='18px'
            height='50px'
            w='100%'
            justifyContent='space-between'
            alignItems='center'>
            <Flex mr='1rem' cursor={'pointer'}  align='center'>
              <Avatar mr='12px' width='44px' height='44px' src={currentPost.user.avatar}/>
              <Box>
                <Text fontSize='20px' color='#fff'> {capitalizeFirstLetter(currentPost.user.name)} </Text>
              </Box>
              <Button 
                onClick={(e)=>{handleFavoriteUserButton(e)}}
                fontSize='12px'
                ml='auto'
                mt='auto'
                aria-active={favoritedUser?'true':'false'}
                aria-label='adicionar/remover artista aos favoritos'
                borderRadius={'3px'}
                mb='4px'
                h='1.5rem'
                p='0.3rem !important'
                _hover={{
                  background:'none',
                  color: '#FFEB80',
                  border:'1px solid #FFEB80'
                }}
                bg={favoritedUser?'none':'#FFEB80'}
                color={favoritedUser?'#FFEB80':'black'}
                border={'1px solid #FFEB80'}>
                {favoritedUser?
                  (<>Following</>):
                  (<><Icon fontSize={'18px'} as={MdOutlineAddBox}/> Follow</>)
                }
              </Button>
            </Flex>
            {/* <Icon mr='18px'fontSize='28px' color='white' as={HiDotsVertical}/> */}
          </ChakraLink>

          <Box margin='1rem auto' width='100%' height='1px' bg='#646464'/>

          <Flex margin='0 8px' flexDir='column'>
            <Text mb='12px' color='white' fontSize='22px'>
              {currentPost?.title} 
            </Text>
            <Text fontSize={'18px'} color='white'>
              {currentPost?.description}
            </Text>
            <Flex mt='16px'align='center' justify='space-between'>
              <Flex>
                <Icon
                  onClick={(e)=>{handleLikeButton(e)}}
                  color={liked[0]?'#f8473b'
                  :'white'}
                  aria-active={liked[0]?'true':'false'}
                  aria-label='curtir Post'
                  fontSize='25px'
                  cursor={'pointer'}
                  as={liked[0]?
                  AiFillHeart:AiOutlineHeart} />
                <Text ml='.5rem' color ='white'>{currentPost.likes? currentPost.likes.length:''}</Text>
              </Flex>
              <Icon
                onClick={(e)=>{handleFavoritePostButton(e)}}
                fontSize='25px'
                cursor={'pointer'}
                aria-active={favoritedPost?'true':'false'}
                aria-label='adicionar/remover post aos favoritos'
                as={favoritedPost?
                BsBookmarkHeartFill:BsBookmarkPlus} />
            </Flex>
          </Flex>

          <Box margin='1rem auto' width='100%' height='1px' bg='#646464'/>
          <Flex flexDir='column'>
            <Text mb='1rem' fontSize='20px'>
              Mais de {capitalizeFirstLetter(currentPost?.user.name)} </Text>  
            <Grid bg='#1a1a1a' padding='.5rem' borderRadius={'5px'} templateColumns={`repeat(3, 1fr)`} width='100%'>
            { 
            currentPost.otherPosts.slice(0,9).map((post)=>{
              return(
                <GridItem key={post.id} cursor='pointer' colSpan={1} display='inline !important' > 
                  <Tooltip label={post.title} aria-label='A tooltip'>
                    <AspectRatio  margin='0 !important' display='flex'   ratio={1} >
                      <Link aria-label={`visitar postagem ${post.title}`} href={`/posts/${post.id}`}>
                        <Image  borderRadius='5px' src={post.cropped} />
                      </Link>
                    </AspectRatio>
                  </Tooltip>
                </GridItem> 
              )
            })}
            </Grid>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) =>  {
  const redirectHome = {
      redirect: {
        destination: '/',
        permanent: false,
      },
  }  
  let postData;
  let {slug} = params
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lib/imgur/imgurGet`,{
    method:'GET',
    headers:{
      id:slug.toString().replace(',','')
    }
  })

  if(![200,201,202].includes(response.status)){
    return redirectHome
  }
  try{
    postData= await response.json();
  }catch(e){
    return redirectHome
  }

  if (postData.posted==false) {
    return redirectHome
  }

  postData.otherPosts= postData.otherPosts.filter(post=>{return(post.posted==true)})
  return {
    props: {
      postData,
      slug:slug
    },
  }
}

export const favPostFunctions = {
  delete: (session,slug)=>{
    if(session){
      Api.delete('/lib/imgur/favoritePost',{data:{
        id:slug,...session
      }})
    }
  },
  push: (session,slug)=>{
    if(session){
      Api.patch('/lib/imgur/favoritePost',{
        id:slug,...session
      }).then(res=>console.log(res))
    }
  },
  post:(session,slug)=>{
    if(session){
      Api.post('/lib/imgur/favoritePost',{
        id:slug,...session
      }).then(res=>console.log(res))
    }
  },
}
export const likeFunctions = {
  like: (user,slug,postOwner)=>{
    if(user){
      Api.patch('/lib/imgur/likePost',{
        ...user,id:slug,postOwnerName:postOwner
      })
    }
  },
  dislike: (user,slug,postOwner)=>{
    if(user){
      Api.delete('/lib/imgur/likePost',{
        data:{
          ...user,id:slug,postOwnerName:postOwner
        }
      })
    }
  }
}
export const favUserFunctions = {
  post:(user,postOwner)=>{
    if(user){
      Api.post('/lib/imgur/favoriteUser',{
        ...user,postOwnerName:postOwner
      })
    }
  },
  push:(user,postOwner)=>{
    if(user){
      Api.patch('/lib/imgur/favoriteUser',{
        ...user,postOwnerName:postOwner
      })
    }
  },
  delete:(user,postOwner)=>{
    if(user){
      console.log(user)
      Api.delete('/lib/imgur/favoriteUser',{data:{
        ...user,postOwnerName:postOwner
      }
      })
    }
  }
}