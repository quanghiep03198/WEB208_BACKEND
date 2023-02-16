import { model, ObjectId, Schema, Types } from "mongoose";
import bcrypt, { genSaltSync } from "bcrypt";
import { Request } from "express";

export interface User extends Document {
    _id: string | ObjectId;
    username: string;
    password: string;
    email: string;
    photoUrl: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
    authenticate(password: string): boolean;
}

const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        validate: {
            validator: function (value: string) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value);
            },
            message: (props: any) => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        require: true,
        minLength: 6,
        trim: true,
    },
    username: {
        type: String,
        trim: true,
        require: true,
    },
    photoUrl: {
        type: String,
        trim: true,
        default:
            "https://firebasestorage.googleapis.com/v0/b/music-app-cdef5.appspot.com/o/pictures%2Fdefault-avatar.png?alt=media&token=a70a307e-5ec6-4375-8e0c-b2e926f8c417",
    },
});

UserSchema.methods.authenticate = function (entryPassword: string): boolean {
    return bcrypt.compareSync(entryPassword, this.password);
};

UserSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password as string, bcrypt.genSaltSync(10));
    next();
});

const UserModel = model<User>("Users", UserSchema);

export default UserModel;
