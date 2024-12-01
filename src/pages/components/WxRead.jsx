import React, { useState } from 'react'
import { Button, Input, Select, message } from 'antd';

const WxRead = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleClick = () => {
    window.ipcRenderer.invoke('open-wx-read', {}).then((res) => {
      console.log('res::::', res);
    }).catch((err) => {
      console.error('err::::', err);
    })
  }

  return (<div>
    {contextHolder}
    <div>
      <Button onClick={() => handleClick()}>handleClick</Button>
    </div>
  </div>)
}

export default WxRead;
