import express, { urlencoded } from "express";
import authRoute from './routes/auth.routes.js'
import dotenv from 'dotenv';
import connectMongoDB from '../backend/db/connectMongoDB.js'
import { protectedRoute } from "./middleware/protectedRoute.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import Postrouter from "./routes/post.routers.js";
import {v2 as cloudinary} from "cloudinary";


dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true }));
app.use(cookieParser());
const PORT=process.env.PORT || 5000;
app.use("/api/auth",authRoute);
app.use("/api/auth",userRouter);
app.use ("/api/post",Postrouter);


console.log(process.env.MONGO_URI)
app.listen(PORT,()=>{
    console.log(`server is on ${PORT}`);
    connectMongoDB();
})