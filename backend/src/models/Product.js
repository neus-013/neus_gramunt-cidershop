import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true }, // ID único del producto
  name: {
    en: { type: String, required: true },
    es: { type: String, required: true },
    ca: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    es: { type: String, required: true },
    ca: { type: String, required: true },
  },
  price: { type: Number, required: true },
  media: [{ type: String }], // array de URLs de imágenes o vídeos
  category: { type: String },
});

export default mongoose.model("Product", ProductSchema);
