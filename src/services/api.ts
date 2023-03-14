import axios from 'axios'

export const Api = axios.create({
  baseURL: '/api',
})

export function deleteImgur(deleteHash: string) {
  if (deleteHash) {
    const config = {
      method: 'delete',
      url: `https://api.imgur.com/3/image/${deleteHash}`,
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        Accept: 'application/json',
      },
    }
    Api(config)
  }
}

export async function postImgur(image) {
  const config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      Accept: 'application/json',
    },
    data: {
      image: image.split(',')[1],
      type: 'base64',
    },
    maxContentLength: 100000000,
    maxBodyLength: 100000000,
  }
  const data = await Api(config)
  return data
}
