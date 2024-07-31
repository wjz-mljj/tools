import React,{ useEffect, useRef } from 'react'
import FlvJs from 'flv.js'

const FlvPlayer = ({ videoFlvUrl }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoFlvUrl) {
      const videoElement = videoRef.current;
      // const flvjs = window.flvjs;

      const player = FlvJs.createPlayer({
        type: 'flv',
        url: videoFlvUrl, // 替换为你的FLV视频路径
        isLive: false, // 是否为直播流
        enableWorker: false, // 是否启用Web Worker以提高性能
        enableStashBuffer: false, // 是否启用暂存缓冲区以支持HLS流
        stashInitialSize: 0, // 暂存缓冲区的初始大小（以毫秒为单位）
        stashMaxSize: 0, // 暂存缓冲区的最大大小（以毫秒为单位）
        preload: 'auto', // 是否预加载视频流数据（可选值：'auto', 'metadata', 'none'）
        mediaDataSource: { type: 'flv', src: videoFlvUrl }, // 视频源路径（可以是本地文件或网络URL）
      });
      player.attachMediaElement(videoElement); // 将FLV.js播放器附加到视频元素上
      player.load(); // 加载视频流数据
    }
    }, [videoFlvUrl]
  );

  return (<div>
      {videoFlvUrl && (
        <div style={{ width: '100%', height: '100%'}}>
          <video
            style={{width: '100%', height: '100%',  objectFit: 'fill'}}
            ref={videoRef}
            controls={true}
            autoPlay={true}
          ></video>
        </div>
      )}
  </div>)
}

export default FlvPlayer
