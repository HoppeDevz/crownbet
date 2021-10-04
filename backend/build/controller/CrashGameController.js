"use strict";
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
var typeorm_1 = require("typeorm");
var User_1 = __importDefault(require("../entity/User"));
var ParamsController_1 = __importDefault(require("./ParamsController"));
var WebSocket_1 = __importDefault(require("./WebSocket"));
var cache = [];
var crashUsersBet = [];
var crashGameMultiplier = 1.00;
var inCrashMatch = false;
var latest_results = [];
var fakeTotalPlayers = 0;
var fakeTotalMoney = 0;
var step = false;
var nextMatchInSeconds = 0;
var CrashGameController = /** @class */ (function () {
    function CrashGameController() {
    }
    CrashGameController.prototype.startCrashGame = function () {
        this.crashGameThread();
    };
    CrashGameController.prototype.getCrashInfo = function (req, res) {
        res.status(200).send({
            inCrashMatch: inCrashMatch,
            crashGameMultiplier: crashGameMultiplier,
            nextMatchInSeconds: nextMatchInSeconds
        });
    };
    CrashGameController.prototype.betInCrashGame = function (req, res) {
        // ERRO SE SE JÁ ESTIVER ACONTECENDO ALGUMA PARTIDA //
        if (inCrashMatch)
            return res.status(400).send({ message: "Game already started!" });
        var user_id = req.body.decoded.id;
        var bet_amount = req.body.bet_amount;
        // ERRO SE O USUÁRIO JÁ TIVER APOSTADO //
        if (cache[user_id])
            return res.status(400).send({ message: "You already betted in this match!" });
        ParamsController_1.default.requireParamsType([
            { paramName: "bet_amount", param: bet_amount, paramType: "number" }
        ], function (err) {
            if (err)
                return res.status(500).send(err.message);
            if (bet_amount <= 0)
                return res.status(500).send("Invalid param bet_amount!");
            (0, typeorm_1.getRepository)(User_1.default)
                .createQueryBuilder("user")
                .where("user.id = :user_id", { user_id: user_id })
                .getOne()
                .then(function (user) {
                // ERRO AO TENTAR APOSTAR MAIS QUE O PRÓPRIO SALDO //
                if (user.balance < bet_amount)
                    return res.status(400).send({ message: "Insufficient funds" });
                (0, typeorm_1.createQueryBuilder)()
                    .update(User_1.default)
                    .set({
                    balance: function () { return "balance - " + String(bet_amount); }
                })
                    .where("id = :user_id", { user_id: user_id })
                    .execute();
                crashUsersBet.push({ user_id: user_id, bet_amount: bet_amount });
                cache[user_id] = true;
                console.log("[CROWN.BET] USER " + user_id + " MAKE BET IN CRASH GAME! R$ " + bet_amount);
                res.status(200).send("Bet sucess!");
            });
        });
    };
    CrashGameController.prototype.stopBetInCrash = function (req, res) {
        var user_id = req.body.decoded.id;
        var multiply = crashGameMultiplier;
        // SEARCH USER IN BET LIST //
        var index = crashUsersBet.findIndex(function (item) { return item.user_id == user_id; });
        var userBet = crashUsersBet[index];
        if (!inCrashMatch)
            return res.status(400).send({ message: "None match in progress right now..." });
        if (userBet) {
            // REMOVE USER FROM BET LIST //
            crashUsersBet.splice(index, 1);
            var reward_1 = (userBet.bet_amount * multiply).toFixed(2);
            (0, typeorm_1.createQueryBuilder)()
                .update(User_1.default)
                .set({
                balance: function () { return "balance + " + String(reward_1); }
            })
                .where("id = :user_id", { user_id: userBet.user_id })
                .execute();
            return res.status(200).send({ multiply: multiply });
        }
        else {
            return res.status(400).send({ message: "Bet not found!" });
        }
    };
    CrashGameController.prototype.generateRandomNumber = function (min, max) {
        var highlightedNumber = Math.random() * (max - min) + min;
        return highlightedNumber;
    };
    CrashGameController.prototype.calculateCounter = function () {
        return this.generateRandomNumber(0.0, 2) * 100;
    };
    CrashGameController.prototype.crashGameThread = function () {
        return __awaiter(this, void 0, void 0, function () {
            var counter, crashInterval;
            var _this = this;
            return __generator(this, function (_a) {
                inCrashMatch = true;
                fakeTotalPlayers = 0;
                fakeTotalMoney = 0;
                counter = this.calculateCounter();
                crashInterval = setInterval(function () {
                    counter--;
                    crashGameMultiplier += 0.01;
                    WebSocket_1.default.globalEmit("update-crash", { crashGameMultiplier: crashGameMultiplier });
                    if (counter <= 0) {
                        // STOP CRASH
                        clearInterval(crashInterval);
                        if (latest_results.length == 18) {
                            latest_results.pop();
                            latest_results.push(crashGameMultiplier);
                        }
                        else {
                            latest_results.push(crashGameMultiplier);
                        }
                        WebSocket_1.default.globalEmit("update-latest-results", latest_results);
                        // RESET VARS
                        crashGameMultiplier = 1.0;
                        crashUsersBet = [];
                        cache = [];
                        inCrashMatch = false;
                        nextMatchInSeconds = 10;
                        var nextMatchInterval_1 = setInterval(function () {
                            nextMatchInSeconds - 0.01 <= 0 ? nextMatchInSeconds = 0.0 : nextMatchInSeconds -= 0.01;
                            if (!step) {
                                fakeTotalPlayers = fakeTotalPlayers + new Date().getTime() % 2;
                                fakeTotalMoney = fakeTotalMoney + new Date().getTime() % 7;
                                step = true;
                            }
                            else {
                                step = false;
                            }
                            WebSocket_1.default.globalEmit("update-timer", { nextMatchInSeconds: nextMatchInSeconds });
                            WebSocket_1.default.globalEmit("update-total-players", fakeTotalPlayers);
                            WebSocket_1.default.globalEmit("update-total-money", fakeTotalMoney);
                            if (nextMatchInSeconds <= 0) {
                                nextMatchInSeconds = 0.0;
                                clearInterval(nextMatchInterval_1);
                            }
                        }, 10);
                        setTimeout(function () { return _this.crashGameThread(); }, 17 * 1000);
                    }
                }, 100);
                return [2 /*return*/];
            });
        });
    };
    return CrashGameController;
}());
exports.default = new CrashGameController();
//# sourceMappingURL=CrashGameController.js.map