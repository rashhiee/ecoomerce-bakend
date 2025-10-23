// import { Router } from "express";
import express from "express"
import { loginPage, signuPage } from "../controller/publicontroller.js";
import {  authentication ,  searchProduct, categoryPublic, productPublic, productByIdPublic, logoutUser } from "../controller/publicontroller.js";
// import {isAdmin} from "../middleware/auth.js";
import { validationLogin, registerValidator } from "../middleware/validator.js";
import { getProductsByCategory } from "../controller/admincontroller.js";
const router = express.Router();

//  ======  public register and login =============

router.post('/signup', registerValidator, signuPage);
router.post("/login", validationLogin, loginPage);
router.post("/logout", logoutUser);
router.get("/category/:name" , getProductsByCategory );

// =======   public to get category ===============

router.get("/category", categoryPublic);

// ========  public to get product ==============

router.get("/product", productPublic);
router.get("/product/:id", productByIdPublic);
router.post("/product/search",searchProduct);


// ======== login check ===========

router.get("/auth/check",authentication);

export default router;