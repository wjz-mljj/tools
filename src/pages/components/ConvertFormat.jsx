import React, { useState } from 'react'
import { Button, Upload, Typography, Select, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { guid, getFileSuffix } from '../utils/func.js';

const { Text } = Typography;

const ConvertFormat = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [filename, setFilename] = useState('');
  const [errorFlag, setErrorFlag] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [keyFileName, setKeyFileName] = useState('');
  const [keyId, setKeyId] = useState('');
  const [progress, setProgerss] = useState(0);
  const [formatValue, setFormatValue] = useState('mp4');
  const [converPadding, setConverPadding] = useState(''); 
  const [saveData, setSaveData] = useState({success: '', msg: ''});
  const [uploadLoading, setUploadLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // 上传文件
  const customRequest = async (info) => {
    console.log('info:::', info);
    let file = info.file;
    setFilename(info.file.name);
    setErrorFlag(false);
    setErrorMsg('');
    setKeyId('');
    setKeyFileName('');
    setConverPadding('');
    setSaveData({success: '', msg: ''});
    setUploadLoading(true);
    if (file) {
      let key = guid();
      let ext = getFileSuffix(info.file.name); // 后缀名 如：mp4
      let keyName = `${key}.${ext}`;
      setKeyId(key);
      setKeyFileName(keyName);
      const CHUNK_SIZE = 1024 * 1024 * 5; // 每次传输5MB
      const fileReader = new FileReader();
      let offset = 0;
      fileReader.onload = (e) => {
        window.ipcRenderer.send('file-chunk', { name: keyName, chunk: e.target.result, offset });
        offset += e.target.result.byteLength;
        setProgerss(Number(Math.min(100, (offset / file.size) * 100).toFixed(2)));
        if (offset < file.size) {
          readNextChunk();
        } else {
          setUploadLoading(false);
          window.ipcRenderer.send('file-end', { name: keyName });
        }
      };

      // 监听主进程的回复消息
      window.ipcRenderer.on('file-process-message', (event, message) => {
        console.log(message); // 在控制台打印消息
        setUploadLoading(false);
        let { code, msg } = message;
        if (code == 500) {
          setErrorFlag(true);
          setErrorMsg(msg);
          setKeyFileName('');
          setKeyId('');
          messageApi.open({ type: 'error', content: msg });
        }
      });

      const readNextChunk = () => {
        const blob = file.slice(offset, offset + CHUNK_SIZE);
        fileReader.readAsArrayBuffer(blob);
      };

      readNextChunk();
    } else {
      setUploadLoading(false);
    }
  };

  // 转换格式
  const handleCoverFormat = async () => {
    if (!keyFileName) {
      messageApi.open({ type: 'warning', content: '请先导入文件！' });
      return;
    }

    let ext = getFileSuffix(keyFileName); // 后缀名 如：mp4
    if (ext.toLocaleLowerCase() === formatValue) {
      messageApi.open({ type: 'warning', content: '要转换的格式与原视频格式一样！' });
      return;
    }
    setCoverLoading(true);
    let obj = {key: keyFileName, format: formatValue, keyId }
    // window.ipcRenderer.send('test-data', {name: 'test data'})
    window.ipcRenderer.invoke('file-convert-format', { ...obj }).then((res) => {
      console.log('res::::', res);
    }).catch((err) => {
      console.error('err::::', err);
      setCoverLoading(false);
    })

    window.ipcRenderer.on('conver-process-message', (event, message) => {
      // console.log(message); // 在控制台打印消息
      setConverPadding(message);
      if (message == '100' || message == 'error'){
        setCoverLoading(false);
      }
    });
  }

  const renderText = () => {
    let type = 'success';
    let context = '';
    if (errorFlag) {
      type = 'danger';
      context = errorMsg;
    } else {
      context = `${filename ? `${filename} ---` : ''} ${progress ? `${progress}%` : ''}`
    }
    return <Text type={type}>{context}</Text>
  }

  const renderTextTwo = () => {
    let type = 'success';
    let context = '';
    if (converPadding == '100') {
      context = '转换成功，请保存！';
    } else if(converPadding == 'error') {
      type = 'danger';
      context = `转换失败，请从第一步重新开始！`;
    } else if (converPadding) {
      context = `转换中:::${converPadding}%`;
    }
    return <Text type={type}>{context}</Text>
  }

  return (<div>
    {contextHolder}
    <div>
      <p>步骤一：</p>
      <Upload
        accept='video/mp4,video/webm,.mov,video/avi'
        maxCount={1}
        showUploadList={false}
        customRequest={(info) => customRequest(info)}
      >
        <Button loading={uploadLoading} disabled={uploadLoading} icon={<UploadOutlined />}>导入视频</Button>
        <div>
          {renderText()}
        </div>
      </Upload>
    </div>
    <div>
      <p>步骤二：</p>
      <Button loading={coverLoading} disabled={coverLoading} onClick={() => handleCoverFormat()}>转换格式</Button>
      <Select
        value={formatValue}
        style={{ width: 120, }}
        onChange={(value) => {
          setFormatValue(value)
        }}
        options={[
          { value: 'mp4', label: 'mp4' },
          { value: 'webm', label: 'webm' },
          { value: 'mov', label: 'mov' },
          { value: 'avi', label: 'avi' }
        ]}
      />
      <div>{renderTextTwo()}</div>
    </div>
  </div>)
}

export default ConvertFormat
