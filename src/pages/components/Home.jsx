import React from "react";
import { Button } from "antd";


const Home = () => {

  const handleClick = async () => {
    let result = await window.ipcRenderer.invoke('check-server-status')
    console.log('交互::::', result);
  }

  const handleClickTwo = async () => {
    let result = await window.ipcRenderer.invoke('test-format')
    console.log('交互::::', result);
  }

  return <div>
    <h2>Home</h2>
    <Button onClick={() => {handleClick()}}>点击测试</Button>
    <Button onClick={() => {handleClickTwo()}}>点击Two</Button>
  </div>
}

export default Home;
