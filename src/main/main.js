import { app, BrowserWindow, dialog, ipcMain } from "electron/main";
import * as path from "path";
const sqlite3 = require("sqlite3").verbose();

let mainWindow;
const dbPath = path.join(app.getPath("userData"), "roms.db"); //TODO: Implement Production Path
console.log(dbPath);
const db = new sqlite3.Database("./roms.db");

let dbClosed = false; // Add a flag to track if the database is closed

const runQuery = (query) => {
  return new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const initializeDatabase = async () => {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS employees (
      pin INTEGER PRIMARY KEY NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      authority_level INTEGER NOT NULL
    );`);
  await runQuery(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      price DOUBLE NOT NULL,
      image_link TEXT,
      description TEXT,
      gui_position INTEGER NOT NULL
    );`);
  await runQuery(`
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY NOT NULL,
      seating_size INTEGER NOT NULL
    );`);
  await runQuery(`
    CREATE TABLE IF NOT EXISTS transaction_history (
      id INTEGER PRIMARY KEY NOT NULL,
      patron_count INTEGER NOT NULL,
      server_id TEXT NOT NULL,
      table_id INTEGER NOT NULL,
      arrival_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      pretip_bill DOUBLE NOT NULL,
      final_bill DOUBLE NOT NULL,
      tip DOUBLE NOT NULL,
      date DATE NOT NULL,
      FOREIGN KEY (server_id) REFERENCES employees(pin),
      FOREIGN KEY (table_id) REFERENCES tables(id)
    );`);
  await runQuery(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY NOT NULL,
      transaction_id INTEGER NOT NULL,
      menu_item INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES transaction_history(id),
      FOREIGN KEY (menu_item) REFERENCES menu(id)
    );`);
};

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
        // console.log(result);
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
    if (!dbClosed) { // Only close the database if it hasn't been closed already
      db.close();
      dbClosed = true; // Set the flag to indicate that the database is closed
    }
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("sql:send", handleSQLCommands);
  initializeDatabase().catch((err) => {
    console.error("Error initializing database:", err);
  });
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (!dbClosed) { // Only close the database if it hasn't been closed already
      db.close();
      dbClosed = true; // Set the flag to indicate that the database is closed
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
