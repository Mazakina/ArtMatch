import {Image, Avatar, Box, Flex, Text, Icon, Grid, GridItem, AspectRatio, Tooltip } from '@chakra-ui/react'
import { useRouter } from "next/router"
import {HiDotsVertical} from 'react-icons/hi'
import {AiOutlineHeart} from 'react-icons/ai'
import {BsBookmarkPlus} from 'react-icons/bs'
import Header from "../../components/Header"
import { useEffect, useState } from 'react'
import { Api } from '../../services/api'
import { GetServerSideProps } from 'next'

interface postDataProps{
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
user: {
  name:string,
  avatar:string,
  banner:string
},
vote: null|number
}

export default function Posts({postData}){
  const router = useRouter()
  const [pageData,setPageData] = useState<postDataProps>(postData)
  console.log(pageData)
  return(
    <>
      <Header/>
      <Box>
        <Flex p='50px 0 0' margin='-50px 0 0' h='100vh'>
          <Flex align='center' justify='center' p='1rem' id='post-image' bg='#0a0a0a' width='100%' >
            <Image alt='' src={pageData?.URL} />
          </Flex>

          <Flex pl='18px' pr='18px'id='details-section' flexDir='column' bg='#272727' width='450px'>
            <Flex  mt='18px' height='50px' w='100%' justify='space-between' align='center'>
              <Flex align='center'>
                <Avatar mr='12px' width='44px' height='44px' src='https://bit.ly/dan-abramov' />
                <Box>
                  <Text fontSize='20px' color='#fff'> {pageData.user.name} </Text>
                  <Text fontSize='16px' color='#fff'>  3D Artist </Text>
                </Box>
              </Flex>
              <Icon mr='18px'fontSize='28px' color='white' as={HiDotsVertical}/>
            </Flex>

            <Box margin='1rem auto' width='100%' height='1px' bg='#646464'/>

            <Flex margin='0 8px' flexDir='column'>
              <Text mb='12px' color='white' fontSize='24px'>
               {pageData?.title} 
              </Text>
              <Text color='white'>
                {pageData?.description}
              </Text>
              <Flex mt='18px'align='center' justify='space-between'>
                <Icon fontSize='25px' cursor={'pointer'} as={AiOutlineHeart}/>
                <Icon fontSize='25px' cursor={'pointer'} as={BsBookmarkPlus}/>
              </Flex>
            </Flex>

            <Box margin='1rem auto' width='100%' height='1px' bg='#646464'/>
            <Flex flexDir='column'>
              <Text mb='1rem' fontSize='20px'>
                Mais de juras </Text>  
              <Grid bg='#1a1a1a' padding='.5rem' borderRadius={'5px'} templateColumns={`repeat(3, 1fr)`} width='100%'>
              { pageData.otherPosts.map((post)=>{
                return(
                  <GridItem key={post.id} cursor='pointer' colSpan={1} display='inline !important' > 
                    <Tooltip label={post.title} aria-label='A tooltip'>
                      <AspectRatio  margin='0 !important' display='flex'   ratio={1} >
                        <Image borderRadius='5px' src={post.cropped} />
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
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) =>  {
  let {slug} = params
  const reqData={
    id:slug
  }
  const response = await fetch(`${process.env.BASE_URL}/api/lib/imgur/imgurGet`,{
    method:'post',
    body:JSON.stringify(
    reqData)
  })
  let postData= await response.json();
  if (postData.id==''|| postData.posted==false) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  postData.otherPosts= postData.otherPosts.filter(post=>{return(post.posted==true)})
  return {
    props: {
      postData
    },
  }
}