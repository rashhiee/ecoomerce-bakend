import express from "express";
import dotenv from "dotenv";
import session from "express-session";
const app = express();

app.use(session({
    secret : process.env.SECRET_KEY,
    resave : false ,
    saveUninitialized : false 
}))

const port = process.env.PORT || 3000
app.use(express.json());
app.use(express.urlencoded({extended:true}));
dotenv.config();
import { connectDBS } from "./db/mongo.js";
connectDBS();
import userRouter from "./router/register.js"
app.use(userRouter)


app.listen(port,() => {
    console.log(`server is running on ${port}`);
})