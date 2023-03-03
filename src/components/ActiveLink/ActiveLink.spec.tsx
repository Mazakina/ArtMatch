import { render } from '@testing-library/react'
import { ActiveLink } from '.'
import { Text } from '@chakra-ui/react'
import React from 'react'

// jest.mock('React', () => {
//   return {
//     useRouter() {
//       return {
//         state: '/',
//       }
//     },
//   }
// })

test('active link renders correctly', () => {
  const [state, setState] = React.useState('trend')

  const { debug } = render(
    <ActiveLink id="trend" currentActive={state} setCurrentActive={setState}>
      <Text>Trend</Text>
    </ActiveLink>,
  )

  debug()
})
