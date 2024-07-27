import React,{ useCallback, useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'

const BasePlayer = ({ videoUrl }) => {

  // 支持播放mp4、mov、webm、mkv
  return (<div>
      {videoUrl && (
        <ReactPlayer 
          url={videoUrl} 
          controls 
          width="100%" 
          height="100%" 
          playing
        />
      )}
  </div>)
}

export default BasePlayer
