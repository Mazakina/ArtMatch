import { NextApiRequest, NextApiResponse } from "next";
import { Api } from "../../../services/api";  
import FormData from  'form-data'
import axios from "axios";



export default async (req:NextApiRequest,res:NextApiResponse)=>{
  const formData = new FormData()
  const image = req.body.image
  const imageData = image.substring(image.indexOf(",") + 1);
  formData.append('image',
   imageData
   )
  // const fileInput = Array.from(form.elements).find(({name})=>name==='img');
  // Fazer o envio de todas as informaçoes //
  // console.log(event)
var config = {
  method: 'post',
  url: 'https://api.imgur.com/3/image',
  headers: { 
    Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
    Accept: 'application/json'
    // 'enctype': 'multipart/form-data',
    // 'Cache-Control': 'sno-cache',
    // 'Pragma': 'no-cache'
  },
  data : formData,
  maxContentLength: 100000000,
  maxBodyLength: 100000000
};
Api(config)
.then( (response)=> {
  res.status(200)
  console.log(JSON.stringify(response.data));
  const reqData = {
    title: req.body.title,
    description: req.body.title,
    deleteHash:response.data.data.deletehash,
    url:response.data.data.link,
    // album: req.body.title,
    // tags:[...req.body.tags],
    // midia: req.body.midia,
  }
  console.log('Post Data:',reqData)
  const reqUser={user:req.body.user}


  
})
.catch(function (error) {
  console.log(error);
})
}

// {"data":{"id":"8G0y2Ii","title":null,"description":null,"datetime":1670089476,"type":"image/png","animated":false,"width":1912,
// "height":480,"size":58017,"views":0,"bandwidth":0,"vote":null,"favorite":false,"nsfw":null,"section":null,"account_url":null,
// "account_id":0,"is_ad":false,"in_most_viral":false,"has_sound":false,"tags":[],"ad_type":0,"ad_url":"","edited":"0","in_gallery":false,
// "deletehash":"MTiK7sPY4FsZ8O7","name":"","link":"https://i.imgur.com/8G0y2Ii.png"},"success":true,"status":200}