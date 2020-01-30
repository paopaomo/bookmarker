const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

app.on('ready', () => {
   mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
         nodeIntegration: true
      }
   });
   mainWindow.webContents.loadFile(path.join(__dirname, 'index.html'));
});
