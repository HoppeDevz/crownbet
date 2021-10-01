"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router_1 = __importDefault(require("./router"));
var App = /** @class */ (function () {
    function App() {
        this.app = (0, express_1.default)();
        this.router = router_1.default;
        /* START */
        this.useRoutes();
    }
    App.prototype.checkPortRange = function (PORT, callback) {
        var outOfRange = PORT < 1024 && PORT > 49151;
        outOfRange ?
            callback(new Error("(PORT) PARAM IS OUTSIDE OF THE PORT RANGE 1024~49151"))
            :
                callback(null);
    };
    App.prototype.useRoutes = function () {
        this.app.use(this.router);
    };
    App.prototype.startServer = function (PORT) {
        var _this = this;
        this.checkPortRange(PORT, function (err) {
            if (err)
                throw err;
            _this.app.listen(PORT, function () {
                console.log("Server is running in port: " + PORT);
            });
        });
    };
    return App;
}());
exports.default = new App();
//# sourceMappingURL=app.js.map