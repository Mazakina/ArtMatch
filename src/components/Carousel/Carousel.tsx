import {Slider, Slide, SliderProps } from '../Slider/index'
import { Image } from '@chakra-ui/react'

interface SlideProps{ 
  img:string,
  alias?:string,
  title?:string,
  url?:string
}
interface Slides{
  slides:SlideProps[];
}

export function HeroSlider({slides}:Slides){
  const settings: SliderProps= {
    spaceBetween:0,
    slidesPerView:1,
    draggable:slides.length >=3,
    loop:slides.length >=3,
    navigation: slides.length >=3,
    pagination:{
      clickable:true,
    },
    onSlideChange:() => console.log('slide change'),
    onSwiper:(swiper) => console.log(swiper),

  }
  return(
    <Slider settings={settings}>
      {slides.map((slide) => {
        return(
          <Slide key={slide.img}>
            <Image objectFit='cover' w='100%' src={slide.img} alt="" />
          </Slide>
        )
      })}
    </Slider>
  )
}