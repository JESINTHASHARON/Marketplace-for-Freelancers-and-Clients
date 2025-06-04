import express from "express";
import {
  createModule,
  getModulesByProjectId,
  updateModule,
  submitModuleWork,
  updateModuleStatus,
  payForModule
} from "../controllers/module.controller.js";

const router = express.Router();

router.post("/", createModule);
router.get("/project/:projectId", getModulesByProjectId);
router.put("/:id", updateModule);
router.put("/:id/status", updateModuleStatus);
router.put("/:id/freelancer", submitModuleWork);
router.post("/pay/:id",payForModule);

export default router;
