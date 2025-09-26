import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
       type : String,
       required : true
    }
},
{timestamps : true})

const categories = mongoose.model("category",categorySchema);
export default categories;