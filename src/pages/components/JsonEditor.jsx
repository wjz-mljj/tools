import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, InputNumber, message, Row, Col } from 'antd';

import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

const sampleData = {
  exampleProp: null,
  nancy_mccarty: {
    A1: {
      userID: "nancy_mccarty",
      userName: "Nancy's McCarty",
      id: "A1",
      score: "0.75",
      date_created: 151208443563,
      date_signed: 151208448055,
      date_approved: 151208471190,
      answers: [
          {
              Q1 : true,
              Q2 : false
          },
          {
              Q34 : 'This is an answer',
              Q35 : false
          }
      ]
    },
    A2: {
      userID: "nancy_mccarty",
      userName: "Nancy McCarty",
      id: "A2",
      score: 0.9,
      date_created: 151208450090,
      date_signed: false,
      date_approved: false,
      answers: ["No", "No", "No", "Yes", "Yes"]
    }
  },
  george_richardson: {
    A2: {
      userID: "george_richardson",
      userName: "George Richardson",
      id: "A2",
      score: 0.35,
      date_created: 1512076585058,
      date_signed: false,
      date_approved: false,
      answers: ["No", "Yes", "Yes", "Yes", "Yes"]
    }
  },
  tom_hughe: {
    A4: {
      userID: "tom_hughe",
      userName: "Tom Hughe",
      id: "A4",
      score: 0.75,
      date_created: 1512076575026,
      date_signed: 1512076609894,
      date_approved: false,
      answers: ["Yes", "No", "No", "Yes", "No"]
    },
    M1: {
      userID: "tom_hughe",
      userName: "Tom Hughe",
      id: "M1",
      score: false,
      date_created: 1512076587361,
      date_signed: false,
      date_approved: false,
      answers: [false, false, false, false, false]
    }
  },
  heidy_white: {
    L2: {
      userID: "heidy_white",
      userName: "Heidy White",
      id: "L2",
      score: false,
      date_created: 15120765766312,
      date_signed: false,
      date_approved: false,
      answers: [0, 1, 2, 3, 4]
    }
  }
};



const JsonEditor = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  const [json, setJson] = useState(sampleData);

  const [currentMode, setCurrentMode] = useState('code');


  useEffect(() => {
    const options = {
      mode: 'code', // or 'view', 'form', 'code', 'text', etc.
      // modes: ['code', 'tree', 'view', 'text',],
      statusBar: false,
      mainMenuBar: false,
      onChange: () => {
        try {
          if (editorRef.current) {
            const updatedJson = editorRef.current.get();
            handleChange(updatedJson);
          }
        } catch (error) {
          console.error("JSON 格式错误", error);
        }
        
      },
      onError: (err) => {
        console.log(err, '1');
      },
    };

    if (containerRef.current) {
      editorRef.current = new JSONEditor(containerRef.current, options);
      editorRef.current.set(json);
    }
    
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };

  }, [json])

  const handleChange = (updatedJson) => {
    setJson(updatedJson);
  }

  // 格式化
  const handleFormat  = () => {
    if (editorRef.current) {
      const compressedJson = editorRef.current.getText();
      editorRef.current.set(JSON.parse(compressedJson));
    }
  }

  // 压缩JSON数据
  const compress = () => {
    if (editorRef.current) {
      const json = editorRef.current.get();
      editorRef.current && editorRef.current.updateText(JSON.stringify(json));
    }
  }

  // 切换
  const handleMode = () => {
    let mode = 'code';
    if (currentMode === 'code') {
      mode = 'view'
    }
    setCurrentMode(mode);
    editorRef.current && editorRef.current.setMode(mode)
  }

  return (<div>
    {contextHolder}
    <h2>JSON编辑器</h2>
    <div
      style={{
        width: '100%',
        boxShadow: '0 10px 30px rgba(76, 92, 70, 0.3)',
        background: '#fff',
        padding: '20px',
        borderRadius: '5px'
      }}
    >
      <div style={{marginBottom: '20px'}}>
        <Row style={{height: '400px'}} justify='space-between'>
          <Col span={24}>
            <div ref={containerRef} style={{ height: '400px' }}>
              <div style={{background: 'rgba(0,0,0,0.1)'}}>
                <Button type="link" onClick={handleFormat}>格式化</Button>
                <Button type="link" onClick={compress}>压缩JSON</Button>
                <Button type="link" onClick={handleMode}>{ currentMode == 'code' ? '预览' : '编辑' }</Button>
              </div>
              
            </div>
          </Col>
        </Row>
      </div>
      <div style={{margin: '50px 0 20px 0'}}>
        <Button type="primary" onClick={() => {
          if (editorRef.current) {
            const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
            const dataURL = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'content.json';
            link.click();
          }
        }}>下载到本地</Button>
      </div>
    </div>
  </div>)
}

export default JsonEditor;