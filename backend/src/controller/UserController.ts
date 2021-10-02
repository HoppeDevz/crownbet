import { Request, Response } from 'express';
import ParamsController from './ParamsController';
import User from '../types/User';

class UserController {

    public registerUser(req: Request, res: Response): void {

        console.log(req.body);

        const username = req.body.username || "";
        const email = req.body.email || "";
        const password = req.body.password || "";

        ParamsController.requireParamsType([
            { paramName: "username", param: username, paramType: "string", rules: [
                ["minStrLen", 10]
            ]},
            { paramName: "email", param: email, paramType: "string", rules: [
                ["strPattern", "email"]
            ]},
            { paramName: "password", param: password, paramType: "string", rules: [
                ["minStrLen", 10]
            ]},
        ],
        err => {

            if (err) return res.status(500).send(err.message);
            
            res.status(200).send("User created!");
        });
    }
}

export default new UserController();