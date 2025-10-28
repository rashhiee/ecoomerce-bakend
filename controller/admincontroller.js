import categories from "../models/categorySchema.js";
import products from "../models/productSchema.js";
import Users from "../models/userschema.js";
import orders from "../models/orderSchema.js";
import bcrypt from "bcrypt"
import upload from "../middleware/multer.js";

export async function adminlogin(req, res) {
    //  console.log(req.session.user);
    try {
        const { email, password } = req.body;
        console.log(req.body);

        const existingUser = await Users.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "email is not found"
            });
        }

        const pass = await bcrypt.compare(password, existingUser.password);
        if (!pass) {
            return res.status(400).json({
                success: false,
                message: "password is not found"
            });
        }
        if (existingUser.role !== "admin") {
            res.json({
                success: false,
                message: "this page is not for users "
            });
        }

        // req.session.admin = {
        //     role: existingUser.role,
        //     email: existingUser.email
        // }

        req.session.role = existingUser.role;
        req.session.userId = existingUser._id;

        res.json({
            message: "admin login successfull",
            success: true
        })


    } catch (error) {
        console.error(error);
        throw error;
    }

}

// ============== admin category view =====================

export async function categoryadminPage(req, res) {

    try {
        console.log(req.session.role);

        const showuser = await categories.find({});
        console.log(showuser);

        res.json(showuser)

    } catch (error) {
        console.error(error);
    }

}

// ================== admin get category by id ================

export async function categoryAdminId(req, res) {

    try {
        console.log(req.session.role);

        const id = req.params.id

        const showuser = await categories.findOne({ _id: id });
        console.log(showuser);

        res.json(showuser)

    } catch (error) {
        console.error(error);
    }

}


// ==================  admin category add ======================

export async function catergoryadminAdd(req, res) {
    try {
        const { name, description, image } = req.body;
        const catogory = await categories.findOne({ name: name });
        if (catogory) {
            return res.json("category is already exist")
        }
        const result = await categories.create({
            name: name,
            description: description,
            image: image
        })
        console.log(result);

        res.json({
            message: "category is added",
            success: true,
            categoryId: result._id
        })

    } catch (error) {
        console.log(error);
        throw new Error("error found");


    }
}

// =========  category update admin =============

export async function categoryUpdate(req, res) {
    try {
        const id = req.params.id;
        // const {name,description} = req.body;

        const found = await categories.findByIdAndUpdate(id, req.body, { new: true })

        if (found) {
            res.status(200).json({
                message: `${found.name} is updated`,
                success: true
            })
        } else {
            res.status(200).json({
                message: 'not updated updated',
                success: false
            })
        }

    } catch (error) {
        console.error("Delete cart error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//  ===================  category delete  =========================

export async function categoryDelete(req, res) {
    try {
        const id = req.params.id;

        const category = await products.find({ category: id })

        if (category.length > 0) {
            return res.json({
                success: false,
                message: "this categories under has products you dont able to delete"
            })
        }

        const found = await categories.findByIdAndDelete(id);
        if (found) {
            res.status(200).json({
                message: `${found.name} is deleted`,
                success: true
            })
        } else {
            res.json("not deleted");
        }
    } catch (error) {
        console.error("Delete cart error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ==========  product view     ===========


export async function productAdmin(req, res) {
    try {
        const product = await products.find().populate("category")
        return res.json(product);
    } catch (error) {
        console.error(error)
        throw new Error("error found");
    }
}

// ========= product by category ==========



export async function getProductsByCategory(req, res) {
    try {
        const { name } = req.params;
        const category = await categories.findOne({ name: name.toLowerCase() });

        if (!category) return res.status(404).json({ message: "Category not found" });

        const productList = await products.find({ category: category._id }).populate("category");
        res.status(200).json(productList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products by category" });
    }
}


// ======== product view byid ============

export async function adminProductById(req, res) {
    try {

        const id = req.params.id;
        const result = await products.findById(id).populate("category");
        if (!result) {
            return res.json("product not found");
        }
        res.json(result);

    } catch (error) {
        console.error(error)
    }
}

// ========= pruduct add  ================

export async function productAdd(req, res) {
    try {
        const { name, description, price, category, size } = req.body;

        const imagePath = req.file ? `${req.file.filename}` : null;
        console.log(imagePath);


        const found = await products.findOne({ name: name });
        if (found) {
            return res.json({
                success: false,
                message: "product already exist"
            });
        }
        const product = await products.create({
            name: name,
            description: description,
            price: price,
            category: category,
            size: size,
            image: imagePath
        });
        console.log(product);

        res.status(200).json({
            success: true,
            message: "the product was added"
        });

    } catch (error) {
        console.error(error);
        throw new Error("error found");
    }
}


//  ============ pruduct update admin ================

export async function productUpdateAdmin(req, res) {
    try {

        // const {name,description,price,image,category} = req.body;
        // const data = req.body;
        const id = req.params.id
        console.log(id);

        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            size: req.body.size
        }

        if (req.file) {
            updatedData.image = req.file.filename;
        } else if (req.body.image) {
            updatedData.image = req.body.image; // keep old image
        }




        const updated = await products.findByIdAndUpdate(id, updatedData,
            { new: true }
        )

        console.log(updated);

        if (updated) {

            res.status(200).json({
                see: updated,
                message: `${updated.name} this product is updated`,
                success: true
            })

        } else {
            res.status(401).json({
                message: ' this product is not updated',
                success: false
            })

        }

    } catch (error) {
        console.error(error);
    }
}
// ===============  product delete admin   ==================

export async function productDeleteAdmin(req, res) {
    try {
        const id = req.params.id;
        const deleted = await products.findByIdAndDelete(id);
        if (!deleted) {
            res.json({
                success: false,
                message: "not found the product"
            })
        }
        res.status(200).json({
            success: true,
            message: `${deleted.name} is deleted`
        })

    } catch (error) {
        console.error(error);
    }
}


// ================   admin view users =====================

export async function adminViewUsers(req, res) {
    try {
        const user = await Users.find({});
        console.log(user);
        if (!user) {
            res.status(404).json("no user found")
        }

        res.status(200).json(user);

    } catch (error) {
        console.error(error)
    }
}

//  ================ admin user managing  ======================

export async function adminUpdateUser(req, res) {
    try {

        const id = req.params.id;
        const { status } = req.body;
        const found = await Users.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!found) {
            return res.status(404).json("user not found");
        }

        res.status(200).json({
            message: `${found.name} is updated`,
            success: true
        })


    } catch (error) {
        console.error(error)
    }
}

// ========= admin order list ==================

export async function adminOrderList(req, res) {
    try {
        const order = await orders.find({});
        if (!order) {
            res.status(404).json("not found any orders")
        }
        res.status(200).json(order);

    } catch (error) {
        console.error(error)
    }
}

// ========= admin order update ======================

export async function adminOrderUpdate(req, res) {
    try {
        const id = req.params.id;
        console.log(id);

        const {status} = req.body

        const found = await orders.findByIdAndUpdate(id, {orderStatus :status}, { new: true })
        console.log(found); 
        
        if (!found) {
            res.status(404).json({message:"order not found"})
        }

        res.status(200).json({message:`${found} is updated`}); 

    } catch (error) {
        console.error(error)
    }
}

// =============  admin delete orders ===============

export async function adminDeleteOrders(req, res) {
    try {
        const id = req.params.id
        const found = await orders.findByIdAndDelete(id);
        if (!found) {
            res.status(404).json("not deleted")
        }
        res.status(200).json("deleted successfully");
    } catch (error) {
        console.error(error)
    }
}