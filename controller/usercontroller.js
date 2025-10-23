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

    // ====== FIX OLD ITEMS WITHOUT SIZE ======
    cart.items = cart.items.map(i => ({
      ...i.toObject(),           // convert Mongoose doc to plain object
      size: i.size || Number(selectedSize)  // if missing, assign selectedSize
    }));

    // Check if the item already exists (same productId AND size)
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
        size: Number(selectedSize)  // ensure size is a number
      });
    }

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await cart.save();
    await cart.populate("items.productId");
    res.json(cart);

  } catch (error) {
    console.log("❌ Error in PostCart:", error);
    res.status(500).json({ message: "Server error", error });
  }
}


// ====================  user update cart ========================

export async function putCart(req, res) {
  try {
    const id = req.params.id; // Cart ID
    const { productId, qty } = req.body; // Receive productId and new qty

    // Validate inputs
    if (!productId || typeof qty !== "number" || qty < 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Find the cart and populate product details
    const cart = await Cart.findById(id).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.find(
      (i) => i.productId._id.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // ✅ Update quantity
    if (qty === 0) {
      // remove item if qty = 0
      cart.items = cart.items.filter(
        (i) => i.productId._id.toString() !== productId
      );
    } else {
      item.quantity = qty;
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );

    // Save and repopulate
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
      return res.status(200).json({ items: [], totalAmount: 0 }); // return empty cart if none exists
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
    // const id = req.params.id;
    const productId = req.params.id;
    const userId = req.session.userId;

    const product = await products.findOne({ _id: productId });
    if (!product) {
      return res.json({message:"no product found"})
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId: productId } } },
      { new: true }
    )
    console.log(cart);

    if (!cart) {
      return res.json({message:"no delelted"})
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

    const status = req.body.paymentMethod;
    const cartFound = await Cart.findOne({ userId: userId });
    if (!cartFound || cartFound.length === 0) {
      res.status(404).json("user has no cart")
    }


    const order = await orders.create({
      userId: userId,
      items: cartFound.items,
      totalAmount: cartFound.totalAmount,
      paymentMethod: status,
      orderStatus: cartFound.orderStatus
    })

    res.status(200).json(order);

  } catch (error) {
    console.error(error);
  }
}

// ==============  get user order   ========================

export async function getUserOrder(req, res) {
  try {
    const userId = req.session.userId;
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

//  ============  