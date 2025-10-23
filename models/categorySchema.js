import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
      type: String,
  }
},
    { timestamps: true });

const categories = mongoose.model("categories", categorySchema);
export default categories;