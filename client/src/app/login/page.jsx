"use client"
import React, { useState } from 'react'
import {toast} from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
 
  const postData = (event) => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      toast.error("Please enter a valid email address");
      return
    }
    fetch("http://localhost:3000/signin",{
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: password,
        email: email,
      })
    }).then(res=>res.json())
    .then(data=>{
      if(!data.err){
        localStorage.setItem("jwt",data.token)
        // localStorage.setItem("user",JSON.stringify(data.user))
        localStorage.setItem("name",data.user.name)
        router.push('/')
        toast.success("Successfully signed in") 
        return
      }
      else{
        toast.error(data.err)
      }
    }).catch(err=>{
      console.log(err,"Error signing in");
      return
    })
  }
  return (
    <>
    <a href="/"><img src="/whitelogo.png" alt="" className="w-20 absolute m-8"/></a>
    <div id="footer" className="text-white absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-row w-screen justify-center mb-5" >
    <p className="inline text-gray-500">Don't have an account?</p>
    <a href="/signup" className="inline">Sign up</a>
    </div>
    
    <div className="h-screen w-screen  flex items-center justify-center text-white">
      <div id="container" className="w-5/6 h-4/5 flex justify-center items-center flex-col">
        <h1 className="text-3xl flex font-light w-10/12 ">Login</h1>
        <form action="" method="POST" className="mt-8 flex flex-col items-center justify-center w-10/12 gap-4 ">
        <input type="email" id="text" name="Email" placeholder="Email" className="border border-white bg-black px-7 py-1.5 rounded focus:outline-none w-full" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" id="password" name="password" placeholder="Password" className="border border-white bg-black px-7 py-1.5 rounded focus:outline-none w-full"  value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button type="button" className="bg-white hover:bg-gray-200 text-black font-semibold px-4 py-2 rounded w-full" onClick={()=>postData()} >Login</button>
      </form>
      </div>
    </div>
    </>
  )
}

export default page