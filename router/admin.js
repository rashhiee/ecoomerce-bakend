import express from "express";
import {adminDeleteOrders, adminOrderUpdate, adminOrderList, catergoryadminAdd ,categoryDelete, categoryadminPage,categoryUpdate ,productAdd ,productAdmin ,productUpdateAdmin ,productDeleteAdmin ,adminUpdateUser,adminViewUsers} from "../controller/admincontroller.js";
import { adminlogin } from "../controller/admincontroller.js";
import { isAdmin } from "../middleware/auth.js";
const router = express.Router();
//  =========== admin access to admin page ========

router.post('/admin/login', adminlogin);

router.use(isAdmin);
// ================ admin acess to category manage =========

router.get("/admin/category", categoryadminPage);
router.post("/admin/category",catergoryadminAdd);
router.put("/admin/category/:id",categoryUpdate);
router.delete("/admin/category/:id",categoryDelete);

// =========== admin add a product  ====================

router.get("/admin/product",productAdmin);
router.post("/admin/product",productAdd);
router.put("/admin/product/:id", productUpdateAdmin);
router.delete('/admin/product/:id',productDeleteAdmin);

// ========== admin user manage =====================

router.get("/admin/users",adminViewUsers);
router.put("/admin/users",adminUpdateUser);

// =========== admin order ===========================

router.get("/admin/orders",adminOrderList);
router.put("/admin/orders/:id",adminOrderUpdate);
router.delete("/admin/orders/:id",adminDeleteOrders);


export default router;