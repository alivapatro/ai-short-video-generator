import React, { useEffect, useMemo } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

function RemotionVideo({script,imageList,audioFileUrl,captions,setDurationInFrame}) {
    

    const {fps}= useVideoConfig();
    const frame= useCurrentFrame();

    const duration = useMemo(() => {
        const lastCaption = captions?.[captions.length - 1];
        if (lastCaption && typeof lastCaption.end === 'number') {
          const d = (lastCaption.end / 1000) * fps;
          if (!isNaN(d)) {
            return d;
          }
        }
        return 1;
    }, [captions, fps]);

    useEffect(() => {
        setDurationInFrame(duration);
    }, [duration, setDurationInFrame]);

    const getCurrentCaptions = () => {
        const currentTime = (frame / fps) * 1000;
        if (!captions || captions.length === 0) {
          return null;
        }

        const currentWordIndex = captions.findIndex(
          (word) => currentTime >= word.start && currentTime <= word.end
        );

        if (currentWordIndex === -1) {
          return null;
        }

        // Display a sliding window of words
        const windowSize = 7;
        const start = Math.max(0, currentWordIndex - 3);
        const end = Math.min(captions.length, start + windowSize);

        const wordsToShow = captions.slice(start, end);

        return wordsToShow.map((word, index) => {
          const isCurrentWord = start + index === currentWordIndex;
          return (
            <span
              key={`${word.start}-${word.text}`}
              style={{
                color: isCurrentWord ? 'yellow' : 'white',
                textShadow: isCurrentWord
                  ? '0 0 6px yellow, 0 0 12px yellow'
                  : '0 0 3px black, 0 0 5px black',
                transition: 'color 0.2s, text-shadow 0.2s',
                margin: '0 4px',
                display: 'inline-block',
              }}
            >
              {word.text}
            </span>
          );
        });
    };

    const safeDuration = !isNaN(duration) && duration > 0 ? duration : 1;

    return (
        <AbsoluteFill className="bg-black">
            {Array.isArray(imageList) && imageList.length > 0 && !isNaN(safeDuration) && imageList.map((item, index) => {
                const startTime=Math.floor((index * safeDuration) / imageList.length)
                const localFrame = frame - startTime;
                const totalFrames = Math.ceil(safeDuration / imageList.length);
                let scale = 1;
                if (totalFrames > 0 && !isNaN(localFrame)) {
                    scale = interpolate(
                        localFrame,
                        [0, totalFrames / 2, totalFrames],
                        [1, 1.1, 1],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    );
                }
                if (isNaN(scale) || !isFinite(scale)) scale = 1;
                const imgStyle = {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${isNaN(scale) || !isFinite(scale) ? 1 : scale})`,
                    transition: 'transform 0.2s',
                };
                return (
                <Sequence
                    key={index}
                    from={isNaN(startTime) ? 0 : startTime}
                    durationInFrames={isNaN(totalFrames) || totalFrames <= 0 ? 1 : totalFrames}
                >
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Img
                            src={item}
                            style={imgStyle}
                        />
                        <AbsoluteFill
                            style={{
                                color: 'white',
                                justifyContent: 'center',
                                top: undefined,
                                bottom: 50,
                                height: 150,
                                textAlign: 'center',
                                width: '100%',
                            }}
                        >
                            <h2 className="text-3xl font-bold">{getCurrentCaptions()}</h2>
                        </AbsoluteFill>
                    </AbsoluteFill>
                </Sequence>
            )})}
            {audioFileUrl && <Audio src={audioFileUrl} />}
        </AbsoluteFill>
    );
}

export default RemotionVideo;