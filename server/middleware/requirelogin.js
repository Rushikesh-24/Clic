import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../keys.js"; 
import mongoose from "mongoose";
const User =mongoose.model("User");
const requiredLogin = (req,res,next) =>{
    const {authorization} = req.headers
    if(!authorization){
        return  res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})
        }
        const {id}= payload
        User.findById(id).then(userdata =>{
            req.user = userdata
            next()
        })
    })
} 
export default requiredLogin