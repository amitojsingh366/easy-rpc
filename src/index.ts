import { app, BrowserWindow, Menu, shell, Tray } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import {
  RPC_STARTED,
  startHandler,
  RPC_TRYING_TO_START,
} from "./presence";
import { HandleTray } from "./tray";
import { MENU_TEMPLATE } from "./constants";
import electronLogger from "electron-log";
import { Listeners } from "./listeners";

export let mainWindow: BrowserWindow;
let tray: Tray;
let menu: Menu;
const instanceLock = app.requestSingleInstanceLock();

electronLogger.transports.file.level = "debug";
autoUpdater.logger = electronLogger;
// just in case we have to revert to a build
autoUpdater.allowDowngrade = true;

export const commons = {
  shouldDock: true,
  autoLaunch: false,
};

const IPCListeners = new Listeners(app);

if (process.platform === 'win32') app.setAppUserModelId("Easy RPC")

export async function createWindow() {
  mainWindow = new BrowserWindow({
    height: 825,
    width: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  IPCListeners.setWindow(mainWindow);


  // const homepage = path.join(__dirname, "../public/index.html");
  // await mainWindow.loadFile(homepage);

  await mainWindow.loadURL("http://localhost:8080");
  menu = Menu.buildFromTemplate(MENU_TEMPLATE);
  Menu.setApplicationMenu(menu);
  const handleLinks = (event: any, url: string) => {
    event.preventDefault();
    shell.openExternal(url);
  };
  mainWindow.webContents.on("new-window", handleLinks);
  mainWindow.webContents.on("will-navigate", handleLinks);
  autoUpdater.checkForUpdatesAndNotify();
}

app.on("ready", async () => {
  await createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  await startHandler();
  tray = new Tray(path.join(__dirname, `../icons/tray.png`));
  await HandleTray(tray);
});

if (!instanceLock) {
  app.quit();
} else {
  app.on("second-instance", (event, argv, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isDestroyed()) {
        createWindow();
      } else if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
}

app.on("window-all-closed", () => {
  if (
    (RPC_STARTED && commons.shouldDock) ||
    (RPC_TRYING_TO_START && commons.shouldDock)
  ) {
    return;
  } else {
    app.quit();
  }
});
