import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { createPost } from '../controllers/post.controller.js';

const Postrouter=express.Router();

Postrouter.post("/createPost",protectedRoute,createPost);
// Postrouter.post("/deletePost",protectedRoute,deletePost);
// Postrouter.post("/likePost/:id",protectedRoute,likePost);
// Postrouter.post("/addComment/:id",protectedRoute,addComment);

export default Postrouter;