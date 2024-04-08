// import { contextBridge, ipcRenderer } from "electron";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  sendSQL: (command) => ipcRenderer.invoke("sql:send", command),
  insertSQL: (command) => ipcRenderer.invoke("sql:insert", command),
});
