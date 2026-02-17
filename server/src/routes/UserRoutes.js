import express from "express";
import {
  register,
  login,
  getAllUsers,
  getMe,
  deleteUser,
} from "../controllers/UserController.js";

import { protect } from "../middlewares/AuthMiddleware.js";
import { authorize } from "../middlewares/RoleMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);

UserRouter.get("/me", protect, getMe);

UserRouter.get("/admin/all", protect, authorize("admin"), getAllUsers);
UserRouter.get("/admin/delete/:id", protect, authorize("admin"), deleteUser);

export default UserRouter;
