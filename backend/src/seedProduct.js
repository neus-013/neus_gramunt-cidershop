import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config({path: '.env.local'});

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conectado a la base de datos");

    const product = new Product({
      productId: uuidv4(),
      name: {
        en: "Fruit Cider Variety Pack | 6 x 330ml (3 flavors)",
        es: "Pack Variado de Sidra de Fruta | 6 x 330ml (3 sabores)",
        ca: "Pack Variat de Cervesa de Fruita | 6 x 330ml (3 sabors)",
      },
      description: {
        en: `Introducing our Fruit Cider Variety Pack, a premium selection of six refreshing ciders crafted to delight your taste buds. This pack includes three distinct flavors: Green Pear, Sweet Apple, and Exotic Mix, each meticulously brewed to offer a unique and invigorating experience.

Our ciders are proudly produced locally, ensuring that every sip supports local craftsmanship and reduces our carbon footprint. Made from the finest quality ingredients, our ciders are vegan-friendly. We believe in creating products that are not only delicious but also align with a sustainable lifestyle.`,
        es: `Presentamos nuestro Pack Variado de Sidra de Fruta, una selección premium de seis sidras refrescantes elaboradas para deleitar tu paladar. Este pack incluye tres sabores distintos: Pera Verde, Manzana Dulce y Mezcla Exótica, cada uno meticulosamente elaborado para ofrecer una experiencia única y estimulante.

Nuestras sidras se producen orgullosamente de manera local, garantizando que cada sorbo apoye la artesanía local y reduzca nuestra huella de carbono. Elaboradas con ingredientes de la más alta calidad, nuestras sidras son aptas para veganos. Creemos en crear productos que no solo sean deliciosos, sino que también estén alineados con un estilo de vida sostenible.`,
        ca: `Presentem el nostre Pack Variat de Cervesa de Fruita, una selecció premium de sis cerveses refrescants elaborades per delectar les teves papil·les gustatives. Aquest pack inclou tres sabors diferents: Peres Verdes, Poma Dolça i Mescla Exòtica, cadascun elaborat amb cura per oferir una experiència única i estimulant.

Les nostres cerveses es produeixen amb orgull localment, assegurant que cada glop doni suport a l’artesania local i redueixi la nostra empremta de carboni. Fetes amb ingredients de la millor qualitat, les nostres cerveses són aptes per a vegans. Creiem en crear productes que no només siguin deliciosos, sinó que també estiguin alineats amb un estil de vida sostenible.`,
      },
      price: 10,
      media: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg",
      ],
      category: "Cider",
    });

    await product.save();
    console.log("✅ Producto creado con éxito");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  }
};

seed();
