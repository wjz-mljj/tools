import React, { useState } from 'react'
import { Button, Input, Select, message } from 'antd';

const UrlCodec = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [urlValue, setUrlValue] = useState('');
  const [codeType, setCodeType] = useState('1');

  // 解码
  const handleDecode = () => {
    if (!urlValue) return messageApi.error('请先粘贴URL...');

    let decodedUrl = ''
    if (codeType === '1') {
      decodedUrl = decodeURI(urlValue);
    } else {
      decodedUrl = decodeURIComponent(urlValue);
    }
    setUrlValue(decodedUrl);
    console.log('解码:', decodedUrl);
  }

  // 编码
  const handleCode = () => {
    if (!urlValue) return messageApi.error('请先粘贴URL...');

    let encodedUrl = ''
    if (codeType === '1') {
      encodedUrl = encodeURI(urlValue);
    } else {
      encodedUrl = encodeURIComponent(urlValue);
    }
    setUrlValue(encodedUrl);
    console.log('编码:', encodedUrl);
  }

  const handleCopy = async () => {
    try {
      let result = await window.ipcRenderer.invoke('copy-string-clipboard', {text: urlValue})
      messageApi.success(result.msg)
    } catch (error) {}
  }

  return (<div>
    {contextHolder}
    <h2>url编码解码</h2>
    <div className="divCard">
      <div style={{marginBottom: '20px'}}>
        <span>编/解码方式：</span>
        <Select
          defaultValue="1"
          style={{ width: 300,}}
          value={codeType}
          onChange={(value) => {setCodeType(value)}}
          options={[
            { value: '1', label: 'encodeURI编码', },
            { value: '2', label: 'encodeURIComponent编码' },
          ]}
        />
      </div>
      <div style={{width: '100%'}}>
        <Input.TextArea
          value={urlValue}
          rows={6}
          placeholder='请粘贴/输入URL...'
          onChange={(e) => {
            setUrlValue(e.target.value)
          }}
        />
      </div>
      <div style={{marginTop: '20px'}}>
        <Button type="primary" onClick={handleDecode}>URL解码</Button>
        <Button style={{margin: '0 20px'}} onClick={handleCode}>URL编码</Button>
        <Button type="dashed" onClick={
          () => setUrlValue('https://example.com/path?name=Hello World!')
        }>来个例子</Button>
        <Button style={{margin: '0 20px'}} onClick={() => setUrlValue('')}>清空</Button>
        <Button onClick={handleCopy}>复制</Button>
      </div>
      <div style={{fontSize: '12px', color: '#a6aea3', marginTop: '20px'}}>
        <div>备注:</div>
        <div>encodeURI编码方式,不会对特殊符号编码。例如: https://www.baidu.com/</div>
        <div>encodeURIComponent编码方式,会对特殊符号编码。例如: https%3A%2F%2Fwww.baidu.com%2F</div>
      </div>
    </div>
  </div>)
}

export default UrlCodec;
