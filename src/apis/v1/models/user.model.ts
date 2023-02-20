import bcrypt from "bcrypt";
import { model, ObjectId, Schema } from "mongoose";

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
            message: (props: any) =>
                `${props.value} is not a valid email address!`,
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
        default: "",
    },
});

UserSchema.methods.authenticate = function (entryPassword: string): boolean {
    return bcrypt.compareSync(entryPassword, this.password);
};

UserSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(
        this.password as string,
        bcrypt.genSaltSync(10),
    );
    this.photoUrl =
        "https://ui-avatars.com/api/?name=" + this.username?.charAt(0);
    next();
});

const UserModel = model<User>("Users", UserSchema);

export default UserModel;
