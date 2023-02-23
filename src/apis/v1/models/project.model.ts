import mongoose, { ObjectId } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { User } from "./user.model";

export interface Project {
	_id: ObjectId;
	projectName: string;
	creator: ObjectId;
	members: Array<{
		_id: ObjectId;
		info: Omit<User, "password">;
		role: string;
		joinedAt: Date;
	}>;
	createdAt: Date;
	updatedAt: Date;
	customer: string;
	budget: number;
	estimatedCompleteDate: Date;
	tasks?: [];
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
				joinedAt: {
					type: Date,
					default: new Date(),
				},
				role: {
					type: String,
					enum: ["MEMBER", "PROJECT_MANAGER"],
				},
			},
		],
		customer: {
			type: String,
			uppercase: true,
			trim: true,
			require: true,
			default: "Unknown",
		},
		budget: { type: Number, default: 1000 },
		estimatedCompleteDate: {
			type: Date,
			default: () => {
				const today = new Date();
				const sixMonthLater = new Date();
				sixMonthLater.setMonth(today.getMonth() + 7);
				return sixMonthLater;
			},
		},
	},
	{
		strictPopulate: false,
		strictQuery: false,
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);
ProjectSchema.plugin(mongooseAutoPopulate);
ProjectSchema.pre("save", function (next) {
	this.members.push({
		info: this.creator,
		role: "PROJECT_MANAGER",
		joinedAt: new Date(),
	});

	next();
});

ProjectSchema.virtual("tasks", {
	ref: "Tasks",
	localField: "_id",
	foreignField: "project",
});

const ProjectModel = mongoose.model<Project>("Projects", ProjectSchema);

export default ProjectModel;
