"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var ParamsController_1 = __importDefault(require("./ParamsController"));
var User_1 = __importDefault(require("../entity/User"));
var config_1 = __importDefault(require("../config"));
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.registerUser = function (req, res) {
        var username = req.body.username || "";
        var email = req.body.email || "";
        var password = req.body.password || "";
        var birthDate = req.body.birthDate || "";
        ParamsController_1.default.requireParamsType([
            { paramName: "username", param: username, paramType: "string", rules: [
                    ["minStrLen", 6]
                ] },
            { paramName: "email", param: email, paramType: "string", rules: [
                    ["strPattern", "email"]
                ] },
            { paramName: "password", param: password, paramType: "string", rules: [
                    ["minStrLen", 8]
                ] },
            { paramName: "birthDate", param: birthDate, paramType: "string", rules: [
                    ["strPattern", "date"]
                ] },
        ], function (err) {
            if (err)
                return res.status(500).send(err.message);
            (0, typeorm_1.getRepository)(User_1.default)
                .createQueryBuilder("user")
                .where("user.username = :username", { username: username })
                .getOne()
                .then(function (alreadyUsername) {
                if (alreadyUsername) {
                    res.status(400).send({
                        message: "Username already in use!"
                    });
                }
                (0, typeorm_1.getRepository)(User_1.default)
                    .createQueryBuilder("user")
                    .where("user.email = :email", { email: email })
                    .getOne()
                    .then(function (alreadyEmail) {
                    if (alreadyEmail) {
                        res.status(400).send({
                            message: "Email already in use!"
                        });
                    }
                    var user = new User_1.default();
                    user.username = username;
                    user.email = email;
                    user.password = password;
                    user.balance = 0.0;
                    user.created_at = new Date();
                    user.updated_at = new Date();
                    (0, typeorm_1.getManager)().save(user).then(function (createdUser) {
                        res.status(200).send({ message: "User created!" });
                    });
                });
            });
        });
    };
    UserController.prototype.userLogin = function (req, res) {
        var email = req.headers['x-email'] || "";
        var password = req.headers['x-password'] || "";
        (0, typeorm_1.getRepository)(User_1.default)
            .createQueryBuilder()
            .where("email = :email", { email: email })
            .getOne()
            .then(function (user) {
            if (!user)
                return res.status(404).send({ message: "User not found!" });
            var isCorrectPassword = user.password == password;
            if (!isCorrectPassword)
                return res.status(404).send({ message: "User not found!" });
            var token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).send({ token: token });
        });
    };
    UserController.prototype.userTokenMiddleWare = function (req, res, next) {
        try {
            var token = req.headers["authorization"].split(" ")[1];
            req.body.decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            next();
        }
        catch (err) {
            return res.status(500).send({ message: "Internal Error" });
        }
    };
    UserController.prototype.getUserBalance = function (req, res) {
        var user_id = req.body.decoded.id;
        (0, typeorm_1.getRepository)(User_1.default)
            .createQueryBuilder()
            .where("id = :user_id", { user_id: user_id })
            .getOne()
            .then(function (user) {
            if (user)
                return res.status(200).send({ balance: user.balance });
            return res.status(404).send({ message: "User not found!" });
        });
    };
    return UserController;
}());
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map