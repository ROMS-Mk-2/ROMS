import { app, BrowserWindow, dialog, ipcMain } from "electron/main";
import * as path from "path";
import * as url from "url";

let mainWindow;

const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      webSecurity: false, //REMOVE AT PRODUCTION
    },
  });
  mainWindow.webContents.openDevTools();
  //mainWindow.loadFile(path.join(__dirname, "../game/index.html"));
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
