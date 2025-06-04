import express from "express";
import {verifyToken} from "../middlewares/jwt.js";
import { createGig,deleteGig,getGig,getGigs , getGigsByUserId} from "../controllers/gig.controller.js";
const router=express.Router();

router.post("/",verifyToken,createGig)
router.delete("/:id",verifyToken,deleteGig)
router.get("/single/:id",verifyToken,getGig)
router.get("/",verifyToken,getGigs)
router.get("/user/:userId", getGigsByUserId);

export default router;