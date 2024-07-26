import React,{ useCallback, useEffect, useState, useRef } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Modal, message, Row, Col, Divider } from 'antd'
import MarkdownIt from 'markdown-it';

import MdEditor, { Plugins } from 'react-markdown-editor-lite';
import { generateShortId } from '../../utils/func.js'
import PluginsUpdate from './PluginsUpdate.jsx'
import 'react-markdown-editor-lite/lib/index.css';


const mdParser = new MarkdownIt();

MdEditor.unuse(Plugins.BlockWrap);
MdEditor.use(Plugins.TabInsert, {
  tabMapValue: ' ',
});
MdEditor.use(PluginsUpdate, {
  start: 2
});
MdEditor.use(Plugins.AutoResize, {
  min: 500, // 最小高度
  max: 1000, // 最大高度
});

function renderHTML(text) {
  // 使用 markdown-it
  return mdParser.render(text);
  // 使用 react-markdown
  // return React.createElement(ReactMarkdown, {
  //   source: text,
  // });
}

const Markdown = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const editorRef = useRef(null)

  const handleEditorChange = ({ html, text }) => {
    //console.log('handleEditorChange', html, text);
  }

  // 上传前
  const beforeUpload = (file) => {
    const content = editorRef.current && editorRef.current.getMdValue();
    return new Promise((resolve, reject) => {
      if (content) {
        Modal.confirm({
          title: '编辑区有内容，是否要覆盖！',
          onOk() {
            resolve(file);
          },
          onCancel() {
            reject()
          },
        })
      } else {
        resolve(file);
      }
    })
  }
  // 上传md文档
  const customRequest = (info) => {
    console.log(info);
    let file = info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        editorRef.current && editorRef.current.setText(e.target.result);
      };
      reader.readAsText(file);
    }
  }

  // 图片
  const onImageUpload = (file) => {
    console.log('file:::', file);
    
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (data) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // 保存
  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getMdValue();
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      let key = generateShortId()
      link.download = `${key}.md`;
      link.click();
    }
  }

  return (
    <div style={{padding: '20px'}}>
      {contextHolder}
      <h2>编辑Markdown</h2>
      <div>
        <Row gutter={5} justify='space-between'>
          <Col>
            <Upload
              accept='.md'
              maxCount={1}
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={(info) => customRequest(info)}
            >
              <Button type="primary" icon={<UploadOutlined />}>导入Markdown文档</Button>
            </Upload>
            <Divider type='vertical' />
            <Button type="primary" onClick={() => handleSave()}>保存Markdown文档</Button>
          </Col>
        </Row>
        <div style={{marginTop: '20px'}}>
          <MdEditor
            ref={editorRef}
            style={{ height: '550px' }} 
            renderHTML={renderHTML} 
            onChange={handleEditorChange}
            plugins ={[
              'header',
              'font-bold',
              'font-italic',
              'font-underline',
              'font-strikethrough',
              'list-unordered',
              'list-ordered',
              'block-quote',
              'block-wrap',
              'block-code-inline',
              'block-code-block',
              'table',
              'local-update',
              // 'image',
              'link',
              'clear',
              'logger',
              'mode-toggle',
              'full-screen',
              'tab-insert'
            ]}
            onImageUpload={onImageUpload}
          />
        </div>
      </div>
    </div>
  )
}

export default Markdown
