"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParamsController = /** @class */ (function () {
    function ParamsController() {
    }
    ParamsController.prototype.checkRule = function (paramName, param, rule, value) {
        switch (rule) {
            case "minStrLen":
                if (param.length < value) {
                    return new Error("Param '" + paramName + "' must have at least " + value + " characters");
                }
            case "strPattern":
                switch (value) {
                    case "email":
                        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        var isEmail = re.test(String(param).toLowerCase());
                        if (!isEmail) {
                            return new Error("Param '" + paramName + "' is invalid e-mail!");
                        }
                }
        }
    };
    ParamsController.prototype.requireParams = function (params, callback) {
        var err;
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var _a = params_1[_i], paramName = _a.paramName, param = _a.param;
            param == null ? err = new Error("Param '" + paramName + "' is null!") : null;
        }
        callback(err);
    };
    ParamsController.prototype.requireParamsType = function (params, callback) {
        var err;
        for (var _i = 0, params_2 = params; _i < params_2.length; _i++) {
            var _a = params_2[_i], paramName = _a.paramName, param = _a.param, paramType = _a.paramType, rules = _a.rules;
            var t = typeof (param);
            if (t != paramType) {
                err = new Error("Type of " + paramName + " is " + t + " but expected " + paramType);
            }
            if (rules) {
                for (var _b = 0, rules_1 = rules; _b < rules_1.length; _b++) {
                    var _c = rules_1[_b], rule = _c[0], value = _c[1];
                    var error = this.checkRule(paramName, param, rule, value);
                    error ? err = error : null;
                }
            }
        }
        callback(err);
    };
    return ParamsController;
}());
exports.default = new ParamsController();
//# sourceMappingURL=ParamsController.js.map