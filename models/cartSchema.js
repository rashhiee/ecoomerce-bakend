import mongoose from "mongoose";
import products from "./productSchema.js";
const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            }, quantity: {
                type: Number,
                min: 1,
                default: 1,
                required: true
            },size:{
               type:Number,
               required:true
            },
            price: {
                type: Number,
                required: true
            },image:{
                type : String,
                required:true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;