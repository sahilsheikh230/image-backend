
import User from "../models/user.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";
import {putObject} from "../config/s3.js";

export const  registerUser=async(req,res)=>{
    const userdata=req.body;
 
    try{
    const username=await User.findOne({name:userdata.name})
    if(username)
    {
        return res.status(409).json({message:"Username already exists"})
    }
const email=await User.findOne({email:userdata.email})
if(email){
    return res.status(409).json({message:"Email already exists"})
}
const hashedpassword= await bcrypt.hash(userdata.password,10);
userdata.password=hashedpassword
const newuser=new User(userdata);

await newuser.save();

const token=jwt.sign({name:userdata.email},"secretkey123",{expiresIn:"1h"});
res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge:60*60*1000,

})

return res.status(201).json({message:"User registered successfully!"})

}
catch(err){
   
return res.status(500).json({message:"Internal server error"})

}

}
 export const loginUser=async(req,res)=>{
    const userdata=req.body;
    
    try{ 
    const user = await User.findOne({ email: userdata.email });
    if(!user){
        return  res.status(404).json({message:"User does not exist"})
    }
    const isMatch=await bcrypt.compare(userdata.password,user.password)
    if(!isMatch){
         return  res.status(404).json({message:"Wrong Password"})
    }
else{
const token=jwt.sign({name:userdata.email},"secretkey123",{expiresIn:"1h"});
res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge:60*60*1000,

})
return res.status(200).json({message:"User Loggged in Successfully!"})
}
}
catch(err){
return res.status(500).json({message:"Internal server error"})
}
}
export const isLogged=async(req,res,next)=>{
try{
   
    const token=req.cookies?.token;

   // console.log("token is",token)
    if (!token) {

            return res.status(401).json({ message: 'Login first ' });
        }
        const decoded=jwt.verify(token,"secretkey123")
        req.user = decoded; 
      //  console.log("decoded",decoded)
        next();
    }
    catch (err) {
          console.log("JWT ERROR:", err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }


}
export const isLoggedHandler=(req,res)=>{
      return res.status(200).json({message:"Continue to Dashboard"})
}
export const logoutUser =
(req,res)=>{

  res.clearCookie(

    "token",

    {

      httpOnly:true,

      secure:false,

      sameSite:"strict"
    }
  )

  return res.status(200).json({

    message:
      "Logged out successfully"
  })
}