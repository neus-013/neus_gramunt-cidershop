import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

/* 🧮 Funció per recalcular totals */
function recalculateCart(cart) {
  cart.subtotal = cart.items.reduce((sum, item) => {
    item.subtotal = item.price * item.quantity;
    return sum + item.subtotal;
  }, 0);
  cart.total = cart.subtotal - cart.discount;
}

/* 🛒 Crear un nou carret */
router.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ items: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ➕ Afegir producte al carret */
router.post("/:cartId/add", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Comprovar si ja existeix al carret
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      });
    }

    recalculateCart(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🔁 Actualitzar quantitat d’un producte */
router.put("/:cartId/update", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    recalculateCart(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ❌ Eliminar producte */
router.delete("/:cartId/remove/:productId", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    recalculateCart(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 💸 Aplicar descompte */
router.post("/:cartId/discount", async (req, res) => {
  try {
    const { discount } = req.body;
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.discount = discount || 0;
    recalculateCart(cart);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🧹 Buidar carret */
router.post("/:cartId/clear", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    cart.discount = 0;
    recalculateCart(cart);
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ Checkout */
router.post("/:cartId/checkout", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    recalculateCart(cart);

    const ticket = {
      id: `TCKT-${Date.now()}`,
      date: new Date(),
      items: cart.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal,
      })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      total: cart.total,
    };

    // Marquem com "completat"
    cart.status = "checked_out";
    await cart.save();

    res.json({ message: "✅ Purchase completed", ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 👀 Veure carret */
router.get("/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

