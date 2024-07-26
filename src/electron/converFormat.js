const { app, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');

let dev = process.env.NODE_ENV === 'development'


const ffmpegPath = path.join(__dirname, 'ffmpeg', path.basename(pathToFfmpeg));
console.log('ffmpegPath:::', ffmpegPath);
let isFlag = 'no'

ffmpeg.setFfmpegPath(ffmpegPath);

function converFormat(win) {
  const openFiles = new Map();

   // 开始接收文件
   ipcMain.on('file-chunk', (event, { name, chunk, offset }) => {
    let fileDescriptor = openFiles.get(name);
    if (!fileDescriptor) {
      const filePath = path.join(app.getPath('userData'), name);
      fileDescriptor = fs.openSync(filePath, 'w');
      openFiles.set(name, fileDescriptor);
    }
  
    const buffer = Buffer.from(chunk);
    fs.write(fileDescriptor, buffer, 0, buffer.length, offset, (err) => {
      if (err) {
        event.sender.send('file-process-message', {code: 500, msg: '视频导入出现问题，请重新导入！' })
        console.error(`Error writing file ${name} at offset ${offset}:`, err);
      }
    });
  });
  // 结束
  ipcMain.on('file-end', (event, { name }) => {
    const fileDescriptor = openFiles.get(name);
    if (fileDescriptor) {
      fs.close(fileDescriptor, (err) => {
        if (err) {
          event.sender.send('file-process-message', {code: 500, msg: '视频导入出现问题，请重新导入！' })
          console.error(`Error closing file ${name}:`, err);
        } else {
          console.log(`File ${name} saved successfully`);
        }
      });
      openFiles.delete(name);
    }
  });

  ipcMain.handle('file-convert-format', async (event, fileInfo) => {
    console.log('fileInfo:::', fileInfo)
    const { key, format, keyId } = fileInfo;
    const filePath = path.join(app.getPath('userData'), key);
    if (fs.existsSync(filePath)) {
      const outputFilePath = path.join(app.getPath('userData'), `${keyId}.${format}`);
      console.log('存在')
      let videoCodec = 'libx264';
      let outputOpts = [];
      if (format === 'webm') {
        videoCodec = 'libvpx-vp9';
        outputOpts = [
          '-cpu-used 3',           // 最高质量编码 数值越低质量越高
          '-crf 28',                // 设定恒定质量 '-crf 30',  CRF 的取值范围为 [0, 63], 建议取值范围为 [15,35]
          '-b:v 0',                // 无比特率限制
          '-qmin 10',               // 最小量化参数 量化参数范围，确保视频质量适中。
          '-qmax 51',              // 最大量化参数
          '-tile-columns 4',       // 启用多线程
          '-frame-parallel 1',     // 启用帧并行
          '-threads auto',
          // '-tune zerolatency',
          // '-auto-alt-ref 1',       // 启用参考帧
          // '-lag-in-frames 15',     // 延迟帧以提高质量
          
        ]
      } else if (format === 'mp4' || format === 'mov' || format === 'avi') {
      videoCodec = 'libx264';
      outputOpts = [
        '-threads 4',        // 编码的线程数量
        '-preset ultrafast',    // 平衡速度和质量
        '-b:v 0',            // 无比特率限制
        '-tune zerolatency', // 优化编码器以减少延迟
      ]
      if (format === 'avi') {
        let temp = [
          '-crf 23',         // 设定恒定质量
          '-qmin 10',        // 最小量化参数
          '-qmax 51'  
        ]
        outputOpts.push(...temp);
      }
      }
      console.time('time--');
      ffmpeg && ffmpeg(filePath)
        .output(outputFilePath)
        .videoCodec(videoCodec)
        .outputOptions([ ...outputOpts ])
        .toFormat(format)
        .on('start', (commandLine) => {})
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent.toFixed(2)}% done`);
          event.sender.send('conver-process-message', progress.percent.toFixed(2))
        })
        .on('end', () => {
          console.timeEnd('time--')
          console.log('Video conversion completed successfully.');
          event.sender.send('conver-process-message', '100');
          // 删除原文件
          fs.unlink(filePath, (err) => {
            if (!err) {
              console.log('File deleted successfully');
            }
          });
        })
        .on('error', (err) => {
          console.error('Error occurred during video conversion:', err);
          event.sender.send('conver-process-message', 'error');
        })
        .run();
    }
  })

  ipcMain.handle('test-format', () => {
    let a= '666'
    let bar = app.getPath('userData')
    return {
      hash: a,
      bar,
      path: ffmpegPath,
      isFlag: isFlag,
    };
  });
}

module.exports = converFormat
