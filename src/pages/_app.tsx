import type { AppProps } from 'next/app'
import { ChakraProvider, Progress} from '@chakra-ui/react'
import { theme } from '../styles/theme'
import '../components/Slider/Slider.css'
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";
import {UserProvider} from '../services/hooks/UserContext'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState,useEffect } from 'react'
import "../styles/global.css"
import Header from '../components/Header'
import { useRouter } from 'next/router'
import { motion, useAnimationControls } from "framer-motion"
import TransitionOverlay from '../components/TransitionOverlay'

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [queryClient]  = useState(() => new QueryClient())
  const router = useRouter()
  const controls = useAnimationControls()

  useEffect(()=>{
    const sequence = async () => {
      await controls.set({width:'100%'})
      await controls.set({ zIndex:'999' })
      return await controls.start({ opacity: 1 })
    }
    const end = async()=>{
      await controls.start({opacity:0})
      await controls.set({zIndex:'0'})
      return await controls.set({width:'0%'})

    }
    router.events.on('routeChangeStart',()=>{ sequence()})
    router.events.on('routeChangeComplete',()=>{end()})
  },[])
 
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <ChakraProvider theme={theme}>
              <TransitionOverlay controls={controls} />
              <Header/>
              <Component {...pageProps} />
            </ChakraProvider>
          </UserProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp