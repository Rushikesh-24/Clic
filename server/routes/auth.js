import express from "express"
const router = express.Router();
import mongoose from "mongoose";
const User =mongoose.model("User");
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../keys.js"; 
import requiredLogin from "../middleware/requirelogin.js"


router.post("/signup",(req,res)=>{
    const {name,email,password}=req.body
    if(!email || !password || !name ){
        return res.status(422).json({err:"Please enter all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({err:"User already exists"})
        }
        bcrypt.hash(password,12)
            .then(hashedpassword=>{
                const user = new User({
                    email:email,
                    password:hashedpassword,
                    name:name,
                })
                user.save()
                .then(user=>{
                    res.json({message:"Sign up successfull"})
                })
                .catch(err=>{
                    console.log(err);
                })
        })  
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post("/signin",(req,res)=>{
    const {email,password}= req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email and password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Succesfully signed in"})
                const token = jwt.sign({id:savedUser._id},JWT_SECRET)
                const {_id,name,email} = savedUser
                res.json({token:token,user:{_id,name,email}})
            }
            else{
                res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})

export default router