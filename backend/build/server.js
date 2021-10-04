"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var database_1 = __importDefault(require("./database"));
var CrashGameController_1 = __importDefault(require("./controller/CrashGameController"));
var WebSocket_1 = __importDefault(require("./controller/WebSocket"));
// CREATE DATABASE CONNECTION //
database_1.default.createConnection();
// START GAMES //
CrashGameController_1.default.startCrashGame();
// START WEBSOCKET //
WebSocket_1.default.startServer(30121);
// START SERVER //
app_1.default.startServer(30120);
//# sourceMappingURL=server.js.map