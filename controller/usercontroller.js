import Cart from "../models/cartSchema.js";
import orders from "../models/orderSchema.js";
import products from "../models/productSchema.js";

 export async function PostCart(req, res) {
    try {

      
        const { productId, quantity } = req.body;
        const userId = req.session.userId
        console.log(userId);
    
        const product = await products.findById(productId);
        if (!product) {
            return res.status(404).json("product not found");
        }
          
        
        let cart = await Cart.findOne({ userId });
        if (!cart) {
             cart = await Cart.create({
            userId ,
            items : []
          })
        }

         const qty = Number(quantity);

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (item) {
            item.quantity += qty;
        } else {
           cart.items.push({ productId, quantity:qty, price: product.price })
        }

        cart.totalAmount = cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);

        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);

    } catch (error) {
           console.log(error);
           
    }

}

// ====================  user update cart ========================

   export async function putCart(req,res) {
    try {
          const id = req.params.id;
        //   console.log(id);
          
          const {productId,action} = req.body;
        //   console.log(req.body);
          

          const cart = await Cart.findOne({_id:id}).populate("items.productId");
          console.log(cart);
          
          if(!cart){
            return res.json("cart not found");
          }

          const item = await cart.items.find(i => i.productId._id.toString() === productId);
          if(!item){
            return res.json("product not in cart")
          }

          if(action === "increase"){
            item.quantity += 1
          }else if (action === "decrease" && item.quantity > 1) {
            item.quantity -= 1
          } else if (action === "decrease" && item.quantity === 1) {
            cart.items = cart.items.filter(i => i.productId._id.toString() !== productId)
          }else{
            res.json("not a specified action")
          }

          cart.totalAmount = cart.items.reduce((sum,i) => sum + i.quantity * i.price,0);


          await cart.save();
          await cart.populate("items.productId");

          res.status(200).json(cart);


          
    } catch (error) {
        console.error(error)
    }
    
   }


//  ======== view cart ==============

 export async function getCart(req,res) {
   try {
         const found = await Cart.find({});
         console.log(found);

         res.status(200).json(found)
         
   } catch (error) {
      console.log(error);
      throw new Error("error found");
      
      
   } 
 }

//  ========== delete cart by user ===========

export async function deleteCart(req,res) {
    try {
        const id = req.params.id
        const found = await Cart.findByIdAndDelete(id);
        if(!found){
            return res.status(404).json("not found")
        }
        res.status(200).json({
        message : `${found._id} is deleted`,
        success : true
       })
    } catch (error) {
    console.error("Delete cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
        
    }
}


//  ==============  user add a order ======================

export async function PostOrder(req,res) {
    try {
        const userId = req.session.userId;
        console.log(userId);
        
        const status = req.body.orderStatus;
        const cartFound = await Cart.findOne({userId:userId});
        if(!cartFound || cartFound.length === 0){
          res.status(404).json("user has no cart")
        }
        
        
        const order = await orders.create({
            userId : userId,
            items : cartFound.items,
            totalAmount : cartFound.totalAmount,
            orderStatus : status            
        }) 

        res.status(200).json(order);

    } catch (error) {
      console.error(error);
    }  
}

// ==============  get user order   ========================

export async function getUserOrder(req,res) {
    try {
      const userId = req.session.userId ;
      const found = await orders.find({userId : userId});
      if(!found){
        return res.status(404).json("there is not orders by this user");
      }
      res.status(200).json(found);
    } catch (error) {
      console.error(error)
    }
}

// =================  get the specific order detail =================

export async function getTheOrder(req,res) {
   try {
   
       
       const id = req.params.id;
       console.log(id);
       
       const found = await orders.findOne({_id:id});

       if(!found){
        return res.status(404).json("order is not found")
       }

       res.status(200).json(found);

   } catch (error) {
     console.error(error)
   }
}

//  ============  