"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.prototype.createConnection = function () {
        (0, typeorm_1.createConnection)();
    };
    return Database;
}());
exports.default = new Database();
//# sourceMappingURL=index.js.map