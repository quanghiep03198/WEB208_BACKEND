import express from "express";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import compression from "compression";
import cors from "cors";
import morgan from "morgan";

// Import routers
import ProjectRouter from "./apis/v1/routes/project.route";
import TaskRouter from "./apis/v1/routes/task.route";
import UserRouter from "./apis/v1/routes/user.route";
import path from "path";

const ROOT_FOLDER = path.join(__dirname, "..");
const SRC_FOLDER = path.join(ROOT_FOLDER, "src");
const options: swaggerJSDoc.OAS3Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Document",
			version: "1.0.0",
			description: "API documentation for Front-end",
		},
		servers: [
			{
				url: "http://localhost:3001/api",
			},
		],
	},
	apis: [path.resolve(path.join(SRC_FOLDER, "/apis/v1/routes/*.ts"))],
};

const app = express();

app.use(
	cors({
		origin: "*",
	})
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(
	compression({
		level: 6,
		threshold: 10 * 1024,
	})
);
app.use("/v1/api", UserRouter);
app.use("/v1/api", ProjectRouter);
app.use("/v1/api", TaskRouter);

app.get("/", async (req, res) => {
	return res.status(200).json({
		status: 200,
		message: "Server now is running!",
	});
});
app.use("/public", express.static(path.join(SRC_FOLDER, "public")));
app.use("/apis", express.static(path.join(SRC_FOLDER, "apis")));
app.use(
	"/api/docs",
	swaggerUI.serve,
	swaggerUI.setup(swaggerJSDoc(options), {
		customCssUrl: "/public/swagger-ui.css",
	})
);
export default app;
