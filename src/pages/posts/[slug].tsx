import {Image, Avatar, Box, Flex, Text, Icon, Grid, GridItem, AspectRatio } from '@chakra-ui/react'
import { useRouter } from "next/router"
import {HiDotsVertical} from 'react-icons/Hi'
import {AiOutlineHeart} from 'react-icons/ai'
import {BsBookmarkPlus} from 'react-icons/bs'
import Header from "../../components/Header"

export default function Posts(){
  const i =[0,1,2,3,4,5,6,7,8]
  const comments=[
    {
      user:'https://bit.ly/kent-c-dodds',
      name:'Rusdonilvo',
      text:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum, nam.'
    },{
      user:'https://bit.ly/kent-c-dodds',
      name:'Rusdonilvo',
      text:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum, nam.'}
  ]
  const router = useRouter()
  const {slug} = router.query
  return(
    <>
      <Header/>
      <Box>
        <Flex p='50px 0 0' margin='-50px 0 0' h='100vh'>
          <Box id='post-image' bg='#0a0a0a' width='100%' >
            <Image alt='' src='https://cdna.artstation.com/p/assets/images/images/054/556/294/4k/juras-rodionovas-juras-rodionovas-the-hunter-close-up.jpg?1664820930'/>
          </Box>

          <Flex pl='18px' pr='18px'id='details-section' flexDir='column' bg='#272727' width='450px'>
            <Flex  mt='18px' height='50px' w='100%' justify='space-between' align='center'>
              <Flex align='center'>
                <Avatar mr='12px' width='44px' height='44px' src='https://bit.ly/dan-abramov' />
                <Box>
                  <Text fontSize='20px' color='#fff'> Juras Rodionovas </Text>
                  <Text fontSize='16px' color='#fff'>  3D Artist </Text>
                </Box>
              </Flex>
              <Icon mr='18px'fontSize='28px' color='white' as={HiDotsVertical}/>
            </Flex>

            <Box margin='1rem auto' width='100%' height='1px' bg='#646464'/>

            <Flex margin='0 8px' flexDir='column'>
              <Text mb='12px' color='white' fontSize='24px'>
               Kaara
              </Text>
              <Text color='white'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam ducimus fugiat dolore est quam magnam, accusantium dicta natus in. Nesciunt quasi ab enim tenetur nulla repellendus commodi placeat veniam praesentium.
              </Text>
              <Flex mt='18px'align='center' justify='space-between'>
                <Icon fontSize='25px' as={AiOutlineHeart}/>
                <Icon fontSize='25px' as={BsBookmarkPlus}/>
              </Flex>
            </Flex>

            <Box margin='1rem auto' width='100%' height='1px' bg='#646464'/>
            <Flex flexDir='column'>
              <Text mb='1rem' fontSize='20px'>
                Mais de juras Rodionovas</Text>  
              <Grid templateColumns={`repeat(3, 1fr)`} width='100%'>
              { i.map((is)=>{
                return(
                  <GridItem key={is}  colSpan={1} display='inline !important' > 
                    <AspectRatio borderRadius='5px' margin='0 !important' display='flex' bg='#969696'  ratio={1} >
                      <Box></Box>
                    </AspectRatio>
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

