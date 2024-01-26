"use client"
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'

const page = () => {
  const [post, setPost] = useState([])
  const [userdata, setUserdata] = useState("")
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      window.location.href = '/login';
    }
    setUserdata(localStorage.getItem("name"))
  },[]);

  useEffect(() => {
    fetch("http://localhost:3000/mypost",{
      headers:{
        "Authorization": "Bearer "+localStorage.getItem('jwt')
      }
    })
    .then(res=>res.json())
    .then(result =>{
      setPost(result.myPost)
    })
  },[])
  return (
    <>
    <Header/>
    <div className='w-screen h-screen'>
      <div className='w-screen h-1/5 flex flex-row md:h-fit'>
        <div id="profile" className='w-1/3 m-10 h-fit md:h-1/2 md:w-1/5'>
          <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='rounded-full'/>
        </div>
        <div id="info" className='m-10 text-center'>
          <h3 className='font-semibold text-xl'>{userdata}</h3>
          <div className='mt-5 text-gray-400'>
            <h4>10 posts</h4>
            <h4>100 followers</h4>
            <h4>100 following</h4>
          </div>
        </div>
      </div>
      <h3 className='m-8 text-xl'>Posts</h3>
      <div id="posts" className='grid grid-cols-3 gap-3 m-4 '>
        {post.map(item=>{
            return <img src={item.photo} alt={item.title} key={item._id} className=' border-2 border-gray-500'/>
        })
       }
      </div>
    </div>
    </>
  )
}

export default page