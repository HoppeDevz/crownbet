"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    // DATABASE SETTINGS
    DB_ADRESS: "localhost",
    DB_PORT: 3306,
    DB_USER: "root",
    DB_PASSWORD: "",
    DB_NAME: "cronwbet",
    // JSON WEB TOKEN
    JWT_SECRET: "EDE098C5FB80E66E796188A5FBE21A967F94081389995D9842FEC841AA4AB98010D08FA6C7243ABC36C53CFE6F6E7CCF9F17728C3272C9937BDBEDE296836518",
    // PAYMENT CONFIG
    MERCADOPAGO_ACESS_TOKEN: "TEST-2296830218728005-042922-2676d30234fc08585bec3c65d89a1e54-392378615",
    PAYMENT_WEBHOOK: "http://187.108.118.71:30120/payment_webhook",
    PAYMENT_SUCESS_CALLBACK: "https://localhost:3000/mp_return?paymentStatus=sucess",
    PAYMENT_FAILED_CALLBACK: "https://localhost:3000/mp_return?paymentStatus=failure",
    PAYMENT_PENDING_CALLBACK: "https://localhost:3000/mp_return?paymentStatus=pending",
    PAYMENT_PRODUCT_TITLE: "CRÉDITOS CROWN.BET",
    PAYMENT_PRODUCT_PICTURE: "https://i.imgur.com/2LPRigG.png"
};
exports.default = config;
//# sourceMappingURL=index.js.map