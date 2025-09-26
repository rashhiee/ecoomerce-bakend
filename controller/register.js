import session from "express-session";
import Users from "../models/userschema.js";
import bcrypt from "bcrypt";


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