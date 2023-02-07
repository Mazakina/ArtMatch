import { extendTheme} from '@chakra-ui/react'

export const theme = extendTheme({
  colors:{
  },

  styles:{
    global:{
      Button:{
        _hover:{
          bg:'#000'
        }
      },
      body:{
        fontSize:'18px',
        bg: '#181818',
        color: 'white',
      },

    }
  },
})