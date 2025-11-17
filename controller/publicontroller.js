import session from "express-session";
import Users from "../models/userschema.js";
import bcrypt from "bcrypt";
import products from "../models/productSchema.js";
import categories from "../models/categorySchema.js";
// import Cart from "../models/cartSchema.js";

export function homePage(req,res) {
  res.status(200).json({message:'server is running'})  
}

export async function signuPage(req, res) {

  try {

    const { email, name, password, Repassword } = req.body;
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "email is already existing"
      });
    }
    if (password !== Repassword) {
      return res.json({
        success: false,
        message: "Enter same password"
      })
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      name: name,
      email: email,
      password: hashed
    })
    console.log(newUser);

    req.session.role = newUser.role,
      req.session.userId = newUser._id
    console.log(req.session.role);



    res.status(200).json({
      message: `${newUser.name}'s signup success`,
      success: true,
      userId: newUser.id
    });

  } catch (error) {
    console.error(error);
    throw new Error("error occured");
  }

}

// ===================== loginpage user ===========================

export async function loginPage(req, res) {
  try {

    const { email, password } = req.body;
    console.log(req.body);

    const existingUser = await Users.findOne({ email: email });
    console.log(existingUser);

    if (!existingUser) {
      return res.json({
        success: false,
        message: "email is not found"
      });
    }

    const pass = await bcrypt.compare(password, existingUser.password);
    if (!pass) {
      return res.json({
        success: false,
        message: "password is incorrect"
      });
    }
    if (existingUser.role === "admin") {
      // console.log(req.session.user.role);
      return res.json({
        success: false,
        message: "this page only for users"
      });
    }

    // req.session.user ={
    //     email : existingUser.email,
    //     role : existingUser.role,
    //     _id : existingUser._id
    // }
    req.session.role = existingUser.role,
      req.session.userId = existingUser._id
    console.log(req.session.role);


    res.status(200).json({
      message: `${existingUser.name} hey your login success`,
      success: true,
      userId: existingUser._id
    });

  } catch (error) {
    console.error(error);
    throw new Error("error ocuured");

  }
}

// ============= logout user  =========================

export async function logoutUser(req, res) {
  try {
    console.log(req.session.userId, "is logout");
    req.session.destroy((err) => {
      if (err) {
        console.error(err)
        res.status(500).json({ message: "logout failed" })
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "logout success" });

    })
  } catch (error) {
    console.error(error)
  }
}

//  ======================== public category view ========================


export async function categoryPublic(req, res) {

  try {
    const showuser = await categories.find({});
    console.log(showuser);

    res.json(showuser)

  } catch (error) {
    console.error(error);
  }

}

//  ====================== product public view ===============================


export async function productPublic(req, res) {
  try {
    const product = await products.find({})
    return res.json(product);
  } catch (error) {
    console.error(error)
    throw new Error("error found");
  }
}

// ============= product byid public  ============================

export async function productByIdPublic(req, res) {
  try {

    const id = req.params.id;
    console.log(id);
    const result = await products.findById(id).populate("category");
    if (!result) {
      return res.json("product not found");
    }
    res.json(result);

  } catch (error) {
    console.error(error)
  }
}

// =========== product search  ================

export async function searchProduct(req, res) {
  try {
    const { word } = req.body;

    if (!word || word.trim() === "") {
      const allProducts = await products.find({});
      return res.status(200).json(allProducts);
    }

    const productsFound = await products.find({
      name: { $regex: word, $options: "i" }
    });

    // if (productsFound.length === 0) {
    //   return res.status(404).json({ message: "No products found" });
    // }

    res.status(200).json(productsFound);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// ============ login auth ==================



export async function authentication(req, res) {

  try {
    if (!req.session.userId) {
      return res.json({ isAuth: false });
    }
   
    const user = await Users.findById(req.session.userId)

    if(!user || user.status === "inactive"){
       req.session.destroy();

      return res.json({
        isAuth: false,
        message: "Your account has been deactivated by admin",
      });
    }

      res.json({
        isAuth: true,
        role: req.session.role,
        userId: req.session.userId,
        status : user.status,
      });
    
  } catch (error) {
    console.log(error);
  }

}


