import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const UserRouter = Router();

UserRouter.get("/user", AuthMiddleware.checkAuthenticated, UserController.getUser);
UserRouter.get("/refresh-token/:auth", UserController.refreshToken);
UserRouter.get("/find-user", UserController.findUser);
UserRouter.post("/login", UserController.login);
UserRouter.post("/register", UserController.register);

export default UserRouter;
