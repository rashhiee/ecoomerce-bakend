import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { connectDBS } from "./db/mongo.js";
import userRouter from "./router/mainroutes.js";
import categoryRouter from "./router/admin.js"
const app = express();

const port = process.env.PORT || 3000
app.use(express.json());
app.use(express.urlencoded({extended:true}));
dotenv.config();
connectDBS();

app.use(session({
    secret : process.env.SECRET_KEY,
    resave : false ,
    saveUninitialized : false 
}))

app.use(userRouter,categoryRouter);

app.listen(port,() => {
    console.log(`server is running on ${port}`);
})