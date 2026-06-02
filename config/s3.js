import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "backend/.env")
});
import {S3Client,GetObjectCommand,PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client=new S3Client({
    region :process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY,
    }
})
 async function getURL(key){
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

