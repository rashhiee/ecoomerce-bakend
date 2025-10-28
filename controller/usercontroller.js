import Cart from "../models/cartSchema.js";
import orders from "../models/orderSchema.js";
import products from "../models/productSchema.js";

export async function PostCart(req, res) {
  try {
    const { productId, selectedSize } = req.body;
    const userId = req.session.userId;

    const product = await products.findById(productId);
    if (!product) {
      return res.status(404).json("product not found");
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: []
      });
    }


    cart.items = cart.items.map(i => ({
      ...i.toObject(),
      size: i.size || Number(selectedSize)
    }));

    const existingItem = cart.items.find(
      i => i.productId.toString() === productId && i.size === Number(selectedSize)
    );

    if (existingItem) {

      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
        price: product.price,
        image: product.image,
        size: Number(selectedSize)
      });
    }

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await cart.save();
    await cart.populate("items.productId");
    res.json({message:"ind:",existingItem,cart});

  } catch (error) {
    console.log(" Error in PostCart:", error);
    res.status(500).json({ message: "Server error", error });
  }
}


// ====================  user update cart ========================

export async function putCart(req, res) {
  try {

    const { items } = req.body;
    console.log("for update", items);

    const userId = req.session.userId;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array" });
    }


    const cart = await Cart.findOne({ userId: userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }


    items.forEach((updatedItem) => {

      const existingItem = cart.items.find(
        (i) => i.productId._id.toString() === updatedItem.productId._id.toString()
      );

      if (existingItem) {
        if (updatedItem.quantity <= 0) {

          cart.items = cart.items.filter(
            (i) => i.productId._id.toString() !== updatedItem.productId._id.toString()
          );
        } else {

          existingItem.quantity = updatedItem.quantity;
        }
      }
    });



    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.quantity * (i.productId?.price || 0),
      0
    );


    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
}



//  ======== view cart ==============

export async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.session.userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ items: [], totalAmount: 0 });
    }

    console.log(cart);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
}


//  ========== delete cart by user ===========

export async function deleteCart(req, res) {
  try {


    const productId = req.params.id;
    const userId = req.session.userId;

    const product = await products.findOne({ _id: productId });
    if (!product) {
      return res.json({ message: "no product found" })
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId: productId } } },
      { new: true }
    )
    console.log(cart);

    if (!cart) {
      return res.json({ message: "no delelted" })
    }

    res.status(200).json({
      message: `${product.name} deleted`,
      cart: cart
    });


  } catch (error) {
    console.error("Delete cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });

  }
}


// const deleted = await Cart.findByIdAndDelete(prdct_id)
// const found = await Cart.findByIdAndDelete(id);
// if (!found) {
//   return res.status(404).json("not found")
// }
// res.status(200).json({
//   message: `${found._id} is deleted`,
//   success: true
// })


//  ==============  user add a order ======================

export async function PostOrder(req, res) {
  try {
    const userId = req.session.userId;
    console.log(userId);

    const { address } = req.body;

    if (
      !address ||
      !address.firstName ||
      !address.lastName ||
      !address.email ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.country ||
      !address.pincode ||
      !address.payment
    ) {
      return res.status(400).json({
        message:
          "Address incomplete. Required: line, city, state, postal_code, country",
      });
    }


    const cartFound = await Cart.findOne({ userId: userId });
    if (!cartFound || cartFound.length === 0) {
      res.status(404).json({message:"user has no cart"})
    }


    const order = await orders.create({
      userId: userId,
      items: cartFound.items,
      totalAmount: cartFound.totalAmount,
      paymentMethod: address.payment,
      orderStatus: cartFound.orderStatus,
      address:address
    })

     await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalAmount: 0 } }
    );
     
    res.status(200).json({message:"order successfully",order});

  } catch (error) {
    console.error(error);
  }
}

// ==============  get user order   ========================

export async function getUserOrder(req, res) {
  try {
    const userId = req.session.userId;
    console.log("user id", userId);
    
    const found = await orders.find({ userId: userId });
    if (!found) {
      return res.status(404).json("there is not orders by this user");
    }
    res.status(200).json(found);
  } catch (error) {
    console.error(error)
  }
}

// =================  get the specific order detail =================

export async function getTheOrder(req, res) {
  try {


    const id = req.params.id;
    console.log(id);

    const found = await orders.findOne({ _id: id });

    if (!found) {
      return res.status(404).json("order is not found")
    }

    res.status(200).json(found);

  } catch (error) {
    console.error(error)
  }
}

//  ============   the end  yes yes yes yes ====================================