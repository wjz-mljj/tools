const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const bcrypt = require('bcryptjs');
// const VLC = require('libvlc');
const fs = require('fs');
const converFormat = require('./electron/converFormat.js')
const imageConvert = require('./electron/imageConvert.js')

if (require('electron-squirrel-startup')) {
  app.quit();
}

let dev = process.env.NODE_ENV === 'development'

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  if (dev) {
    converFormat();
  }
  imageConvert();
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// 检查服务状态
ipcMain.handle('check-server-status', () => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("B4c0/\/", salt);
  let p = path.resolve(__dirname, './src/electron/arm64')
  return {
    hash: hash,
    p,
  };
});

let player;
// ipcMain.on('play-video', (event, filePath) => {
//   if (player) {
//     player.stop();
//   }
//   player = new VLC();
//   player.play(filePath);
// });

