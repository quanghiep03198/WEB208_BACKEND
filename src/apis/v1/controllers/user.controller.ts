import UserService from "../services/user.services";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { HttpError } from "http-errors";
import createHttpError from "http-errors";
import "dotenv/config";
import { MongooseError } from "mongoose";

const UserController = {
    async login(req: Request, res: Response) {
        try {
            const user = await UserService.login(req.body as Pick<User, "email" & "password">);

            const accessToken = jwt.sign({ credential: (user as User)._id }, process.env.SECRET_KEY!, {
                expiresIn: "1h",
            });

            return res.status(200).json({ accessToken, user });
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
};

export default UserController;
