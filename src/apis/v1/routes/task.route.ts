import { Router } from "express";
import TaskController from "../controllers/task.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
const TaskRouter = Router();

TaskRouter.get("/tasks/:projectId", TaskController.getTasksByProject);
TaskRouter.post(
    "/tasks",
    AuthMiddleware.checkAuthenticated,
    AuthMiddleware.checkIsMember,
    TaskController.createTask,
);
TaskRouter.patch(
    "/tasks/:projectId/:taskId",
    AuthMiddleware.checkAuthenticated,
    AuthMiddleware.checkIsMember,
    TaskController.updateTask,
);
TaskRouter.delete(
    "/tasks/:projectId/:taskId",
    AuthMiddleware.checkAuthenticated,
    AuthMiddleware.checkIsMember,
    TaskController.deleteTask,
);

export default TaskRouter;
