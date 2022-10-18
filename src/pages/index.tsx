import {Box, Button, Flex, HStack, Icon, Select, Stack} from '@chakra-ui/react'
import { SwiperProps, SwiperSlide } from 'swiper/react'
import Header from "../components/Header"
import Slider from '../components/Slider'

const Home  = () => {
  const settings: SwiperProps= {
    spaceBetween:50,
    slidesPerView:2,
    navigation:true,
    pagination:{
      clickable:true,
    },
    onSlideChange:() => console.log('slide change'),
    onSwiper:(swiper) => console.log(swiper),

  }

  return (
    <>
      <Header/>
      <Box id='heroBox'>
        <Slider settings={settings}>
          <SwiperSlide>
            <h1>ola</h1>
          </SwiperSlide>
          <SwiperSlide>
            <h1>ola</h1>
          </SwiperSlide>
          <SwiperSlide>
            <h1>ola</h1>
          </SwiperSlide>
          <SwiperSlide>
            <h1>ola</h1>
          </SwiperSlide>
        </Slider>
      </Box>
    </>
  )
}

export default Home
