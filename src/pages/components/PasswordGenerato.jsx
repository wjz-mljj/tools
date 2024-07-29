import React, { useState } from 'react'
import { Form, Row, Col, Button, Checkbox, Input, InputNumber, Tooltip, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const itemStyle = {marginBottom: 0};
const itemStyleInput = {marginBottom: '15px'};

const uniqueTip = '开启后，若:密码长度 > 字符总和的长度，则:生成的密码长度 = 字符总和的长度'

const PasswordGenerato = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [genResult, setGenResult] = useState('');

  const onFinish = (values) => {
    console.log('Received: ', values);
    let chars = '';
    let passwords = [];
    if (values.includeNumber) chars += '0123456789';
    if (values.includeLowercaseLetters) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (values.includeUppercaseLetters) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (values.specialChar) chars += values.specialChar;
    if (values.excludeChar) {
      chars = chars.replace(new RegExp(values.excludeChar.split('').join('|'), 'g'), '');
    }
    while (passwords.length < values.quantity) {
      let _chars = chars.split('');
      let password = '';
      for (let i = 0, l = values.passwordLength; i < l; i++) {
        if (_chars.length < 1) break;
        let idx = Math.floor(Math.random() * _chars.length);
        password += _chars[idx];
        // 字符是否重复
        if (unique) {
          _chars.splice(idx, 1)
        }
      }
      if (passwords.indexOf(password) === -1) {
        passwords.push(password);
      }
    }
    console.log('passwords::', passwords);
    const crlf = String.fromCharCode(13) + String.fromCharCode(10); // 分隔符 "\r\n"
    setGenResult(passwords.join(crlf))
  }

  const onReset = () => {
    form.resetFields();
    setGenResult('');
  };

  const onCopy = async () => {
    try {
      let result = await window.ipcRenderer.invoke('copy-string-clipboard', {text: genResult})
      messageApi.success(result.msg)
    } catch (error) {}
  }

  return (<div>
    {contextHolder}
    <h2>密码生成器</h2>
    <div className="divCard">
      <Row style={{width: '100%'}} justify='space-between'>
        <Col span={12}>
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
              includeNumber: true,
              includeLowercaseLetters: true,
              includeUppercaseLetters: true,
              unique: true,
              passwordLength: 16,
              quantity: 1,
            }}
          >
            <Form.Item
              name="includeNumber"
              valuePropName="checked"
              style={itemStyle}
            >
              <Checkbox>是否包含数字</Checkbox>
            </Form.Item>
            <Form.Item
              name="includeLowercaseLetters"
              valuePropName="checked"
              style={itemStyle}
            >
              <Checkbox>是否包含小写字母</Checkbox>
            </Form.Item>
            <Form.Item
              name="includeUppercaseLetters"
              valuePropName="checked"
              style={itemStyle}
            >
              <Checkbox>是否包含大写字母</Checkbox>
            </Form.Item>
            <Form.Item
              name="unique"
              valuePropName="checked"
              style={itemStyle}
            >
              <Checkbox>
                <span style={{marginRight: '5px'}}>字符不重复</span>
                <Tooltip title={uniqueTip} placement="bottom"><QuestionCircleOutlined /></Tooltip>
              </Checkbox>
            </Form.Item>
            <Form.Item
              label=""
              name="specialChar"
              style={{...itemStyleInput, marginTop: '10px'}}
            >
              <Input addonBefore="添加特殊符号" placeholder="输入需要添加的特殊符号" />
            </Form.Item>
            <Form.Item
              label=""
              name="excludeChar"
              style={itemStyleInput}
            >
              <Input addonBefore="排除字符" placeholder="如: L,o,3" />
            </Form.Item>
            <Form.Item
              label=""
              name="passwordLength"
              style={itemStyleInput}
            >
              <InputNumber
                style={{width: '100%'}}
                max={256}
                min={1}
                precision={0}
                addonBefore="密码长度"
                placeholder='最大256个字符'
              />
            </Form.Item>
            <Form.Item
              label=""
              name="quantity"
              style={itemStyleInput}
            >
              <InputNumber
                style={{width: '100%'}}
                max={100}
                min={1}
                precision={0}
                addonBefore="密码数量"
                placeholder='最大数量100'
              />
            </Form.Item>
            <Form.Item
              style={{...itemStyleInput, marginTop: '30px'}}
            >
              <Button type="primary" htmlType="submit">生成密码</Button>
              <Button onClick={onReset} style={{margin: '0 20px'}}>清空</Button>
              <Button onClick={onCopy}>复制</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={10}>
          <div>生成结果</div>
          <div style={{width: '100%'}}>
            <Input.TextArea value={genResult} readOnly rows={10} />
          </div>
        </Col>
      </Row>
    </div>
  </div>)
}

export default PasswordGenerato;
