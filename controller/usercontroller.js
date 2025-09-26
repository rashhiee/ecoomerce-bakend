import products from "../models/productSchema";

export async function productuserPage(req,res) {
    try {
        const product = await products.find({});
        return res.json(product);    
    } catch (error) {
        console.error(error)
        throw new Error("error found"); 
    }
}


