import type { AppProps } from 'next/app'
import { ChakraProvider} from '@chakra-ui/react'
import { theme } from '../styles/theme'
import '../components/Slider/Slider.css'
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";


function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
