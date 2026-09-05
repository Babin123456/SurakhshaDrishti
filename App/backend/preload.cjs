const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  acknowledgeAlert: () => ipcRenderer.send('acknowledge-alert'),
  triggerAlert: (msg) => ipcRenderer.send('trigger-alert', msg),
  onAlertData: (callback) => ipcRenderer.on('alert-data', (_event, value) => callback(value))
});
