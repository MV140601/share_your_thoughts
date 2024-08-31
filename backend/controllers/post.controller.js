import express from 'express'
import Users from '../models/user.model.js';
import Post from '../models/post.model.js';
import {v2 as cloudinary} from 'cloudinary';

export const createPost=async(req,res )=>{
try {
let {text}=req.body;
let {img}=req.body;
const userId=req.user._id.toString();

const user=await Users.findById({_id:userId});
if(!user) return res.status(404).json({error:"User Not Found"});
if(!text &&!img){
    if(!user) return res.status(404).json({error:"Post must have both Text and Imge"});

}

if(img){
    const uploadedResponse=await cloudinary.uploader.upload(img);
    img=uploadedResponse.secure_url;
    
}

const newPost=new Post({
    user:userId,
    text:text,
    img:img
})

await newPost.save();
res.status(201).json(newPost);


} catch (error) {
    res.status(500).json({err:error.message})
}
}