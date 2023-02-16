import createHttpError from "http-errors";
import { MongooseError } from "mongoose";
import UserModel, { User } from "../models/user.model";

const UserService = {
    async login(data: Partial<User>) {
        try {
            const user = (await UserModel.findOne({ email: data.email }).exec()) as User;
            if (!user) throw createHttpError.NotFound("Account does not exist!");
            if (!user.authenticate(data.password as string)) throw createHttpError.BadRequest("Password is incorrect!");

            return user;
        } catch (error) {
            throw error as MongooseError;
        }
    },
    async register(data: Partial<User>) {
        try {
            const existedUser = await UserModel.findOne({ email: data.email }).exec();
            if (existedUser) throw new Error("Account already exited!");
            const newUser = await new UserModel(data).save();

            return newUser;
        } catch (error) {
            console.log((error as MongooseError).message);
            throw error as MongooseError;
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
            if (!users) throw new MongooseError("Cannot find user!");
            return users;
        } catch (error) {
            return error as MongooseError;
        }
    },
};

export default UserService;
