import {Box, AspectRatio, Grid, GridItem, HStack } from '@chakra-ui/react'
import { HeroSlider } from '../components/Carousel/HeroSlider'
import Header from "../components/Header"
import { useEffect, useState } from 'react'
import { ActiveLink } from '../components/ActiveLink'

const Home  = () => {
  const [grid,setGrid] = useState(0)
  const [currentActive, setCurrentActive] = useState('Trend')
  useEffect(()=>{
    setGrid(Math.floor(window.screen.width/200))
    console.log(grid)
  },[])
  console.log('re')
  const slides=[
    {img:'https://i.pinimg.com/originals/b3/45/e4/b345e46becdaeaaa9dcf6ea6144c91a9.jpg'},
    {img:'https://i.pinimg.com/originals/7d/98/84/7d98840fdff1b2e7cd508cc7f3a17403.jpg'},
    {img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHXmdVmmMTIvB7V9hKXV8iYs1d4noyYyAFCsPVvV__g4s-BhZE3irbTtKMgRy2vL-C1rM&usqp=CAU'}
  ]
 
  const i =[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
  return (
    <>
      <Header/>
      <Box margin='50px 0'id='heroBox'>
        <HeroSlider slides={slides}/>

        <HStack borderTop='10px solid #323232' margin='50px 0 16px' padding='0 25px'>
          <ActiveLink
            setCurrentActive={setCurrentActive}
            currentActive={currentActive}
            id='Trend'>
                Trend
          </ActiveLink>
          <ActiveLink
            setCurrentActive={setCurrentActive}
            currentActive={currentActive}
            id='Seguindo' >
                Seguindo
          </ActiveLink>
          <ActiveLink
            setCurrentActive={setCurrentActive}
            currentActive={currentActive}
            id='Recente'>
                Recente
          </ActiveLink>
        </HStack>

        <Box id='image-container' >
          <Grid templateColumns={`repeat(${grid}, 1fr)`} width='100%'>
            { i.map((is)=>{
              return(
                <GridItem key={is} colSpan={1} display='inline !important' > 
                  <AspectRatio margin='0 !important' display='flex' bg='#969696' border='1px solid black' ratio={1} >
                    <Box></Box>
                  </AspectRatio>
                </GridItem> 
              )
            })}
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default Home
