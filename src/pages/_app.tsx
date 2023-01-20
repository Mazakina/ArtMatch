import type { AppProps } from 'next/app'
import { ChakraProvider} from '@chakra-ui/react'
import { theme } from '../styles/theme'
import '../components/Slider/Slider.css'
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";
import {UserProvider} from './UserContext'

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {



  return (
    <SessionProvider session={pageProps.session}>
      <UserProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default MyApp
