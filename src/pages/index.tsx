import {Box, Grid,Text, HStack, useMediaQuery  } from '@chakra-ui/react'
import { HeroSlider } from '../components/Carousel/HeroSlider'
import Header from "../components/Header"
import { useContext, useEffect, useRef, useState } from 'react'
import { ActiveLink } from '../components/ActiveLink'
import { GetStaticProps } from 'next'
import { fauna } from '../services/fauna'
import {query as q} from 'faunadb'
import PostPrev from '../components/PostPrev'
import { UserContext } from '../services/hooks/UserContext'
import {useInView} from "framer-motion"
import Division from '../components/Division'
interface ResponseProps{
  data:any
}

interface UserProps {
  ref:{
    id:string
  },
  data:{
    user:string,
    banner:string,
    avatar:string,
  }
}

interface HomePosts{
  avatar:string,
  banner:string,
  cropped:string,
  deleteHash:string,
  description:string,
  id:string,
  midia:string,
  title:string,
  url:string,
  user:string,
  createdAt:number,
  likes:string[],
  tags:string[],
}


const Home  = ({data}) => {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const [isBase,isSm,isMd,isLg] = useMediaQuery([
    "(max-width: 479px)",
    "(min-width: 480px) and (max-width: 767px)",
    "(min-width: 768px) and (max-width: 991px)",
    "(min-width: 992px) ",
  ]);
  let postsData =data
  const useUser = useContext(UserContext)
  const {user,favoriteUsers}= useUser
  const [grid,setGrid] = useState(3)
  const [gridRows,setGridRows] = useState(5)
  const [currentActive, setCurrentActive] = useState('trend')
  const getBreakPoints =  [isBase,isSm,isMd,isLg].findIndex(el=> el === true)
  const gridColumns = [3,5,7,9]
  const newGridValue =gridColumns[getBreakPoints]* gridRows

  const slides=[
    {img:'https://i.pinimg.com/originals/b3/45/e4/b345e46becdaeaaa9dcf6ea6144c91a9.jpg'},
    {img:'https://i.pinimg.com/originals/7d/98/84/7d98840fdff1b2e7cd508cc7f3a17403.jpg'},
    {img:'https://cdn.discordapp.com/attachments/1008571163099811953/1066425655518044250/Mazakina_logo_for_a_site_called_ink-eyes_framed_in_a_circle_cd6a955c-1a50-4e01-823f-10bf72c97b0d.png'}
  ]
  
  function sortPosts(postsData){
    if(currentActive == 'recent'){
      //sort by publication date
      return (postsData.sort(
        (a,b)=>{
          return b.createdAt-a.createdAt
        }
      ).slice(0,grid))
    }
    if(currentActive == 'trend'){
      //sort by likes
      return (postsData.sort(
        (a,b)=>{
          return b.likes.length- a.likes.length
        }
      ).slice(0,grid))
    }
    if(currentActive == 'following'){
        return(postsData.filter(post=>favoriteUsers.includes(post.reference)).sort(
        (a,b)=>{
          return b.createdAt-a.createdAt
        }
      ).slice(0,grid))
    }

  }
  const postsOnDisplay = sortPosts(postsData)
  
  useEffect(()=>{
    setTimeout(()=>{ 
      if(!isNaN(newGridValue)){
        setGrid(newGridValue)
      }
    },200)
  },[gridRows,isBase,isSm,isMd,isLg])

  useEffect(()=>{
      if(isInView &&grid<postsOnDisplay ){
      setGridRows(gridRows=>gridRows+3)
    }
  },[isInView])

  return (
    <Box margin='50px 0'id='heroBox'>
      <HeroSlider slides={slides}/>
      <HStack borderTop='10px solid #323232' margin='50px 0 16px' padding='0 25px'>
        <ActiveLink
          setCurrentActive={setCurrentActive}
          currentActive={currentActive}
          id='trend'>
              Trend
        </ActiveLink>
        {user?.data &&     
        <ActiveLink
          setCurrentActive={setCurrentActive}
          currentActive={currentActive}
          id='following' >
              Seguindo
        </ActiveLink>
        }
        <ActiveLink
          setCurrentActive={setCurrentActive}
          currentActive={currentActive}
          id='recent'>
              Recente
        </ActiveLink>
      </HStack>
      <Box id='image-container' >
        <Grid
          className='grid-container'
          templateColumns={{base:`repeat(3,1fr)`,
          md:`repeat(5, 1fr)`,
          lg:`repeat(7,1fr)`,
          xl:`repeat(9,1fr)`}}
          pb='1rem'
          borderBottom='5px solid #323232'
          width='100%'>
          {postsOnDisplay.map((post)=>{
            return(
              <PostPrev  post={post} key={post.id}/>
            )
          })}
        </Grid>
      </Box>
      <Box ref={ref}/>
      <Division width='100%' bg='#323232'/>
    </Box>
  )
}

export default Home


export const getStaticProps:GetStaticProps= async (context)=>{
  try{
    let data;
    // await fauna.query(
    //   q.Map(
    //     q.Paginate(q.Documents(q.Collection("collections"))),
    //     q.Lambda("X", q.Get(q.Var("X")))
    //   )
    // ).then(async (response:ResponseProps)=>{
    //   //filtering data if visible, and expading post with user data
    //   data = await Promise.all(response.data.map(async collection=>{
    //     if(collection.data.visible==false){return}
    //     let user:UserProps = await fauna.query(
    //       q.Get(
    //         collection.data.userId
    //       )
    //     )
    //     return{
    //       posts:[...Object.values(collection.data.posts)].map((value:object)=>{
    //         return{...value,
    //           reference:user.ref.id,
    //           user:user.data.user,
    //           avatar:user.data.avatar,
    //           banner:user.data.banner}
    //       })
    //     }
    //   }))
    //  }).catch(e=>console.log(e))  
  
     
    //  let allPosts = []
     
    // data.map(users=>{ if(users?.posts){
    //   try{
    //     return allPosts =[...allPosts,...users.posts]
    //   }catch{
    //     return allPosts
    //   }
    // }})
     data = []
    return{
      props:{
        data
      },
    }
  }catch{
    return{
      props:{
      }
    }
  }
}
