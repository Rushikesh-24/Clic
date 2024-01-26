"use client"
import React, { useState } from 'react'
import {toast} from 'react-hot-toast'

const page = () => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
 
  const postData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      toast.error("Please enter a valid email address");
      return
    }
    fetch("http://localhost:3000/signup",{
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        password: password,
        email: email,
      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.err){
        toast.error(data.err)
      }
      else{
        window.location.href = '/login';
        toast.success(data.message)
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  return (
    <>
    <a href="/"><img src="/whitelogo.png" alt="" className="w-20 absolute m-8"/></a>
    <div id="footer" className="text-white absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-row w-screen justify-center mb-5" >
    <p className="inline text-gray-500">Already have an account?</p>
    <a href="/login" className="inline">Login</a>
    </div>
    
    <div className="h-screen w-screen  flex items-center justify-center text-white">
      <div id="container" className="w-5/6 h-4/5 flex justify-center items-center flex-col">
        <h1 className="text-3xl flex font-light w-10/12 ">Create Account</h1>
        <form  method="post" className="mt-8 flex flex-col items-center justify-center w-10/12 gap-4">
        <input type="email" id="email" name="email" placeholder="Email" className="border border-white bg-black px-7 py-1.5 rounded focus:outline-none w-full" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input type="text" id="name" name="name" placeholder="name" className="border border-white bg-black px-7 py-1.5 rounded focus:outline-none w-full" value={name} onChange={(e)=>setName(e.target.value)}/>
        <input type="password" id="password" name="password" placeholder="Password" className="border border-white bg-black px-7 py-1.5 rounded focus:outline-none w-full" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button type="button" className="bg-white hover:bg-gray-200 text-black font-semibold px-4 py-2 rounded w-full" onClick={()=>postData()}>Sign Up</button>
      </form>
      </div>
    </div>
    </>
  )
}

export default page