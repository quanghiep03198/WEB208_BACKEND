import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { MongooseError } from "mongoose";
import UserModel, { User } from "../models/user.model";

const UserService = {
    async login(data: Partial<User>) {
        try {
            const user = (await UserModel.findOne({
                email: data.email,
            }).exec()) as User;
            if (!user) throw createHttpError.NotFound("Account does not exist!");
            if (!user.authenticate(data.password as string)) throw createHttpError.BadRequest("Password is incorrect!");

            return user;
        } catch (error) {
            throw error as MongooseError;
        }
    },
    async register(data: Partial<User>) {
        try {
            const existedUser = await UserModel.findOne({
                email: data.email,
            }).exec();
            if (existedUser) throw new Error("Account already exited!");
            const newUser = await new UserModel(data).save();

            return newUser;
        } catch (error) {
            console.log((error as MongooseError).message);
            throw error as MongooseError | Error;
        }
    },
    async getUser(credential: string) {
        try {
            return await UserModel.findOne({ _id: credential }).select("-password").exec();
        } catch (error) {
            throw error as MongooseError;
        }
    },
    async findUser(searchTerm: string) {
        try {
            const searchTermPattern = new RegExp(searchTerm, "gi");
            const users = await UserModel.find({
                $or: [{ email: searchTermPattern }, { username: searchTermPattern }],
            })
                .select("-password")
                .exec();
            console.log(searchTermPattern);
            return users;
        } catch (error) {
            throw error as MongooseError;
        }
    },
    async changePassword(userId: string, previousPassword: string, newPassword: string) {
        try {
            const user = await UserModel.findOne({ _id: userId }).exec();
            if (!user?.authenticate(previousPassword)) {
                throw new Error("Current password is incorrect!");
            }
            console.log(newPassword);
            const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
            return await UserModel.updateOne(
                {
                    _id: userId,
                },
                { password: hashedPassword },
                { new: true },
            );
        } catch (error) {
            throw error;
        }
    },
    async editProfile(userId: string, updatedUserInfo: Partial<User>) {
        try {
            if (updatedUserInfo.username) {
                updatedUserInfo.photoUrl = "https://ui-avatars.com/api/?name=" + updatedUserInfo.username.charAt(0);
            }
            return await UserModel.findOneAndUpdate({ _id: userId }, updatedUserInfo, { new: true });
        } catch (error) {
            throw error as MongooseError;
        }
    },
};

export default UserService;
