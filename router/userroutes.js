import express from "express";
// import { productuserPage } from "../controller/usercontroller.js";
const router = express.Router();
import { isUser } from "../middleware/auth.js";
import { getCart, PostCart, putCart, deleteCart, PostOrder, getUserOrder, getTheOrder } from "../controller/usercontroller.js";

// router.use(isUser);
router.get("/cart", isUser,getCart);
router.post("/cart", isUser, PostCart);
router.patch("/cart/:id", isUser, putCart);
router.delete("/cart/:id", isUser, deleteCart);

// ========== order ================

router.post("/order", isUser, PostOrder);
router.get("/orders", isUser, getUserOrder);
router.get("/orders/:id", isUser, getTheOrder);

export default router;