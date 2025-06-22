"use client"
import { Button } from '@/components/ui/button';
import React, { useState,useEffect, useContext} from 'react'
import EmptyState from './_components/EmptyState'
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import VideoList from './_components/VideoList';
import { db } from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { eq } from 'drizzle-orm';

function Dashboard() {
  const [videoList,setVideoList]=useState();
  
  const {user}=useUser();

  useEffect(()=>{
    user&&GetVideoList();
  },[user])

  const GetVideoList=async ()=>{
    const result=await db.select().from(VideoData)
    .where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress))
    console.log(result);
    setVideoList(result);
  }

  const handleDelete = async (videoId) => {
    // Optimistically update UI
    setVideoList(prev => prev?.filter(v => v.id !== videoId));
    try {
      // Call your API or db to delete the video
      await db.delete(VideoData).where(eq(VideoData.id, videoId));
      // Optionally, re-fetch the list
      // await GetVideoList();
    } catch (error) {
      console.error('Failed to delete video:', error);
      // Optionally, revert UI
      // setVideoList(await db.select().from(VideoData).where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress)));
    }
  };

  return (
    <div className='z-10'>
        <div className='flex justify-between items-center'>
            <h2 className='font-bold text-2xl text-primary'>Dashboard</h2>
            <Link href={'/dashboard/create-new'}>
      <Button variant="gradient">+ Create New</Button>
      </Link>
        </div>
        
        {(videoList === undefined || videoList.length === 0) && <div>
            <EmptyState/>
            </div>}

        {/*list of videos*/}
        <VideoList videoList={videoList} onDelete={handleDelete}/>
    </div>
  )
}

export default Dashboard