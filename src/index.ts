import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import { RPC_STARTED, startHandler, rpc, RPC_TRYING_TO_START } from "./presence";
import { HandleTray } from "./tray";
import AutoLaunch from 'auto-launch';
import { MENU_TEMPLATE } from "./constants";

export let mainWindow: BrowserWindow;
let tray: Tray;
let menu: Menu;
const instanceLock = app.requestSingleInstanceLock();

export const commons = {
    shouldDock: true,
    autoLaunch: false,
}

const easyRPCAutoLauncher = new AutoLaunch({
    name: 'Easy RPC',
});

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
    await startHandler()
    tray = new Tray(path.join(__dirname, `../icons/tray.png`));
    await HandleTray(tray);
    ipcMain.on("@app/shouldDock", (event, shouldDock) => {
        commons.shouldDock = shouldDock;
    })
    ipcMain.on("@app/autoLaunch", (event, autoLaunch) => {
        if (autoLaunch) {
            easyRPCAutoLauncher.enable();
        } else {
            easyRPCAutoLauncher.disable();
        }
        commons.autoLaunch = autoLaunch;
    })
    ipcMain.on("@app/quit", (event, args) => {
        if (RPC_STARTED && rpc) {
            rpc.removeAllListeners();
            rpc.clearActivity();
            rpc.destroy();
        }
        app.quit();
    });
    ipcMain.on('@app/version', (event, args) => {
        event.sender.send('@app/version', app.getVersion());
    });
    if (!mainWindow.isDestroyed()) {
        mainWindow.webContents.send("@app/shouldDock", "");
        mainWindow.webContents.send("@app/autoLaunch", "");
        mainWindow.webContents.send("@app/started", "");
    }
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
    if ((RPC_STARTED && commons.shouldDock) || (RPC_TRYING_TO_START && commons.shouldDock)) {
        return;
    } else {
        app.quit();
    }
});