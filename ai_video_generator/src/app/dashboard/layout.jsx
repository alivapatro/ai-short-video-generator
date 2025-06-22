"use client"
import React, { useState, useEffect, useContext } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import {VideoDataContext} from '../_context/VideoDataContext'
import { UserDetailContext } from '../_context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs/db'
import { Users } from '@/configs/schema'
import { eq } from 'drizzle-orm'

function DashboardLayout({children}) {
  const [videoData,setVideoData]=useState([]);
  const [userDetail,setUserDetail]=useState([]);
  const {user}=useUser();

  useEffect(()=>{
    user&&getUserDetail();
  },[user])

  const getUserDetail=async()=>{
      const result=await db.select().from(Users)
      .where(eq(Users.email,user?.primaryEmailAddress?.emailAddress))
      setUserDetail(result[0]);
  }
  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <VideoDataContext.Provider value={{videoData,setVideoData}}>
      <div className="relative">
      <div className="z-20 relative">
        <div className='hidden md:block h-screen text-black mt-[56px] fixed w-[64px] z-20'>
            <SideNav/>
        </div>
        <div>
        <div className="z-20 relative bg-white bg-opacity-80">
          <Header />
        </div>
        <div className='ml-64 p-10 z-20'>
            {children}
        </div>
    </div>
    </div>
    </div>
    </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default DashboardLayout