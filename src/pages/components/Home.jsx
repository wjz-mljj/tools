import React from "react";


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
    <h2>欢迎来到小工具合集</h2>
  </div>
}

export default Home;
