import jwt from 'jsonwebtoken';

const  generateTokenAndSetCookie=(userId,res)=>{
    const secretKey=process.env.JWT_SECRET||"qsds9qhd92qus1";
const token =jwt.sign({userId},secretKey,{
    expiresIn:'15d'
})
     
res.cookie("jwt",token,{
    maxAge:15*24*60*60*1000,
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV!=='development',
})

}

export default generateTokenAndSetCookie