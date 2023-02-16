import "dotenv/config";
import { AuthenticatedRequest, NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import jwt from "jsonwebtoken";
import UserModel, { User } from "../models/user.model";
import ProjectService from "../services/project.services";

const AuthMiddleware = {
    async checkAuthenticated(
        req: Request | any,
        res: Response,
        next: NextFunction,
    ) {
        try {
            let token = req.headers.authorization;
            if (!token)
                throw createHttpError.Forbidden(
                    "Access token must be provided!",
                );
            token = token.split(" ").at(1) as string;
            const decoded = jwt.verify(
                token,
                process.env.SECRET_KEY as string,
            ) as any;
            console.log(decoded);
            const user = (await UserModel.findOne({ _id: decoded.credential })
                .select("-password")
                .exec()) as Omit<User, "password">;

            req.auth = user._id as string;
            next();
        } catch (error) {
            return res.status(401).json({
                message: (error as HttpError).message,
                status: (error as HttpError).status | 401,
            });
        }
    },
    async checkIsProjectManager(
        req: Request | any,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const createdProject = await ProjectService.getProjectByCreator(
                req.params.id,
                req.auth,
            );
            if (!createdProject) {
                throw createHttpError.Forbidden("You are not project creator!");
            }
            next();
        } catch (error) {
            return res.status((error as HttpError).statusCode).json({
                message: (error as HttpError).message,
                statusCode: (error as HttpError).statusCode,
            });
        }
    },
    async checkIsMember(req: Request | any, res: Response, next: NextFunction) {
        try {
            const projectId =
                req.params.id || req.params.projectId || req.query.projectId;
            console.log(projectId);
            const projectJoinedIn = await ProjectService.getJoinedProject(
                projectId,
                req.auth,
            );
            console.log(projectJoinedIn);
            if (!projectJoinedIn)
                throw createHttpError.Unauthorized(
                    "You are not a member of this project!",
                );
            next();
        } catch (error) {
            return res.status((error as HttpError).statusCode | 500).json({
                message: (error as HttpError).message,
                statusCode: (error as HttpError).statusCode,
            });
        }
    },
};

export default AuthMiddleware;
