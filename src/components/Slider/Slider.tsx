import { Swiper, SwiperProps } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { A11y, Navigation, Pagination } from 'swiper';
import { ReactNode } from 'react';


interface SliderProps{
  settings: SwiperProps,
  children: React.ReactNode
}

export function Slider({settings, children}:SliderProps){
  return(
    <Swiper modules={[Navigation, Pagination, A11y ]} {...settings}>
      {children}
    </Swiper>
  )
}