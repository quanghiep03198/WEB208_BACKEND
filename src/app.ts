import express from "express";

import cors from "cors";
import morgan from "morgan";
import compression from "compression";

// Import routers
import TaskRouter from "./apis/v1/routes/task.route";
import ProjectRouter from "./apis/v1/routes/project.route";
import UserRouter from "./apis/v1/routes/user.route";

const app = express();

app.use(cors({ origin: "*" }));
app.use(morgan("tiny"));
app.use(express.json());
app.use(
    compression({
        level: 6,
        threshold: 10 * 1024,
    }),
);
app.use("/v1/api", UserRouter);
app.use("/v1/api", ProjectRouter);
app.use("/v1/api", TaskRouter);

export default app;
