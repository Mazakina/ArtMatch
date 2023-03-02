import axios from  'axios'

export const Api = axios.create({
  baseURL: '/api',
})

export function saveImage(data){ Api.post('/_lib/manageGallery',data).then(response=>{console.log(response)}).catch(error=>console.log(error))}