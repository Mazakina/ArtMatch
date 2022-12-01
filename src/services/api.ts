import axios from  'axios'

export const Api = axios.create({
  baseURL: '/api',
})

export function saveImage(data){ Api.post('/lib/manageGallery',data)}