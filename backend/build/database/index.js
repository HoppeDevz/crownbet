"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var config_1 = __importDefault(require("../config"));
var Database = /** @class */ (function () {
    function Database() {
        this.connection = mysql_1.default.createPool({
            localAddress: config_1.default.DB_ADRESS,
            port: config_1.default.DB_PORT,
            user: config_1.default.DB_USER,
            password: config_1.default.DB_PASSWORD,
            database: config_1.default.DB_NAME
        });
    }
    Database.prototype.syncSQL = function () {
    };
    return Database;
}());
//# sourceMappingURL=index.js.map