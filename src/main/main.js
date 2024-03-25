import { app, BrowserWindow, dialog, ipcMain } from "electron/main";
import * as path from "path";
const sqlite3 = require("sqlite3").verbose();

let mainWindow;
const dbPath = path.join(app.getPath("userData"), "roms.db"); //TODO: Implement Production Path
console.log(dbPath);
const db = new sqlite3.Database("./roms.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

  const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (let i = 0; i < 10; i++) {
    stmt.run("Ipsum " + i);
  }
  stmt.finalize();
});

const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
};

const handleSQLCommands = async (event, command) => {
  return new Promise((resolve, reject) => {
    let result = [];
    db.all(command, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        result = [...rows];
        console.log(result);
        resolve(result);
      }
    });
  });
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      nodeIntegration: true,
      webSecurity: false, //REMOVE AT PRODUCTION
    },
  });
  mainWindow.webContents.openDevTools();
  //   mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.on("closed", () => {
    db.close();
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("sql:send", handleSQLCommands);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    db.close();
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
