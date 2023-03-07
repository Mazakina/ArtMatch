import { render, screen } from '@testing-library/react'
import Home, { getStaticProps } from './index'
jest.mock('../services/fauna', () => {
  return {
    fauna: {
      query: jest.fn(),
    },
  }
})

jest.mock('../components/Carousel/HeroSlider', () => {
  return '<p>something</p>'
})

describe('Home Page', () => {
  it('loads inital data correctly', async () => {
    const mockedResponse = [
      {
        user: {
          ref: '352729610782245455',
          user: 'mazakina',
          avatar: 'https://i.imgur.com/dmGd6S6.jpg',
          banner: 'https://i.imgur.com/M2GV5NA.png',
        },
        posts: [
          {
            id: 'SwleDlc',
            title: 'Shyv',
            description: 'new concept to old shyvana',
            deleteHash: 'DGhMVvNtd3djG0A',
            url: 'https://i.imgur.com/SwleDlc.jpg',
            posted: true,
            tags: ['league of legends', 'shyvana'],
            midia: 'pinturaDigital',
            cropped: 'https://i.imgur.com/8gvVZ1G.jpg',
            likes: [],
            createdAt: 1674515922,
            albumRef:
              'Fri Feb 03 2023 04:53:29 GMT-0300 (Brasilia Standard Time) asdasdas',
            albumName: 'asdasdas',
            reference: '352729610782245455',
            user: 'mazakina',
            avatar: 'https://i.imgur.com/dmGd6S6.jpg',
            banner: 'https://i.imgur.com/M2GV5NA.png',
          },
        ],
      },
      {
        user: {
          ref: '358114421282701903',
          user: 'brunodmp98',
          avatar:
            'https://lh3.googleusercontent.com/a/AGNmyxaOdZIwPP3oRIQfuhhhyOFlxBEproprweoqWVKB=s96-c',
        },
        posts: [
          {
            id: 'fNWskrF',
            title: 'Rainy Night',
            description: 'Trabalho feito para matéria de composição visual',
            deleteHash: 'rCqA0Ws1W6t2cpE',
            url: 'https://i.imgur.com/fNWskrF.gif',
            posted: true,
            tags: ['pixel-art', 'animacao', 'digital art'],
            midia: 'pinturaDigital',
            cropped: 'https://i.imgur.com/wcrKVS0.jpg',
            likes: [],
            createdAt: 1677784129,
            albumRef:
              'Thu Mar 02 2023 19:07:41 GMT+0000 (Coordinated Universal Time) Pixel-art',
            albumName: 'Pixel-art',
            reference: '358114421282701903',
            user: 'brunodmp98',
            avatar:
              'https://lh3.googleusercontent.com/a/AGNmyxaOdZIwPP3oRIQfuhhhyOFlxBEproprweoqWVKB=s96-c',
          },
        ],
      },
    ]

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockedResponse),
      }),
    )
    const response = await getStaticProps({})
    // const jsonResponse = await response.json()
    console.log(response)
  })
})
