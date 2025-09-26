import session from "express-session";
import Users from "../models/userschema.js";
import bcrypt from "bcrypt";
import products from "../models/productSchema.js";
import categories from "../models/categorySchema.js";


export async function signuPage(req,res) {
           
     try {

       const {email,name,password,Repassword} = req.body;
       const existingUser = await  Users.findOne({email:email});
       if(existingUser){
        return res.json("email is already existing");
       }
       if(password !== Repassword){
        return res.json("enter same password");
       }

       const hashed = await bcrypt.hash(password,10);

      const newUser =  await Users.create({
        name : name ,
        email : email,
        password : hashed,
       })
        console.log(newUser);

       
        
       res.status(200).json({
        message : `${newUser.name}'s signup success`,
        success : true,
        userId : newUser.id
       }); 

     } catch (error) {
        console.error(error);
        throw new Error("error occured");
     }
         
}

// ===================== loginpage user ===========================

export async function loginPage(req,res) {
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
       if(existingUser.role == "admin"){
        // console.log(req.session.user.role);
        
        return res.json("this page is only for users");
      }
       
        req.session.user ={
            email : existingUser.email,
            role : existingUser.role,
        }
        // console.log(req.session.user);
        
       res.status(200).json({
        message : `${existingUser.name} hey your login success`,
        success : true,
        userId : existingUser.id
       });

   } catch (error) {
     console.error(error);
     throw new Error("error ocuured");
     
   }
}

//  ======================== public category view ========================


export async function categoryPublic(req,res) {

    try {
        const showuser = await categories.find({});
        console.log(showuser);

        res.json(showuser)
         
    } catch (error) {
        console.error(error);
    }

}

//  ====================== product public view ===============================


export async function productPublic(req,res) {
    try {
        const product = await products.find({}).select('name');
        return res.json(product);    
    } catch (error) {
        console.error(error)
        throw new Error("error found"); 
    }
}

// ============= product byid public  ============================

export async function productByIdPublic(req,res) {
  try {

       const id = req.params.id ;
       const result = await products.findById(id).populate("category");
       if(!result){
          return res.json("product not found");
       }
       res.json(result);
       
  } catch (error) {
    console.error(error)
  }  
}
