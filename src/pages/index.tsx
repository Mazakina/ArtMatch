import {Box, AspectRatio, Grid, GridItem, HStack } from '@chakra-ui/react'
import { HeroSlider } from '../components/Carousel/HeroSlider'
import Header from "../components/Header"
import { useContext, useEffect, useState } from 'react'
import { ActiveLink } from '../components/ActiveLink'
import { GetStaticProps } from 'next'
import { fauna } from '../services/fauna'
import {query as q} from 'faunadb'
import PostPrev from '../components/PostPrev'
import { UserContext } from '../contexts/UserContext'

interface ResponseProps{
  data:any
}

interface UserProps {
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
  const useUser = useContext(UserContext)
  const {user,favorites}= useUser
  let postsData =JSON.parse(data)
  const [grid,setGrid] = useState(0)
  const [currentActive, setCurrentActive] = useState('trend')
  useEffect(()=>{
    setGrid(Math.floor(window.screen.width/200))
    console.log(grid)
  },[])
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
      ))
    }
    if(currentActive == 'trend'){
      //sort by likes
      return (postsData.sort(
        (a,b)=>{
          return b.likes.length- a.likes.length
        }
      ))
    }
    if(currentActive == 'following'){
        return(postsData.filter(post=>favorites.includes(post.user)).sort(
        (a,b)=>{
          return b.createdAt-a.createdAt
        }
      ))
    }

  }

  return (
    <>
      <Header/>
      <Box margin='50px 0'id='heroBox'>
        <HeroSlider slides={slides}/>

        <HStack borderTop='10px solid #323232' margin='50px 0 16px' padding='0 25px'>
          <ActiveLink
            setCurrentActive={setCurrentActive}
            currentActive={currentActive}
            id='trend'>
                Trend
          </ActiveLink>
          <ActiveLink
            setCurrentActive={setCurrentActive}
            currentActive={currentActive}
            id='following' >
                Seguindo
          </ActiveLink>
          <ActiveLink
            setCurrentActive={setCurrentActive}
            currentActive={currentActive}
            id='recent'>
                Recente
          </ActiveLink>
        </HStack>

        <Box id='image-container' >
          <Grid templateColumns={`repeat(${grid}, 1fr)`} width='100%'>
            { sortPosts(postsData).map((post)=>{
              return(
                <PostPrev post={post} key={post.id}/>
              )
            })}
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default Home


export const getStaticProps:GetStaticProps= async (context)=>{
  let data;
  await fauna.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("collections"))),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  ).then(async (response:ResponseProps)=>{
    //filtering data if visible, and expading post with user data
    data = await Promise.all(response.data.map(async collection=>{
      if(collection.data.visible==false){return}
      let user:UserProps = await fauna.query(
        q.Get(
          collection.data.userId
        )
      )
      return{
        posts:[...Object.values(collection.data.posts)].map((value:object)=>{
          return{...value,
            user:user.data.user,
            avatar:user.data.avatar,
            banner:user.data.banner}
        })
      }
    }))
   }).catch(e=>console.log(e))  

   let allPosts = []
   
   data.map(users=> allPosts =[...allPosts,...users.posts])
   data = JSON.stringify(allPosts)
  return{
    props:{
      data
    },
  }
}



// export const getStaticProps:GetStaticProps= async (context)=>{
//   let data;
//   await fauna.query(
//     q.Map(
//       q.Paginate(q.Documents(q.Collection("collections"))),
//       q.Lambda("X", q.Get(q.Var("X")))
//     )
//   ).then(async (response:ResponseProps)=>{
//     data = await Promise.all(response.data.map(async collection=>{
//       if(collection.data.visible==false){return}
//       let user:UserProps = await fauna.query(
//         q.Get(
//           collection.data.userId
//         )
//       )
//       return{
//         user:{
//           user:user.data.user,
//           avatar:user.data.avatar,
//           banner:user.data.banner
//         },
//         posts:[Object.values(collection.data.posts.map(post=>{
//           return{
//             ...post,user:user.data.user,avatar:user.data.avatar,banner:user.data.banner
//           }}
//         ))]
//       }
//     }))
//    }).catch(e=>console.log(e))  
//    data = JSON.stringify(data)
//   return{
//     props:{
//       data
//     },
//     revalidate: 60*15 //revalidate every 15min
//   }
// }