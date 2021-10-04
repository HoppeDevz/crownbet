"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var CrashGameController_1 = __importDefault(require("../controller/CrashGameController"));
var PaymentController_1 = __importDefault(require("../controller/PaymentController"));
var UserController_1 = __importDefault(require("../controller/UserController"));
var routes = (0, express_1.Router)();
routes.post("/register_account", UserController_1.default.registerUser);
routes.get("/user_login", UserController_1.default.userLogin);
routes.get("/get_user_balance", UserController_1.default.userTokenMiddleWare, UserController_1.default.getUserBalance);
routes.post("/create_payment", UserController_1.default.userTokenMiddleWare, PaymentController_1.default.createPayment);
routes.post("/payment_webhook", PaymentController_1.default.PaymentWebhook);
routes.post("/bet_crash", UserController_1.default.userTokenMiddleWare, CrashGameController_1.default.betInCrashGame);
routes.post("/stop_bet_crash", UserController_1.default.userTokenMiddleWare, CrashGameController_1.default.stopBetInCrash);
routes.get("/get_crash_game_info", CrashGameController_1.default.getCrashInfo);
exports.default = routes;
//# sourceMappingURL=index.js.map