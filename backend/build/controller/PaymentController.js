"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var mercadopago_1 = __importDefault(require("mercadopago"));
var axios_1 = __importDefault(require("axios"));
var config_1 = __importDefault(require("../config"));
var Payment_1 = __importDefault(require("../entity/Payment"));
var User_1 = __importDefault(require("../entity/User"));
mercadopago_1.default.configure({
    access_token: config_1.default.MERCADOPAGO_ACESS_TOKEN
});
var PaymentController = /** @class */ (function () {
    function PaymentController() {
        this.checkPaymentsInterval = 30 * 1000;
        setInterval(this.CheckPaymentsThread, this.checkPaymentsInterval);
    }
    PaymentController.prototype.CheckPaymentsThread = function () {
        console.log("[CROWN.BET] CHECKING ORDERS...");
        (0, typeorm_1.getRepository)(Payment_1.default)
            .createQueryBuilder("payment")
            .where("payment.payment = :payment", { payment: JSON.stringify({}) })
            .getMany()
            .then(function (payments) {
            var _loop_1 = function (payment) {
                axios_1.default.get("https://api.mercadopago.com/v1/payments/" + payment.order_id, {
                    headers: {
                        Authorization: "Bearer " + config_1.default.MERCADOPAGO_ACESS_TOKEN
                    }
                })
                    .then(function (response) {
                    var paymentData = response.data;
                    var productName = response.data.additional_info.items[0].title;
                    var status = response.data.status;
                    var payer = response.data.payer;
                    var transaction_amount = parseInt(response.data.transaction_amount);
                    var user_id = parseInt(response.data.external_reference);
                    if (status == "approved") {
                        (0, typeorm_1.createQueryBuilder)()
                            .update(Payment_1.default)
                            .set({
                            payment: JSON.stringify(paymentData)
                        })
                            .where("id = :id", { id: payment.id })
                            .execute();
                        (0, typeorm_1.createQueryBuilder)()
                            .update(User_1.default)
                            .set({
                            balance: function () { return "balance + " + String(transaction_amount); }
                        })
                            .where("id = :user_id", { user_id: user_id })
                            .execute();
                        console.log("[CROWN.BET] DELIVERY ORDER TO USER_ID " + user_id);
                    }
                })
                    .catch(function (err) {
                    console.log(err);
                });
            };
            for (var _i = 0, payments_1 = payments; _i < payments_1.length; _i++) {
                var payment = payments_1[_i];
                _loop_1(payment);
            }
        });
    };
    PaymentController.prototype.PaymentWebhook = function (req, res) {
        if (req.query["data.id"]) {
            var orderId = req.query["data.id"];
            var payment = new Payment_1.default();
            payment.order_id = String(orderId);
            payment.payment = JSON.stringify({});
            payment.created_at = new Date();
            (0, typeorm_1.getManager)().save(payment);
            console.log("[CROWN.BET] SAVE ORDER IN DATABASE - " + orderId);
            res.status(200).send("Payment saved!");
        }
    };
    PaymentController.prototype.createPayment = function (req, res) {
        var _a = req.body, amount = _a.amount, decoded = _a.decoded;
        mercadopago_1.default.preferences.create({
            back_urls: {
                "success": config_1.default.PAYMENT_SUCESS_CALLBACK,
                "failure": config_1.default.PAYMENT_FAILED_CALLBACK,
                "pending": config_1.default.PAYMENT_PENDING_CALLBACK
            },
            auto_return: "all",
            external_reference: String(decoded.id),
            notification_url: config_1.default.PAYMENT_WEBHOOK,
            items: [
                {
                    title: config_1.default.PAYMENT_PRODUCT_TITLE,
                    unit_price: amount,
                    quantity: 1,
                    currency_id: "BRL",
                    picture_url: config_1.default.PAYMENT_PRODUCT_PICTURE
                }
            ]
        })
            .then(function (data) {
            var init_point = data.response.init_point;
            res.status(200).send({ init_point: init_point });
        })
            .catch(function (err) {
            console.log(err);
            res.status(500).send({ message: "Internal Error" });
        });
    };
    return PaymentController;
}());
exports.default = new PaymentController();
//# sourceMappingURL=PaymentController.js.map