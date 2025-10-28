import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { connectDBS } from "./db/mongo.js";
import publicRouter from "./router/mainroutes.js";
import adminRouter from "./router/admin.js"
import userRouter from "./router/userroutes.js"
import MongoStore from "connect-mongo";
import cors from "cors";
import path from 'path'
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000

connectDBS();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
    }),
    cookie :{
        secure : false,
        httpOnly : true,
         sameSite: "lax",   
        maxAge : 1000 * 60 * 60 
    }

}))

app.use("/admin", adminRouter);
app.use("/", publicRouter);
app.use("/", userRouter);

app.listen(port, () => {

    console.log(`server is running on ${port}`);

})