import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const UserRouter = Router();

UserRouter.get(
	"/user",
	AuthMiddleware.checkAuthenticated,
	UserController.getUser
);
UserRouter.get("/refresh-token/:auth", UserController.refreshToken);
UserRouter.get("/find-user", UserController.findUser);
UserRouter.post("/login", UserController.login);
UserRouter.post("/register", UserController.register);
UserRouter.patch(
	"/change-password",
	AuthMiddleware.checkAuthenticated,
	UserController.changePassword
);
UserRouter.patch(
	"/edit-profile",
	AuthMiddleware.checkAuthenticated,
	UserController.editProfile
);

export default UserRouter;

/**
 * @openapi
 * /login:
 *   tags: ['Auth']
 *   post:
 *     description: Basic Auth signin with email and password
 *     requestBody:
 *       type: object
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example: {email: 'test@gmail.com', password: '123123'}
 *     responses:
 *       200:
 *         description: ok
 */
