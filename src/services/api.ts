import axios from  'axios'

export const Api = axios.create({
  baseURL: 'https://art-match-s16i.vercel.app/api',
})

export function saveImage(data){ Api.post('/_lib/manageGallery',data)}