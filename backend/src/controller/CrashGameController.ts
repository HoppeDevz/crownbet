import CrashBet from "../types/CrashBet";
import { Request, Response } from 'express';
import { createQueryBuilder, getRepository } from 'typeorm';
import User from "../entity/User";
import ParamsController from "./ParamsController";
import socket from './WebSocket';

let cache: Array<boolean> = [];
let crashUsersBet: Array<CrashBet> = [];
let crashGameMultiplier: number = 1.00;
let inCrashMatch: boolean = false;
let latest_results: Array<number> = [];

let fakeTotalPlayers: number = 0;
let fakeTotalMoney: number = 0;
let step: boolean = false;

let nextMatchInSeconds: number = 0;

class CrashGameController {

    public startCrashGame() {
        this.crashGameThread();
    }

    public getCrashInfo(req: Request, res: Response) {
        
        res.status(200).send({
            inCrashMatch,
            crashGameMultiplier,
            nextMatchInSeconds
        })
    }

    public betInCrashGame(req: Request, res: Response) {

        // ERRO SE SE JÁ ESTIVER ACONTECENDO ALGUMA PARTIDA //
        if (inCrashMatch) return res.status(400).send({ message: "Game already started!" });

        const { id: user_id } = req.body.decoded;
        const { bet_amount } = req.body;

        // ERRO SE O USUÁRIO JÁ TIVER APOSTADO //
        if (cache[user_id]) return res.status(400).send({ message: "You already betted in this match!" });

        ParamsController.requireParamsType([
            { paramName: "bet_amount", param: bet_amount, paramType: "number" }
        ],
        err => {

            if (err) return res.status(500).send(err.message);
            if (bet_amount <= 0) return res.status(500).send("Invalid param bet_amount!");

            getRepository(User)
            .createQueryBuilder("user")
            .where("user.id = :user_id", { user_id })
            .getOne()
            .then(user => {

                // ERRO AO TENTAR APOSTAR MAIS QUE O PRÓPRIO SALDO //
                if (user.balance < bet_amount) return res.status(400).send({ message: "Insufficient funds" });

                createQueryBuilder()
                .update(User)
                .set({
                    balance: () => `balance - ${String(bet_amount)}`
                })
                .where("id = :user_id", { user_id })
                .execute();
    
                crashUsersBet.push({ user_id, bet_amount });
                cache[user_id] = true;
    
                console.log(`[CROWN.BET] USER ${user_id} MAKE BET IN CRASH GAME! R$ ${bet_amount}`);
    
                res.status(200).send("Bet sucess!");
            });
        });
    }

    public stopBetInCrash(req: Request, res: Response) {

        const { id: user_id } = req.body.decoded;

        const multiply = crashGameMultiplier;

        // SEARCH USER IN BET LIST //
        const index = crashUsersBet.findIndex(item => item.user_id == user_id);
        const userBet = crashUsersBet[index];

        if (!inCrashMatch) return res.status(400).send({ message: "None match in progress right now..." });

        if (userBet) {

            // REMOVE USER FROM BET LIST //
            crashUsersBet.splice(index, 1);

            const reward = (userBet.bet_amount * multiply).toFixed(2);

            createQueryBuilder()
            .update(User)
            .set({
                balance: () => `balance + ${String(reward)}`
            })
            .where("id = :user_id", { user_id: userBet.user_id })
            .execute();

            return res.status(200).send({ multiply });
        
        } else {

            return res.status(400).send({ message: "Bet not found!" });
        }

    }

    private generateRandomNumber(min: number, max: number): number {
        
        let highlightedNumber = Math.random() * (max - min) + min;
    
        return highlightedNumber;
    }

    private calculateCounter(): number {

        return this.generateRandomNumber(0.0, 2) * 100;
    }

    private async crashGameThread() {

        inCrashMatch = true;

        fakeTotalPlayers = 0;
        fakeTotalMoney = 0;

        let counter = this.calculateCounter();

        
        let crashInterval = setInterval(() => {

            counter--;
            crashGameMultiplier += 0.01;

            socket.globalEmit("update-crash", { crashGameMultiplier });

            if (counter <= 0) {

                // STOP CRASH
                clearInterval(crashInterval);

                if (latest_results.length == 18) {

                    latest_results.pop();
                    latest_results.push(crashGameMultiplier);
                } else {
                    latest_results.push(crashGameMultiplier);
                }

                socket.globalEmit("update-latest-results", latest_results);

                // RESET VARS
                crashGameMultiplier = 1.0;
                crashUsersBet = [];
                cache = [];
                inCrashMatch = false;

                nextMatchInSeconds = 10;

                const nextMatchInterval = setInterval(() => {

                    nextMatchInSeconds - 0.01 <= 0 ? nextMatchInSeconds = 0.0 : nextMatchInSeconds -= 0.01;

                    
                    if (!step) {

                        fakeTotalPlayers = fakeTotalPlayers + new Date().getTime() % 2;
                        fakeTotalMoney = fakeTotalMoney + new Date().getTime() % 7;
                        step = true;
                    } else {

                        step = false;
                    }
                      
                    

                    socket.globalEmit("update-timer", { nextMatchInSeconds });

                    socket.globalEmit("update-total-players", fakeTotalPlayers);
                    socket.globalEmit("update-total-money", fakeTotalMoney);

                    if (nextMatchInSeconds <= 0) {

                        nextMatchInSeconds = 0.0;
                        clearInterval(nextMatchInterval);
                    }
                }, 10);

                setTimeout(() => this.crashGameThread(), 17 * 1000);
            }

        }, 100);
    }
}

export default new CrashGameController();