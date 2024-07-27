import React, { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoJsPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    console.log('videoRef.current::', videoRef.current);
    const player = videojs(videoRef.current, {
      controls: true,
      sources: [{ src: videoUrl, type: 'video/ogg' }],
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [videoUrl]);

  return (
    <div>
       <video ref={videoRef} className="video-js vjs-default-skin" style={{width: '100px', height: '100px',border: '1px solid #000'}} />
       {/* <video
            // src={videoWmvUrl}
            // ref={videoRef}
            controls={true}
            autoPlay={true}
            style={{width: '100%', height: '100%',  objectFit: 'fill',}}
          >
            <source src={videoWmvUrl} type='video/avi'></source>
          </video> */}
    </div>
  );
};

export default VideoJsPlayer;
