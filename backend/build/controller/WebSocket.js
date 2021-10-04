"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, { cors: { origin: "*" } });
io.on("connection", function (socket) {
    console.log("New user connected! " + socket.id);
    socket.on("disconnect", function (reason) {
        console.log("User disconnect - reason: " + reason);
    });
});
var globalEmit = function (event, data) {
    io.emit(event, data);
};
var startServer = function (PORT) {
    server.listen(PORT, function () { return console.log("Web socket is running in port: " + PORT); });
};
exports.default = {
    startServer: startServer,
    globalEmit: globalEmit
};
//# sourceMappingURL=WebSocket.js.map