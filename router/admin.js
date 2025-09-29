import express from "express";
import {adminDeleteOrders, adminOrderUpdate, adminOrderList, catergoryadminAdd ,categoryDelete, categoryadminPage,categoryUpdate ,productAdd ,productAdmin ,productUpdateAdmin ,productDeleteAdmin ,adminUpdateUser,adminViewUsers} from "../controller/admincontroller.js";
import { adminlogin } from "../controller/admincontroller.js";
import { isAdmin } from "../middleware/auth.js";
const router = express.Router();
//  =========== admin access to admin page ========

router.post('/login', adminlogin);

router.use(isAdmin);
// ================ admin acess to category manage =========

router.get("/category", categoryadminPage);
router.post("/category",catergoryadminAdd);
router.put("/category/:id",categoryUpdate);
router.delete("/category/:id",categoryDelete);

// =========== admin add a product  ====================

router.get("/product",productAdmin);
router.post("/product",productAdd);
router.put("/product/:id", productUpdateAdmin);
router.delete('/product/:id',productDeleteAdmin);

// ========== admin user manage =====================

router.get("/users",adminViewUsers);
router.put("/users/:id",adminUpdateUser);

// =========== admin order ===========================

router.get("/orders",adminOrderList);
router.put("/orders/:id",adminOrderUpdate);
router.delete("/orders/:id",adminDeleteOrders);


export default router;