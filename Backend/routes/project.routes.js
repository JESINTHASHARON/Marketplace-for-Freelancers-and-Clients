import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  getProjectByUserId,
  getBidsForProject,
} from "../controllers/project.controller.js";

const router = express.Router();
router.post("/", createProject);
router.get("/user/:userId", getProjectByUserId);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);
router.get("/:projectId/bids", getBidsForProject);

export default router;
