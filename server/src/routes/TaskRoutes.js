import express from "express";
import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
} from "../controllers/TaskController.js";

import { protect } from "../middlewares/AuthMiddleware.js";

const TaskRouter = express.Router();

TaskRouter.post("/", protect, createTask);
TaskRouter.get("/my", protect, getMyTasks);
TaskRouter.put("/:id", protect, updateTask);
TaskRouter.delete("/:id", protect, deleteTask);


export default TaskRouter;
