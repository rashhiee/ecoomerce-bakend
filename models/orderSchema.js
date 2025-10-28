import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    firstName : {type:String , required:true},
    lastName : {type : String , required: true },
    email : {type: String, required:true},
    phone: {type:Number,required:true},
    address: {type:String,required: true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    country:{type:String,required:true},
    pincode:{type:String,required:true}
},{id:false})



const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["UPI", "cash on delivery", "bank transfer"],
        default: "UPI"
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["shipped", "pending", "delivered","placed","cancelled"],
        default: "shipped"
    },address:{
        type:addressSchema ,required: true
    }
   
    


}, { timestamps: true });

const orders = mongoose.model("orders", orderSchema);
export default orders