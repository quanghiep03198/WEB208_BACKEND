import mongooseAutoPopulate from "mongoose-autopopulate";
import { model, ObjectId, Schema, Types } from "mongoose";
import { User } from "./user.model";
import { Project } from "./project.model";

export interface Task {
    _id: string | ObjectId;
    project: Partial<Project>;
    title: string;
    description: string;
    assignees: Array<ObjectId | Partial<User>>;
    startedAt: Date;
    deadline: Date;
    createdAt?: Date;
    updatedAt?: Date;
    status: string;
}
const TaskSchema = new Schema(
    {
        project: {
            type: Types.ObjectId,
        },
        title: {
            type: String,
            trim: true,
            require: true,
            minLength: 3,
        },
        description: {
            type: String,
            trim: true,
            require: true,
        },
        assignee: {
            type: Types.ObjectId,
            ref: "Users",
            autopopulate: { select: "-password" },
        },
        startedAt: {
            type: Date,
            require: true,
            default: new Date(),
        },
        deadline: {
            type: Date,
            require: true,
            default: function () {
                const today = new Date();
                const threeDaysLater = new Date();
                threeDaysLater.setDate(today.getDate() + 3);
                return threeDaysLater;
            },
        },
        status: {
            type: String,
            require: true,
            default: "TODO",
            enum: ["TODO", "IN_PROGRESS", "COMPLETED"],
        },
    },
    { timestamps: true },
);

TaskSchema.plugin(mongooseAutoPopulate);

const TaskModel = model<Task>("Tasks", TaskSchema);

export default TaskModel;
