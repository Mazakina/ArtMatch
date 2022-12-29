import type { AppProps } from 'next/app'
import { ChakraProvider} from '@chakra-ui/react'
import { theme } from '../styles/theme'
import '../components/Slider/Slider.css'
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";
import { Profiler } from 'react'


function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {



  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />

      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
