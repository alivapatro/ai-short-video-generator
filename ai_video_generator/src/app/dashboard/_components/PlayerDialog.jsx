import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Player } from "@remotion/player"
import RemotionVideo from './RemotionVideo'
import { db } from '@/configs/db'
import { VideoData } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'

function PlayerDialog({playVideo,videoId}) {

    const [openDialog,setOpenDialog]=useState(false);
    const [videoData,setVideoData]=useState();
    const [durationInFrame,setDurationInFrame]=useState(100);
    const router=useRouter();
    useEffect(()=>{
        setOpenDialog(!openDialog)
        if(videoId) {
            GetVideoData();
        }
    },[playVideo, videoId])

    const GetVideoData=async()=>{
        try {
            const result = await db.select().from(VideoData)
                .where(eq(VideoData.id,videoId));
            console.log("Video Data from DB in PlayerDialog:", result);
            setVideoData(result[0]);
        } catch (error) {
            console.error('Error fetching video data:', error);
        }
    }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="bg-white flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold my-5">Your Video is ready</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center my-4">
          <Player
            component={RemotionVideo}
            durationInFrames={Number(durationInFrame.toFixed(0))}
            compositionWidth={300}
            compositionHeight={450}
            fps={30}
            controls={true}
            inputProps={{
                ...videoData,
                setDurationInFrame: (frameValue) => setDurationInFrame(frameValue)
            }}
          />
        </div>
        
        <DialogDescription className="text-center">
          Your video has been generated successfully!
        </DialogDescription>
        
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="ghost" onClick={() =>{router.replace('/dashboard')
            setOpenDialog(false)}}>
          Cancel</Button>
          <Button>Export</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlayerDialog