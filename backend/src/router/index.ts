import { Router } from 'express';
import UserController from '../controller/UserController';

const routes = Router();

routes.post("/register_account", UserController.registerUser);
routes.get("/user_login", UserController.userLogin);

export default routes;