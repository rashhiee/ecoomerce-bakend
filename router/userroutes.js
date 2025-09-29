import express from "express";
// import { productuserPage } from "../controller/usercontroller.js";
const router = express.Router();
import { isUser } from "../middleware/auth.js";
import { getCart, PostCart ,putCart ,deleteCart , PostOrder ,getUserOrder ,getTheOrder} from "../controller/usercontroller.js";

// router.use(isUser);
router.get("/cart",getCart);
router.post("/cart",PostCart);
router.put("/cart/:id",putCart);
router.delete("/cart/:id",deleteCart);

// ========== order ================

router.post("/order",PostOrder);
router.get("/orders",getUserOrder);
router.get("/orders/:id",getTheOrder);

export default router;