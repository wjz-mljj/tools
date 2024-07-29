import React, { useState } from 'react'
import { Button, Input, InputNumber, message } from 'antd';

const UuidGenerato = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [uuidValue, setUuidValue] = useState('');
  const [quantity, setQuantity] = useState(5);

  const uuidGenerate = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }

  const handleUuid = () => {
    let uuids = [];
    for (let i = 0; i < quantity; i++) {
      let uuid = uuidGenerate();
      uuids.push(uuid)
    }
    const crlf = String.fromCharCode(13) + String.fromCharCode(10); // 分隔符 "\r\n"
    setUuidValue(uuids.join(crlf))
  }

  const handleCopy = async () => {
    try {
      let result = await window.ipcRenderer.invoke('copy-string-clipboard', {text: uuidValue})
      messageApi.success(result.msg)
    } catch (error) {}
  }

  return (<div>
    {contextHolder}
    <h2>UUID生成器</h2>
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
        <InputNumber
          style={{width: '100%'}}
          value={quantity}
          max={256}
          min={1}
          precision={0}
          addonBefore="生成数量"
          placeholder=''
          onChange={(value) => {setQuantity(value)}}
        />
      </div>

      <div style={{margin: '20px 0'}}>
        <Button type="primary" onClick={handleUuid}>生成</Button>
        <Button style={{margin: '0 20px'}} onClick={() => setUuidValue('')}>清空</Button>
        <Button onClick={handleCopy}>复制</Button>
      </div>

      <div style={{width: '100%'}}>
        <Input.TextArea
          value={uuidValue}
          rows={10}
          readOnly
        />
      </div>
     
      <div style={{fontSize: '12px', color: '#a6aea3', marginTop: '20px'}}>
        <div>介绍:</div>
        <p>
        UUID 是 通用唯一识别码（Universally Unique Identifier）的缩写，是一种软件建构的标准，亦为开放软件基金会组织在分布式计算环境领域的一部分。其目的，是让分布式系统中的所有元素，都能有唯一的辨识信息，而不需要通过中央控制端来做辨识信息的指定。如此一来，每个人都可以创建不与其它人冲突的UUID。在这样的情况下，就不需考虑数据库创建时的名称重复问题。最广泛应用的UUID，是微软公司的全局唯一标识符（GUID），而其他重要的应用，则有Linux ext2/ext3文件系统、LUKS加密分区、GNOME、KDE、Mac OS X等等。另外我们也可以在e2fsprogs包中的UUID库找到实现。
        </p>
        <p>UUID是由一组32位数的16进制数字所构成，故UUID理论上的总数为16^32=2^128，约等于3.4 x 10^38。也就是说若每纳秒产生1兆个UUID，要花100亿年才会将所有UUID用完。</p>
        <p>UUID的标准型式包含32个16进制数字，以连字号分为五段，形式为8-4-4-4-12的32个字符。</p>
      </div>
    </div>
  </div>)
}

export default UuidGenerato;