import type { AppProps } from 'next/app'
import { ChakraProvider} from '@chakra-ui/react'
import { theme } from '../styles/theme'
import '../components/Slider/Slider.css'
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";
import {UserProvider} from '../services/hooks/UserContext'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'
import "../styles/global.css"


function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [queryClient]  = useState(() => new QueryClient())

 
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <ChakraProvider theme={theme}>
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