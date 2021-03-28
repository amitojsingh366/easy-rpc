import { app, BrowserWindow, ipcMain, shell, Tray } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import { RPC_STARTED, startHandler } from "./presence";
import { HandleTray } from "./tray";

export let mainWindow: BrowserWindow;
let tray: Tray;
const instanceLock = app.requestSingleInstanceLock();

export const commons = {
    shouldDock: true,
}

export async function createWindow() {
    mainWindow = new BrowserWindow({
        height: 825,
        width: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    await mainWindow.loadFile(path.join(__dirname, "../public/home.html"));

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
    await startHandler()
    tray = new Tray(path.join(__dirname, `../icons/tray.png`));
    await HandleTray(tray);
    mainWindow.webContents.send("@app/shouldDock", "");
    ipcMain.on("@app/shouldDock", (event, shouldDock) => {
        commons.shouldDock = shouldDock;
    })
    ipcMain.on("@app/quit", (event, args) => {
        app.quit();
    })
});

if (!instanceLock) {
    app.quit();
} else {
    app.on("second-instance", (event, argv, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            } else if (mainWindow.isDestroyed()) {
                createWindow();
            }
            mainWindow.focus();
        } else {
            createWindow();
        }
    });
}

app.on("window-all-closed", () => {
    if (RPC_STARTED && commons.shouldDock) {
        return;
    } else {
        app.quit();
    }
});