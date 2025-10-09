import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: {
        en: { type: String, required: true },
        es: { type: String, required: true },
        ca: { type: String, required: true },
      }, 
      price: Number, 
      quantity: { type: Number, default: 1 },
      subtotal: Number, 
    },
  ],

 
  discount: { type: Number, default: 0 }, 
  subtotal: { type: Number, default: 0 }, 
  total: { type: Number, default: 0 }, 


  status: {
    type: String,
    enum: ["active", "checked_out", "cancelled"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Cart", CartSchema);
