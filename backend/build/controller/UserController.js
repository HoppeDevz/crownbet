"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ParamsController_1 = __importDefault(require("./ParamsController"));
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.registerUser = function (req, res) {
        console.log(req.body);
        var username = req.body.username || "";
        var email = req.body.email || "";
        var password = req.body.password || "";
        ParamsController_1.default.requireParamsType([
            { paramName: "username", param: username, paramType: "string", rules: [
                    ["minStrLen", 10]
                ] },
            { paramName: "email", param: email, paramType: "string", rules: [
                    ["strPattern", "email"]
                ] },
            { paramName: "password", param: password, paramType: "string", rules: [
                    ["minStrLen", 10]
                ] },
        ], function (err) {
            if (err)
                return res.status(500).send(err.message);
            res.status(200).send("User created!");
        });
    };
    return UserController;
}());
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map