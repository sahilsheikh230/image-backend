
import dotenv from "dotenv";
import path from "path";
dotenv.config();

import {S3Client,GetObjectCommand,PutObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Image from "../models/image.js"
import User from "../models/user.js"
import { url } from "inspector";
const s3Client=new S3Client({
    region :process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY,
    }
})
  export async function getURL(key){
    const command=new GetObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:key,
    })
const url= await getSignedUrl(s3Client,command)
return url;
}

  export async function putObject(filename,contentType){
    const command=new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`${filename}`,
        ContentType:contentType
    })
    const url=await getSignedUrl(s3Client,command)
return url
}
export async function puttransformedImage(

  newkey,

  transformedBuffer

){

  const command =

  new PutObjectCommand({

    Bucket:
      process.env.AWS_BUCKET_NAME,

    Key:newkey,

    Body:
      transformedBuffer,

    ContentType:
      "image/jpeg"
  })

  await s3Client.send(command)

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newkey}`
}
async function deleteObject(key){
    try{
    const command=new DeleteObjectCommand({
         Bucket:process.env.AWS_BUCKET_NAME,
        Key:key,
    
    })
     await s3Client.send(command); 

    console.log("Deleted successfully");
    return true;
}
   catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}




 export const uploadFile=async(req,res)=>{
const {fileName,fileType,fileSize,dimensions}=req.body;



    const allowedTypes=["image/jpeg","image/png","image/webp"];

        try{

    if(!allowedTypes.includes(fileType)){
    
        return res.status(400).json({
            message:"Only JPEG and PNG files are allowed"
        })

    }
    if(fileSize>5*1024*1024){
   
         return res.status(400).json({
         message:"File exceeds 5MB  size limit"
        })
    }
     const key = `${Date.now()}-${fileName}`;
   let url= await putObject(key,fileType)
   console.log("url generated",url)



    return res.status(200).json({
        message:"Url generated",url:url,key:key
    })


        }
        catch(e){
            console.log("error is",e)
return res.status(500).json({

    message:"Internal Server error"
})
        }
    

}
export const  saveImage=async(req,res)=>{
    const {key,size,dimensions}=req.body
    console.log("dimensions are",dimensions)
    const currentUser=req.user;
    try{
//const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;;
 const user=  await User.findOne({email:currentUser.name})
console.log("user id",user._id)

const imageData={userId:user._id,key:key,size:size,dimensions:dimensions}
const newImage=new Image(imageData);
await newImage.save()
console.log("image created",newImage);
return res.status(200).json({message:"Image Saved successfully"})
    }
    catch(err){
return res.status(500).json({

    message:"Internal Server error"
})
    }
}






export const getImages=async(req,res)=>{
 const user=  await User.findOne({email:req.user.name})
try{
let images= await Image.find({userId:user._id})

if(images.length>0){
let baseurl=`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`



  const results = images.map((image) => ({
      url: `${baseurl}/${image.key}`,
      size: image.size,
      key:image.key,
      dimensions:image.dimensions
    }));
  
     const totalSize = images.reduce((sum, img) => sum + img.size, 0);

    
    return res.status(200).json({images:results,totalSize:totalSize})
}
else{
    return res.status(400).json({message:"No image uploaded yet"})
}
}
catch(err){
return res.status(500).json({message:"Internal servor error"})
}
}
export const deleteImage=async(req,res)=>{
    const {key}=req.body;

    try{
    const image=await Image.findOne({key:key})
    
if(image){
    const isDeleted=await deleteObject(key);
    if(isDeleted){
await Image.deleteOne({key:key})

        return res.status(200).json({message:"Image deleted Successfully.Please refresh the page"})
    }
}
else{
    return res.status(404).json({message:"Image not found"})
}
    }
    catch(err){
  res.status(500).json({ message: "Delete failed" });
    }


}