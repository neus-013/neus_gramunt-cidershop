import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

// Llista productes
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Un producte concret
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Afegir producte (només per tu, en dev)
router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

export default router;
