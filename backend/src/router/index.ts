import { Router } from 'express';
import UserController from '../controller/UserController';

const routes = Router();

routes.post("/register_account", UserController.registerUser);

export default routes;