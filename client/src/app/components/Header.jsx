import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <>
    <div className='w-screen'>
      <ul className='flex flex-row gap-4 justify-end items-end mr-4 mt-5'>
      <li className='w-16 left-0 absolute ml-4'><a href="/"><img src="/whitelogo.png" alt="" /></a></li>
        <li><Link href="/post">Post</Link></li>
        <li><Link href="/profile">Profile</Link></li>
        <li><button onClick={()=>{
          localStorage.clear()
          window.location.href = '/login';
        }}>Logout</button></li>
      </ul>
    </div>
    </>
  )
}

export default Header