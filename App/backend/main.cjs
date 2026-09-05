const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let alertWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
}

function triggerEmergencyAlert(message) {
  if (alertWindow) return; // Alert already active

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  alertWindow = new BrowserWindow({
    width: 600,
    height: 200,
    x: Math.round((width - 600) / 2),
    y: height - 220, // Bottom center of the screen
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  alertWindow.on('close', (e) => {
    if (alertWindow && !alertWindow.isAcknowledged) {
      e.preventDefault();
    }
  });

  // Load the React app's /alert route for the popup instead of static HTML
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    alertWindow.loadURL('http://localhost:5173/alert');
  } else {
    alertWindow.loadURL(`file://${path.join(__dirname, '../frontend/dist/index.html')}#/alert`);
  }
  
  // Send the message to the alert UI
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
  
  // For demonstration: Wait 5 seconds after launch to simulate an incoming red zone alert!
  setTimeout(() => {
    triggerEmergencyAlert();
  }, 5000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// User clicked Acknowledge in the persistent alert window
ipcMain.on('acknowledge-alert', () => {
  if (alertWindow) {
    alertWindow.isAcknowledged = true;
    alertWindow.close();
    alertWindow = null;
  }
});

// Manually trigger alert from UI
ipcMain.on('trigger-alert', (event, msg) => {
  triggerEmergencyAlert(msg);
});
