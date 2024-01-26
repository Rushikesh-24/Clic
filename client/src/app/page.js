"use client"
import Header from "./components/Header";
import { useEffect, useState } from "react";



export default function Home() {
  const [like, setlike] = useState(false)
  const [data, setData] = useState([])
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);
  useEffect(()=>{
    fetch("http://localhost:3000/allpost",{
      method: "get",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(res=>res.json())
    .then(result=>{
      setData(result.posts);
    })
  },[])

const likepost = (id) => {
  fetch("http://localhost:3000/like",{
    method: "put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      postId: id
    })
  })
  .then(res=>res.json())
  .then(result=>{
    setlike(true)
    const newdata = data.map(item=>{
      if(item._id==result._id){
        return result
      }
      else{
        return item
      }
    })
    setData(newdata)
  }).catch(err=>{
    console.log(err);
  })
}
const unlikepost = (id) => {
  fetch("http://localhost:3000/unlike",{
    method: "put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      postId: id
    })
  })
  .then(res=>res.json())
  .then(result=>{
    setlike(false)
     const newdata = data.map(item=>{
      if(item._id==result._id){
        return result
      }
      else{
        return item
      }
    })
    setData(newdata)
  }).catch(err=>{
    console.log(err);
  })
}
 
const comment = (text,postId) => {
  fetch("http://localhost:3000/comment",{
    method: "put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      postId: postId,
      text:text
    })
  })
  .then(res=>res.json())
  .then(result=>{
    console.log(result.comments);
    const newdata = data.map(item=>{
      if(item._id==result._id){
        return result
      }
      else{
        return item
      }
    })
    setData(newdata)
  })
  .catch(err=>{
    console.log(err);
  })
}
  return (
    <>
    <Header/>
    <div className="w-screen h-auto">
      <div id="posts" className="w-full">
          {data.map(item=>{
            return(
              <div id="post" className="m-10 md:flex md:flex-col md:justify-center md:items-center" key={item._id}>
                <div id="head" className="flex h-10 justify-between">
            <h5 className="flex items-center">{item.postedby.name}</h5>
                </div>
            <img src={item.photo} alt="" className="md:w-1/2 border-white border-2"/>
            <div id="content" className="mt-3 md:text-center">
              <img src="/like.png" alt="" className={`w-7 m-2 ${like ? '' : ''}`} onClick={()=>{
                if(like){
                  unlikepost(item._id)
                }
                else{
                  likepost(item._id)
                }
              }} loading="lazy"/>
              <h4>{item.likes.length} Likes</h4>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
              {
                item.comments.map(record=>{
                   return (
                     <h6 key={record._id} className="text-gray-500"><span className="text-gray-400">{record.postedBy.name} </span>{record.text}</h6>
                    
                   )
                })
              }
              <form action="" onSubmit={(e)=>{
                e.preventDefault();
                // console.log(e.target[0].value);
                comment(e.target[0].value,item._id);
              }}>
              <input id={item._id} type="text" placeholder="Add a comment..." className="bg-black focus:outline-none" />
              </form>
            </div>
          </div>
            )
          })}
      </div>
      
    </div>
    </>
  );
}
