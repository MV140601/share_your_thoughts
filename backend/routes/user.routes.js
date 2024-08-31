import express from 'express';
 import { protectedRoute } from '../middleware/protectedRoute.js';
import { getUserInfo,UserAction,getSuggestedUsers,updateUserInfo } from '../controllers/user.controller.js';


const userRouter=express.Router();

userRouter.get("/profile/:userName",protectedRoute,getUserInfo);
userRouter.get("/suggested",protectedRoute,getSuggestedUsers);
 userRouter.post("/follow/:id",protectedRoute,UserAction);
 userRouter.post("/update",protectedRoute,updateUserInfo);

export default userRouter;