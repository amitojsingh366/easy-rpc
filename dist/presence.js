"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRPC = exports.startHandler = exports.RPC_STARTED = void 0;
var Discord = __importStar(require("discord-rpc"));
var electron_1 = require("electron");
var path = __importStar(require("path"));
var index_1 = require("./index");
var electron_prompt_1 = __importDefault(require("electron-prompt"));
exports.RPC_STARTED = false;
var PREV_TOKEN = "";
var buttons = [];
var RPC_INTERVAL;
var rpc = new Discord.Client({ transport: 'ipc' });
function startHandler() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            electron_1.ipcMain.on("@rpc/update", function (event, data) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, updateRPC(data)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            electron_1.ipcMain.on("@window/navigate", function (event, file) {
                if (!index_1.mainWindow.isDestroyed()) {
                    index_1.mainWindow.webContents.loadFile(path.join(__dirname, "../public/" + file)).catch(console.error);
                }
            });
            electron_1.ipcMain.on("@rpc/status", function (event, args) {
                if (!index_1.mainWindow.isDestroyed()) {
                    index_1.mainWindow.webContents.send("@rpc/status", exports.RPC_STARTED);
                }
            });
            electron_1.ipcMain.on("@rpc/importPrompt", function (event, args) {
                electron_prompt_1.default({
                    title: 'Import Profile',
                    label: 'Profile ID to import: ',
                    value: '',
                    inputAttrs: {
                        type: 'text'
                    },
                    type: 'input'
                }).then(function (r) {
                    if (r !== null) {
                        index_1.mainWindow.webContents.send("@rpc/importPrompt", r);
                    }
                }).catch(console.error);
            });
            return [2 /*return*/];
        });
    });
}
exports.startHandler = startHandler;
function updateRPC(data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, a, presenceData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (buttons) {
                        buttons.length = 0;
                    }
                    if (data.button_1_label) {
                        if (!buttons) {
                            buttons = [{ label: data.button_1_label, url: data.button_1_url }];
                        }
                        else {
                            buttons.push({ label: data.button_1_label, url: data.button_1_url });
                        }
                        delete data.button_1_label;
                        delete data.button_1_url;
                    }
                    if (data.button_2_label) {
                        if (!buttons) {
                            buttons = [{ label: data.button_2_label, url: data.button_2_url }];
                        }
                        else {
                            buttons.push({ label: data.button_2_label, url: data.button_2_url });
                        }
                        delete data.button_2_label;
                        delete data.button_2_url;
                    }
                    if (data.startTimestamp) {
                        data.startTimestamp = Number(data.startTimestamp);
                    }
                    if (data.endTimestamp) {
                        data.endTimestamp = Number(data.endTimestamp);
                    }
                    if (data.partySize) {
                        data.partySize = Number(data.partySize);
                    }
                    if (data.partyMax) {
                        data.partyMax = Number(data.partyMax);
                    }
                    data.instance = true;
                    if (!(data.partyId && data.partySize && data.partyMax && data.joinSecret)) return [3 /*break*/, 3];
                    _a = data;
                    return [4 /*yield*/, randomString(8)];
                case 1:
                    _a.matchSecret = _c.sent();
                    _b = data;
                    return [4 /*yield*/, randomString(8)];
                case 2:
                    _b.spectateSecret = _c.sent();
                    delete data.buttons;
                    _c.label = 3;
                case 3:
                    if (buttons) {
                        a = buttons.slice(0, 2);
                        buttons = a;
                        data.buttons = buttons;
                    }
                    return [4 /*yield*/, cleanData(data)];
                case 4:
                    presenceData = _c.sent();
                    if (exports.RPC_STARTED == false || data.token != PREV_TOKEN) {
                        rpc.login({ clientId: presenceData.token }).catch(function (e) {
                            // console.log("Error");
                            // if (!RPC_INTERVAL) {
                            //     console.log("setInterval")
                            //     RPC_INTERVAL = setInterval(() => {
                            //         updateRPC(data);
                            //     }, 2000);
                            // }
                            // return false;
                            console.log("error");
                            console.log(e);
                        });
                    }
                    delete presenceData.token;
                    if (exports.RPC_STARTED) {
                        rpc.setActivity(presenceData);
                        if (!index_1.mainWindow.isDestroyed()) {
                            index_1.mainWindow.webContents.send("@rpc/status", exports.RPC_STARTED);
                        }
                    }
                    else {
                        if (rpc.listeners('ready').length === 0) {
                            rpc.on('ready', function () {
                                if (RPC_INTERVAL) {
                                    clearInterval(RPC_INTERVAL);
                                }
                                exports.RPC_STARTED = true;
                                rpc.setActivity(presenceData);
                                if (!index_1.mainWindow.isDestroyed()) {
                                    index_1.mainWindow.webContents.send("@rpc/status", exports.RPC_STARTED);
                                }
                            });
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateRPC = updateRPC;
function cleanData(obj) {
    return __awaiter(this, void 0, void 0, function () {
        var n;
        return __generator(this, function (_a) {
            for (n in obj) {
                if (obj[n] === null || obj[n] === undefined || obj[n] === '') {
                    delete obj[n];
                }
            }
            return [2 /*return*/, obj];
        });
    });
}
function randomString(length) {
    return __awaiter(this, void 0, void 0, function () {
        var chars, result, i;
        return __generator(this, function (_a) {
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            result = '';
            for (i = length; i > 0; --i)
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            return [2 /*return*/, result];
        });
    });
}
