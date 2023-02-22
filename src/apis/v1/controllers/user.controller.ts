import "dotenv/config";
import { Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import UserService from "../services/user.services";

const UserController = {
    async login(req: Request, res: Response) {
        try {
            const user = await UserService.login(req.body as Pick<User, "email" & "password">);

            const token = jwt.sign({ auth: (user as Omit<User, "password">)._id }, process.env.SECRET_KEY!, {
                expiresIn: "30m",
            });
            console.log(user);
            return res.status(200).json({ accessToken: token, auth: user._id });
        } catch (error) {
            return res.status(400).json({
                message: (error as HttpError).message,
                statusCode: (error as HttpError).statusCode,
            });
        }
    },
    async register(req: Request, res: Response) {
        try {
            console.log(req.body);
            if (!req.body || !Object.keys(req.body).length) {
                throw createHttpError.BadRequest("User data must be provided!");
            }
            const response = await UserService.register(req.body as Partial<User>);
            return res.status(201).json(response);
        } catch (error) {
            console.log((error as HttpError).message);
            return res.status(400).json({
                message: (error as HttpError).message,
                statusCode: (error as HttpError).statusCode,
            });
        }
    },
    async getUser(req: Request | any, res: Response) {
        try {
            if (!req.auth) {
                throw createHttpError.Forbidden("User credential must be provided");
            }
            const user = await UserService.getUser(req.auth);
            return res.status(200).json(user);
        } catch (error) {
            return res.status((error as HttpError).statusCode).json({
                message: (error as HttpError).message,
                statusCode: (error as HttpError).statusCode,
            });
        }
    },
    async refreshToken(req: Request, res: Response) {
        try {
            const newAccessToken = jwt.sign({ auth: req.params.auth }, process.env.SECRET_KEY!, { expiresIn: "1h" });
            return res.status(200).json(newAccessToken);
        } catch (error) {
            return res.status((error as HttpError).statusCode).json({
                message: (error as HttpError).message,
                statusCode: (error as HttpError).statusCode,
            });
        }
    },
    async findUser(req: Request, res: Response) {
        try {
            const foundUsers = await UserService.findUser(req.query.searchTerm as string);
            return res.status(200).json(foundUsers);
        } catch (error) {
            return res.status((error as HttpError).statusCode).json({
                message: (error as HttpError).message,
                statusCode: (error as HttpError).statusCode,
            });
        }
    },
    async changePassword(req: Request | any, res: Response) {
        try {
            console.log(req.body);
            return await UserService.changePassword(req.auth, req.body.currentPassword, req.body.newPassword);
        } catch (error) {
            return res.status(400).json({
                message: (error as HttpError).message,
                status: (error as HttpError).status,
            });
        }
    },
    async editProfile(req: Request | any, res: Response) {
        try {
            const updatedProfile = await UserService.editProfile(req.auth, req.body);
            return res.status(201).json(updatedProfile);
        } catch (error) {
            return res.status(400).json({
                message: (error as HttpError).message,
                status: (error as HttpError).status,
            });
        }
    },
};

export default UserController;
