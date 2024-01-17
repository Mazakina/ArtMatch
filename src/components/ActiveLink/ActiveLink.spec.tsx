import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'
import { useState } from 'react'

describe('activeLink', () => {
  it(' renders correctly', () => {
    render(<ActiveLinkWrapper />)

    expect(screen.getByText('Trend')).toBeInTheDocument()
  })

  it(' has active class if it is active', () => {
    render(<ActiveLinkWrapper />)

    expect(screen.getByText('Trend')).toHaveClass('active')
  })
})

function ActiveLinkWrapper() {
  const [state, setState] = useState('trend')

  return (
    <ActiveLink id="trend" currentActive={state} setCurrentActive={setState}>
      Trend
    </ActiveLink>
  )
}

export default ActiveLinkWrapper
