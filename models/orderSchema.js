import mongoose from "mongoose";


const orderSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users",
        required : true
    },
    items :[
       { productId : {
           type : mongoose.Schema.Types.ObjectId,
           ref : "products",
           required : true
        } ,
        quantity :{type : Number,required : true},
        price :{ type : Number,required : true}
       }
    ],
   
    totalAmount : {
        type : Number,
        required : true
    },
    orderStatus : {
        type : String,
        required : true,
        enum : ["shipped","pending","delivered"],
        default : "pending"
    }
},{timestamps:true});

const orders = mongoose.model("orders",orderSchema);
export default orders