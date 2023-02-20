import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { User } from "./user.model";

export interface Project {
    _id: string;
    projectName: string;
    members: Array<Omit<User, "password"> | any>;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            trim: true,
            minLength: 3,
            require: true,
        },
        creator: {
            type: mongoose.Types.ObjectId,
            ref: "Users",
            autopopulate: { select: "-password -__v" },
        },
        members: [
            {
                info: {
                    type: mongoose.Types.ObjectId,
                    ref: "Users",
                    autopopulate: { select: "-password -__v" },
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
    this.members.push({
        info: this.creator,
        role: "PROJECT_MANAGER",
    });

    next();
});

const ProjectModel = mongoose.model<Project>("Projects", ProjectSchema);

export default ProjectModel;
