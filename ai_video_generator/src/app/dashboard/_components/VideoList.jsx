import React, { useState } from "react";
import {Thumbnail} from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import PlayerDialog from "./PlayerDialog";

function VideoList({videoList, onDelete}) {
  // Filter out videos with invalid or missing imageList URLs
  const validVideoList = videoList?.filter(video => {
    if (!video.imageList || !Array.isArray(video.imageList)) return false;
    // At least one valid image URL
    return video.imageList.some(url => typeof url === 'string' && url.startsWith('http'));
  });

  const [openPlayerDialog, setOpenPlayerDialog] = useState(false);
  const [videoId, setVideoId] = useState();

  const handleCardClick = (id) => {
    setVideoId(id);
    setOpenPlayerDialog(true);
  };

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {validVideoList?.map((video, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center relative transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-primary/70"
          onClick={() => handleCardClick(video.id)}
        >
          <Thumbnail
            component={RemotionVideo}
            compositionWidth={300}
            compositionHeight={450}
            frameToDisplay={30}
            durationInFrames={120}
            fps={30}
            inputProps={{
                ...video,
                setDurationInFrame:(v)=>console.log(v)
            }}
          />
          <div className="w-full mt-3 flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-2">
              By: {video.createdByName ? video.createdByName : video.createdBy}
            </div>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs mt-2"
              onClick={e => { e.stopPropagation(); onDelete && onDelete(video.id); }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {(!validVideoList || validVideoList.length === 0) && (
        <div className="col-span-full text-center text-gray-400">No videos found.</div>
      )}
      {openPlayerDialog && (
        <PlayerDialog playVideo={openPlayerDialog} videoId={videoId} onOpenChange={setOpenPlayerDialog} />
      )}
    </div>
  );
}

export default VideoList;
