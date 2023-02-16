import { Schema, model, Types, ObjectId } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { User } from "./user.model";

export interface Project {
    _id: string | ObjectId;
    projectName: string;
    member: Array<ObjectId | Omit<User, "password">>;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema(
    {
        projectName: {
            type: String,
            trim: true,
            minLength: 3,
            require: true,
        },
        creator: {
            type: Types.ObjectId,
            ref: "Users",
            autopopulate: { select: "-password -__v" },
        },
        members: [
            {
                member: {
                    type: Types.ObjectId,
                    ref: "Users",
                    autopopulate: { select: "-password -__v" },
                    unique: true,
                },
                role: {
                    type: String,
                    enum: ["MEMBER", "PROJECT_MANAGER"],
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);
ProjectSchema.plugin(mongooseAutoPopulate);
ProjectSchema.pre("save", function (next) {
    if (this.members.length > 0) {
        this.members[0].role = "PROJECT_MANAGER";
    }
    next();
});

const ProjectModel = model<Project>("Projects", ProjectSchema);

export default ProjectModel;
