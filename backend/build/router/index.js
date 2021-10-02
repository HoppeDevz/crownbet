"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = __importDefault(require("../controller/UserController"));
var routes = (0, express_1.Router)();
routes.post("/register_account", UserController_1.default.registerUser);
exports.default = routes;
//# sourceMappingURL=index.js.map