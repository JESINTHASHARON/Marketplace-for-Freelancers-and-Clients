import express from "express";
import {verifyToken} from "../middlewares/jwt.js";
import { getProjectsByBidder, createBid, checkIfBidExists, updateBidStatus} from "../controllers/bid.controller.js";
const router=express.Router();

router.get("/user/:userId/projects",verifyToken,getProjectsByBidder);
router.post("/",verifyToken, createBid);
router.get("/check", checkIfBidExists);
router.put("/:bidId/:action", updateBidStatus);
export default router;