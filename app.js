import express, { urlencoded } from "express"

import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRoutes from "./Routes/userRouter.js"
dotenv.config();
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const port=3000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));



mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log("error in connecting database",err)
})

app.get("/",(req,res)=>{
    res.send("hello")
})
app.use("/users",userRoutes)




app.listen(port,()=>{
    console.log("server is listening")
})