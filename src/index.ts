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

    // handling external links
    const handleLinks = (event: any, url: string) => {
        event.preventDefault();
        shell.openExternal(url);
    };
    mainWindow.webContents.on("new-window", handleLinks);
    mainWindow.webContents.on("will-navigate", handleLinks);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
if (!instanceLock) {
    app.quit();
} else {
    app.on("ready", async () => {
        await createWindow();
        autoUpdater.checkForUpdatesAndNotify();
        app.on("activate", function () {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
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
    app.on("second-instance", (event, argv, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
                mainWindow.focus();
            } else if (mainWindow.isDestroyed()) {
                createWindow();
            }
        } else {
            createWindow();
        }
    });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (RPC_STARTED && commons.shouldDock) {
        return;
    } else {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.