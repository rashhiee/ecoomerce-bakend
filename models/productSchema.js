import mongoose, { Schema } from "mongoose";

const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        required : true 
    },
    price : {
        type : Number,
        required : true,
        min : 0
    },
    images : {
        type : String,
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "categories",
        required : true
    }
    

},{timestamps:true})

const products = mongoose.model("products",productSchema);
export default products