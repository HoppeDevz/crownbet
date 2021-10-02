import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import ParamsController from './ParamsController';
import User from '../entity/User';

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

            createConnection().then(async connection => {

                const alreadyUsername = await connection
                .getRepository(User)
                .createQueryBuilder("user")
                .where("user.username = :username", { username })
                .getOne();

                const alreadyEmail = await connection
                .getRepository(User)
                .createQueryBuilder("user")
                .where("user.email = :email", { email })
                .getOne();

                if (alreadyUsername) {

                    res.status(400).send({
                        message: "Username already in use!"
                    });
                }

                if (alreadyEmail) {

                    res.status(400).send({
                        message: "Email already in use!"
                    });
                }

                const user = new User();

                user.username = username;
                user.email = email;
                user.password = password;
                user.created_at = new Date();
                user.updated_at = new Date();

                await connection.manager.save(user);

                res.status(200).send({ message: "User created!" });
            })
        });
    }
}

export default new UserController();