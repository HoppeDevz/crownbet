import { Router } from 'express';
import CrashGameController from '../controller/CrashGameController';
import PaymentController from '../controller/PaymentController';
import UserController from '../controller/UserController';

const routes = Router();

routes.post("/register_account", UserController.registerUser);
routes.get("/user_login", UserController.userLogin);
routes.get("/get_user_balance", UserController.userTokenMiddleWare, UserController.getUserBalance);

routes.post("/create_payment", UserController.userTokenMiddleWare, PaymentController.createPayment);
routes.post("/payment_webhook", PaymentController.PaymentWebhook);

routes.post("/bet_crash", UserController.userTokenMiddleWare, CrashGameController.betInCrashGame);
routes.post("/stop_bet_crash", UserController.userTokenMiddleWare, CrashGameController.stopBetInCrash);
routes.get("/get_crash_game_info", CrashGameController.getCrashInfo);

export default routes;