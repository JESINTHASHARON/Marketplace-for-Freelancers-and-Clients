import express from "express";
import {verifyToken} from "../middlewares/jwt.js";
import { createReview,getReviews,deleteReview, getReviewsByUserId } from "../controllers/review.controller.js";
const router=express.Router();

router.post("/",verifyToken,createReview);
router.get("/:gigId",verifyToken,getReviews);
router.delete("/:id",verifyToken,deleteReview);
router.get("/user/:userId", getReviewsByUserId);

export default router;