import express from "express";
import { verifyToken } from "../middlewares/jwt.js";
import {
  getOrders,
  createOrder,
  submitRequirements,
  uploadWork,
  payForOrder,
  deleteOrder,
  getOrderDetails,
  confirmPayment,
  getOrder
} from "../controllers/order.controller.js";

const router = express.Router();
router.get("/:id", verifyToken, getOrder); 
router.post("/create/:gigId", verifyToken, createOrder);
router.put("/requirements/:orderId", verifyToken, submitRequirements);
router.put("/upload-work/:orderId", verifyToken, uploadWork);
router.post("/pay/:orderId", verifyToken, payForOrder);
router.put("/confirm", confirmPayment);
router.get("/", verifyToken, getOrders);
router.get("/details/:id", verifyToken, getOrderDetails);
router.delete("/:id", verifyToken, deleteOrder);

export default router;
