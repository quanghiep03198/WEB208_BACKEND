import bcrypt from "bcrypt";
import mongoose, { ObjectId } from "mongoose";

export interface User extends mongoose.Document {
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

const UserSchema = new mongoose.Schema({
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
        require: true,
    },
});

UserSchema.methods.authenticate = function (entryPassword: string): boolean {
    return bcrypt.compareSync(entryPassword, this.password);
};

const UserModel = mongoose.model<User>("Users", UserSchema);

UserSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password as string, bcrypt.genSaltSync(10));
    this.photoUrl = "https://ui-avatars.com/api/?name=" + this.username?.charAt(0);
    next();
});

export default UserModel;
