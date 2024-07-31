import React,{ useCallback, useEffect, useState, useRef } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Typography, message, Select } from 'antd'
import { getFileSuffix } from '../utils/func.js'
import BasePlayer from './player/BasePlayer.jsx'
import FlvPlayer from './player/FlvPlayer.jsx';
import VideoJsPlayer from './player/VideoJsPlayer.jsx';

let formatArr = [
  { value: 'mp4', label: 'MP4', isPlay: 'ok' }, // ok
  { value: 'mov', label: 'MOV', isPlay: 'ok' }, // ok
  { value: 'wmv', label: 'WMV', isPlay: 'no' }, // no
  { value: 'flv', label: 'FLV', isPlay: 'ok' }, // ok
  { value: 'avi', label: 'AVI', isPlay: 'no' }, // no
  { value: 'webm', label: 'WebM', isPlay: 'ok' }, // ok
  { value: 'mkv', label: 'MKV', isPlay: 'ok' }, // ok
  { value: 'm4v', label: 'm4v', isPlay: 'no' }, // no
]

const VideoPlayer = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFlvUrl, setVideoFlvUrl] = useState('');
  const [videoWmvUrl, setVideoWmvUrl] = useState('');
  const [videoWmvFile, setVideoWmvFile] = useState('');

  const customRequest = (info) => {
    setVideoUrl('');
    setVideoFlvUrl('');
    setVideoWmvUrl('');
    setVideoWmvFile('');
    console.log(info);
    try {
      let file = info.file;
      const url = URL.createObjectURL(file);
      console.log(url);
      let ext = getFileSuffix(file.name);
      switch(ext.toLocaleLowerCase()) {
        case 'flv':
          setVideoFlvUrl(url);
          break;
        case 'mp4':
        case 'mov':
        case 'webm':
        case 'mkv':
          setVideoUrl(url);
          break;
        case 'wmv':
        case 'avi':
        case 'm4v':
        case 'ogv':
        default:
          messageApi.error('暂不支持！')
          break;
      }
      
    } catch (error) {
      
    }
  }

  return (<div style={{padding: '20px'}}>
    {contextHolder}
    <h2>视频播放器</h2>
    <p>支持格式：{formatArr.map((data) => { 
      if (data.isPlay === 'ok') {
        return <span key={data.value} style={{padding: '0 5px'}}>{data.value}</span>
      }
      return '';
    })}</p>
    <div>
      <p>步骤一：</p>
      <Upload
        accept='video/*,.flv,.mkv'
        maxCount={1}
        showUploadList={false}
        customRequest={(info) => {
          customRequest(info)
        }}
      >
        <Button icon={<UploadOutlined />}>导入视频</Button>
      </Upload>
    </div>
    
    <div style={{marginTop: '20px'}}>
      {videoUrl && (
        <BasePlayer videoUrl={videoUrl} />
      )}
      {
        videoFlvUrl && (
          <FlvPlayer videoFlvUrl={videoFlvUrl} />
        )
      }
       {
        videoWmvUrl && (
          <VideoJsPlayer videoUrl={videoWmvUrl} file={videoWmvFile} />
        )
      }
    </div>
  </div>)
}

export default VideoPlayer
