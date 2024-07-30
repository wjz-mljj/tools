import React, { useState } from 'react'
import { Navigate, Route, Routes , useNavigate} from 'react-router-dom'
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
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

const items = [
  {
    key: '/home',
    label: '首页',
    icon: <MailOutlined />,
  },
  {
    key: '/uuidGenerato',
    label: 'UUID生成器',
    icon: <MailOutlined />,
  },
  {
    key: '/passwordGenerato',
    label: '密码生成器',
    icon: <MailOutlined />,
  },
  {
    key: '/urlCodec',
    label: 'Url编码解码',
    icon: <MailOutlined />,
  },
  {
    key: '/urlResolution',
    label: 'Url地址解析',
    icon: <MailOutlined />,
  },
  {
    key: '/binaryConvert',
    label: '进制转换',
    icon: <MailOutlined />,
  },
  {
    key: '/markdown',
    label: 'Markdown',
    icon: <MailOutlined />,
  },
  {
    key: '/jsonEditor',
    label: 'JSON编辑器',
    icon: <MailOutlined />,
  },
  {
    key: '/imageConvert',
    label: '图片转换',
    icon: <MailOutlined />,
  },
  {
    key: '/videoPlayer',
    label: '视频播放器',
    icon: <MailOutlined />,
  },
  {
    key: '/convertFormat',
    label: '视频转换',
    icon: <MailOutlined />,
  },
];

function App() {
  const [current, setCurrent] = useState('/jsonEditor');
  const navigate = useNavigate();

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
              />
            </Sider>
          <Layout>
            <Content className='contentStyle'>
              <Routes>
                <Route path='/' element={<Navigate to="/jsonEditor"/>}></Route>
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
            <Footer className='footerStyle'>Footer</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default App;
