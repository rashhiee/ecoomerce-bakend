import categories from "../models/categorySchema.js";
import products from "../models/productSchema.js";
import Users from "../models/userschema.js";
import bcrypt from "bcrypt"

export async function adminlogin(req,res) {
  //  console.log(req.session.user);
   try {
          const {email,password} = req.body;
       const existingUser = await  Users.findOne({email:email});
       if(!existingUser){
        return res.json("email is not found");
       }
       
         const pass = await bcrypt.compare(password,existingUser.password);
       if(!pass){
        return res.json('password is incorrect');
       }
       if(existingUser.role !== "admin"){
        res.json("this page is not for users")
       }
      
       req.session.admin = {
          role : existingUser.role,
          email : existingUser.email
       }

       res.json({
        message : "admin login successfull",
        success : true
       })
       

   } catch (error) {
    console.error(error);
    throw error;
   }
  
}

// ============== admin category view =====================

export async function categoryadminPage(req,res) {

    try {
        const showuser = await categories.find({});
        console.log(showuser);

        res.json(showuser)
         
    } catch (error) {
        console.error(error);
    }

}

// ==================  admin category add ======================

export async function catergoryadminAdd(req,res) {
    try {
        const {name,description} = req.body;
        const catogory = await categories.find({name : name});
        if(catogory){
          return res.json("category is already exist")
        }
    const result = await categories.create({
        name : name,
        description : description
    })
    console.log(result);

    res.json({
        message : "category is added",
        success : true,
        categoryId : result._id
    })
    
    } catch (error) {
        console.log(error);
        throw new Error("error found");
        
        
    }
}

// ==========  product view     ===========


export async function productAdmin(req,res) {
    try {
        const product = await products.find().populate("category")
        return res.json(product);    
    } catch (error) {
        console.error(error)
        throw new Error("error found"); 
    }
}

// ========= pruduct add  ================

export async function productAdd(req,res) {
   try {
      const {name,description,price,image,category} = req.body;
      const found = await products.findOne({name:name});
      if(found){
        return res.json("product already exist");
      }
      const product = await products.create({
        name : name,
        description : description,
        price : price,
        image : image,
        category : category
      });
      console.log(product);
      
      res.status(200).json("the product was added");

   } catch (error) {
     console.error(error);
     throw new Error("error found");
   } 
}
