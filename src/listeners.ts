import AutoLaunch from "auto-launch";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { readFileSync, writeFileSync } from "original-fs";
import { commons } from "./index";
import { rpc, RPC_STARTED } from "./presence";

export class Listeners {
    private app: Electron.App;
    private window: BrowserWindow | undefined;

    constructor(app: Electron.App) {
        this.app = app;

        this.startListeners();
    }

    setWindow(newWindow: BrowserWindow) {
        this.window = newWindow;
    }

    private startListeners() {

        const easyRPCAutoLauncher = new AutoLaunch({
            name: "Easy RPC",
        });

        ipcMain.on("@app/shouldDock", (event, shouldDock) => {
            commons.shouldDock = shouldDock;
        });

        ipcMain.on("@app/autoLaunch", (event, autoLaunch) => {
            if (autoLaunch) {
                easyRPCAutoLauncher.enable();
            } else {
                easyRPCAutoLauncher.disable();
            }
            commons.autoLaunch = autoLaunch;
        });

        ipcMain.on("@app/quit", (event, args) => {
            if (RPC_STARTED && rpc) {
                rpc.removeAllListeners();
                rpc.clearActivity();
                rpc.destroy();
            }
            this.app.quit();
        });

        ipcMain.on("@app/version", (event, args) => {
            event.sender.send("@app/version", this.app.getVersion());
        });

        ipcMain.on("@profile/import", (event, args) => {
            if (!this.window) return;
            const profilePath = dialog.showOpenDialogSync(this.window, {
                properties: ['openFile'],
                filters: [
                    { name: 'JSON Files', extensions: ['json'] }
                ],
                message: 'Select profile to import'
            });
            if (!profilePath) return;

            const profileData = readFileSync(profilePath[0], 'utf-8')
            this.window.webContents.send("@profile/import", profileData);
        });

        ipcMain.on("@profile/export", (event, profileData) => {
            if (!this.window) return;
            const savePath = dialog.showSaveDialogSync(this.window, {
                title: 'profile.json',
                filters: [
                    { name: 'JSON Files', extensions: ['json'] }
                ],
                message: 'Select a location to save your profile'
            });
            if (!savePath) return;

            writeFileSync(savePath, profileData);
        });

        ipcMain.on("@window/loaded", (event, data) => {
            if (this.window && !this.window.isDestroyed()) {
                this.window.webContents.send("@app/shouldDock", "");
                this.window.webContents.send("@app/autoLaunch", "");
                this.window.webContents.send("@app/started", "");
            }
        })
    }
}