import * as Discord from 'discord-rpc';
import { ipcMain } from 'electron';
import * as path from "path";
import { commons, mainWindow } from "./index"
import { EventEmitter } from 'events';

export let RPC_STARTED = false;
export let RPC_TRYING_TO_START = false;
let PREV_TOKEN = "";
let buttons: any[] = [];

let RPC_INTERVAL: NodeJS.Timeout;
export let rpc = new Discord.Client({ transport: 'ipc' });
let RPC_DESTROYED = false;
const rpcEmitter = new EventEmitter();


export async function startHandler() {
    ipcMain.on("@rpc/update", async (event, data) => {
        await updateRPC(data);
    });

    ipcMain.on("@rpc/status", (event, args) => {
        if (!mainWindow.isDestroyed()) {
            mainWindow.webContents.send("@rpc/status", RPC_STARTED);
        }
    });

    ipcMain.on("@rpc/dockAndStart", async (event, data) => {
        console.log("dock and start")
        if (commons.autoLaunch && commons.shouldDock) {
            data = JSON.parse(data);
            await updateRPC(data);
            rpcEmitter.once('@rpc/started', (event, args) => {
                if (!mainWindow.isDestroyed()) {
                    mainWindow.destroy();
                }
            })
        }
    });
}


export async function updateRPC(data: any) {
    if (buttons) {
        buttons.length = 0;
    }
    if (data.button_1_label) {
        if (!buttons) {
            buttons = [{ label: data.button_1_label, url: data.button_1_url }];
        } else {
            buttons.push({ label: data.button_1_label, url: data.button_1_url });
        }
    }
    if (data.button_2_label) {
        if (!buttons) {
            buttons = [{ label: data.button_2_label, url: data.button_2_url }];
        } else {
            buttons.push({ label: data.button_2_label, url: data.button_2_url });
        }
    }

    if (data.startTimestamp) {
        data.startTimestamp = Number(data.startTimestamp)
    }
    if (data.endTimestamp) {
        data.endTimestamp = Number(data.endTimestamp)
    }
    if (data.partySize) {
        data.partySize = Number(data.partySize)
    }
    if (data.partyMax) {
        data.partyMax = Number(data.partyMax)
    }
    data.instance = true;

    if (data.partyId && data.partySize && data.partyMax && data.joinSecret) {
        data.matchSecret = await randomString(8);
        data.spectateSecret = await randomString(8);
        delete data.buttons;
    }
    if (buttons.length != 0) {
        let a: any = buttons.slice(0, 2);
        buttons = a;
        data.buttons = buttons;
    }
    let presenceData = await cleanData(data);
    if (RPC_STARTED == false || data.token != PREV_TOKEN) {
        RPC_DESTROYED = false;
        if (RPC_STARTED) {
            rpc.removeAllListeners();
            rpc.clearActivity();
            rpc.destroy();
            rpc = new Discord.Client({ transport: 'ipc' });
        }
        rpc.login({ clientId: presenceData.token }).catch((e) => {
            console.log("Error");
            rpc.removeAllListeners();
            //rpc.destroy();
            rpc = new Discord.Client({ transport: 'ipc' });
            RPC_DESTROYED = true;
            if (!RPC_INTERVAL) {
                console.log("setInterval")
                RPC_INTERVAL = setInterval(() => {
                    updateRPC(data);
                }, 60000);
            }
            RPC_TRYING_TO_START = true;
            rpcEmitter.emit('@rpc/started');
        });
    }
    if (RPC_STARTED && presenceData.token == PREV_TOKEN) {
        rpc.setActivity(presenceData);
        rpcEmitter.emit('@rpc/started')
        if (!mainWindow.isDestroyed()) {
            mainWindow.webContents.send("@rpc/status", RPC_STARTED);
            mainWindow.webContents.send("@visualizer/profile", {
                userTag: [
                    rpc.user.username,
                    '#' + rpc.user.discriminator
                ],
                avatar: `https://cdn.discordapp.com/avatars/${rpc.user.id}/${rpc.user.avatar}.png`
            });
        }
    } else {
        if (!RPC_DESTROYED) {
            rpc.on('ready', () => {
                if (RPC_INTERVAL) {
                    clearInterval(RPC_INTERVAL);
                }
                RPC_STARTED = true;
                rpc.setActivity(presenceData);
                rpcEmitter.emit('@rpc/started')
                if (!mainWindow.isDestroyed()) {
                    mainWindow.webContents.send("@rpc/status", RPC_STARTED);
                    mainWindow.webContents.send("@visualizer/profile", {
                        userTag: [
                            rpc.user.username,
                            '#' + rpc.user.discriminator
                        ],
                        avatar: `https://cdn.discordapp.com/avatars/${rpc.user.id}/${rpc.user.avatar}.png`
                    });
                }
            });
        }
    }

    PREV_TOKEN = presenceData.token;

}


async function cleanData(obj) {
    for (var n in obj) {
        if (obj[n] === null || obj[n] === undefined || obj[n] === '') {
            delete obj[n];
        }
    }
    return obj
}
async function randomString(length: number) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}