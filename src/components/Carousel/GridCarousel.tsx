import {Slider, Slide, SliderProps } from '../Slider/index'
import { Box, Image } from '@chakra-ui/react'

interface SlideProps{ 
  img:string,
  alias?:string,
  title?:string,
  url?:string
}
interface Slides{
  slides:SlideProps[];
}

export function GridSlider({slides}:Slides){
console.log(slides)
const settings: SliderProps= {
    spaceBetween:10,
    slidesPerView:3,
    draggable:slides.length >=3,
    loop:false,
    navigation: slides.length >=3,
    pagination:{
      clickable:true,
    },
   
    // onSlideChange:() => console.log('slide change'),
    // onSwiper:(swiper) => console.log(swiper),

  }
  return(
    <Box maxWidth={'100%'}>
      <Slider settings={settings}>
        {slides.map((slide) => {
          return(
            <Slide key={slide.url}>
              <Image  objectFit='cover' w='100%' src={slide.url} alt="" />
            </Slide>
          )
        })}
      </Slider>
    </Box>
  )
}