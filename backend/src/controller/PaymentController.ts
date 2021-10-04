import { getManager, getRepository, createQueryBuilder } from 'typeorm';
import mercadopago from 'mercadopago';
import axios from 'axios';

import { MercadoPago } from 'mercadopago/interface';
import { PreferenceCreateResponse } from 'mercadopago/resources/preferences';
import { Request, Response } from 'express';

import config from '../config';
import Payment from '../entity/Payment';
import User from '../entity/User';

mercadopago.configure({
    access_token: config.MERCADOPAGO_ACESS_TOKEN
});

class PaymentController {

    private checkPaymentsInterval: number;

    constructor() {

        this.checkPaymentsInterval = 30 * 1000;

        setInterval(this.CheckPaymentsThread, this.checkPaymentsInterval); 
    }

    private CheckPaymentsThread() {

        console.log("[CROWN.BET] CHECKING ORDERS...");
        
        getRepository(Payment)
        .createQueryBuilder("payment")
        .where("payment.payment = :payment", { payment: JSON.stringify({}) })
        .getMany()
        .then(payments => {
            
            for (let payment of payments) {

                axios.get(`https://api.mercadopago.com/v1/payments/${payment.order_id}`, {
                    headers: {
                        Authorization: `Bearer ${config.MERCADOPAGO_ACESS_TOKEN}`
                    }
                })
                .then(response => {
    
                    const paymentData = response.data;
    
                    const productName = response.data.additional_info.items[0].title;
                    const status = response.data.status;
                    const payer = response.data.payer;
                    const transaction_amount = parseInt(response.data.transaction_amount);
                    const user_id = parseInt(response.data.external_reference);
    
                    if (status == "approved") {
                        
                        
                        createQueryBuilder()
                        .update(Payment)
                        .set({
                            payment: JSON.stringify(paymentData)
                        })
                        .where("id = :id", { id: payment.id })
                        .execute();

                        
                        createQueryBuilder()
                        .update(User)
                        .set({
                            balance: () => `balance + ${String(transaction_amount)}`
                        })
                        .where("id = :user_id", { user_id })
                        .execute();
                        
                        console.log(`[CROWN.BET] DELIVERY ORDER TO USER_ID ${user_id}`);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            }
        });

    }

    public PaymentWebhook(req: Request, res: Response) {

        if (req.query["data.id"]) {

            let orderId = req.query["data.id"];

            const payment = new Payment();
            
            payment.order_id = String(orderId);
            payment.payment = JSON.stringify({});
            payment.created_at = new Date();

            getManager().save(payment);

            console.log(`[CROWN.BET] SAVE ORDER IN DATABASE - ${orderId}`);

            res.status(200).send("Payment saved!");
            
        }
    }

    public createPayment(req: Request, res: Response) {

        const { amount, decoded } = req.body;

        mercadopago.preferences.create({
            
            back_urls: {
                "success": config.PAYMENT_SUCESS_CALLBACK,
                "failure": config.PAYMENT_FAILED_CALLBACK,
                "pending": config.PAYMENT_PENDING_CALLBACK
            },
            auto_return: "all",

            external_reference: String(decoded.id),
    
            notification_url: config.PAYMENT_WEBHOOK,
            items: [
                {
                    title: config.PAYMENT_PRODUCT_TITLE,
                    unit_price: amount,
                    quantity: 1,
                    currency_id: "BRL",
    
                    picture_url: config.PAYMENT_PRODUCT_PICTURE
                }
            ]
        })
        .then((data: PreferenceCreateResponse) => {

            const init_point = data.response.init_point;
            
            res.status(200).send({ init_point });
        })
        .catch(err => {

            console.log(err);

            res.status(500).send({ message: "Internal Error" });
        });
    }
}

export default new PaymentController();