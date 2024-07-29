import React, { useState } from 'react'
import { Button, Descriptions, Input, message } from 'antd';


const UrlResolution = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [urlValue, setUrlValue] = useState('');
  const [parseData, setParseData] = useState(null);

  const handleGenerate = () => {
    if (!urlValue) return messageApi.error('请先输入URL地址...');
    const url = new URL(urlValue);
    console.log(url);

    const userinfo = `${url.username}:${url.password}`;
    const tld = url.hostname.split('.').slice(-2).join('.');
    const authority = url.host;
    const subdomain = url.hostname.split('.').slice(0, -2).join('.');
    const directory = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
    const filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
    const suffix = filename.split('.').pop();
    const query = url.search.replace(/^\?/, ''); // ?search=test&foo=bar
    const resource = `${url.pathname}${url.search}${url.hash}`; 

    const obj = {
      protocol:	url.protocol,
      username:	url.username,
      password:	url.password,
      hostname:	url.hostname,
      port:	url.port,
      fullHost:	url.host,
      userinfo:	userinfo,
      authority: authority,
      origin:	url.origin,
      subdomain: subdomain,
      tld: tld,
      pathname:	url.pathname,
      directory: directory,
      filename: filename,
      suffix:	suffix,
      query: query,
      hash:	url.hash,
      fragment:	url.hash,
      resource: resource,
    }
    let arr = []
    for (let [key, value] of Object.entries(obj)) {
      arr.push({key, value})
    }
    console.log('arr::', arr);
    setParseData([ ...arr ]);
  }

  return (<div>
    {contextHolder}
    <h2>url地址解析</h2>
    <div className="divCard">
      <div style={{width: '100%'}}>
        <Input.TextArea
          value={urlValue}
          rows={6}
          placeholder='请输入URL地址...'
          onChange={(e) => {
            setUrlValue(e.target.value)
          }}
        />
      </div>
      <div style={{marginTop: '20px'}}>
        <Button type="primary" onClick={handleGenerate}>生成</Button>
        <Button style={{marginLeft: '20px'}} type="dashed" onClick={
          () => setUrlValue('https://user:pass@example.co.uk:8080/path/to/file.html?search=test&foo=bar#hash')
        }>来个例子</Button>
        <Button style={{margin: '0 20px'}} onClick={() => {
          setUrlValue('');
          setParseData(null);
        }}>清空</Button>
      </div>
      {parseData && (
        <div style={{marginTop: '20px'}}>
          <Descriptions
            size='small'
            bordered
            column={1}
            labelStyle={{ width: '200px' }}
            style={{height: '280px', overflowY: 'auto'}}
          >
            {parseData.map(data => {
              return (
                <Descriptions.Item key={data.key} label={data.key}>
                  {data.value}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        </div>
      )}
      
      <div style={{fontSize: '12px', color: '#a6aea3', marginTop: '20px'}}>
        <div>备注:</div>
        <div>URL地址解析：在线URL地址解析工具，可以对输入的URL地址进行解析，解析出各种不同的属性值，包括protocol，hostname等
        </div>
      </div>
    </div>
  </div>)
}

export default UrlResolution;