const { app, BrowserWindow, ipcMain, clipboard, Menu } = require('electron');
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

const template = [
  {
      label: "Tools",
      submenu: [
          {
              label: "隐藏",
              role: "hide",
          },
          {
              type: "separator",
          },
          {
              label: "关闭",
              accelerator: "quit",
              click: () => {
                  app.quit();
              },
          },
      ],
  },
  {
      label: "窗口",
      submenu: [
          { label: "剪贴", role: 'cut' },
          { label: "拷贝", role: 'copy' },
          { label: "全选", role: 'selectAll' },
          { label: "粘贴", role: 'paste' },
          { label: "后退", role: 'undo' },
          {
              label: "关闭",
              role: "close",
          },
          {
              label: "刷新",
              role: "reload",
          },
          {
              label: "进入全屏模式",
              role: "togglefullscreen",
          },
      ],
  },
  {
      label: "帮助",
      submenu: [
          {
              label: "更多",
              click: async () => {
                  const { shell } = require("electron");
                  await shell.openExternal("https://github.com/wjz-mljj/tools");
              },
          },
      ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

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

// 复制字符串到剪贴板
ipcMain.handle('copy-string-clipboard', (event, data) => {
  try{
    clipboard.writeText(data.text);
  } catch(err) {}
  
  return {
    code: 200,
    msg: '复制成功!'
  };
});
