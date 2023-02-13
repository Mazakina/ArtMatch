import { extendTheme} from '@chakra-ui/react'

export const theme = extendTheme({
  colors:{
  },

  styles:{
    global:{
      zIndex:1,
      Button:{
        _hover:{
          bg:'#000'
        }
      },
      body:{
        fontFamily:'Raleway',
        fontWeight:'400',
        fontSize:'18px',
        bg: '#181818',
        color: 'white',
        zIndex:'1'
      },

    }
  },
})