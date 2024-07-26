// 生成id
const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function generateShortId() {
  return (Date.now() + Math.random()).toString(36).substring(0, 8);
}

// 获取文件后缀名
const getFileSuffix = (fileName) => {
  let ext = fileName ? fileName.match(/\.([^.]+)$/)[1] : ''
  return ext;
}

export {
  guid,
  generateShortId,
  getFileSuffix,
}