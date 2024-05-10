import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import e from "express";
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connect to MongoDB")
}).catch((e)=>{
    console.log(e)
})


const app = express();

app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})