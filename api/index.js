import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import e from "express";
dotenv.config();
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";


mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connect to MongoDB")
}).catch((e)=>{
    console.log(e)
})


const app = express();


//allow json as the input   
app.use(express.json())
app.use(cookieParser())


app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

app.use((err,rqe,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal Server Error"
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
})