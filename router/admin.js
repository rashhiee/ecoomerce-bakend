import express from "express";
import { catergoryadminAdd ,productAdd ,productAdmin } from "../controller/admincontroller.js";
import { adminlogin } from "../controller/admincontroller.js";
import { isAdmin } from "../middleware/authAdmin.js";
const router = express.Router();
//  =========== admin access to admin page ========
router.post('/admin/login', adminlogin);

router.use(isAdmin)
// ================ admin acess to card manage =========
router.post("category",catergoryadminAdd);

// =========== admin add a product  ====================
router.post("/product",productAdd);
router.get("/admin/product",productAdmin);
export default router;