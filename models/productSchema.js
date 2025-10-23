import mongoose, { Schema } from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
     size: {
    type: [Number], //  ["6", "7", "8", "9", "10", "11"]
    enum:[6,7,8,9,10,11],
    default: [],    
  },


}, { timestamps: true })

const products = mongoose.model("products", productSchema);
export default products