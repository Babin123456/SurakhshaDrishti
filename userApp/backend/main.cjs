const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

// Fixes double-render / trailing artifacts on Windows machines
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow;
let alertWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    backgroundColor: '#050914',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5175');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
}

function triggerEmergencyAlert(message) {
  if (alertWindow) return;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  alertWindow = new BrowserWindow({
    width: 500,
    height: 280,
    x: Math.round((width - 500) / 2),
    y: Math.max(20, height - 310),
    frame: false,
    transparent: false,       // CHANGED: No transparency — fixes Windows rendering glitch
    backgroundColor: '#FDFBF7', // Matches theme background while page loads
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    show: false,              // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Only show after content is painted — prevents ghost frame
  alertWindow.once('ready-to-show', () => {
    alertWindow.show();
  });

  alertWindow.on('close', (e) => {
    if (alertWindow && !alertWindow.isAcknowledged) {
      e.preventDefault();
    }
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    alertWindow.loadURL('http://localhost:5175/alert');
  } else {
    alertWindow.loadURL(`file://${path.join(__dirname, '../frontend/dist/index.html')}#/alert`);
  }

  alertWindow.webContents.once('did-finish-load', () => {
    alertWindow.webContents.send('alert-data', { message: message || 'EMERGENCY HAZARD DETECTED IN YOUR AREA' });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('acknowledge-alert', () => {
  if (alertWindow) {
    alertWindow.isAcknowledged = true;
    alertWindow.close();
    alertWindow = null;
  }
});

ipcMain.on('trigger-alert', (event, msg) => {
  triggerEmergencyAlert(msg);
});
