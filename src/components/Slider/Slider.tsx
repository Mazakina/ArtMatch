import { Swiper, SwiperProps } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { A11y, Navigation, Pagination,Grid } from 'swiper';
import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';


interface SliderProps{
  settings: SwiperProps,
  children: React.ReactNode
}

export function Slider({settings, children}:SliderProps){
  return(
    <Flex h={{base:'200px',md:'300px' }}>
      <Swiper modules={[Navigation, Pagination, A11y, Grid ]} {...settings}>
        {children}
      </Swiper>
    </Flex>
  )
}