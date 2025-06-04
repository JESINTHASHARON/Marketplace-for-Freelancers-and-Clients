import express from "express";
import {deleteUser, getUser, getUserDetailsById} from "../controllers/user.controller.js"
import { verifyToken } from "../middlewares/jwt.js";

const router=express.Router();

router.delete("/:id",verifyToken,deleteUser);
router.get("/:id",verifyToken,getUser);
router.get("/userdetails/:id", getUser);
export default router;