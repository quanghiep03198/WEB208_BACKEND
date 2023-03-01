import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import jwt from "jsonwebtoken";
import UserModel, { User } from "../models/user.model";
import ProjectService from "../services/project.services";

const AuthMiddleware = {
    async checkAuthenticated(req: Request | any, res: Response, next: NextFunction) {
        try {
            let token = req.headers.authorization;
            if (!token) throw createHttpError.Unauthorized("Access token must be provided!");
            token = token.split(" ").at(1) as string;
            const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as any;
            const user = (await UserModel.findOne({ _id: decoded.auth }).select("-password").exec()) as Omit<User, "password">;

            req.auth = user._id as string;

            next();
        } catch (error) {
            return res.status(401).json({
                message: (error as HttpError).message,
                status: (error as HttpError).status,
            });
        }
    },
    async checkIsProjectCreator(req: Request | any, res: Response, next: NextFunction) {
        try {
            const projectId = req.params.projectId || req.params.id || req.query.projectId;
            console.log(projectId);
            const createdProject = await ProjectService.getProjectByCreator(projectId, req.auth);
            console.log(createdProject);
            if (!createdProject) {
                throw createHttpError.Forbidden("You are not project creator!");
            }
            next();
        } catch (error) {
            return res.status(403).json({
                message: (error as HttpError).message,
                status: (error as HttpError).status,
            });
        }
    },
    async checkIsMember(req: Request | any, res: Response, next: NextFunction) {
        try {
            const projectId = req.params.id || req.params.projectId || req.query.projectId;
            const projectJoinedIn = await ProjectService.getJoinedProject(projectId, req.auth);

            if (!projectJoinedIn) throw createHttpError.Unauthorized("You are not a member of this project!");
            next();
        } catch (error) {
            return res.status(403).json({
                message: (error as HttpError).message,
                statusCode: (error as HttpError).statusCode,
            });
        }
    },
};

export default AuthMiddleware;
