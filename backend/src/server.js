import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// Carrega el fitxer d'entorn segons NODE_ENV si MONGO_URI no està definit
if (!process.env.MONGO_URI) {
    const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local";
    dotenv.config({ path: envFile });
    console.log("Loaded env from", envFile);
  } else {
    console.log("Loaded env from process.env (platform)");
}

import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// rutes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
