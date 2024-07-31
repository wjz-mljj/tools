import React, { useState } from 'react'
import { Navigate, Route, Routes , useNavigate} from 'react-router-dom'
import { Layout, Menu } from 'antd';
import Home from './components/Home.jsx'
import ConvertFormat from './components/ConvertFormat.jsx'
import Markdown from './components/markdown/Markdown.jsx'
import ImageConvert from './components/ImageConvert.jsx'
import VideoPlayer from './components/VideoPlayer.jsx'
import PasswordGenerato from './components/PasswordGenerato.jsx'
import UrlCodec from './components/UrlCodec.jsx'
import UuidGenerato from './components/UuidGenerato.jsx'
import UrlResolution from './components/UrlResolution.jsx'
import BinaryConvert from './components/BinaryConvert.jsx'
import JsonEditor from './components/JsonEditor.jsx'


const { Header, Footer, Sider, Content } = Layout;

function App() {
  const [current, setCurrent] = useState('/home');
  const navigate = useNavigate();

  const items = [
    {
      key: '/home',
      label: '首页',
      icon: <i className={`iconfont ${current === '/home' ? 'icon-a-1shouye-copy' : 'icon-a-1shouye'}`}></i>,
    },
    {
      key: '/uuidGenerato',
      label: 'UUID生成器',
      icon: <i className={`iconfont ${current === '/uuidGenerato' ? 'icon-square-u-copy' : 'icon-square-u'}`}></i>,
    },
    {
      key: '/passwordGenerato',
      label: '密码生成器',
      icon: <i className={`iconfont ${current === '/passwordGenerato' ? 'icon-AttributeKeyDisabled-copy' : 'icon-AttributeKeyDisabled'}`}></i>,
    },
    {
      key: '/urlCodec',
      label: 'Url编码解码',
      icon: <i className={`iconfont ${current === '/urlCodec' ? 'icon-URLguanli-copy' : 'icon-URLguanli'}`}></i>,
    },
    {
      key: '/urlResolution',
      label: 'Url地址解析',
      icon: <i className={`iconfont ${current === '/urlResolution' ? 'icon-lianjieyouhua--copy' : 'icon-lianjieyouhua'}`}></i>,
    },
    {
      key: '/binaryConvert',
      label: '进制转换',
      icon: <i className={`iconfont ${current === '/binaryConvert' ? 'icon-shujuchaxun-copy' : 'icon-shujuchaxun'}`}></i>,
    },
    {
      key: '/markdown',
      label: 'Markdown',
      icon: <i className={`iconfont ${current === '/markdown' ? 'icon-file-markdown-copy' : 'icon-file-markdown'}`}></i>,
    },
    {
      key: '/jsonEditor',
      label: 'JSON编辑器',
      icon: <i className={`iconfont ${current === '/jsonEditor' ? 'icon-json-copy' : 'icon-json'}`}></i>,
    },
    {
      key: '/imageConvert',
      label: '图片转换',
      icon: <i className={`iconfont ${current === '/imageConvert' ? 'icon-tupianzhuanhuan-copy' : 'icon-tupianzhuanhuan'}`}></i>,
    },
    {
      key: '/videoPlayer',
      label: '视频播放器',
      icon: <i className={`iconfont ${current === '/videoPlayer' ? 'icon-shipinbofang-copy' : 'icon-shipinbofang-copy'}`}></i>,
    },
    {
      key: '/convertFormat',
      label: '视频转换',
      icon: <i className={`iconfont ${current === '/convertFormat' ? 'icon-shipinzhuanhuan-copy' : 'icon-shipinzhuanhuan'}`}></i>,
    },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  }
  return (
    <div>
      <Layout className='layoutStyle'>
        <Layout>
          <Sider theme='light' className='siderStyle'>
              <Menu
                theme={'light'}
                onClick={onClick}
                className='menuStyle'
                mode="inline"
                items={items}
                selectedKeys={[current]}
                style={{width: 200, flex: 'none'}}
              />
            </Sider>
          <Layout>
            <Content className='contentStyle'>
              <Routes>
                <Route path='/' element={<Navigate to="/"/>}></Route>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/convertFormat' element={<ConvertFormat />}></Route>
                <Route path='/markdown' element={<Markdown />}></Route>
                <Route path='/imageConvert' element={<ImageConvert />}></Route>
                <Route path='/videoPlayer' element={<VideoPlayer />}></Route>
                <Route path='/passwordGenerato' element={<PasswordGenerato />}></Route>
                <Route path='/urlCodec' element={<UrlCodec />}></Route>
                <Route path='/urlResolution' element={<UrlResolution />}></Route>
                <Route path='/uuidGenerato' element={<UuidGenerato />}></Route>
                <Route path='/binaryConvert' element={<BinaryConvert />}></Route>
                <Route path='/jsonEditor' element={<JsonEditor />}></Route>
                
                <Route path='*' element={<div>页面丢失了</div>}></Route>
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default App;
