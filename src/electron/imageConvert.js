const { app, ipcMain } = require('electron')
const Jimp = require("jimp").default;

function imageConvert() {
  ipcMain.handle('image-convert-format', async (event, fileInfo) => {
    const { bufferData, formatValue } = fileInfo;
    Jimp.read(bufferData).then((res) => {
      res.getBase64Async(`image/${formatValue}`).then((res2) => {
        event.sender.send('image-base64-info', {
          code: 200,
          msg: res2
        });
      })
    }).catch((err) => {
      event.sender.send('image-base64-info', {
        code: 500,
        msg: '转换失败，请重试！'
      });
      console.log('err::::', err);
    })
  })
}

module.exports = imageConvert
