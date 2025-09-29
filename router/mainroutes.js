// import { Router } from "express";
import express from "express"
import { loginPage, signuPage } from "../controller/publicontroller.js";
import { categoryPublic ,productPublic ,productByIdPublic ,logoutUser} from "../controller/publicontroller.js";
// import {isAdmin} from "../middleware/auth.js";
import { validationLogin,registerValidator } from "../middleware/validator.js";
const router = express.Router();

//  ======  public register and login =============

router.post('/signup',registerValidator,signuPage);
router.post("/login",validationLogin,loginPage);
router.post("/logout",logoutUser);

// =======   public to get category ===============

router.get("/category",categoryPublic);

// ========  public to get product ==============

router.get("/product",productPublic);
router.get("/product/:id",productByIdPublic);


export default router;