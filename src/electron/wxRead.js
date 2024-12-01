const { app, ipcMain, BrowserWindow } = require('electron')

let win;

function wxRead() {
  ipcMain.handle('open-wx-read', async (event, ) => {
    if (win) {
      win.focus();
    } else {
      creatWin()
    }
  })
}

function creatWin() {
  win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  });
  win.loadURL('https://weread.qq.com/');
  win.on('close', () => {
    win = null;
  })
}

module.exports = wxRead
