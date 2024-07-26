
import React, { useState, } from 'react';
import { PluginProps } from 'react-markdown-editor-lite';
import { Button, Popover, Input, Form, Upload, Tooltip, Segmented, Row, Col } from 'antd';
import { QuestionCircleOutlined, UploadOutlined, PictureOutlined } from '@ant-design/icons';


const PluginsUpdate = (props) => {
  const [currentValue, setCurrentValue] = useState('url-update');
  const [openPopover, setOpenPopover] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
    let url = `![${values.title}](${values.url})`
    props.editor.insertText(url);
    setOpenPopover(false);
    form.resetFields();
  };

  const customRequest = (info) => {
    console.log('info:::', info);
    let file = info.file;
    let filename = info.file.name
    const reader = new FileReader();
    reader.onload = (data) => {
      console.log('/////', data.target.result);
      let url = `![${filename}](${data.target.result})`
      props.editor.insertText(url);
      // resolve(data.target.result);
      setOpenPopover(false);
    };
    reader.readAsDataURL(file);
  }

  const renderText = () => {
    let value = ''
    if (currentValue === 'url-update'){
      value = (<Form name="basic"
        layout='vertical'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ width: '265px', marginTop: '20px'}}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="图片描述"
          name="title"
          rules={[ { required: true, message: '请输入Title',},]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="图片链接"
          name="url"
          rules={[ 
            { required: true, message: '请输入Url' },
            { pattern: /^(http|https):\/\//, message: '请输入正确的地址！' },
          ]}
        >
          <Input placeholder='https://example.com' />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 16, span: 16,}}>
          <Button type="primary" htmlType="submit">确定 </Button>
        </Form.Item>
      </Form>)
    } else {
      value = (<div style={{marginTop: '15px'}}>
        <Upload
          accept='image/*'
          maxCount={1}
          showUploadList={false}
          customRequest={(info) => customRequest(info)}
        >
          <Row
            style={{width: '265px', height: '100px', background: '#f2f2f2', border: '1px solid #ccc', cursor: 'pointer'}} 
            justify='center' align='middle'
          >
            <Col><UploadOutlined /></Col>
            <Col>点击上传</Col>
          </Row>
        </Upload>
      </div>)
    }
    return value;
  }

  const content = (<div style={{width: '265px'}}>
    <Segmented
      value={currentValue}
      options={[
        {label: '插入图片', value: 'url-update'},
        {label: (<>
        本地上传
        <Tooltip title='本地上传的图片会自动转成base64'><QuestionCircleOutlined /></Tooltip>
        </>), value: 'local-update'}
      ]}
      onChange={(value) => {setCurrentValue(value)}}
    />
    {renderText()}
  </div>)

  
  const handleClick = () => {
    let u = 'https://img0.baidu.com/it/u=2411769539,2571930160&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1721322000&t=6965011f36365eb21203a4830e9bf41c'
    let url = `![测试](${u})`
    props.editor.insertText(url);

  }

  return (
    <span
      className="button button-type-counter"
      title="图片上传"
      // onClick={handleClick}
    >
      <Popover
        content={content}
        open={openPopover}
        placement="bottom"
        title=""
        trigger="click"
        onOpenChange={(newOpen) => setOpenPopover(newOpen)}
      >
        <div style={{}}>
          <PictureOutlined />
        </div>
      </Popover>
      
    </span>
  );
}
// 如果需要的话，可以在这里定义默认选项
PluginsUpdate.align = 'left';
PluginsUpdate.pluginName = 'local-update';

export default PluginsUpdate;
