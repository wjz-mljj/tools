
import React,{ useCallback, useEffect, useState, useRef } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Typography, message, Select } from 'antd'
import { getFileSuffix, generateShortId} from '../utils/func.js'

const { Text } = Typography;
let formatArr = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPG/JPEG' },
  { value: 'bmp', label: 'BNP' },
  { value: 'tiff', label: 'TIFF' },
  { value: 'gif', label: 'GIF' },
]
const ImageConvert = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [formatData, setFormatData] = useState([...formatArr, { value: 'webp', label: 'WEBP' }]);
  const [formatValue, setFormatValue] = useState('png');
  const [bufferData, setBufferData] = useState();
  const [imgInfo, setImgInfo] = useState({type: '', ext: '', filename: ''});
  const [saveText, setSaveText] = useState({type: '', msg: ''})

  // 上传图片
  const customRequest = (info) => {
    console.log(info);
    setFormatValue('png');
    setSaveText({type: '', msg: ''});
    setImgInfo({type: '', ext: '', filename: ''})
    try {
      let file = info.file;
      let ext = getFileSuffix(file.name).toLocaleLowerCase();
      if (ext === 'webp') {
        setFormatData([
          { value: 'png', label: 'PNG' },
          { value: 'jpeg', label: 'JPG/JPEG' },
        ])
      } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        setFormatData([...formatArr, { value: 'webp', label: 'WEBP' },]);
      } else {
        setFormatData([...formatArr]);
      }
      setImgInfo({ type: file.type, ext, filename: file.name});
      const reader = new FileReader();
      // 文件读取完毕后的处理
      reader.onload = async (event) => {
          const buffer = event.target.result;
          setBufferData(buffer);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log(11, error);
    }
  }

  // 转换图片
  const handleConvert = () => {
    console.log('imgInfo::', imgInfo);
    if (formatValue === imgInfo.ext) {
      messageApi.warning('转换的格式一样');
      return;
    }
    try {
      if (imgInfo.ext === 'webp' || formatValue === 'webp') {
        toWebp();
        return;
      }
      window.ipcRenderer.invoke('image-convert-format', {formatValue, bufferData}).then((res) => {
        console.log('res::::', res);
      }).catch((err) => {
        console.error('err::::', err);
      })

      window.ipcRenderer.on('image-base64-info', (event, message) => {
        console.log(message); // 在控制台打印消息
        if (message.code == 200) {
          download(message.msg);
        } else {
          setSaveText({type: 'error', msg: message.msg});
        }
      });
    } catch (error) {
      
    }
  }

  // 转换webp
  const toWebp = async () => {
    try {
      let buffer = bufferData;
      const bitmap = await createImageBitmap(new Blob([buffer]));

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx && ctx.drawImage(bitmap, 0, 0);

      const format = `image/${formatValue}`; // Change to 'image/jpeg' for JPG format
      const dataURL = canvas.toDataURL(format);
      console.log('dataURL::::', dataURL);
      download(dataURL);
    } catch (error) {
      setSaveText({type: 'error', msg: '转换失败，请重试！'});
    }
  }

  // 下载
  const download = (dataURL) => {
    setSaveText({type: 'success', msg: '转换成功, 已保存！'});
    const link = document.createElement('a');
    link.href = dataURL;
    let key = generateShortId();
    link.download = `${key}.${formatValue}`;
    link.click();
  }

  // 在线图片转换
  const onlineConvert = () => {
    
  }
  
  const renderText = () => {
    let context = '';
    if (imgInfo.filename) {
      context = imgInfo.filename;
    }
    return <Text type='success'>{context}</Text>
  }

  const renderText2 = () => {
    let type  = 'success';
    let context = '';
    if (imgInfo.filename) {
      context = saveText.msg;
    }
    return <Text type={type}>{context}</Text>
  }

  return (
    <div style={{padding: '20px'}}>
      {contextHolder}
      <h2>图片转格式</h2>
      <div>
        <p>步骤一：</p>
        <Upload
          accept='.jpeg,.png,.gif,.jpg,.tiff,.bmp,.webp'
          maxCount={1}
          showUploadList={false}
          customRequest={(info) => {
            customRequest(info)
          }}
        >
          <Button icon={<UploadOutlined />}>上传图片</Button>
          <div>{renderText()}</div>
        </Upload>
      </div>
      <div>
        <p>步骤二：</p>
        <Button onClick={() => {
          handleConvert()
        }}>转换格式并保存</Button>
        <Select
          value={formatValue}
          style={{ width: 120, }}
          onChange={(value) => {
            setFormatValue(value)
          }}
          options={formatData}
        />
        <div>{renderText2()}</div>
      </div>
    </div>
  )
}

export default ImageConvert
