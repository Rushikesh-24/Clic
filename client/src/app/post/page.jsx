'use client'
import React, { useEffect, useState } from 'react'
import {toast} from 'react-hot-toast'
import Header from '../components/Header'
import { useRouter } from 'next/navigation'

const page = () => {
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false);
  
  const cloudinaryUpload = async (image) => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "Clicwebsite");
      data.append("cloud_name", "rushikesh24");
  
      const response = await fetch("https://api.cloudinary.com/v1_1/rushikesh24/image/upload", {
        method: "post",
        body: data
      });
  
      const cloudinaryData = await response.json();
      return cloudinaryData.url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };
  
  const createPost = async (title, body, photo, jwt) => {
    try {
      const response = await fetch("http://localhost:3000/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({
          title,
          body,
          photo,
        })
      });
  
      const postData = await response.json();
      return postData;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };
  
  const postData = async () => {
    try {
      setLoading(true);
      const url = await cloudinaryUpload(image);
  
      const postDataResponse = await createPost(title, body, url, localStorage.getItem("jwt"));
  
      console.log(postDataResponse);
  
      if (!postDataResponse.err) {
        router.push('/');
        toast.success("Successfully posted");
      } else {
        toast.error(postDataResponse.err);
      }
    } catch (error) {
      console.error("Error in postData:", error);
    }finally{
      setLoading(false);
    }
  };
  return (
    <>
    <Header/>
    <div className='w-screen h-screen'>
        <div className='flex flex-col m-10 gap-4'>
        <input type="text" name="title" id="title" placeholder='Title' className='border border-white bg-black px-7 py-1.5 rounded focus:outline-none w-full' value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
        <input type="text" name="body" id="body" placeholder='Description' className='border border-white bg-black px-7 py-1.5 rounded focus:outline-none w-full' value={body} onChange={(e)=>{setBody(e.target.value)}}/>
        <label htmlFor="file" className='bg-white text-black text-center py-1.5 '>Add Image</label>
        <input type="file" className='hidden' id='file' required onChange={(e)=>setImage(e.target.files[0])}/>
        <button className='bg-white text-black text-center py-1.5' onClick={()=>postData()}>{loading ? 'Uploading...' : 'Submit'}</button>
        </div>
    </div>
    </>
  )
}

export default page