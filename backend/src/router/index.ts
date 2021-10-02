import { Router } from 'express';
import UserController from '../controller/UserController';

const routes = Router();

routes.post("/register_account", UserController.registerUser);
routes.get("/user_login", UserController.userLogin);
routes.get("/get_user_balance", UserController.userTokenMiddleWare, UserController.getUserBalance);

export default routes;