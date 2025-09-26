// import { Router } from "express";
import express from "express"
import { loginPage, signuPage ,adminlogin } from "../controller/register.js";
import {isAdmin} from "../middleware/authAdmin.js";
const router = express.Router();


router.post('/signup',signuPage);
router.post("/login",loginPage);
router.post('/admin/login', adminlogin);




export default router;