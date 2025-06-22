"use client"
import React, { useState, useEffect, useContext } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import CustomLoading from './_components/CustomLoading'
import { v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from '@/app/_context/VideoDataContext';
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import PlayerDialog from '../_components/PlayerDialog'
import { toast } from 'sonner'
import { db } from '@/configs/db'
import { Users } from '@/configs/schema'
import { eq } from 'drizzle-orm'


function CreateNew() {
  const [formData, setFormData] = useState({});
  const [loading,setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl,setAudioFileUrl]=useState();
  const [captions,setCaptions]=useState();
  const [imageList,setImageList]=useState();
  const [videoSaved, setVideoSaved] = useState(false);
  const [playVideo,setPlayVideo]=useState();
  const [videoId,setVideoId]= useState();
  const {videoData,setVideoData}=useContext(VideoDataContext)
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  const {user}=useUser()
  // useEffect(() => {
  //   if (audioFileUrl) {
  //     GenerateAudioCaption(audioFileUrl);
  //   }
  // }, [audioFileUrl]);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  };

  const GetVideoScript = async () => {
    setLoading(true);
    const prompt = 'Write a script to generate ' + formData.duration + ' video on topic : ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and ContentText as field';
    try {
      const result = await axios.post('/api/get-video-script', { prompt });
      setVideoData(prev=>({
        ...prev,
        'videoScript':result.data.result
      }))
      setVideoScript(result.data.result);
      await GenerateAudioFile(result.data.result);
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      console.error('Full error object:', error); // Debug: Log the full error
    }
    setLoading(false);
  };

  const GenerateAudioFile= async(videoScriptData)=>{
    setLoading(true);
    let script='';
    // Check if videoScriptData is an array before using forEach
    const id=uuidv4();
    if (Array.isArray(videoScriptData)) {
      videoScriptData.forEach(item=>{
        script+=item.contentText+' ';
      })
    } else {
      console.error('videoScriptData is not an array:', videoScriptData);
    }

    try {
      const resp = await axios.post('/api/generate-audio', {
        text: script,
        id: id
      });
      setVideoData(prev=>({
        ...prev,
        'audioFileUrl':resp.data.Result
      }))
      setAudioFileUrl(resp.data.Result);
      if(resp.data.Result) {
        await GenerateAudioCaption(resp.data.Result, videoScriptData);
      }
    } catch (error) {
      console.error('Audio generation error:', error.response?.data || error.message);
    }
    setLoading(false);
  }

  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/generate-captions', {
        audioFileUrl: fileUrl
      });
      setVideoData(prev=>({
        ...prev,
        'captions':resp.data.captions
      }));
      setCaptions(resp.data.captions);
      await GenerateImage(videoScriptData);
    } catch (error) {
      console.error('Caption generation error:', error.response?.data || error.message);
    }
    setLoading(false);
  };
  

  const GenerateImage = async (videoScriptData) => {
    setLoading(true);
    try {
      const prompts = videoScriptData.map((element) => element.imagePrompt);
       // Take only the first two scenes for testing
      //  const prompts = videoScriptData.slice(0, 2).map((element) => element.imagePrompt);

      const resp = await axios.post('/api/generate-image', {
        prompts: prompts,
      });
      
      const images = resp.data.result;
      setVideoData(prev=>({
        ...prev,
        'imageList':images
      }))
      setImageList(images);
    } catch (error) {
      console.error('Image generation error:', error);
    }
    setLoading(false);
  }

  const onCreateClickHandler = async () => {
    // Validate that all required fields are filled
    if(!(userDetail?.credits>=0)){
      toast("You don't have enough credits to create a video.");
      return
    }
    if (!formData.duration || !formData.topic || !formData.imageStyle) {
      console.error('Missing required fields:', {
        duration: formData.duration,
        topic: formData.topic,
        imageStyle: formData.imageStyle
      });
      alert('Please fill in all required fields (Duration, Topic, and Style)');
      return;
    }
    
    // Reset state for new video creation
    setVideoSaved(false);
    setVideoData({});
    
    await GetVideoScript();
  };

  useEffect(() => {
    // Only save when all required fields are present
    if (
      videoData?.videoScript &&
      videoData?.audioFileUrl &&
      videoData?.captions &&
      videoData?.imageList &&
      !videoSaved
    ) {
      setVideoSaved(true);
      SaveVideoData(videoData);
    }
  }, [videoData, videoSaved]);

  const SaveVideoData=async(videoData)=>{
    setLoading(true);
    try {
      const response = await axios.post('/api/save-video', {
        videoScript: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress
      });
      console.log('Video data saved successfully:', response.data);
      
      // Extract the video ID from the response
      if (response.data && response.data.videoId) {
        await UpdateUserCredits();
        setVideoId(response.data.videoId);
        setPlayVideo(true);
      }
    } catch (error) {
      console.error('Failed to save video data:', error);
    }
    setLoading(false);
  }

  const UpdateUserCredits=async()=>{
    const result=await db.update(Users).set({
      credits:userDetail?.credits-10
    }).where(eq(Users?.email,user?.primaryEmailAddress?.emailAddress))
    setUserDetail(prev=>({
      ...prev,
      "credits":userDetail?.credits-10
    }))
  }

  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center'></h2>
      <div className='mt-10 shadow-md p-10'>
        {/*Select topic*/}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/*select style*/}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/*duration*/}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/*create*/}
        <Button className="mt-10" onClick={onCreateClickHandler}>Create Video</Button>
      </div>
      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId}/>
    </div>
  );
}

export default CreateNew