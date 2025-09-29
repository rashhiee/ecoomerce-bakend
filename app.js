import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { connectDBS } from "./db/mongo.js";
import publicRouter from "./router/mainroutes.js";
import categoryRouter from "./router/admin.js"
import userRouter from "./router/userroutes.js"
const app = express();
import MongoStore from "connect-mongo";

const port = process.env.PORT || 3000
app.use(express.json());
app.use(express.urlencoded({extended:true}));
dotenv.config();
connectDBS();

app.use(session({
    secret : process.env.SECRET_KEY,
    resave : false ,
    saveUninitialized : false ,
    store : MongoStore.create({
        mongoUrl : process.env.MONGO_URI,
        collectionName : "sessions",
    })

}))

app.use(userRouter,categoryRouter,publicRouter);

app.listen(port,() => {
    console.log(`server is running on ${port}`);
})