import React, { useState } from 'react'
import { Button, Input, Table, message, Radio } from 'antd';

const columns = [
  { title: '进制',  dataIndex: 'binary', key: 'binary' },
  { title: '结果',  dataIndex: 'result', key: 'result' },
]
const BinaryConvert = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [binaryType, setBinaryType] = useState('10');
  const [digit, setDigit] = useState('');
  const [result, setResult] = useState(null);

  const handleSelect = (e) => {
    setBinaryType(e.target.value);
    setDigit('');
    setResult(null);
  }

  const handelChange = (e) => {
    console.log(e.target.value);
    let value = e.target.value ? e.target.value : '';
    let result = '';
    switch (binaryType) {
      case '2':
        result = value.replace(/[^01]/g, '');
        break;
      case '8':
        result = value.replace(/[^0-7]/g, '');
        break;
      case '10':
        result = value.replace(/[^0-9]/g, '');
        break;
      case '16':
        result = value.replace(/[^0-9A-Fa-f]/g, '');
        break;
      default:
        result = value;
        break;
    }
    setDigit(result);
  }

  const handelConvert = () => {
    if (!digit) return messageApi.error('请先输入数字!');
    let b = Number(binaryType);
    // 二进制
    const binary = parseInt(digit, b).toString(2);
    // 八进制
    const octal = parseInt(digit, b).toString(8);
    // 十进制
    const bidecimalismnary = parseInt(digit, b).toString(10);
    // 十六进制
    const hexadecimal = parseInt(digit, b).toString(16);
    const obj = { binary, octal, bidecimalismnary, hexadecimal };
    console.log(obj);
    let arr = []
    for (let [key, value] of Object.entries(obj)) {
      let str = ''
      switch (key) {
        case 'binary': 
          str = '二进制';
          break;
        case 'octal': 
          str = '八进制';
          break;
        case 'bidecimalismnary': 
          str = '十进制';
          break;
        case 'hexadecimal':
          str = '十六进制';
          break;
        default: break
      }
      arr.push({ key: key, binary: str, result: value });
    }
    setResult([ ...arr ]);
  }

  return (<div>
    {contextHolder}
    <h2>进制转换</h2>
    <div className="divCard">
      <div style={{marginBottom: '20px'}}>
        <Radio.Group onChange={handleSelect} value={binaryType}>
          <Radio.Button value="2">二进制</Radio.Button>
          <Radio.Button value="8">八进制</Radio.Button>
          <Radio.Button value="10">十进制</Radio.Button>
          <Radio.Button value="16">十六进制</Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <Input
          addonBefore="转换数字"
          addonAfter={<Button onClick={handelConvert}>转换</Button>}
          size='large'
          placeholder="请输入待转换数字"
          value={digit}
          onChange={handelChange}
        />
      </div>
      {result && (
        <div>
          <p style={{fontSize: '16px'}}>转换结果:</p>
          <Table dataSource={result} columns={columns} bordered pagination={false} />
        </div>
      )}
    </div>
  </div>)
}

export default BinaryConvert;
