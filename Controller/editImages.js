
import Image from "../models/image.js"
import User from "../models/user.js"

import sharp from "sharp";
import axios from "axios";

import { getURL, puttransformedImage } from "./fileUploadController.js";
export const previewImage=async(req,res)=>{
    const{transform,key}=req.body;

    try{
       const response = await axios.get(`https://pixelproject1045.s3.eu-north-1.amazonaws.com/${key}`, { responseType: 'arraybuffer' });
const image=await Image.findOne({key});
      
     

if(image && response){

let imagetransform=sharp(response.data)

  if(transform.width || transform.height){
     if(transform.width==="" || transform.height===""){
        return res.status(401).json({message:"Dimensions cannot be empty"})
      }
      if(Number(transform.width) <100  || Number(transform.height) <100 ){
     return   res.status(400).json({message:"Dimensions cannot be less than 100px"})
    }
imagetransform=imagetransform.resize({ width:Number(transform.width), height:Number( transform.height), fit: 'fill' })

  }

if(transform.cropArea){
  imagetransform=    imagetransform.extract({
      left: Math.round(transform.cropArea.x),

    top: Math.round(transform.cropArea.y),

   width:transform.cropArea.width,
   height:transform.cropArea.height
  })
}
imagetransform =
imagetransform.modulate({

  brightness:
    transform.brightness,

  saturation:
    transform.saturation
})
if(transform.contrast){
 imagetransform =
imagetransform.linear(
  transform.contrast,
  0
)
  
}
if(transform.blur>0){
 imagetransform =
imagetransform.blur(
  transform.blur
)
}
if(transform.rotation){

  imagetransform =
  imagetransform.rotate(
    transform.rotation
  )
}
const transformedBuffer =
await imagetransform

  .jpeg({

  quality:
    transform.quality
})

  .toBuffer();
res.set(
  "Content-Type",
  "image/jpeg"
)

    return res.send(transformedBuffer);



    
}
    

    }

    catch(e){
 console.log(e);

  return res.status(500).json({
    message:"Preview failed"
  })
    }
}


export const savetransformedimage=async(req,res)=>{
const {transform,key}=req.body;
try{
 const image=await Image.findOne({key})
     const response = await axios.get(`https://pixelproject1045.s3.eu-north-1.amazonaws.com/${key}`, { responseType: 'arraybuffer' });
let imagetransform=sharp(response.data)

imagetransform=imagetransform.resize({ width:(transform.width)?Number(transform.width):image.dimensions.width, height:( transform.height)?Number( transform.height):image.dimensions.height, fit: 'fill' })

if(transform.cropArea){
  imagetransform=    imagetransform.extract({
      left: Math.round(transform.cropArea.x),

    top: Math.round(transform.cropArea.y),

   width:transform.cropArea.width,
   height:transform.cropArea.height
  })
}
imagetransform =
imagetransform.modulate({

  brightness:
    transform.brightness,

  saturation:
    transform.saturation
})
if(transform.contrast){
 imagetransform =
imagetransform.linear(
  transform.contrast,
  0
)
  
}
if(transform.blur>0){
 imagetransform =
imagetransform.blur(
  transform.blur
)
}
if(transform.rotation){

  imagetransform =
  imagetransform.rotate(
    transform.rotation
  )
}
const transformedBuffer =
await imagetransform

  .jpeg({

  quality:
    transform.quality
})

  .toBuffer();

const newkey=`edited-${Date.now()}-${key}`
const url=await puttransformedImage(newkey,transformedBuffer)
console.log(url)

 image.editedkey.push(newkey)
await image.save()
console.log(image);
const newimagedata={userId:image.userId,dimensions:{ width:(transform.width)?Number(transform.width):image.dimensions.width, height:( transform.height)?Number( transform.height):image.dimensions.height}
,key:newkey,size:transformedBuffer.length}
const newimage=new Image(newimagedata);
await newimage.save();
return res.status(200).json({

  message:
    "Image saved successfully",

  key:newkey,

  url
})
}
catch(err){
  return res.status(500).json({message:"Internal server error"})
}
}




//Download image
export const downloadImage=async(req,res)=>{
  const {transform,format,key}=req.body;
    try{
       const response = await axios.get(`https://pixelproject1045.s3.eu-north-1.amazonaws.com/${key}`, { responseType: 'arraybuffer' });
const image=await Image.findOne({key});
      
     

if(image && response){

let imagetransform=sharp(response.data)

imagetransform =
imagetransform.resize({

  width:

    transform.width

    ? Number(transform.width)

    : image.dimensions.width,

  height:

    transform.height

    ? Number(transform.height)

    : image.dimensions.height,

  fit:"fill"
})

  

if(transform.cropArea){
  imagetransform=    imagetransform.extract({
      left: Math.round(transform.cropArea.x),

    top: Math.round(transform.cropArea.y),

   width:transform.cropArea.width,
   height:transform.cropArea.height
  })
}
imagetransform =
imagetransform.modulate({

  brightness:
    transform.brightness,

  saturation:
    transform.saturation
})
if(transform.contrast){
 imagetransform =
imagetransform.linear(
  transform.contrast,
  0
)
  
}
if(transform.blur>0){
 imagetransform =
imagetransform.blur(
  transform.blur
)
}
if(transform.rotation){

  imagetransform =
  imagetransform.rotate(
    transform.rotation
  )
}
if(format==="jpeg"){

  imagetransform =
  imagetransform.jpeg({

    quality:
      transform.quality
  })
}
if(format==="png"){

  imagetransform =
  imagetransform.png()
}
if(format==="webp"){

  imagetransform =
  imagetransform.webp({

    quality:
      transform.quality
  })
}
const transformedBuffer =

await imagetransform
.toBuffer()


res.set(

  "Content-Type",

  `image/${format}`
)
res.set(

  "Content-Disposition",

  `attachment; filename="edited-image.${format}"`
)

    return res.send(transformedBuffer);



    
}
    

    }

    catch(e){
 console.log(e);

  return res.status(500).json({
    message:"Preview failed"
  })
    }
}