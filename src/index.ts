import { app, BrowserWindow, ipcMain, Tray } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import { RPC_STARTED, startHandler } from "./presence";
import { HandleTray } from "./tray";

let mainWindow: BrowserWindow;
let tray: Tray;

export async function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 825,
        width: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    // and load the index.html of the app.
    await mainWindow.loadFile(path.join(__dirname, "../public/home.html"));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    await createWindow();
    autoUpdater.checkForUpdatesAndNotify();
    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    await startHandler(mainWindow)
    tray = new Tray(path.join(__dirname, `../icons/tray.png`));
    await HandleTray(mainWindow, tray);

    ipcMain.on("@app/quit", (event, args) => {
        app.quit();
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (RPC_STARTED) {
        return;
    } else {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.