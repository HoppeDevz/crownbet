import { Request, Response } from 'express';
import User from '../types/User';

class UserController {

    public registerUser(req: Request, res: Response): void {

        const { username, email, password } = req.body;
    }
}