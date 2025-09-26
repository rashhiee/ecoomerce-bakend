import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI

export async function connectDBS() {
    try {
          
        await mongoose.connect(uri)
         console.log("database connected");
         

    } catch (error) {
        console.log(error);
        
    }
}


