// import { Router } from "express";
import express from "express"
import { loginPage, signuPage } from "../controller/publicontroller.js";
import { categoryPublic ,productPublic ,productByIdPublic} from "../controller/publicontroller.js";
import {isAdmin} from "../middleware/auth.js";
const router = express.Router();

//  ======  public register and login =============

router.post('/signup',signuPage);
router.post("/login",loginPage);

// =======   public to get category ===============

router.get("/category",categoryPublic);

// ========  public to get product ==============

router.get("/product",productPublic);
router.get("/product/:id",productByIdPublic);


export default router;